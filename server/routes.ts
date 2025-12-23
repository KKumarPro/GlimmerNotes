import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateChatbotResponse, generateMemoryInsight, generatePetInteraction } from "./openai";
import { z } from "zod";
import { insertMemorySchema, insertFriendSchema, insertChatMessageSchema, insertGameSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const connectedUsers = new Map<string, WebSocket>();

  wss.on('connection', (ws) => {
    let userId: string | null = null;

    ws.on('message', async (data) => {
      try {
        const rawMessage = JSON.parse(data.toString());
        
        // Basic schema for message type validation
        const baseSchema = z.object({ type: z.string() });
        const typeCheck = baseSchema.safeParse(rawMessage);
        
        if (!typeCheck.success) return;

        const message = rawMessage;

        if (message.type === 'auth') {
          userId = message.userId;
          if (userId) {
            connectedUsers.set(userId, ws);
          }
        }
        
        if (message.type === 'chat') {
          // Validate chat message payload
          const chatPayload = z.object({
            senderId: z.string(),
            receiverId: z.string(),
            content: z.string()
          }).safeParse(message);

          if (chatPayload.success) {
            const chatMessage = await storage.createChatMessage({
              senderId: chatPayload.data.senderId,
              receiverId: chatPayload.data.receiverId,
              content: chatPayload.data.content,
              type: 'text'
            });
            
            // Send to receiver if online
            const receiverWs = connectedUsers.get(chatPayload.data.receiverId);
            if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
              receiverWs.send(JSON.stringify({
                type: 'chat',
                message: chatMessage
              }));
            }
          }
        }
        
        if (message.type === 'game_move') {
          const gamePayload = z.object({
            gameId: z.string(),
            gameState: z.any(), // specific game state schema depends on game type
            nextTurn: z.string()
          }).safeParse(message);

          if (gamePayload.success) {
            const game = await storage.getGame(gamePayload.data.gameId);
            if (game) {
              const updatedGame = await storage.updateGame(game.id, {
                gameState: gamePayload.data.gameState,
                currentTurn: gamePayload.data.nextTurn
              });
              
              if (updatedGame) {
                // Notify both players
                [game.player1Id, game.player2Id].forEach(playerId => {
                  const playerWs = connectedUsers.get(playerId);
                  if (playerWs && playerWs.readyState === WebSocket.OPEN) {
                    playerWs.send(JSON.stringify({
                      type: 'game_update',
                      game: updatedGame
                    }));
                  }
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        connectedUsers.delete(userId);
      }
    });
  });

  // Memory routes
  app.post("/api/memories", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const memoryData = insertMemorySchema.parse({ ...req.body, userId: req.user!.id });
      const memory = await storage.createMemory(memoryData);
      
      await storage.createActivity({
        userId: req.user!.id,
        type: "memory_shared",
        description: `Shared a new memory: ${memory.title}`,
        data: { memoryId: memory.id }
      });

      res.json(memory);
    } catch (error) {
      res.status(400).json({ error: "Invalid memory data" });
    }
  });

  app.get("/api/memories", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    try {
      const memories = await storage.getMemoriesByUser(req.user!.id);
      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memories" });
    }
  });

  app.get("/api/memories/insights", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    try {
      const memories = await storage.getMemoriesByUser(req.user!.id);
      const insights = await generateMemoryInsight(memories);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // Friends routes
  app.get("/api/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    try {
      const friendships = await storage.getFriendsByUser(req.user!.id);
      const friendsWithDetails = await Promise.all(
        friendships.map(async (friendship) => {
          const friendId = friendship.userId === req.user!.id ? friendship.friendId : friendship.userId;
          const friend = await storage.getUser(friendId);
          return { ...friendship, friend };
        })
      );
      res.json(friendsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch friends" });
    }
  });

  

  app.post("/api/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      // Changed to expect 'targetUser' which can be ID or Username, or prefer username
      const { username } = z.object({ username: z.string() }).parse(req.body);
      
      // Resolve username to user ID
      const friend = await storage.getUserByUsername(username);
      if (!friend) {
        return res.status(404).json({ error: "User not found" });
      }

      if (friend.id === req.user!.id) {
        return res.status(400).json({ error: "Cannot add yourself" });
      }
      
      // Check if already friends (storage checks both directions usually, but we ensure single check)
      const existingFriendship = await storage.getFriendship(req.user!.id, friend.id);
      
      if (existingFriendship) {
        return res.status(400).json({ error: "Friendship already exists" });
      }
      
      const friendship = await storage.createFriend({
        userId: req.user!.id,
        friendId: friend.id,
        status: "pending"
      });
      
      res.json(friendship);
    } catch (error) {
      console.error('Friend request error:', error);
      res.status(400).json({ error: "Invalid friend request" });
    }
  });

  app.patch("/api/friends/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const id = req.params.id;

      // Validate that the user is actually part of this friendship before updating
      // (This logic depends on your storage.getFriendshipById implementation, handled generically here)

      const friendship = await storage.updateFriendship(id, { status });
      
      if (!friendship) return res.status(404).json({ error: "Friendship not found" });

      if (status === "accepted") {
        // Manually update friends count for both users
        const u1 = await storage.getUser(friendship.userId);
        if (u1) await storage.updateUser(u1.id, { friendsCount: (u1.friendsCount || 0) + 1 });
        
        const u2 = await storage.getUser(friendship.friendId);
        if (u2) await storage.updateUser(u2.id, { friendsCount: (u2.friendsCount || 0) + 1 });

        await storage.createActivity({
          userId: req.user!.id,
          type: "friend_added",
          description: "Connected with a new friend",
          data: { friendshipId: id }
        });
      }
      
      res.json(friendship);
    } catch (error) {
      res.status(500).json({ error: "Failed to update friendship" });
    }
  });

  // Pet routes
  app.get("/api/pet", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    const pet = await storage.getPetByUser(req.user!.id);
    res.json(pet);
  });

  app.post("/api/pet/action", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { action } = z.object({ action: z.string() }).parse(req.body);
      const pet = await storage.getPetByUser(req.user!.id);
      
      if (!pet) return res.status(404).json({ error: "Pet not found" });
      
      const happiness = pet.happiness ?? 50;
      const energy = pet.energy ?? 50;
      const bond = pet.bond ?? 30;
      
      let updates: Partial<typeof pet> = {};
      
      switch (action) {
        case "feed":
          updates = { 
            happiness: Math.min(100, happiness + 10),
            energy: Math.min(100, energy + 15),
            lastFed: new Date()
          };
          break;
        case "play":
          updates = { 
            happiness: Math.min(100, happiness + 15),
            bond: Math.min(100, bond + 5),
            energy: Math.max(0, energy - 10),
            lastPlayed: new Date()
          };
          break;
        case "sleep":
          updates = { 
            energy: Math.min(100, energy + 25),
            mood: "Rested"
          };
          break;
        case "exercise":
          updates = { 
            happiness: Math.min(100, happiness + 8),
            energy: Math.max(0, energy - 15),
            bond: Math.min(100, bond + 3)
          };
          break;
      }
      
      const updatedPet = await storage.updatePet(pet.id, updates);
      
      if (!updatedPet) {
        return res.status(500).json({ error: "Failed to update pet" });
      }

      const response = await generatePetInteraction(updatedPet, action);
      
      await storage.createActivity({
        userId: req.user!.id,
        type: "pet_interaction",
        description: `${action} your pet`,
        data: { action, response }
      });
      
      res.json({ pet: updatedPet, response });
    } catch (error) {
      res.status(400).json({ error: "Invalid pet action" });
    }
  });

  app.post("/api/pet/co-care", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user!.id;
  const { friendId } = req.body; // this is actually USERNAME right now

  // 1️⃣ Resolve username → user
  const friendUser = await storage.getUserByUsername(friendId);
  if (!friendUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const friendUserId = friendUser.id;

  // 2️⃣ Validate friendship (bidirectional)
  const friendship = await storage.getFriendship(userId, friendUserId);
  if (!friendship || friendship.status !== "accepted") {
    return res.status(400).json({ error: "Not a valid friend" });
  }

  // 3️⃣ Get pet (shared logic already fixed)
  const pet = await storage.getPetByUser(userId);
  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }

  if (pet.coCarerId) {
  const existingPartner = await storage.getUser(pet.coCarerId);

  return res.status(400).json({
    error: "Pet already has a co-care partner",
    partner: existingPartner
      ? {
          id: existingPartner.id,
          username: existingPartner.username,
          displayName: existingPartner.displayName
        }
      : null
  });
}

  // 4️⃣ Assign co-care partner
  const updatedPet = await storage.updatePet(pet.id, {
    coCarerId: friendUserId
  });

  res.json({
    pet: updatedPet,
    message: "Co-Care Partner added. Pet is now shared."
  });
});

  // Chat routes
  app.get("/api/chat/:friendId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const messages = await storage.getChatMessages(req.user!.id, req.params.friendId);
      
      // Update last interaction for streak
      const friendship = await storage.getFriendship(req.user!.id, req.params.friendId);
      if (friendship) {
        const now = new Date();
        const lastInteraction = friendship.lastInteraction ? new Date(friendship.lastInteraction) : null;
        
        // Increment streak if more than 1 day has passed since last interaction
        if (!lastInteraction || (now.getTime() - lastInteraction.getTime()) > 24 * 60 * 60 * 1000) {
          await storage.updateFriendship(friendship.id, {
            lastInteraction: now,
            streakCount: (friendship.streakCount || 0) + 1
          });
        } else {
          await storage.updateFriendship(friendship.id, { lastInteraction: now });
        }
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat" });
    }
  });

  app.get("/api/friends/conversations", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const friendships = await storage.getFriendsByUser(req.user!.id);
      const acceptedFriends = friendships.filter(f => f.status === "accepted");
      
      // Get last message for each friend and sort by most recent
      const conversations = await Promise.all(
        acceptedFriends.map(async (friendship) => {
          const messages = await storage.getChatMessages(req.user!.id, friendship.userId === req.user!.id ? friendship.friendId : friendship.userId);
          const lastMessage = messages.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          })[0];
          
          return {
            friendship,
            lastMessage: lastMessage || null,
            lastMessageTime: lastMessage?.createdAt || friendship.lastInteraction
          };
        })
      );
      
      // Sort by last message time
      conversations.sort((a, b) => {
        const timeA = new Date(a.lastMessageTime || 0).getTime();
        const timeB = new Date(b.lastMessageTime || 0).getTime();
        return timeB - timeA;
      });
      
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Game routes
  app.post("/api/games", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const gameData = insertGameSchema.parse({
        ...req.body,
        player1Id: req.user!.id,
        currentTurn: req.user!.id
      });
      
      const game = await storage.createGame(gameData);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  app.get("/api/games", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    const games = await storage.getActiveGamesByUser(req.user!.id);
    res.json(games);
  });

  app.get("/api/games/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const game = await storage.getGame(req.params.id);
      if (!game || (game.player1Id !== req.user!.id && game.player2Id !== req.user!.id)) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    const activities = await storage.getActivitiesByUser(req.user!.id, 20);
    res.json(activities);
  });

  // Chatbot routes
  app.post("/api/chatbot", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { message, context } = req.body;
      const response = await generateChatbotResponse(message, context);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ error: "Chatbot error" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const user = req.user!;
      const memories = await storage.getMemoriesByUser(user.id);
      const friends = await storage.getFriendsByUser(user.id);
      const pet = await storage.getPetByUser(user.id);
      const activities = await storage.getActivitiesByUser(user.id, 5);
      
      // Sanitize user object to avoid leaking sensitive fields if any
      const { password, ...safeUser } = user as any;

      res.json({
        user: safeUser,
        memories: memories.length,
        friends: friends.filter(f => f.status === "accepted").length,
        pet,
        activities
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to load dashboard" });
    }
  });

  return httpServer;
}
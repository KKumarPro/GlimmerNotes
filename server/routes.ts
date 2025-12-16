import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import {
  generateChatbotResponse,
  generateMemoryInsight,
  generatePetInteraction,
} from "./ai";
import { z } from "zod";
import { insertMemorySchema, insertFriendSchema, insertChatMessageSchema, insertGameSchema, insertActivitySchema } from "@shared/schema";

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
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          userId = message.userId;
          if (userId) {
            connectedUsers.set(userId, ws);
          }
        }
        
        if (message.type === 'chat') {
          const chatMessage = await storage.createChatMessage({
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            type: 'text'
          });
          
          // Send to receiver if online
          const receiverWs = connectedUsers.get(message.receiverId);
          if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify({
              type: 'chat',
              message: chatMessage
            }));
          }
        }
        
        if (message.type === 'game_move') {
          const game = await storage.getGame(message.gameId);
          if (game) {
            const updatedGame = await storage.updateGame(game.id, {
              gameState: message.gameState,
              currentTurn: message.nextTurn
            });
            
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
    console.error("Create memory error:", error);

    // Optional: be more specific if it's validation
    // import { ZodError } from "zod"; at the top if you want to branch
    return res.status(400).json({ error: "Invalid memory data" });
  }

  });

  app.get("/api/memories", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const memories = await storage.getMemoriesByUser(req.user!.id);
    res.json(memories);
  });

  app.get("/api/memories/insights", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const memories = await storage.getMemoriesByUser(req.user!.id);
    const insights = await generateMemoryInsight(memories);
    res.json(insights);
  });

  

  // Fetch memory first
  const memory = await storage.getMemoryById(memoryId);

  if (!memory) {
    return res.status(404).json({ error: "Memory not found" });
  }

  // Ownership check (CRITICAL)
  if (memory.userId !== req.user!.id) {
    return res.status(403).json({ error: "You cannot delete this memory" });
  }

  // Delete memory
  await storage.deleteMemory(memoryId);
  // Delete memory
  app.delete("/api/memories/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
  }
  const memoryId = req.params.id;

  // Optional: log activity
  await storage.createActivity({
    userId: req.user!.id,
    type: "memory_deleted",
    description: `Deleted a memory: ${memory.title}`,
    data: { memoryId }
  });

  res.json({ success: true });
});


  // Friends routes
  app.get("/api/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const friendships = await storage.getFriendsByUser(req.user!.id);
    const friendsWithDetails = await Promise.all(
      friendships.map(async (friendship) => {
        const friendId = friendship.userId === req.user!.id ? friendship.friendId : friendship.userId;
        const friend = await storage.getUser(friendId);
        return { ...friendship, friend };
      })
    );
    
    res.json(friendsWithDetails);
  });

    app.post("/api/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });

    console.log("POST /api/friends body:", JSON.stringify(req.body));

    try {
      const { friendId: rawFriendId } = req.body;

      // Try to resolve a real user record for the supplied identifier.
      // First assume the client passed a user id. If not found, and storage
      // exposes a username lookup function, try that.
      let friendUser = null;
      if (rawFriendId) {
        friendUser = await storage.getUser(rawFriendId); // common lookup by id

        // Fallback: if not found and a username lookup exists, try it.
        if (!friendUser && typeof storage.getUserByUsername === "function") {
          friendUser = await storage.getUserByUsername(rawFriendId);
        }
        // Some projects use findUserByUsername / getUserByHandle — try common names
        if (!friendUser && typeof storage.findUserByUsername === "function") {
          friendUser = await storage.findUserByUsername(rawFriendId);
        }
        if (!friendUser && typeof storage.getUserByHandle === "function") {
          friendUser = await storage.getUserByHandle(rawFriendId);
        }
      }

      if (friendUser.id === req.user!.id) {
      return res.status(400).json({ error: "You cannot add yourself as a friend" });
      }


      // If we couldn't resolve a user, tell the client plainly.
      if (!friendUser) {
        console.error("Create friend failed - user not found for:", rawFriendId);
        return res.status(404).json({ error: "Friend user not found" });
      }

      const friendRealId = friendUser.id;

      const existingFriendship = await storage.getFriendship(req.user!.id, friendRealId);
      if (existingFriendship) {
        return res.status(400).json({ error: "Friendship already exists" });
      }

      const friendship = await storage.createFriend({
        userId: req.user!.id,
        friendId: friendRealId,
        status: "pending"
      });

      res.json(friendship);
    } catch (error) {
      console.error("Create friend error:", error && (error.stack || error.message || error));
      console.error("Create friend request body at error:", JSON.stringify(req.body));
      res.status(400).json({ error: "Invalid friend request" });
    }
  });

  
  app.patch("/api/friends/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const { status } = req.body;
    const friendship = await storage.updateFriendship(req.params.id, { status });
    
    if (status === "accepted") {
      await storage.createActivity({
        userId: req.user!.id,
        type: "friend_added",
        description: "Connected with a new friend",
        data: { friendshipId: req.params.id }
      });
    }
    
    res.json(friendship);
  });

  // Pet routes
  app.get("/api/pet", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const pet = await storage.getPetByUser(req.user!.id);
    res.json(pet);
  });

  app.post("/api/pet/action", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const { action } = req.body;
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
    const response = await generatePetInteraction(updatedPet, action);
    
    await storage.createActivity({
      userId: req.user!.id,
      type: "pet_interaction",
      description: `${action} your pet`,
      data: { action, response }
    });
    
    res.json({ pet: updatedPet, response });
  });

  // Chat routes
  app.get("/api/chat/:friendId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const messages = await storage.getChatMessages(req.user!.id, req.params.friendId);
    res.json(messages);
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
    
    const game = await storage.getGame(req.params.id);
    if (!game || (game.player1Id !== req.user!.id && game.player2Id !== req.user!.id)) {
      return res.status(404).json({ error: "Game not found" });
    }
    
    res.json(game);
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
      
    const { message, context } = req.body;
    const response = await generateChatbotResponse(message, context);
    res.json({ response });
  });

  // Dashboard stats
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    const user = req.user!;
    const memories = await storage.getMemoriesByUser(user.id);
    const friends = await storage.getFriendsByUser(user.id);
    const pet = await storage.getPetByUser(user.id);
    const activities = await storage.getActivitiesByUser(user.id, 5);
    
    res.json({
      user,
      memories: memories.length,
      friends: friends.filter(f => f.status === "accepted").length,
      pet,
      activities
    });
  });

  return httpServer;
}

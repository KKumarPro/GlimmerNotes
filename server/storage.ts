import { type User, type InsertUser, type Memory, type InsertMemory, type Friend, type InsertFriend, type Pet, type InsertPet, type ChatMessage, type InsertChatMessage, type Game, type InsertGame, type Activity, type InsertActivity } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  createMemory(memory: InsertMemory): Promise<Memory>;
  getMemoriesByUser(userId: string): Promise<Memory[]>;
  getMemory(id: string): Promise<Memory | undefined>;
  
  createFriend(friend: InsertFriend): Promise<Friend>;
  getFriendsByUser(userId: string): Promise<Friend[]>;
  getFriendship(userId: string, friendId: string): Promise<Friend | undefined>;
  updateFriendship(id: string, updates: Partial<Friend>): Promise<Friend | undefined>;
  
  getPetByUser(userId: string): Promise<Pet | undefined>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: string, updates: Partial<Pet>): Promise<Pet | undefined>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId1: string, userId2: string): Promise<ChatMessage[]>;
  getGroupChatMessages(roomId: string): Promise<ChatMessage[]>;
  
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: string): Promise<Game | undefined>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined>;
  getActiveGamesByUser(userId: string): Promise<Game[]>;
  
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByUser(userId: string, limit?: number): Promise<Activity[]>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private memories: Map<string, Memory>;
  private friends: Map<string, Friend>;
  private pets: Map<string, Pet>;
  private chatMessages: Map<string, ChatMessage>;
  private games: Map<string, Game>;
  private activities: Map<string, Activity>;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.memories = new Map();
    this.friends = new Map();
    this.pets = new Map();
    this.chatMessages = new Map();
    this.games = new Map();
    this.activities = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      currentStreak: 0,
      longestStreak: 0,
      memoriesCount: 0,
      friendsCount: 0,
      petLevel: 1,
      lastActive: new Date(),
      createdAt: new Date(),
    };
    this.users.set(id, user);

    // Create default pet for new user
    await this.createPet({
      userId: id,
      name: "Stardust",
      species: "Cosmic Fairy",
      level: 1,
      happiness: 50,
      energy: 50,
      bond: 30,
      mood: "Neutral",
    });

    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const id = randomUUID();
    const memory: Memory = {
      ...insertMemory,
      id,
      createdAt: new Date(),
    };
    this.memories.set(id, memory);

    // Update user's memory count
    const user = this.users.get(insertMemory.userId);
    if (user) {
      await this.updateUser(user.id, { memoriesCount: user.memoriesCount + 1 });
    }

    return memory;
  }

  async getMemoriesByUser(userId: string): Promise<Memory[]> {
    return Array.from(this.memories.values()).filter(memory => memory.userId === userId);
  }

  async getMemory(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async createFriend(insertFriend: InsertFriend): Promise<Friend> {
    const id = randomUUID();
    const friend: Friend = {
      ...insertFriend,
      id,
      streakCount: 0,
      lastInteraction: new Date(),
      createdAt: new Date(),
    };
    this.friends.set(id, friend);

    // Update user's friend count if accepted
    if (friend.status === "accepted") {
      const user = this.users.get(friend.userId);
      if (user) {
        await this.updateUser(user.id, { friendsCount: user.friendsCount + 1 });
      }
    }

    return friend;
  }

  async getFriendsByUser(userId: string): Promise<Friend[]> {
    return Array.from(this.friends.values()).filter(friend => 
      friend.userId === userId || friend.friendId === userId
    );
  }

  async getFriendship(userId: string, friendId: string): Promise<Friend | undefined> {
    return Array.from(this.friends.values()).find(friend =>
      (friend.userId === userId && friend.friendId === friendId) ||
      (friend.userId === friendId && friend.friendId === userId)
    );
  }

  async updateFriendship(id: string, updates: Partial<Friend>): Promise<Friend | undefined> {
    const friend = this.friends.get(id);
    if (!friend) return undefined;
    
    const updatedFriend = { ...friend, ...updates };
    this.friends.set(id, updatedFriend);
    return updatedFriend;
  }

  async getPetByUser(userId: string): Promise<Pet | undefined> {
    return Array.from(this.pets.values()).find(pet => pet.userId === userId);
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const id = randomUUID();
    const pet: Pet = {
      ...insertPet,
      id,
      createdAt: new Date(),
    };
    this.pets.set(id, pet);
    return pet;
  }

  async updatePet(id: string, updates: Partial<Pet>): Promise<Pet | undefined> {
    const pet = this.pets.get(id);
    if (!pet) return undefined;
    
    const updatedPet = { ...pet, ...updates };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessages(userId1: string, userId2: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async getGroupChatMessages(roomId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.roomId === roomId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = {
      ...insertGame,
      id,
      createdAt: new Date(),
    };
    this.games.set(id, game);
    return game;
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async getActiveGamesByUser(userId: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => 
      (game.player1Id === userId || game.player2Id === userId) && 
      game.status === "active"
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getActivitiesByUser(userId: string, limit = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();

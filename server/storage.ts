import { type User, type InsertUser, type Memory, type InsertMemory, type Friend, type InsertFriend, type Pet, type InsertPet, type ChatMessage, type InsertChatMessage, type Game, type InsertGame, type Activity, type InsertActivity } from "@shared/schema";
import { users, memories, friends, pets, chatMessages, games, activities } from "@shared/schema";
import { db } from "./db";
import { eq, or, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgSession = connectPgSimple(session);

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
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PgSession({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      displayName: insertUser.displayName || null,
    }).returning();

    await this.createPet({
      userId: user.id,
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
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const [memory] = await db.insert(memories).values({
      ...insertMemory,
      content: insertMemory.content || null,
      starPosition: insertMemory.starPosition || null,
      isPublic: insertMemory.isPublic ?? false,
    }).returning();

    const user = await this.getUser(insertMemory.userId);
    if (user) {
      await this.updateUser(user.id, { memoriesCount: (user.memoriesCount || 0) + 1 });
    }

    return memory;
  }

  async getMemoriesByUser(userId: string): Promise<Memory[]> {
    return db.select().from(memories).where(eq(memories.userId, userId)).orderBy(desc(memories.createdAt));
  }

  async getMemory(id: string): Promise<Memory | undefined> {
    const [memory] = await db.select().from(memories).where(eq(memories.id, id));
    return memory || undefined;
  }

  async createFriend(insertFriend: InsertFriend): Promise<Friend> {
    const [friend] = await db.insert(friends).values({
      ...insertFriend,
      status: insertFriend.status || "pending",
    }).returning();

    if (friend.status === "accepted") {
      const user = await this.getUser(friend.userId);
      if (user) {
        await this.updateUser(user.id, { friendsCount: (user.friendsCount || 0) + 1 });
      }
    }

    return friend;
  }

  async getFriendsByUser(userId: string): Promise<Friend[]> {
    return db.select().from(friends).where(
      or(eq(friends.userId, userId), eq(friends.friendId, userId))
    );
  }

  async getFriendship(userId: string, friendId: string): Promise<Friend | undefined> {
    const [friendship] = await db.select().from(friends).where(
      or(
        and(eq(friends.userId, userId), eq(friends.friendId, friendId)),
        and(eq(friends.userId, friendId), eq(friends.friendId, userId))
      )
    );
    return friendship || undefined;
  }

  async updateFriendship(id: string, updates: Partial<Friend>): Promise<Friend | undefined> {
    const [friend] = await db.update(friends).set(updates).where(eq(friends.id, id)).returning();
    return friend || undefined;
  }

  async getPetByUser(userId: string): Promise<Pet | undefined> {
    const [pet] = await db.select().from(pets).where(eq(pets.userId, userId));
    return pet || undefined;
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const [pet] = await db.insert(pets).values({
      ...insertPet,
      name: insertPet.name || "Stardust",
      species: insertPet.species || "Cosmic Fairy",
      level: insertPet.level ?? 1,
      happiness: insertPet.happiness ?? 50,
      energy: insertPet.energy ?? 50,
      bond: insertPet.bond ?? 30,
      mood: insertPet.mood || "Neutral",
    }).returning();
    return pet;
  }

  async updatePet(id: string, updates: Partial<Pet>): Promise<Pet | undefined> {
    const [pet] = await db.update(pets).set(updates).where(eq(pets.id, id)).returning();
    return pet || undefined;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values({
      ...insertMessage,
      type: insertMessage.type || "text",
      receiverId: insertMessage.receiverId || null,
      roomId: insertMessage.roomId || null,
    }).returning();
    return message;
  }

  async getChatMessages(userId1: string, userId2: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(
      or(
        and(eq(chatMessages.senderId, userId1), eq(chatMessages.receiverId, userId2)),
        and(eq(chatMessages.senderId, userId2), eq(chatMessages.receiverId, userId1))
      )
    ).orderBy(chatMessages.createdAt);
  }

  async getGroupChatMessages(roomId: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.roomId, roomId)).orderBy(chatMessages.createdAt);
  }

  async deleteExpiredChatMessages() {
  await this.db.execute(sql`
    DELETE FROM chat_messages
    WHERE created_at < NOW() - INTERVAL '24 hours'
  `);
}


  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values({
      ...insertGame,
      status: insertGame.status || "active",
      gameState: insertGame.gameState || null,
      winnerId: insertGame.winnerId || null,
      currentTurn: insertGame.currentTurn || null,
    }).returning();
    return game;
  }

  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const [game] = await db.update(games).set(updates).where(eq(games.id, id)).returning();
    return game || undefined;
  }

  async getActiveGamesByUser(userId: string): Promise<Game[]> {
    return db.select().from(games).where(
      and(
        or(eq(games.player1Id, userId), eq(games.player2Id, userId)),
        eq(games.status, "active")
      )
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values({
      ...insertActivity,
      data: insertActivity.data || null,
    }).returning();
    return activity;
  }

  async getActivitiesByUser(userId: string, limit = 10): Promise<Activity[]> {
    return db.select().from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();

import { users, socialConnections, leaderboard, tasks, campaigns, campaignParticipants, profiles, type User, type InsertUser, type SocialConnection, type InsertSocialConnection, type LeaderboardEntry, type InsertLeaderboardEntry, type Task, type InsertTask, type Campaign, type InsertCampaign, type CampaignParticipant, type InsertCampaignParticipant, type Profile, type InsertProfile } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Social connection operations
  getSocialConnections(userId: number): Promise<SocialConnection[]>;
  getUserSocialConnection(userId: number, platform: string): Promise<SocialConnection | undefined>;
  createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection>;
  updateSocialConnection(id: number, updates: Partial<SocialConnection>): Promise<SocialConnection>;
  updateUserSocialConnection(userId: number, connectionData: Partial<SocialConnection> & { platform: string }): Promise<SocialConnection>;
  removeSocialConnection(userId: number, platform: string): Promise<void>;
  disconnectSocialConnection(userId: number, platform: string): Promise<void>;
  
  // Leaderboard operations
  getLeaderboard(category?: string, limit?: number): Promise<LeaderboardEntry[]>;
  updateLeaderboard(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  
  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task>;
  
  // Campaign operations
  getCampaigns(userId?: number): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign>;
  
  // Campaign participation operations
  getCampaignParticipants(campaignId: number): Promise<CampaignParticipant[]>;
  getUserCampaignParticipation(userId: number, campaignId: number): Promise<CampaignParticipant | undefined>;
  createCampaignParticipant(participant: InsertCampaignParticipant): Promise<CampaignParticipant>;
  updateCampaignParticipant(id: number, updates: Partial<CampaignParticipant>): Promise<CampaignParticipant>;
  getUserParticipatedCampaigns(userId: number): Promise<CampaignParticipant[]>;
  
  // Profile operations
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, updates: Partial<Profile>): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
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

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Social connection operations
  async getSocialConnections(userId: number): Promise<SocialConnection[]> {
    return await db
      .select()
      .from(socialConnections)
      .where(eq(socialConnections.userId, userId));
  }

  async createSocialConnection(connectionData: InsertSocialConnection): Promise<SocialConnection> {
    const [connection] = await db
      .insert(socialConnections)
      .values({
        ...connectionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return connection;
  }

  async updateSocialConnection(id: number, updates: Partial<SocialConnection>): Promise<SocialConnection> {
    const [connection] = await db
      .update(socialConnections)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(socialConnections.id, id))
      .returning();
    return connection;
  }

  async getUserSocialConnection(userId: number, platform: string): Promise<SocialConnection | undefined> {
    const [connection] = await db
      .select()
      .from(socialConnections)
      .where(eq(socialConnections.userId, userId))
      .where(eq(socialConnections.platform, platform));
    return connection || undefined;
  }

  async updateUserSocialConnection(userId: number, connectionData: Partial<SocialConnection> & { platform: string }): Promise<SocialConnection> {
    const existing = await this.getUserSocialConnection(userId, connectionData.platform);
    
    if (existing) {
      // Update existing connection
      const [updated] = await db
        .update(socialConnections)
        .set({
          ...connectionData,
          updatedAt: new Date(),
        })
        .where(eq(socialConnections.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new connection
      const [created] = await db
        .insert(socialConnections)
        .values({
          userId,
          ...connectionData,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as InsertSocialConnection)
        .returning();
      return created;
    }
  }

  async removeSocialConnection(userId: number, platform: string): Promise<void> {
    await db
      .delete(socialConnections)
      .where(eq(socialConnections.userId, userId))
      .where(eq(socialConnections.platform, platform));
  }

  async disconnectSocialConnection(userId: number, platform: string): Promise<void> {
    await db
      .delete(socialConnections)
      .where(eq(socialConnections.userId, userId))
      .where(eq(socialConnections.platform, platform));
  }

  // Leaderboard operations
  async getLeaderboard(category = "global", limit = 100): Promise<LeaderboardEntry[]> {
    return await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.category, category))
      .orderBy(desc(leaderboard.score))
      .limit(limit);
  }

  async updateLeaderboard(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    // First check if entry exists
    const existing = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, entry.userId!))
      .where(eq(leaderboard.category, entry.category || "global"));

    if (existing.length > 0) {
      // Update existing entry
      const [updated] = await db
        .update(leaderboard)
        .set({
          ...entry,
          updatedAt: new Date(),
        })
        .where(eq(leaderboard.id, existing[0].id))
        .returning();
      return updated;
    } else {
      // Create new entry
      const [created] = await db
        .insert(leaderboard)
        .values({
          ...entry,
          updatedAt: new Date(),
        })
        .returning();
      return created;
    }
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...taskData,
        createdAt: new Date(),
      })
      .returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({
        ...updates,
        completedAt: updates.isCompleted ? new Date() : undefined,
      })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  // Campaign operations
  async getCampaigns(userId?: number): Promise<Campaign[]> {
    if (userId) {
      return await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.userId, userId))
        .orderBy(desc(campaigns.createdAt));
    } else {
      return await db
        .select()
        .from(campaigns)
        .orderBy(desc(campaigns.createdAt));
    }
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values({
        ...campaignData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign> {
    const [campaign] = await db
      .update(campaigns)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  // Campaign participation operations
  async getCampaignParticipants(campaignId: number): Promise<CampaignParticipant[]> {
    return await db
      .select()
      .from(campaignParticipants)
      .where(eq(campaignParticipants.campaignId, campaignId));
  }

  async getUserCampaignParticipation(userId: number, campaignId: number): Promise<CampaignParticipant | undefined> {
    const [participant] = await db
      .select()
      .from(campaignParticipants)
      .where(eq(campaignParticipants.userId, userId))
      .where(eq(campaignParticipants.campaignId, campaignId));
    return participant || undefined;
  }

  async createCampaignParticipant(participantData: InsertCampaignParticipant): Promise<CampaignParticipant> {
    const [participant] = await db
      .insert(campaignParticipants)
      .values({
        ...participantData,
        appliedAt: new Date(),
      })
      .returning();
    return participant;
  }

  async updateCampaignParticipant(id: number, updates: Partial<CampaignParticipant>): Promise<CampaignParticipant> {
    const [participant] = await db
      .update(campaignParticipants)
      .set(updates)
      .where(eq(campaignParticipants.id, id))
      .returning();
    return participant;
  }

  async getUserParticipatedCampaigns(userId: number): Promise<CampaignParticipant[]> {
    return await db
      .select()
      .from(campaignParticipants)
      .where(eq(campaignParticipants.userId, userId));
  }

  // Profile operations
  async getProfile(userId: number): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async createProfile(profileData: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values({
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return profile;
  }

  async updateProfile(id: number, updates: Partial<Profile>): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();
    return profile;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private socialConnections: Map<number, SocialConnection>;
  private leaderboard: Map<number, LeaderboardEntry>;
  private tasks: Map<number, Task>;
  private campaigns: Map<number, Campaign>;
  private profiles: Map<number, Profile>;
  private currentUserId: number;
  private currentSocialId: number;
  private currentLeaderboardId: number;
  private currentTaskId: number;
  private currentCampaignId: number;
  private currentProfileId: number;

  constructor() {
    this.users = new Map();
    this.socialConnections = new Map();
    this.leaderboard = new Map();
    this.tasks = new Map();
    this.campaigns = new Map();
    this.profiles = new Map();
    this.currentUserId = 1;
    this.currentSocialId = 1;
    this.currentLeaderboardId = 1;
    this.currentTaskId = 1;
    this.currentCampaignId = 1;
    this.currentProfileId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: 1,
      username: "samhuber",
      email: "sam@example.com",
      password: "password123",
      firstName: "Sam",
      lastName: "Huber",
      veriScore: 99,
      xpPoints: 2500,
      points: 250,
      profilePicture: "SH",
      bio: "Tech creator and content strategist",
      isVerified: true,
      userType: "creator",
      profileType: "creator",
      streak: 12,
      hasCompletedOnboarding: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(1, sampleUser);
    this.currentUserId = 2;

    // Create sample social connections
    const connections = [
      {
        id: 1,
        userId: 1,
        platform: "twitter",
        platformUsername: "@samhuber",
        isConnected: true,
        connectionData: JSON.stringify({ followers: 15600, verified: true }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        platform: "youtube",
        platformUsername: "Sam Huber",
        isConnected: true,
        connectionData: JSON.stringify({ subscribers: 45200, verified: true }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        platform: "instagram",
        platformUsername: "@samhuber",
        isConnected: false,
        connectionData: JSON.stringify({ followers: 8900 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    connections.forEach(conn => this.socialConnections.set(conn.id, conn));
    this.currentSocialId = 4;

    // Create sample leaderboard entries
    const leaderboardEntries = [
      {
        id: 1,
        userId: 1,
        rank: 3,
        score: 99,
        category: "global",
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 2,
        rank: 1,
        score: 156,
        category: "global",
        updatedAt: new Date(),
      },
      {
        id: 3,
        userId: 3,
        rank: 2,
        score: 142,
        category: "global",
        updatedAt: new Date(),
      },
    ];

    leaderboardEntries.forEach(entry => this.leaderboard.set(entry.id, entry));
    this.currentLeaderboardId = 4;

    // Create sample tasks
    const sampleTasks = [
      {
        id: 1,
        userId: 1,
        title: "Brand collaboration",
        description: "Complete a brand collaboration post",
        points: 200,
        isCompleted: true,
        category: "social",
        requiresVerification: true,
        verificationData: JSON.stringify({ type: "social_post", platform: "twitter" }),
        createdAt: new Date(),
        completedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        title: "Content creation",
        description: "Create original content",
        points: 150,
        isCompleted: true,
        category: "content",
        requiresVerification: false,
        verificationData: null,
        createdAt: new Date(),
        completedAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        title: "Engagement boost",
        description: "Increase engagement by 10%",
        points: 100,
        isCompleted: false,
        category: "social",
        requiresVerification: true,
        verificationData: JSON.stringify({ type: "engagement_metrics", target: "10%" }),
        createdAt: new Date(),
        completedAt: null,
      },
    ];

    sampleTasks.forEach(task => this.tasks.set(task.id, task));
    this.currentTaskId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      email: insertUser.email,
      username: insertUser.username,
      password: insertUser.password,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      veriScore: 0,
      xpPoints: 0,
      points: 25,
      profilePicture: null,
      bio: null,
      isVerified: false,
      userType: insertUser.userType ?? "creator",
      profileType: insertUser.profileType ?? "creator",
      streak: 0,
      hasCompletedOnboarding: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getSocialConnections(userId: number): Promise<SocialConnection[]> {
    return Array.from(this.socialConnections.values()).filter(conn => conn.userId === userId);
  }

  async createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection> {
    const id = this.currentSocialId++;
    const newConnection: SocialConnection = {
      id,
      userId: connection.userId ?? null,
      platform: connection.platform,
      platformUsername: connection.platformUsername,
      isConnected: connection.isConnected ?? null,
      connectionData: connection.connectionData ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.socialConnections.set(id, newConnection);
    return newConnection;
  }

  async updateSocialConnection(id: number, updates: Partial<SocialConnection>): Promise<SocialConnection> {
    const connection = this.socialConnections.get(id);
    if (!connection) {
      throw new Error("Social connection not found");
    }
    const updatedConnection = { ...connection, ...updates, updatedAt: new Date() };
    this.socialConnections.set(id, updatedConnection);
    return updatedConnection;
  }

  async getLeaderboard(category = "global", limit = 10): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboard.values())
      .filter(entry => entry.category === category)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit);
  }

  async updateLeaderboard(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const existingEntry = Array.from(this.leaderboard.values())
      .find(e => e.userId === entry.userId && e.category === entry.category);
    
    if (existingEntry) {
      const updatedEntry = { ...existingEntry, ...entry, updatedAt: new Date() };
      this.leaderboard.set(existingEntry.id, updatedEntry);
      return updatedEntry;
    } else {
      const id = this.currentLeaderboardId++;
      const newEntry: LeaderboardEntry = {
        id,
        userId: entry.userId ?? null,
        category: entry.category ?? null,
        rank: entry.rank,
        score: entry.score,
        updatedAt: new Date(),
      };
      this.leaderboard.set(id, newEntry);
      return newEntry;
    }
  }

  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const newTask: Task = {
      id,
      userId: task.userId ?? null,
      title: task.title,
      description: task.description ?? null,
      points: task.points,
      category: task.category ?? null,
      isCompleted: false,
      requiresVerification: task.requiresVerification ?? false,
      verificationData: task.verificationData ?? null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error("Task not found");
    }
    const updatedTask = { ...task, ...updates };
    if (updates.isCompleted && !task.isCompleted) {
      updatedTask.completedAt = new Date();
    }
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async getCampaigns(userId?: number): Promise<Campaign[]> {
    const campaigns = Array.from(this.campaigns.values());
    return userId ? campaigns.filter(c => c.userId === userId) : campaigns;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const newCampaign: Campaign = {
      id,
      userId: campaign.userId ?? null,
      title: campaign.title,
      description: campaign.description ?? null,
      budget: campaign.budget,
      status: "active",
      targetAudience: campaign.targetAudience ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    const updatedCampaign = { ...campaign, ...updates, updatedAt: new Date() };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async getProfile(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(p => p.userId === userId);
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const newProfile: Profile = {
      id,
      userId: profile.userId ?? null,
      displayName: profile.displayName,
      profileType: profile.profileType,
      description: profile.description ?? null,
      website: profile.website ?? null,
      location: profile.location ?? null,
      isPublic: profile.isPublic ?? true,
      customizations: profile.customizations ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async updateProfile(id: number, updates: Partial<Profile>): Promise<Profile> {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }
}

// Initialize storage based on demo mode
async function initializeStorage() {
  try {
    const { isDemoMode } = await import('./demo-config');
    if (isDemoMode()) {
      const { DemoStorage } = await import('./demo-storage');
      return new DemoStorage();
    } else {
      return new DatabaseStorage();
    }
  } catch (error) {
    console.error('Error determining storage mode, falling back to demo:', error);
    const { DemoStorage } = await import('./demo-storage');
    return new DemoStorage();
  }
}

// Export a promise that resolves to the appropriate storage
export const storagePromise = initializeStorage();

// Legacy export for backward compatibility - will be async
let storageInstance: IStorage | null = null;
export const storage = new Proxy({} as IStorage, {
  get(target, prop) {
    if (!storageInstance) {
      throw new Error('Storage not initialized. Use await storage methods or storagePromise.');
    }
    return (storageInstance as any)[prop];
  }
});

// Initialize storage immediately
storagePromise.then(instance => {
  storageInstance = instance;
  console.log('Storage initialized:', instance.constructor.name);
});

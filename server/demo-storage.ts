import { type User, type InsertUser, type SocialConnection, type InsertSocialConnection, type LeaderboardEntry, type InsertLeaderboardEntry, type Task, type InsertTask, type Campaign, type InsertCampaign, type CampaignParticipant, type InsertCampaignParticipant, type Profile, type InsertProfile } from "@shared/schema";
import { IStorage } from "./storage";
import { getCachedLeaderboard } from "./leaderboard-generator";

/**
 * Demo Storage Implementation
 * Uses in-memory storage for demo mode - no database required
 */
export class DemoStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private socialConnections: Map<number, SocialConnection[]> = new Map();
  private tasks: Map<number, Task[]> = new Map();
  private campaigns: Map<number, Campaign> = new Map();
  private campaignParticipants: Map<number, CampaignParticipant[]> = new Map();
  private profiles: Map<number, Profile> = new Map();
  private nextUserId = 1;
  private nextTaskId = 1;
  private nextCampaignId = 1;
  private nextProfileId = 1;
  private nextConnectionId = 1;
  private nextParticipantId = 1;

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo users
    const demoUsers = [
      {
        id: 1,
        username: 'DemoCreator',
        email: 'demo@veri.club',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'Creator',
        veriScore: 85,
        xpPoints: 1250,
        points: 150,
        profilePicture: null,
        bio: 'Welcome to Veri! This is your demo account to explore all features.',
        isVerified: true,
        userType: 'creator' as const,
        profileType: 'creator' as const,
        streak: 7,
        hasCompletedOnboarding: false, // Start with onboarding
        profileCompleted: false,
        customUsername: 'democreator',
        website: 'https://demo.veri.club',
        showcaseContent: null,
        creatorType: 'content_creator',
        interests: ['gaming', 'tech', 'lifestyle'],
        goals: ['grow_audience', 'monetize_content'],
        veriAccountId: 'demo-1',
        walletAddress: '0x742d35Cc6Bf8f5C4a1cE09e3E4D68D5b1234567890',
        encryptedPrivateKey: null,
        walletCreatedAt: new Date(),
        chainId: 137,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Create demo social connections
    const demoConnections = [
      {
        id: 1,
        userId: 1,
        platform: 'twitter',
        platformId: 'demo_twitter_123',
        platformUsername: 'democreator',
        displayName: 'Demo Creator',
        followerCount: 15420,
        profileImageUrl: null,
        isConnected: true,
        accessToken: 'demo_token',
        refreshToken: 'demo_refresh',
        expiresAt: new Date(Date.now() + 86400000), // 24 hours
        lastSync: new Date(),
        metadata: { demo: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    this.socialConnections.set(1, demoConnections);

    // Create demo tasks
    const demoTasks = [
      {
        id: 1,
        userId: 1,
        title: 'Connect Your Social Media',
        description: 'Link your social media accounts to start building your VeriScore',
        status: 'pending' as const,
        xpReward: 50,
        platform: 'twitter',
        category: 'onboarding',
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 86400000),
        completedAt: null,
        metadata: { demo: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        title: 'Complete Your Profile',
        description: 'Add your bio, profile picture, and showcase content',
        status: 'pending' as const,
        xpReward: 75,
        platform: 'veri',
        category: 'profile',
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 172800000), // 2 days
        completedAt: null,
        metadata: { demo: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    this.tasks.set(1, demoTasks);

    // Create demo campaigns
    const demoCampaigns = [
      {
        id: 1,
        title: 'Summer Gaming Challenge',
        description: 'Showcase your favorite gaming setup and earn rewards!',
        brand: 'GameTech Pro',
        budget: 5000,
        requirements: 'Must have 1000+ followers and post gaming content',
        status: 'active' as const,
        startDate: new Date(),
        endDate: new Date(Date.now() + 2592000000), // 30 days
        participantCount: 42,
        maxParticipants: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Tech Review Series',
        description: 'Review the latest tech gadgets and share your honest opinions',
        brand: 'TechInnovate',
        budget: 8000,
        requirements: 'Tech content creators with engaged audience',
        status: 'active' as const,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1814400000), // 21 days
        participantCount: 28,
        maxParticipants: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    demoCampaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });

    this.nextUserId = 2;
    this.nextTaskId = 3;
    this.nextCampaignId = 3;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      ...userData,
      id: this.nextUserId++,
      veriScore: userData.veriScore || 0,
      xpPoints: userData.xpPoints || 0,
      points: userData.points || 25,
      profilePicture: userData.profilePicture || null,
      bio: userData.bio || null,
      isVerified: userData.isVerified || false,
      userType: userData.userType || 'creator',
      profileType: userData.profileType || 'creator',
      streak: userData.streak || 0,
      hasCompletedOnboarding: userData.hasCompletedOnboarding || false,
      profileCompleted: userData.profileCompleted || false,
      customUsername: userData.customUsername || null,
      website: userData.website || null,
      showcaseContent: userData.showcaseContent || null,
      creatorType: userData.creatorType || null,
      interests: userData.interests || null,
      goals: userData.goals || null,
      veriAccountId: userData.veriAccountId || `demo-${this.nextUserId}`,
      walletAddress: userData.walletAddress || null,
      encryptedPrivateKey: userData.encryptedPrivateKey || null,
      walletCreatedAt: userData.walletCreatedAt || null,
      chainId: userData.chainId || 137,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Social connection operations
  async getSocialConnections(userId: number): Promise<SocialConnection[]> {
    return this.socialConnections.get(userId) || [];
  }

  async getUserSocialConnection(userId: number, platform: string): Promise<SocialConnection | undefined> {
    const connections = this.socialConnections.get(userId) || [];
    return connections.find(conn => conn.platform === platform);
  }

  async createSocialConnection(connectionData: InsertSocialConnection): Promise<SocialConnection> {
    const connection: SocialConnection = {
      ...connectionData,
      id: this.nextConnectionId++,
      followerCount: connectionData.followerCount || 0,
      profileImageUrl: connectionData.profileImageUrl || null,
      isConnected: connectionData.isConnected ?? true,
      accessToken: connectionData.accessToken || null,
      refreshToken: connectionData.refreshToken || null,
      expiresAt: connectionData.expiresAt || null,
      lastSync: connectionData.lastSync || new Date(),
      metadata: connectionData.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userConnections = this.socialConnections.get(connectionData.userId!) || [];
    userConnections.push(connection);
    this.socialConnections.set(connectionData.userId!, userConnections);

    return connection;
  }

  async updateSocialConnection(id: number, updates: Partial<SocialConnection>): Promise<SocialConnection> {
    for (const [userId, connections] of this.socialConnections.entries()) {
      const connectionIndex = connections.findIndex(conn => conn.id === id);
      if (connectionIndex !== -1) {
        const updatedConnection = {
          ...connections[connectionIndex],
          ...updates,
          updatedAt: new Date(),
        };
        connections[connectionIndex] = updatedConnection;
        this.socialConnections.set(userId, connections);
        return updatedConnection;
      }
    }
    throw new Error('Social connection not found');
  }

  async updateUserSocialConnection(userId: number, connectionData: Partial<SocialConnection> & { platform: string }): Promise<SocialConnection> {
    const connections = this.socialConnections.get(userId) || [];
    const connectionIndex = connections.findIndex(conn => conn.platform === connectionData.platform);
    
    if (connectionIndex !== -1) {
      const updatedConnection = {
        ...connections[connectionIndex],
        ...connectionData,
        updatedAt: new Date(),
      };
      connections[connectionIndex] = updatedConnection;
      this.socialConnections.set(userId, connections);
      return updatedConnection;
    }

    // Create new connection if it doesn't exist
    return this.createSocialConnection({
      userId,
      ...connectionData,
    } as InsertSocialConnection);
  }

  async removeSocialConnection(userId: number, platform: string): Promise<void> {
    const connections = this.socialConnections.get(userId) || [];
    const filteredConnections = connections.filter(conn => conn.platform !== platform);
    this.socialConnections.set(userId, filteredConnections);
  }

  async disconnectSocialConnection(userId: number, platform: string): Promise<void> {
    const connections = this.socialConnections.get(userId) || [];
    const connection = connections.find(conn => conn.platform === platform);
    if (connection) {
      connection.isConnected = false;
      connection.accessToken = null;
      connection.refreshToken = null;
      connection.updatedAt = new Date();
    }
  }

  // Leaderboard operations
  async getLeaderboard(category?: string, limit?: number): Promise<LeaderboardEntry[]> {
    const globalLeaderboard = getCachedLeaderboard();
    const leaderboardEntries: LeaderboardEntry[] = globalLeaderboard.slice(0, limit || 100).map(user => ({
      id: user.id,
      userId: user.id,
      username: user.username,
      score: user.score,
      rank: user.rank,
      change: user.change,
      category: user.category,
      period: 'weekly',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (category && category !== 'global') {
      return leaderboardEntries.filter(entry => entry.category === category);
    }

    return leaderboardEntries;
  }

  async updateLeaderboard(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const leaderboardEntry: LeaderboardEntry = {
      ...entry,
      id: Date.now(), // Simple ID generation
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return leaderboardEntry;
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return this.tasks.get(userId) || [];
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const task: Task = {
      ...taskData,
      id: this.nextTaskId++,
      status: taskData.status || 'pending',
      xpReward: taskData.xpReward || 0,
      category: taskData.category || 'general',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completedAt: taskData.completedAt || null,
      metadata: taskData.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userTasks = this.tasks.get(taskData.userId!) || [];
    userTasks.push(task);
    this.tasks.set(taskData.userId!, userTasks);

    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    for (const [userId, tasks] of this.tasks.entries()) {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        const updatedTask = {
          ...tasks[taskIndex],
          ...updates,
          updatedAt: new Date(),
        };
        tasks[taskIndex] = updatedTask;
        this.tasks.set(userId, tasks);
        return updatedTask;
      }
    }
    throw new Error('Task not found');
  }

  // Campaign operations
  async getCampaigns(userId?: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const campaign: Campaign = {
      ...campaignData,
      id: this.nextCampaignId++,
      status: campaignData.status || 'draft',
      participantCount: campaignData.participantCount || 0,
      maxParticipants: campaignData.maxParticipants || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const updatedCampaign = {
      ...campaign,
      ...updates,
      updatedAt: new Date(),
    };

    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Campaign participation operations
  async getCampaignParticipants(campaignId: number): Promise<CampaignParticipant[]> {
    return this.campaignParticipants.get(campaignId) || [];
  }

  async getUserCampaignParticipation(userId: number, campaignId: number): Promise<CampaignParticipant | undefined> {
    const participants = this.campaignParticipants.get(campaignId) || [];
    return participants.find(p => p.userId === userId);
  }

  async createCampaignParticipant(participantData: InsertCampaignParticipant): Promise<CampaignParticipant> {
    const participant: CampaignParticipant = {
      ...participantData,
      id: this.nextParticipantId++,
      status: participantData.status || 'pending',
      submissionUrl: participantData.submissionUrl || null,
      submittedAt: participantData.submittedAt || null,
      approvedAt: participantData.approvedAt || null,
      rejectedAt: participantData.rejectedAt || null,
      rejectionReason: participantData.rejectionReason || null,
      payout: participantData.payout || null,
      paidAt: participantData.paidAt || null,
      metadata: participantData.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const campaignParticipants = this.campaignParticipants.get(participantData.campaignId!) || [];
    campaignParticipants.push(participant);
    this.campaignParticipants.set(participantData.campaignId!, campaignParticipants);

    return participant;
  }

  async updateCampaignParticipant(id: number, updates: Partial<CampaignParticipant>): Promise<CampaignParticipant> {
    for (const [campaignId, participants] of this.campaignParticipants.entries()) {
      const participantIndex = participants.findIndex(p => p.id === id);
      if (participantIndex !== -1) {
        const updatedParticipant = {
          ...participants[participantIndex],
          ...updates,
          updatedAt: new Date(),
        };
        participants[participantIndex] = updatedParticipant;
        this.campaignParticipants.set(campaignId, participants);
        return updatedParticipant;
      }
    }
    throw new Error('Campaign participant not found');
  }

  async getUserParticipatedCampaigns(userId: number): Promise<CampaignParticipant[]> {
    const allParticipants: CampaignParticipant[] = [];
    for (const participants of this.campaignParticipants.values()) {
      allParticipants.push(...participants.filter(p => p.userId === userId));
    }
    return allParticipants;
  }

  // Profile operations
  async getProfile(userId: number): Promise<Profile | undefined> {
    return this.profiles.get(userId);
  }

  async createProfile(profileData: InsertProfile): Promise<Profile> {
    const profile: Profile = {
      ...profileData,
      id: this.nextProfileId++,
      isPublic: profileData.isPublic ?? true,
      showcaseItems: profileData.showcaseItems || null,
      socialLinks: profileData.socialLinks || null,
      achievements: profileData.achievements || null,
      metadata: profileData.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.profiles.set(profileData.userId!, profile);
    return profile;
  }

  async updateProfile(id: number, updates: Partial<Profile>): Promise<Profile> {
    for (const [userId, profile] of this.profiles.entries()) {
      if (profile.id === id) {
        const updatedProfile = {
          ...profile,
          ...updates,
          updatedAt: new Date(),
        };
        this.profiles.set(userId, updatedProfile);
        return updatedProfile;
      }
    }
    throw new Error('Profile not found');
  }
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSocialConnectionSchema, insertTaskSchema, insertCampaignSchema, insertCampaignParticipantSchema, insertProfileSchema } from "@shared/schema";
import "./types";
import healthRoutes from "./routes/health";
import brightmatterRoutes from "./routes/brightmatter";
import { requestTiming, errorTracking } from "./middleware/monitoring";
import { rateLimitMiddleware } from "./middleware/rateLimiter";
import adminRoutes from "./routes/admin";
import { authMiddleware, optionalAuthMiddleware, generateTokens, setAuthCookies, clearAuthCookies, type AuthenticatedRequest } from "./auth";
import { initiateTwitterLogin, handleTwitterCallback, disconnectTwitter } from "./oauth";
import { demoTwitterLogin, demoTwitterCallback, demoTwitterDisconnect } from "./oauth-demo";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply monitoring middleware
  app.use(requestTiming);
  
  // Apply rate limiting middleware (dormant unless enabled)
  app.use(rateLimitMiddleware);
  
  // Clear auth cookies in demo mode to ensure clean slate
  app.use(async (req, res, next) => {
    try {
      const { isDemoMode } = await import('./demo-config');
      if (isDemoMode() && (req.cookies.accessToken || req.cookies.refreshToken)) {
        console.log('🧹 DEMO MODE: Clearing existing auth cookies');
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken'); 
        res.clearCookie('connect.sid');
      }
    } catch (error) {
      console.error('Error clearing demo cookies:', error);
    }
    next();
  });
  
  // Health check routes
  app.use('/api', healthRoutes);
  
  // Brightmatter AI routes
  app.use('/api/brightmatter', brightmatterRoutes);
  
  // Admin routes (internal use only)
  app.use(adminRoutes);
  
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      // Check for demo mode
      const { isDemoMode } = await import('./demo-config');
      if (isDemoMode()) {
        // In demo mode, always return the demo user
        const demoUser = await storage.getUser(1);
        if (demoUser) {
          // Generate demo tokens
          const { accessToken, refreshToken } = generateTokens(demoUser.id, demoUser.email);
          setAuthCookies(res, accessToken, refreshToken);
          req.session.userId = demoUser.id;
          return res.status(201).json(demoUser);
        }
      }

      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Create wallet for new user
      try {
        const { createWalletForUser } = await import("./wallet");
        await createWalletForUser(user.id);
      } catch (walletError) {
        console.error('Failed to create wallet for new user:', walletError);
        // Continue with user creation even if wallet creation fails
      }
      
      // Generate JWT tokens
      const { accessToken, refreshToken } = generateTokens(user.id, user.email);
      
      // Set auth cookies
      setAuthCookies(res, accessToken, refreshToken);
      
      // Also set legacy session for compatibility
      req.session.userId = user.id;
      
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      // Check for demo mode
      const { isDemoMode } = await import('./demo-config');
      if (isDemoMode()) {
        // In demo mode, always return the demo user
        const demoUser = await storage.getUser(1);
        if (demoUser) {
          // Generate demo tokens
          const { accessToken, refreshToken } = generateTokens(demoUser.id, demoUser.email);
          setAuthCookies(res, accessToken, refreshToken);
          req.session.userId = demoUser.id;
          return res.json(demoUser);
        }
      }

      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT tokens
      const { accessToken, refreshToken } = generateTokens(user.id, user.email);
      
      // Set auth cookies
      setAuthCookies(res, accessToken, refreshToken);
      
      // Also set legacy session for compatibility
      req.session.userId = user.id;
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // Clear JWT cookies
    clearAuthCookies(res);
    
    // Also clear legacy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Handle both GET and POST requests for /api/auth/refresh
  const handleRefresh = async (req, res) => {
    try {
      // In demo mode, don't auto-refresh tokens from previous sessions
      // Users must explicitly sign up/login first
      const { isDemoMode } = await import('./demo-config');
      console.log('🔍 REFRESH TOKEN DEBUG: isDemoMode =', isDemoMode());
      if (isDemoMode()) {
        console.log('🚫 BLOCKING refresh token in demo mode');
        return res.status(401).json({ message: "Token refresh disabled in demo mode" });
      }

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
      }

      // This will be handled by authMiddleware, but we can also provide a direct endpoint
      const { verifyRefreshToken } = await import("./auth");
      const payload = verifyRefreshToken(refreshToken);
      
      if (!payload) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const user = await storage.getUser(payload.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email);
      setAuthCookies(res, accessToken, newRefreshToken);

      res.json({ message: "Token refreshed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Token refresh failed" });
    }
  };

  app.post("/api/auth/refresh", handleRefresh);
  app.get("/api/auth/refresh", handleRefresh);

  app.post("/api/auth/complete-onboarding", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.updateUser(userId, { hasCompletedOnboarding: true });
      res.json(user);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  app.post("/api/auth/complete-profile", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.updateUser(userId, { 
        profileCompleted: true,
        hasCompletedOnboarding: true 
      });
      res.json(user);
    } catch (error) {
      console.error("Failed to complete profile:", error);
      res.status(500).json({ message: "Failed to complete profile" });
    }
  });

  // Save user onboarding data
  app.post("/api/users/:id/onboarding", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { creatorType, interests, goals, bio } = req.body;

      const user = await storage.updateUser(userId, {
        creatorType,
        interests: interests || [],
        goals: goals || [],
        bio,
        hasCompletedOnboarding: true,
        profileCompleted: true
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      res.status(500).json({ error: "Failed to save onboarding data" });
    }
  });

  // OAuth routes - use real OAuth if credentials are available, demo otherwise
  const useDemo = !process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET;
  
  if (useDemo) {
    console.log('Using demo OAuth implementation (Twitter credentials not configured)');
    app.get("/api/auth/twitter/login", authMiddleware, demoTwitterLogin);
    app.get("/api/auth/twitter/callback", demoTwitterCallback);
    app.post("/api/auth/twitter/disconnect", authMiddleware, demoTwitterDisconnect);
  } else {
    console.log('Using real Twitter OAuth implementation');
    app.get("/api/auth/twitter/login", authMiddleware, initiateTwitterLogin);
    app.get("/api/auth/twitter/callback", handleTwitterCallback);
    app.post("/api/auth/twitter/disconnect", authMiddleware, disconnectTwitter);
  }

  // User routes
  app.get("/api/users/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Also fetch social connections
      const socialConnections = await storage.getSocialConnections(id);
      
      res.json({
        ...user,
        socialConnections
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/username/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Social connection routes
  app.get("/api/social-connections/:userId", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await storage.getSocialConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/social-connections", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const connectionData = insertSocialConnectionSchema.parse(req.body);
      const connection = await storage.createSocialConnection(connectionData);
      
      // Award points for connecting social accounts
      if (connection.isConnected && req.userId) {
        const user = await storage.getUser(req.userId);
        if (user) {
          await storage.updateUser(req.userId, {
            xpPoints: (user.xpPoints || 0) + 25, // Award 25 points for social connection
            streak: (user.streak || 0) + 1,
          });
        }
      }
      
      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: "Invalid connection data" });
    }
  });

  app.patch("/api/social-connections/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const connection = await storage.updateSocialConnection(id, req.body);
      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: "Failed to update connection" });
    }
  });

  // Demo OAuth connection endpoint
  app.post("/api/social-connections/demo-connect", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { platform } = req.body;
      const userId = req.userId;

      if (!platform) {
        return res.status(400).json({ error: 'Platform is required' });
      }

      // Demo social connection data
      const demoConnections = {
        twitter: {
          platformId: 'demo_twitter_123',
          platformUsername: 'demo_creator',
          displayName: 'Demo Creator',
          followerCount: 15420,
          profileImageUrl: 'https://via.placeholder.com/150',
        },
        youtube: {
          platformId: 'demo_youtube_456',
          platformUsername: 'democreator',
          displayName: 'Demo Creator',
          followerCount: 8750,
          profileImageUrl: 'https://via.placeholder.com/150',
        },
        instagram: {
          platformId: 'demo_instagram_789',
          platformUsername: 'demo.creator',
          displayName: 'Demo Creator',
          followerCount: 32100,
          profileImageUrl: 'https://via.placeholder.com/150',
        },
      };

      const demoData = demoConnections[platform as keyof typeof demoConnections];
      if (!demoData) {
        return res.status(400).json({ error: 'Unsupported platform' });
      }

      const connection = await storage.createSocialConnection({
        userId,
        platform,
        ...demoData,
        isConnected: true,
      });

      // Award points for connecting social accounts
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUser(userId, {
          xpPoints: (user.xpPoints || 0) + 25, // Award 25 points for social connection
          streak: (user.streak || 0) + 1,
        });
      }

      res.json(connection);
    } catch (error) {
      console.error('Error creating demo social connection:', error);
      res.status(500).json({ error: 'Failed to create demo connection' });
    }
  });

  // Social connection disconnect endpoint
  app.post("/api/social-connections/disconnect", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { platform } = req.body;
      const userId = req.userId;

      if (!platform) {
        return res.status(400).json({ error: 'Platform is required' });
      }

      await storage.disconnectSocialConnection(userId, platform);
      res.json({ success: true });
    } catch (error) {
      console.error('Error disconnecting social connection:', error);
      res.status(500).json({ error: 'Failed to disconnect' });
    }
  });

  // Enhanced Global Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { getCachedLeaderboard, filterUsers, paginateUsers } = await import("./leaderboard-generator");
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const category = req.query.category as string;
      const tier = req.query.tier as string;
      const country = req.query.country as string;
      const search = req.query.search as string;
      const sort = req.query.sort as string || "highest";
      
      // Get cached global leaderboard
      let allUsers = getCachedLeaderboard();
      
      // Apply sorting - reverse for lowest to highest
      if (sort === "lowest") {
        allUsers = [...allUsers].reverse();
        // Update ranks to reflect the new order
        allUsers = allUsers.map((user, index) => ({
          ...user,
          rank: index + 1
        }));
      }
      
      // Apply filters
      const filteredUsers = filterUsers(allUsers, {
        category: category !== "global" ? category : undefined,
        tier,
        country,
        search
      });
      
      // Paginate results
      const paginatedResult = paginateUsers(filteredUsers, page, limit);
      
      res.json(paginatedResult);
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user position in global leaderboard
  app.get("/api/leaderboard/user/:userId", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { getCachedLeaderboard, findUserPosition } = await import("./leaderboard-generator");
      const userId = parseInt(req.params.userId);
      
      // Get user info to find their position
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const allUsers = getCachedLeaderboard();
      
      // For now, simulate user position based on their XP
      const userScore = user.xpPoints || 0;
      const userPosition = allUsers.findIndex(u => u.score <= userScore) + 1;
      
      const userLeaderboardEntry = {
        rank: userPosition || allUsers.length + 1,
        name: user.username,
        username: `@${user.username.toLowerCase()}`,
        score: userScore,
        change: "+1",
        avatar: user.username.slice(0, 2).toUpperCase(),
        tier: userScore >= 2500 ? "Diamond" : userScore >= 1800 ? "Platinum" : userScore >= 1200 ? "Gold" : userScore >= 600 ? "Silver" : "Bronze",
        country: "US",
        category: "global"
      };
      
      res.json({
        user: userLeaderboardEntry,
        totalUsers: allUsers.length
      });
    } catch (error) {
      console.error("User position error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search users in leaderboard
  app.get("/api/leaderboard/search", async (req, res) => {
    try {
      const { getCachedLeaderboard, findUserPosition } = await import("./leaderboard-generator");
      const searchTerm = req.query.q as string;
      
      if (!searchTerm) {
        return res.status(400).json({ message: "Search term required" });
      }
      
      const allUsers = getCachedLeaderboard();
      const foundUser = findUserPosition(allUsers, searchTerm);
      
      if (foundUser) {
        res.json({ user: foundUser, found: true });
      } else {
        res.json({ user: null, found: false });
      }
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user profile
  app.patch("/api/users/:id/profile", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updateData = req.body;
      
      // Validate user owns this profile or is admin
      if (req.session?.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update profile fields
      const updatedUser = {
        ...user,
        bio: updateData.bio || user.bio,
        website: updateData.website || user.website,
        customUsername: updateData.customUsername || user.customUsername || user.username?.toLowerCase().replace(/\s+/g, ''),
        showcaseContent: updateData.showcaseContent || user.showcaseContent || "[]",
        updatedAt: new Date().toISOString()
      };

      await storage.updateUser(userId, updatedUser);
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Award XP to user
  app.post("/api/users/:id/award-xp", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { points, reason } = req.body;
      
      // Validate user owns this profile or is admin
      if (req.session?.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (!points || points <= 0) {
        return res.status(400).json({ error: "Invalid points amount" });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Award XP points to user
      const updatedUser = await storage.updateUser(userId, {
        xpPoints: (user.xpPoints || 0) + points,
      });
      
      console.log(`Awarded ${points} XP to user ${userId} for: ${reason}`);
      
      res.json({
        success: true,
        newXP: updatedUser.xpPoints,
        pointsAwarded: points,
        reason: reason
      });
    } catch (error) {
      console.error("Error awarding XP:", error);
      res.status(500).json({ error: "Failed to award XP" });
    }
  });

  // Get public profile by custom username
  app.get("/api/public-profile/:username", async (req, res) => {
    try {
      const username = req.params.username.toLowerCase();
      
      // Find user by custom username
      const users = await storage.getUsers();
      const user = users.find(u => 
        u.customUsername?.toLowerCase() === username || 
        u.username?.toLowerCase().replace(/\s+/g, '') === username
      );
      
      if (!user) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Get user's social connections
      const connections = await storage.getSocialConnections(user.id);
      const connectedPlatforms = connections.filter(conn => conn.isConnected);

      // Get user's leaderboard position
      const { getCachedLeaderboard } = await import("./leaderboard-generator");
      const allUsers = getCachedLeaderboard();
      
      // Find user's position
      const userScore = user.xpPoints || 0;
      const userPosition = allUsers.findIndex(u => u.score <= userScore) + 1;
      const userTier = userScore >= 2500 ? "Diamond" : userScore >= 1800 ? "Platinum" : userScore >= 1200 ? "Gold" : userScore >= 600 ? "Silver" : "Bronze";

      // Create public profile data (remove sensitive info)
      const publicProfile = {
        name: user.username,
        bio: user.bio,
        website: user.website,
        customUsername: user.customUsername || user.username?.toLowerCase().replace(/\s+/g, ''),
        isVerified: user.isVerified || false,
        veriScore: user.veriScore || 0,
        xpPoints: user.xpPoints || 0,
        rank: userPosition || 999,
        tier: userTier,
        connectedPlatforms: connectedPlatforms.map(conn => ({
          platform: conn.platform,
          followers: conn.followerCount || 0
        })),
        showcaseContent: user.showcaseContent ? JSON.parse(user.showcaseContent) : [],
        joinedAt: user.createdAt
      };
      
      res.json(publicProfile);
    } catch (error) {
      console.error("Error fetching public profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Task routes
  app.get("/api/tasks/:userId", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tasks", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, req.body);
      
      // Award points and update streak when task is completed
      if (req.body.isCompleted && !task.isCompleted && req.userId) {
        const user = await storage.getUser(req.userId);
        if (user) {
          await storage.updateUser(req.userId, {
            xpPoints: (user.xpPoints || 0) + task.points,
            streak: (user.streak || 0) + 1,
          });
        }
      }
      
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  // Task verification endpoint for frontend task completion
  app.post("/api/tasks/verify", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { taskId, verificationUrl, points, streakBonus } = req.body;
      
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Award XP points to user
      const user = await storage.getUser(req.userId);
      if (user) {
        // Special handling for MVP demo task (taskId 0)
        const isSpecialTask = taskId === 0;
        const streakToAdd = isSpecialTask && streakBonus ? streakBonus : 1;
        
        await storage.updateUser(req.userId, {
          xpPoints: (user.xpPoints || 0) + points,
          streak: (user.streak || 0) + streakToAdd,
        });
      }

      // Create a completed task record
      const completedTask = await storage.createTask({
        userId: req.userId,
        title: req.body.title || "Completed Task",
        description: req.body.description || "Task completed via verification",
        points: points,
        category: req.body.category || "general",
        isCompleted: true,
        requiresVerification: true,
        verificationData: JSON.stringify({ 
          url: verificationUrl,
          verifiedAt: new Date().toISOString(),
          taskId: taskId,
          streakBonus: streakBonus || 1
        })
      });

      res.json({ 
        success: true, 
        task: completedTask,
        user: await storage.getUser(req.userId)
      });
    } catch (error) {
      console.error("Task verification error:", error);
      res.status(500).json({ message: "Failed to verify task" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Get participants for this campaign
      const participants = await storage.getCampaignParticipants(id);
      
      res.json({
        ...campaign,
        participants
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const campaignData = insertCampaignSchema.parse({ ...req.body, userId: req.userId });
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Campaign creation error:", error);
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  app.patch("/api/campaigns/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.updateCampaign(id, req.body);
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Failed to update campaign" });
    }
  });

  // Campaign participation routes
  app.post("/api/campaigns/:id/apply", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { applicationData } = req.body;
      
      // Check if user already applied
      const existing = await storage.getUserCampaignParticipation(req.userId!, campaignId);
      if (existing) {
        return res.status(409).json({ message: "Already applied to this campaign" });
      }

      const participant = await storage.createCampaignParticipant({
        campaignId,
        userId: req.userId!,
        applicationData: JSON.stringify(applicationData)
      });

      res.status(201).json(participant);
    } catch (error) {
      console.error("Campaign application error:", error);
      res.status(400).json({ message: "Failed to apply to campaign" });
    }
  });

  app.post("/api/campaigns/:id/submit", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { submissionData, submissionUrl } = req.body;
      
      // Find the user's participation record
      const participation = await storage.getUserCampaignParticipation(req.userId!, campaignId);
      if (!participation) {
        return res.status(404).json({ message: "Not participating in this campaign" });
      }

      // Update participation with submission
      const updatedParticipation = await storage.updateCampaignParticipant(participation.id, {
        submissionData: JSON.stringify(submissionData),
        submissionUrl,
        status: "completed",
        completedAt: new Date()
      });

      res.json(updatedParticipation);
    } catch (error) {
      console.error("Campaign submission error:", error);
      res.status(400).json({ message: "Failed to submit to campaign" });
    }
  });

  app.get("/api/campaigns/:id/participants", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const participants = await storage.getCampaignParticipants(campaignId);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  app.get("/api/users/:userId/campaigns", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const participations = await storage.getUserParticipatedCampaigns(userId);
      res.json(participations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user campaigns" });
    }
  });

  // Wallet routes
  app.post("/api/wallet/create", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { createWalletForUser } = await import("./wallet");
      const result = await createWalletForUser(req.userId!);
      
      if (result.success) {
        res.status(201).json({
          veriAccountId: result.veriAccountId,
          walletAddress: result.walletAddress,
          success: true
        });
      } else {
        res.status(500).json({ message: result.error || "Failed to create wallet" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  app.get("/api/wallet/info", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { getUserWalletInfo } = await import("./wallet");
      const walletInfo = await getUserWalletInfo(req.userId!);
      res.json(walletInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet info" });
    }
  });

  app.get("/api/wallet/balance/:address", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { getWalletBalance } = await import("./wallet");
      const balance = await getWalletBalance(req.params.address);
      res.json(balance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet balance" });
    }
  });

  // Profile routes
  app.get("/api/profiles/:userId", authMiddleware, async (req: AuthenticatedRequest, res) => {
    const userId = parseInt(req.params.userId);
    try {
      const profile = await storage.getProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profiles", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const profileData = insertProfileSchema.parse({ ...req.body, userId: req.userId });
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.patch("/api/profiles/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    const id = parseInt(req.params.id);
    try {
      const profile = await storage.updateProfile(id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // MCP API routes
  app.get("/api/mcp/status", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { mcpServer } = await import("./mcp/mcpServer");
      const status = mcpServer.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get MCP status" });
    }
  });

  app.get("/api/mcp/tools", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { toolRegistry } = await import("./mcp/toolRegistry");
      const tools = await toolRegistry.getAvailableTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Failed to get MCP tools" });
    }
  });

  app.post("/api/mcp/tools/:toolName", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { toolRegistry } = await import("./mcp/toolRegistry");
      const result = await toolRegistry.callTool(req.params.toolName, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to call MCP tool" });
    }
  });

  app.get("/api/mcp/connectors", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { mcpConfigManager } = await import("./mcp/settings/mcpConfig");
      const connectors = mcpConfigManager.generateUIConfig();
      res.json(connectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to get MCP connectors" });
    }
  });

  app.post("/api/mcp/connectors/:connectorId/configure", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { mcpConfigManager } = await import("./mcp/settings/mcpConfig");
      mcpConfigManager.updateConnectorConfig(req.params.connectorId, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to configure MCP connector" });
    }
  });

  app.get("/api/mcp/connectors/:connectorId/status", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { mcpConfigManager } = await import("./mcp/settings/mcpConfig");
      const status = mcpConfigManager.getConnectorStatus(req.params.connectorId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get connector status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

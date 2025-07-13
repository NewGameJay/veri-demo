import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSocialConnectionSchema, insertTaskSchema, insertCampaignSchema, insertProfileSchema } from "@shared/schema";
import "./types";
import healthRoutes from "./routes/health";
import { requestTiming, errorTracking } from "./middleware/monitoring";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply monitoring middleware
  app.use(requestTiming);
  
  // Health check routes
  app.use('/api', healthRoutes);
  
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Set user session
      req.session.userId = user.id;
      
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user session
      req.session.userId = user.id;
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      // Clear session cookie
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.session.userId;
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

  app.post("/api/auth/complete-onboarding", async (req, res) => {
    try {
      const userId = req.session.userId;
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

  app.post("/api/auth/complete-profile", async (req, res) => {
    try {
      const userId = req.session.userId;
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

  // Auth middleware for protected routes
  const requireAuth = async (req: any, res: any, next: any) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    req.userId = userId;
    next();
  };

  // User routes
  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
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

  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Social connection routes
  app.get("/api/social-connections/:userId", requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await storage.getSocialConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/social-connections", requireAuth, async (req, res) => {
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

  app.patch("/api/social-connections/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const connection = await storage.updateSocialConnection(id, req.body);
      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: "Failed to update connection" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const category = req.query.category as string || "global";
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(category, limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Task routes
  app.get("/api/tasks/:userId", requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", requireAuth, async (req, res) => {
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
  app.post("/api/tasks/verify", requireAuth, async (req, res) => {
    try {
      const { taskId, verificationUrl, points } = req.body;
      
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Award XP points to user
      const user = await storage.getUser(req.userId);
      if (user) {
        await storage.updateUser(req.userId, {
          xpPoints: (user.xpPoints || 0) + points,
          streak: (user.streak || 0) + 1,
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
          taskId: taskId
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
  app.get("/api/campaigns", requireAuth, async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", requireAuth, async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse({ ...req.body, userId: req.userId });
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  // Profile routes
  app.get("/api/profiles/:userId", requireAuth, async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
      const profile = await storage.getProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profiles", requireAuth, async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse({ ...req.body, userId: req.userId });
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.patch("/api/profiles/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const profile = await storage.updateProfile(id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

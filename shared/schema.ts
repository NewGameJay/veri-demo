import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  veriScore: integer("veri_score").default(0),
  xpPoints: integer("xp_points").default(0),
  points: integer("points").default(25), // P2P points for using AI agents
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  userType: text("user_type").default("creator"), // creator, studio, community
  profileType: text("profile_type").default("creator"), // creator, studio
  streak: integer("streak").default(0),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  profileCompleted: boolean("profile_completed").default(false),
  customUsername: text("custom_username").unique(), // Custom username for public profile
  website: text("website"), // Personal website URL
  showcaseContent: text("showcase_content"), // JSON string for featured content pieces
  // Onboarding fields
  creatorType: text("creator_type"), // Selected creator type from onboarding
  interests: text("interests").array(), // Array of user interests
  goals: text("goals").array(), // Array of user goals
  // Web3 Wallet Fields
  veriAccountId: text("veri_account_id").unique(), // Unique identifier for Veri account
  walletAddress: text("wallet_address").unique(), // Public wallet address
  encryptedPrivateKey: text("encrypted_private_key"), // Encrypted private key (server-side only)
  walletCreatedAt: timestamp("wallet_created_at"), // When wallet was created
  chainId: integer("chain_id").default(137), // Default to Polygon (137)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(), // twitter, youtube, instagram, etc.
  platformId: text("platform_id"), // User ID on the platform
  platformUsername: text("platform_username").notNull(),
  displayName: text("display_name"), // Display name on platform
  followerCount: integer("follower_count").default(0),
  profileImageUrl: text("profile_image_url"),
  isConnected: boolean("is_connected").default(false),
  accessToken: text("access_token"), // OAuth access token
  refreshToken: text("refresh_token"), // OAuth refresh token
  expiresAt: timestamp("expires_at"), // Token expiration
  connectionData: text("connection_data"), // JSON string for additional platform-specific data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  rank: integer("rank").notNull(),
  score: integer("score").notNull(),
  category: text("category").default("global"), // global, gaming, lifestyle, etc.
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  isCompleted: boolean("is_completed").default(false),
  category: text("category"), // social, content, referral, challenge
  requiresVerification: boolean("requires_verification").default(false),
  verificationData: text("verification_data"), // JSON string for verification details
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Brand/creator who created the campaign
  title: text("title").notNull(),
  description: text("description"),
  budget: integer("budget").notNull(), // Total budget in cents
  rewardPerAction: integer("reward_per_action").notNull(), // Payment per completed action
  status: text("status").default("active"), // active, paused, completed, draft
  campaignType: text("campaign_type").notNull(), // content_creation, engagement, review, social_post
  targetAudience: text("target_audience"),
  requirements: text("requirements"), // JSON string for campaign requirements
  platforms: text("platforms"), // JSON array of required platforms
  tags: text("tags"), // JSON array of campaign tags
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  isPublic: boolean("is_public").default(true),
  verificationRequired: boolean("verification_required").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign participation tracking
export const campaignParticipants = pgTable("campaign_participants", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  userId: integer("user_id").references(() => users.id),
  status: text("status").default("applied"), // applied, accepted, rejected, completed, paid
  applicationData: text("application_data"), // JSON string for application details
  submissionData: text("submission_data"), // JSON string for submission details
  submissionUrl: text("submission_url"), // URL to submitted content
  isVerified: boolean("is_verified").default(false),
  verificationNotes: text("verification_notes"),
  earnedAmount: integer("earned_amount").default(0),
  appliedAt: timestamp("applied_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  paidAt: timestamp("paid_at"),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  displayName: text("display_name").notNull(),
  profileType: text("profile_type").notNull(), // creator, studio
  description: text("description"),
  website: text("website"),
  location: text("location"),
  isPublic: boolean("is_public").default(true),
  customizations: text("customizations"), // JSON string for profile customizations
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Usage table for cost tracking (Sprint 5)
export const apiUsage = pgTable("api_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  service: varchar("service", { length: 50 }).notNull(),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  tokensUsed: integer("tokens_used"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  serviceCreatedAtIdx: index("idx_api_usage_service_date").on(table.service, table.createdAt),
  userIdIdx: index("idx_api_usage_user").on(table.userId),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  userType: true,
  profileType: true,
});

export const insertSocialConnectionSchema = createInsertSchema(socialConnections).pick({
  userId: true,
  platform: true,
  platformUsername: true,
  isConnected: true,
  connectionData: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  userId: true,
  rank: true,
  score: true,
  category: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  points: true,
  category: true,
  requiresVerification: true,
  verificationData: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  userId: true,
  title: true,
  description: true,
  budget: true,
  rewardPerAction: true,
  campaignType: true,
  targetAudience: true,
  requirements: true,
  platforms: true,
  tags: true,
  startDate: true,
  endDate: true,
  maxParticipants: true,
  isPublic: true,
  verificationRequired: true,
});

export const insertCampaignParticipantSchema = createInsertSchema(campaignParticipants).pick({
  campaignId: true,
  userId: true,
  applicationData: true,
  submissionData: true,
  submissionUrl: true,
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  userId: true,
  displayName: true,
  profileType: true,
  description: true,
  website: true,
  location: true,
  isPublic: true,
  customizations: true,
});

export const insertApiUsageSchema = createInsertSchema(apiUsage).pick({
  userId: true,
  service: true,
  endpoint: true,
  tokensUsed: true,
  estimatedCost: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SocialConnection = typeof socialConnections.$inferSelect;
export type InsertSocialConnection = z.infer<typeof insertSocialConnectionSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type CampaignParticipant = typeof campaignParticipants.$inferSelect;
export type InsertCampaignParticipant = z.infer<typeof insertCampaignParticipantSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;

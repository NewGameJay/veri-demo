import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  userType: text("user_type").default("creator"), // creator, studio, community
  profileType: text("profile_type").default("creator"), // creator, studio
  streak: integer("streak").default(0),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(), // twitter, youtube, instagram, etc.
  platformUsername: text("platform_username").notNull(),
  isConnected: boolean("is_connected").default(false),
  connectionData: text("connection_data"), // JSON string for platform-specific data
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
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  budget: integer("budget").notNull(),
  status: text("status").default("active"), // active, paused, completed
  targetAudience: text("target_audience"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  targetAudience: true,
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
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

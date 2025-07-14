import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { VeriScoreCard } from "@/components/dashboard/veri-score-card";
import { TaskVerification } from "@/components/dashboard/task-verification";
import { ProfileBuilder } from "@/components/dashboard/profile-builder";
import { SocialConnections } from "@/components/dashboard/social-connections";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { MemorizzIntegration } from "@/components/integrations/memorizz-integration";
import { AIAgents } from "@/components/dashboard/ai-agents";
import { useAuth } from "@/contexts/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBuilderOnboarding } from "@/components/onboarding/profile-builder-onboarding";
import { Eye, TrendingUp, Users, DollarSign } from "lucide-react";
import { FaTwitter, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Dashboard() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const { user, needsOnboarding, completeOnboarding } = useAuth();

  const { data: connections } = useQuery({
    queryKey: ["/api/social-connections", user?.id],
    enabled: !!user?.id,
  });

  const { data: userTasks } = useQuery({
    queryKey: ["/api/tasks", user?.id],
    enabled: !!user?.id,
  });

  if (!user) {
    return null;
  }

  // Show onboarding for new users
  if (needsOnboarding && !showProfileBuilder) {
    return (
      <ProfileBuilderOnboarding
        onComplete={completeOnboarding}
        onStartProfileBuilder={() => setShowProfileBuilder(true)}
      />
    );
  }

  const userStreak = user.streak || 0;
  const userXP = user.xpPoints || 0;
  const isMemorizzUnlocked = userStreak >= 10;

  // Handle hamburger menu toggle
  const handleDashboardToggle = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  return (
    <div className="min-h-screen bg-gray-800 hero-gradient">
      <Header
        onDashboardToggle={handleDashboardToggle}
        onMobileMenuToggle={handleDashboardToggle}
      />
      <DashboardSidebar
        isOpen={isDashboardOpen}
        isPinned={false}
        isCollapsed={isCollapsed}
        onClose={() => setIsDashboardOpen(false)}
        onPin={() => {}} // Removed pin functionality
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <main className="pt-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Welcome Section with Animation */}
          <div className="mb-8 animate-fade-in pt-[20px] pb-[20px]">
            <h1 className="text-3xl font-termina text-white mb-2 tracking-tight pt-[8px] pb-[8px]">
              🚀 Welcome back, {user.firstName || user.username}!
            </h1>
            <p className="text-white/60 font-inter">
              Here's your creator dashboard with all your progress and opportunities.
            </p>
          </div>

          {/* Prominent Streak Highlight */}
          <div className="mb-8 glass-effect p-6 rounded-xl border border-white/20 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 animate-slide-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                  <span className="text-2xl font-termina text-white">{userStreak}</span>
                </div>
                <div>
                  <h3 className="text-xl font-termina text-white mb-1">
                    {userStreak} Day Streak! 🔥
                  </h3>
                  <p className="text-white/70 font-inter">
                    Complete daily tasks to unlock XP multipliers. Next milestone: {userStreak >= 10 ? '15' : '10'} days
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-termina text-lg">
                  {userStreak >= 10 ? '2.5x' : userStreak >= 7 ? '2x' : userStreak >= 3 ? '1.5x' : '1x'} XP Multiplier
                </div>
                <div className="text-white/60 text-sm font-inter">
                  {userStreak >= 10 ? 'AI Agent Unlocked!' : `${10 - userStreak} days to AI Agent`}
                </div>
              </div>
            </div>
            
            {/* Streak Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Progress to next reward</span>
                <span>{userStreak >= 10 ? '10/10' : `${userStreak}/10`}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((userStreak / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Enhanced Dashboard Tabs with Glass Effect - Sticky Navigation */}
          <Tabs defaultValue="tasks" className="w-full animate-slide-in mb-6">
            <div className="sticky top-20 z-20 sticky-tabs rounded-lg mb-6 p-1">
              <TabsList className="grid w-full grid-cols-4 bg-transparent border-0">
                <TabsTrigger value="tasks" className="text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300">
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-agent" 
                  className="text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300 relative group"
                  disabled={!isMemorizzUnlocked}
                  title={!isMemorizzUnlocked ? "Complete 10 Day Streak to unlock access to our Veri AI Agent suite." : ""}
                >
                  AI Agent {!isMemorizzUnlocked && "🔒"}
                  {!isMemorizzUnlocked && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-white/20">
                      Complete 10 Day Streak to unlock access to our Veri AI Agent suite.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-white/20"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300">
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tasks" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-8 space-y-6">
                  <TaskVerification 
                    userId={user.id} 
                    userStreak={userStreak}
                    userXP={userXP}
                    showFilters={true}
                  />
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Vertical VeriScore Card */}
                  <VeriScoreCard />
                  
                  {/* Social Connections */}
                  <SocialConnections />

                  {/* Leaderboard */}
                  <Leaderboard />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-8 space-y-6">
                  <ProfileBuilder 
                    user={user} 
                    profileType="creator"
                  />
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Vertical VeriScore Card */}
                  <VeriScoreCard />
                  
                  {/* Social Connections */}
                  <SocialConnections />

                  {/* Leaderboard */}
                  <Leaderboard />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-agent" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-8 space-y-6">
                  <AIAgents 
                    userPoints={user.points || 0}
                    userStreak={userStreak}
                    onUseAgent={(agentId, pointsCost) => {
                      // Handle point deduction
                      console.log(`Used agent ${agentId} for ${pointsCost} points`);
                    }}
                  />
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Vertical VeriScore Card */}
                  <VeriScoreCard />
                  
                  {/* Social Connections */}
                  <SocialConnections />

                  {/* Leaderboard */}
                  <Leaderboard />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Enhanced Analytics Dashboard */}
                  <div className="glass-effect p-6 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Analytics Dashboard</h3>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">7D</button>
                        <button className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-400 rounded-lg">30D</button>
                        <button className="px-3 py-1 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">90D</button>
                      </div>
                    </div>
                    
                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-blue-400 text-sm font-medium">Total Views</div>
                        <div className="text-2xl font-termina text-white">124.5K</div>
                        <div className="text-green-400 text-xs flex items-center">
                          ↗ +12.3% vs last month
                        </div>
                      </div>
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-green-400 text-sm font-medium">Engagement Rate</div>
                        <div className="text-2xl font-termina text-white">8.4%</div>
                        <div className="text-green-400 text-xs flex items-center">
                          ↗ +2.1% vs last month
                        </div>
                      </div>
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-purple-400 text-sm font-medium">Total Followers</div>
                        <div className="text-2xl font-termina text-white">12.4K</div>
                        <div className="text-green-400 text-xs flex items-center">
                          ↗ +18.5% vs last month
                        </div>
                      </div>
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-emerald-400 text-sm font-medium">Revenue</div>
                        <div className="text-2xl font-termina text-white">$3,456</div>
                        <div className="text-green-400 text-xs flex items-center">
                          ↗ +24.7% vs last month
                        </div>
                      </div>
                    </div>

                    {/* Platform Performance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4">Platform Performance</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaTwitter className="w-4 h-4 text-blue-400" />
                              <span className="text-white">Twitter</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">45.2K views</div>
                              <div className="text-green-400 text-sm">+15.3%</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaYoutube className="w-4 h-4 text-red-400" />
                              <span className="text-white">YouTube</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">32.1K views</div>
                              <div className="text-green-400 text-sm">+8.7%</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaInstagram className="w-4 h-4 text-pink-400" />
                              <span className="text-white">Instagram</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">28.9K views</div>
                              <div className="text-green-400 text-sm">+22.1%</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaTiktok className="w-4 h-4 text-white" />
                              <span className="text-white">TikTok</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">18.3K views</div>
                              <div className="text-red-400 text-sm">-3.2%</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Brand Partnerships</span>
                            <span className="text-white font-medium">$2,150</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Content Creation</span>
                            <span className="text-white font-medium">$890</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Sponsored Posts</span>
                            <span className="text-white font-medium">$416</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-400 font-medium">Total Revenue</span>
                              <span className="text-emerald-400 font-semibold">$3,456</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Performing Content */}
                    <div className="glass-effect p-4 rounded-lg border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Top Performing Content</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                              <FaTwitter className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white font-medium">Building the Future of Creator Economy</div>
                              <div className="text-white/60 text-sm">12.5K engagement • 2.3K shares • $234 revenue</div>
                            </div>
                          </div>
                          <div className="text-green-400 text-sm font-medium">+24%</div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400">
                              <FaYoutube className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white font-medium">Gaming Setup Tour 2024</div>
                              <div className="text-white/60 text-sm">8.9K engagement • 1.8K likes • $567 revenue</div>
                            </div>
                          </div>
                          <div className="text-green-400 text-sm font-medium">+18%</div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400">
                              <FaInstagram className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white font-medium">Behind the Scenes: Content Creation</div>
                              <div className="text-white/60 text-sm">6.7K engagement • 890 comments • $123 revenue</div>
                            </div>
                          </div>
                          <div className="text-green-400 text-sm font-medium">+31%</div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="glass-effect p-4 rounded-lg border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Performance Insights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <div className="text-emerald-400 text-sm font-medium">Best Posting Time</div>
                          <div className="text-white font-semibold">2:00 PM - 4:00 PM</div>
                        </div>
                        <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="text-blue-400 text-sm font-medium">Top Content Type</div>
                          <div className="text-white font-semibold">Gaming Tutorials</div>
                        </div>
                        <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <div className="text-purple-400 text-sm font-medium">Audience Growth</div>
                          <div className="text-white font-semibold">+127 followers/week</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Vertical VeriScore Card */}
                  <VeriScoreCard />
                  
                  {/* Social Connections */}
                  <SocialConnections />

                  {/* Leaderboard */}
                  <Leaderboard />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* FAQ Section */}
          <div className="mt-12 mb-8 glass-effect p-6 rounded-xl border border-white/20">
            <h3 className="text-xl font-termina text-white mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">How do streaks work?</h4>
                <p className="text-white/70 text-sm">Complete at least one task daily to maintain your streak. Longer streaks unlock higher XP multipliers and exclusive features like AI Agents.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">What are XP multipliers?</h4>
                <p className="text-white/70 text-sm">Streak rewards that multiply your XP earnings: 3+ days = 1.5x, 7+ days = 2x, 10+ days = 2.5x. Higher VeriScore means better opportunities.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">How do I unlock AI Agents?</h4>
                <p className="text-white/70 text-sm">Maintain a 10-day streak to unlock our AI Agent suite. These agents help optimize your content and find better brand partnerships.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">What brands can I work with?</h4>
                <p className="text-white/70 text-sm">We partner with gaming brands like Hyve, Lusterlabs, and the Veri Platform. Complete your profile to access premium campaigns.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
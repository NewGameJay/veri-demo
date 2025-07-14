import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { VeriScoreCard } from "@/components/dashboard/veri-score-card";
import { TaskVerification } from "@/components/dashboard/task-verification";
import { ProfileBuilder } from "@/components/dashboard/profile-builder";
import { SocialConnections } from "@/components/dashboard/social-connections";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { FAQ } from "@/components/dashboard/faq";
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
          {/* Streamlined Welcome Header with Compact Streak */}
          <div className="mb-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6">
              {/* Welcome Text */}
              <div>
                <h1 className="text-3xl font-termina mb-2 tracking-tight">
                  🚀 <span className="bg-gradient-to-r from-foreground via-emerald-300 to-foreground dark:from-white dark:via-emerald-300 dark:to-white bg-clip-text text-transparent animate-gradient-shift font-semibold">Welcome back, {user.firstName || user.username}!</span>
                </h1>
                <p className="text-muted-foreground dark:text-white/60 font-inter leading-relaxed">
                  Here's your creator dashboard with all your progress and opportunities.
                </p>
              </div>

              {/* Compact Streak Display */}
              <div className="flex items-center gap-4">
                <div className="glass-effect px-4 py-3 rounded-xl border border-white/20 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                      <span className="text-lg font-termina text-white">{userStreak}</span>
                    </div>
                    <div>
                      <div className="text-foreground dark:text-white font-termina text-sm">
                        {userStreak} Day Streak 🔥
                      </div>
                      <div className="text-emerald-400 font-inter text-xs">
                        {userStreak >= 10 ? '2.5x' : userStreak >= 7 ? '2x' : userStreak >= 3 ? '1.5x' : '1x'} XP Multiplier
                      </div>
                    </div>
                  </div>
                </div>
                
                
              </div>
            </div>
          </div>

          {/* Enhanced Dashboard Tabs with Glass Effect - Sticky Navigation */}
          <Tabs defaultValue="tasks" className="w-full animate-slide-in mb-6">
            <div className="sticky top-20 z-20 sticky-tabs rounded-lg mb-6 p-1">
              <TabsList className="grid w-full grid-cols-4 bg-transparent border-0">
                <TabsTrigger value="tasks" className="text-foreground dark:text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-foreground dark:text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300">
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-agent" 
                  className="text-foreground dark:text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300 relative group"
                  disabled={!isMemorizzUnlocked}
                  title={!isMemorizzUnlocked ? "Complete 10 Day Task Streak to Unlock your Veri AI Agent" : ""}
                >
                  AI Agent {!isMemorizzUnlocked && "🔒"}
                  {!isMemorizzUnlocked && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 glass-effect bg-black/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 border border-emerald-400/30 shadow-xl shadow-emerald-500/20">
                      <div className="text-emerald-400 font-medium mb-1">🔒 AI Agent Locked</div>
                      <div className="text-white/90">Complete 10 Day Task Streak to Unlock your Veri AI Agent Studio</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black/95 rotate-45 border-r border-b border-emerald-400/30 -mt-1.5"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-foreground dark:text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300">
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

                  {/* FAQ Section - Expandable */}
                  <FAQ />
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

                  {/* FAQ Section - Expandable */}
                  <FAQ />
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

                  {/* FAQ Section - Expandable */}
                  <FAQ />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
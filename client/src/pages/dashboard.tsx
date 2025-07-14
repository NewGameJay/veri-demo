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
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

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
            <h1 className="text-3xl font-termina text-white mb-2 tracking-tight">
              🚀 Welcome back, {user.firstName || user.username}!
            </h1>
            <p className="text-white/60 font-inter">
              Here's your creator dashboard with all your progress and opportunities.
            </p>
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
                  className="text-white data-[state=active]:veri-gradient data-[state=active]:text-white font-inter transition-all duration-300"
                  disabled={!isMemorizzUnlocked}
                >
                  AI Agent {!isMemorizzUnlocked && "🔒"}
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
                  {/* Analytics Dashboard */}
                  <div className="glass-effect p-6 rounded-xl border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-6">Analytics Dashboard</h3>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-blue-400 text-sm font-medium">Total Views</div>
                        <div className="text-2xl font-termina text-white">124.5K</div>
                        <div className="text-green-400 text-xs">+12.3%</div>
                      </div>
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-green-400 text-sm font-medium">Engagement</div>
                        <div className="text-2xl font-termina text-white">8.4%</div>
                        <div className="text-green-400 text-xs">+2.1%</div>
                      </div>
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-purple-400 text-sm font-medium">Followers</div>
                        <div className="text-2xl font-termina text-white">1,234</div>
                        <div className="text-green-400 text-xs">+18.5%</div>
                      </div>
                      <div className="glass-effect p-4 rounded-lg border border-white/10">
                        <div className="text-emerald-400 text-sm font-medium">Revenue</div>
                        <div className="text-2xl font-termina text-white">$3,456</div>
                        <div className="text-green-400 text-xs">+24.7%</div>
                      </div>
                    </div>

                    {/* Top Content */}
                    <div className="glass-effect p-4 rounded-lg border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Top Performing Content</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                              <FaTwitter className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white font-medium">Building the Future of Creator Economy</div>
                              <div className="text-white/60 text-sm">12.5K engagement • $234 revenue</div>
                            </div>
                          </div>
                          <div className="text-green-400 text-sm">+24%</div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400">
                              <FaYoutube className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white font-medium">Gaming Setup Tour 2024</div>
                              <div className="text-white/60 text-sm">8.9K engagement • $567 revenue</div>
                            </div>
                          </div>
                          <div className="text-green-400 text-sm">+18%</div>
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
        </div>
      </main>
    </div>
  );
}
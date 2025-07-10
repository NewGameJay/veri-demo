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
import { useAuth } from "@/contexts/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

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

  const userStreak = user.streak || 0;
  const userXP = user.xpPoints || 0;
  const isMemorizzUnlocked = userStreak >= 10;

  // Enhanced menu behavior with scroll and hover
  useEffect(() => {
    const handleScroll = () => {
      if (!isPinned && isDashboardOpen && !isHovering) {
        setIsDashboardOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isPinned &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isDashboardOpen
      ) {
        setIsDashboardOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDashboardOpen, isPinned, isHovering]);

  // Toggle menu (proper open/close behavior)
  const handleMenuToggle = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  // Handle hover behavior when not pinned
  const handleSidebarHover = () => {
    if (!isPinned) {
      setIsHovering(true);
      setIsDashboardOpen(true);
    }
  };

  const handleSidebarLeave = () => {
    if (!isPinned) {
      setIsHovering(false);
      // Small delay to prevent flickering
      setTimeout(() => {
        if (!isPinned && !isHovering) {
          setIsDashboardOpen(false);
        }
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 hero-gradient">
      <Header
        onDashboardToggle={handleMenuToggle}
        onMobileMenuToggle={handleMenuToggle}
      />
      
      {/* Hover trigger area when sidebar is closed */}
      {!isDashboardOpen && !isPinned && (
        <div
          className="fixed top-0 left-0 w-8 h-full z-20"
          onMouseEnter={handleSidebarHover}
        />
      )}
      
      <div ref={sidebarRef}>
        <DashboardSidebar
          isOpen={isDashboardOpen || isPinned}
          isPinned={isPinned}
          onClose={() => setIsDashboardOpen(false)}
          onPin={() => setIsPinned(!isPinned)}
          onMouseEnter={handleSidebarHover}
          onMouseLeave={handleSidebarLeave}
        />
      </div>

      <main className="pt-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Welcome Section with Animation */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-termina text-white mb-2 tracking-tight">
              Welcome back, {user.firstName || user.username}!
            </h1>
            <p className="text-white/60 font-inter">
              Here's your creator dashboard with all your progress and opportunities.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* VeriScore Card */}
              <VeriScoreCard />

              {/* Enhanced Dashboard Tabs with Glass Effect */}
              <Tabs defaultValue="tasks" className="w-full animate-slide-in">
                <TabsList className="grid w-full grid-cols-4 glass-effect border-white/20 hover-scale">
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

                <TabsContent value="tasks" className="mt-6">
                  <TaskVerification 
                    userId={user.id} 
                    userStreak={userStreak}
                    userXP={userXP}
                  />
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                  <ProfileBuilder 
                    user={user} 
                    profileType="creator"
                  />
                </TabsContent>

                <TabsContent value="ai-agent" className="mt-6">
                  <MemorizzIntegration 
                    userStreak={userStreak}
                    isUnlocked={isMemorizzUnlocked}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <div className="glass-effect p-6 rounded-xl border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Analytics Dashboard</h3>
                    <p className="text-white/60">
                      Detailed analytics and performance metrics coming soon. Track your engagement, 
                      follower growth, and earnings across all connected platforms.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar Content */}
            <div className="lg:col-span-4 space-y-6">
              {/* Social Connections */}
              <SocialConnections />

              {/* Leaderboard */}
              <Leaderboard />

              {/* Quick Stats */}
              <div className="glass-effect p-6 rounded-xl border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Connected Platforms</span>
                    <span className="text-white font-medium">{connections?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Completed Tasks</span>
                    <span className="text-white font-medium">
                      {userTasks?.filter((task: any) => task.isCompleted).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Current Level</span>
                    <span className="text-white font-medium">
                      {Math.floor((userXP || 0) / 100) + 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
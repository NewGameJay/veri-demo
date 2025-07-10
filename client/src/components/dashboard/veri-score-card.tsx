import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskVerification } from "./task-verification";
import { ProfileBuilder } from "./profile-builder";
import { MemorizzIntegration } from "@/components/integrations/memorizz-integration";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Star, TrendingUp, Users, Trophy, Zap, Target, Award, Crown, Brain, User, CheckCircle2 } from "lucide-react";

export function VeriScoreCard() {
  const { user } = useAuth();
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
  });

  const activeUser = user || currentUser;

  // Calculate VeriScore based on user activity
  const calculateVeriScore = () => {
    if (!activeUser) return 0;
    
    const baseScore = Math.min((activeUser.xpPoints || 0) / 10, 100);
    const streakBonus = Math.min((activeUser.streak || 0) * 2, 20);
    const socialBonus = 10; // Base social connection bonus
    
    return Math.min(baseScore + streakBonus + socialBonus, 100);
  };

  const veriScore = calculateVeriScore();
  const nextLevelThreshold = Math.ceil(veriScore / 25) * 25;
  const isAIUnlocked = (activeUser?.streak || 0) >= 10;

  if (!activeUser) {
    return (
      <Card className="glass-effect border-white/20">
        <CardContent className="p-6">
          <div className="text-center text-white/60">
            Please sign in to view your VeriScore and dashboard
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* VeriScore Summary Card */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <CardTitle className="text-white">VeriScore Dashboard</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                Level {Math.floor(veriScore / 25) + 1}
              </Badge>
              {isAIUnlocked && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  <Brain className="mr-1 h-3 w-3" />
                  AI Unlocked
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-white/60">
            Your creator reputation and authenticity score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* VeriScore */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {Math.round(veriScore)}
              </div>
              <div className="text-sm text-white/60">VeriScore</div>
            </div>

            {/* XP Points */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {activeUser.xpPoints || 0}
              </div>
              <div className="text-sm text-white/60">XP Points</div>
            </div>

            {/* Streak */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {activeUser.streak || 0}
              </div>
              <div className="text-sm text-white/60">Day Streak</div>
            </div>
          </div>

          {/* Progress to Next Level */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Progress to Level {Math.floor(veriScore / 25) + 2}</span>
              <span className="text-white font-medium">
                {Math.round(veriScore % 25)}/25
              </span>
            </div>
            <Progress value={(veriScore % 25) * 4} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Card className="glass-effect border-white/20">
        <CardContent className="p-6">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5">
              <TabsTrigger value="tasks">
                <Target className="mr-2 h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="ai-agent">
                <Brain className="mr-2 h-4 w-4" />
                AI Agent
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-6">
              <TaskVerification
                userId={activeUser.id}
                userStreak={activeUser.streak || 0}
                userXP={activeUser.xpPoints || 0}
              />
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6">
              <ProfileBuilder
                user={activeUser}
                profileType={activeUser.userType === "studio" ? "studio" : "creator"}
              />
            </TabsContent>
            
            <TabsContent value="ai-agent" className="mt-6">
              <MemorizzIntegration
                userStreak={activeUser.streak || 0}
                isUnlocked={isAIUnlocked}
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                    Creator Analytics
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Track your performance and growth across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Engagement Metrics */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-white">Engagement Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Total Interactions</span>
                          <span className="text-white font-medium">2,547</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Avg. Engagement Rate</span>
                          <span className="text-white font-medium">4.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Growth Rate</span>
                          <span className="text-white font-medium text-green-400">+12.5%</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Performance */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-white">Content Performance</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Posts This Week</span>
                          <span className="text-white font-medium">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Best Performing</span>
                          <span className="text-white font-medium">Video Content</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Optimal Post Time</span>
                          <span className="text-white font-medium">7PM EST</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Weekly Goal Progress</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Content Creation Goal</span>
                        <span className="text-white font-medium">8/10 posts</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

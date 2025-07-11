import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VeriLogo } from "@/components/ui/veri-logo";
import { TaskVerification } from "./task-verification";
import { ProfileBuilder } from "./profile-builder";
import { MemorizzIntegration } from "@/components/integrations/memorizz-integration";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useCounter } from "@/hooks/use-counter";
import { useState, useEffect, useRef } from "react";
import { Star, TrendingUp, Users, Trophy, Zap, Target, Award, Crown, Brain, User, CheckCircle2 } from "lucide-react";

export function VeriScoreCard() {
  const { user } = useAuth();
  const [previousScore, setPreviousScore] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const scoreRef = useRef<HTMLDivElement>(null);
  
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
  const animatedScore = useCounter({ 
    end: veriScore, 
    start: previousScore,
    duration: 1500,
    onComplete: () => {
      if (veriScore > previousScore) {
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 1000);
      }
    }
  });
  
  useEffect(() => {
    if (veriScore !== previousScore) {
      setPreviousScore(veriScore);
    }
  }, [veriScore, previousScore]);

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
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced VeriScore Card matching brand assets */}
      <Card className="veri-gradient-card border-white/20 hover-scale">
        <CardContent className="p-8">
          {/* Header with Veri Icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 veri-gradient rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
              <VeriLogo size="lg" showText={false} />
            </div>
          </div>

          {/* VeriScore Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-termina text-white mb-2">VeriScore</h3>
            <p className="text-white/60 font-inter">Calculated Weekly Based on</p>
            <p className="text-green-400 font-inter text-sm underline cursor-pointer hover:text-green-300 transition-colors">VeriScore Analytics™</p>
          </div>

          {/* Main Score */}
          <div className="text-center mb-8 relative">
            <div 
              ref={scoreRef}
              className="text-6xl font-termina text-green-400 mb-2 animate-bounce-in hover-scale transition-all duration-300 cursor-pointer relative"
            >
              {Math.round(animatedScore)}
              {showParticles && (
                <div className="particle-burst">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="particle"
                      style={{
                        '--angle': `${i * 30}deg`,
                        animationDelay: `${i * 0.05}s`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* VeriPoints Section */}
          <div className="text-center mb-8">
            <h4 className="text-xl font-termina text-white mb-4">VeriPoints</h4>
            <div className="text-4xl font-termina text-green-400 mb-6">
              {(activeUser.xpPoints || 0).toLocaleString()}XP
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-effect p-4 rounded-xl text-center hover-scale">
              <div className="text-2xl font-bold text-white mb-1">8.7K</div>
              <div className="text-sm text-white/60 font-inter">Total Followers</div>
            </div>
            <div className="glass-effect p-4 rounded-xl text-center hover-scale">
              <div className="text-2xl font-bold text-white mb-1">12.5K</div>
              <div className="text-sm text-white/60 font-inter">Engagement</div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h5 className="text-xl font-termina text-white mb-1">
              {activeUser.firstName && activeUser.lastName 
                ? `${activeUser.firstName} ${activeUser.lastName}`
                : activeUser.username}
            </h5>
            <p className="text-green-400 font-inter">Creator & Influencer</p>
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

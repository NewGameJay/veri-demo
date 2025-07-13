import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TaskSkeleton } from "@/components/ui/veri-skeleton";
import { useQuery } from "@tanstack/react-query";
import { triggerHaptic } from "@/lib/haptic";
import type { Task } from "@shared/schema";
import { motion } from "framer-motion";
import { CheckCircle2 } from 'lucide-react';
import { Clock } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { Youtube } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Music } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Target } from 'lucide-react';
import { Users } from 'lucide-react';
import { Trophy } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { Hash } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface TaskVerificationProps {
  userId: number;
  userStreak: number;
  userXP: number;
}

export function TaskVerification({ userId, userStreak, userXP }: TaskVerificationProps) {
  const [activeTab, setActiveTab] = useState("available");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { toast } = useToast();

  // Fetch completed tasks from backend
  const { data: completedTasksData = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/tasks/${userId}`],
    enabled: !!userId,
  });

  const availableTasks = [
    {
      id: 0,
      title: "MVP Demo Test Task",
      description: "Complete this test task to unlock AI Agent tooling - Perfect for demos and testing!",
      platform: "demo",
      icon: Trophy,
      color: "text-green-400",
      points: 10000,
      difficulty: "Easy",
      estimatedTime: "30 seconds",
      requirements: ["Enter any URL containing 'test', 'demo', or 'veri'", "Perfect for demos!", "Unlocks AI Agent tooling with 30-day streak"],
      category: "mvp_demo",
      brand: "Veri Platform",
      streakBonus: 30
    },
    {
      id: 1,
      title: "Create Gaming Highlights Reel",
      description: "Create a 60-second highlights reel from your best gaming moments and share it across platforms",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 500,
      difficulty: "Medium",
      estimatedTime: "2 hours",
      requirements: ["Record 3-5 epic gaming moments", "Edit into 60-second highlights", "Upload to YouTube/TikTok", "Include #GamingHighlights"],
      category: "gaming_content",
      brand: "Hyve.gg",
      streakBonus: 3
    },
    {
      id: 2,
      title: "Share Gaming Tips & Tricks",
      description: "Share your best gaming tips and strategies with the community across social platforms",
      platform: "twitter",
      icon: Twitter,
      color: "text-blue-400",
      points: 250,
      difficulty: "Easy",
      estimatedTime: "30 minutes",
      requirements: ["Post 3-5 useful gaming tips", "Include relevant hashtags", "Tag @community", "Include screenshots/GIFs"],
      category: "gaming_tips",
      brand: "Lusterlabs.xyz",
      streakBonus: 1
    },
    {
      id: 3,
      title: "Gameplay Livestream",
      description: "Host live gameplay stream on Twitch with interactive audience engagement",
      platform: "twitch",
      icon: RefreshCw,
      color: "text-purple-400",
      points: 400,
      difficulty: "Medium",
      estimatedTime: "3 hours",
      requirements: ["Minimum 2 hour live stream", "Engage with chat actively", "Use branded stream overlay"],
      category: "live_streaming",
      brand: "Lusterlabs.xyz"
    },
    {
      id: 4,
      title: "Short-form Video Teasers",
      description: "Create 2x short-form video teasers for TikTok and YouTube Shorts",
      platform: "tiktok",
      icon: Music,
      color: "text-pink-400",
      points: 300,
      difficulty: "Easy",
      estimatedTime: "1 hour",
      requirements: ["60 seconds maximum each", "Include trending gaming hashtags", "Cross-post to both platforms"],
      category: "short_form_content",
      brand: "Lusterlabs.xyz"
    },
    {
      id: 5,
      title: "Social Media Campaign",
      description: "Create 3x social media posts across Twitter/X, Instagram, and Discord",
      platform: "twitter",
      icon: Twitter,
      color: "text-blue-400",
      points: 250,
      difficulty: "Easy",
      estimatedTime: "45 minutes",
      requirements: ["Announce collaboration", "Include branded hashtags", "Tag official accounts"],
      category: "social_campaign",
      brand: "Hyve.gg"
    },
    {
      id: 6,
      title: "Live Gaming Community Stream",
      description: "Host a live gaming stream with community interaction and Q&A session",
      platform: "twitch",
      icon: Users,
      color: "text-purple-400",
      points: 400,
      difficulty: "Medium",
      estimatedTime: "2-3 hours",
      requirements: ["Minimum 90 minute stream", "Interact with chat consistently", "Play trending games", "Include community challenges"],
      category: "live_streaming",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 7,
      title: "Gaming Tutorial Creation",
      description: "Create detailed tutorial showing advanced gaming techniques and strategies",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 350,
      difficulty: "Hard",
      estimatedTime: "3-4 hours",
      requirements: ["Record step-by-step tutorial", "Include commentary explaining strategy", "Upload to YouTube", "Add timestamps and chapters"],
      category: "educational_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 8,
      title: "Live Event Participation",
      description: "Participate in live gaming event or community stream",
      platform: "community",
      icon: Users,
      color: "text-green-400",
      points: 600,
      difficulty: "Hard",
      estimatedTime: "4 hours",
      requirements: ["Participate in scheduled event", "Engage with community", "Represent brand professionally"],
      category: "live_events",
      brand: "Hyve.gg"
    },
    {
      id: 9,
      title: "Creator Economy Reaction Video",
      description: "Create reaction video responding to popular gaming content and trends",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 300,
      difficulty: "Medium",
      estimatedTime: "1-2 hours",
      requirements: ["React to trending gaming content", "Add insightful commentary", "Include your gameplay clips", "Upload to YouTube/TikTok"],
      category: "reaction_content",
      brand: "Hyve.gg",
      streakBonus: 2
    }
  ];

  // Filter completed tasks from backend data
  const completedTasks = completedTasksData
    .filter(task => task.isCompleted)
    .map(task => {
      // Parse verification data if available
      let verificationData: any = {};
      try {
        if (task.verificationData) {
          verificationData = JSON.parse(task.verificationData);
        }
      } catch (e) {
        console.error("Error parsing verification data:", e);
      }

      // Map platform to icon and color
      const platformConfig: Record<string, { icon: any, color: string }> = {
        demo: { icon: Trophy, color: "text-green-400" },
        twitter: { icon: Twitter, color: "text-blue-400" },
        youtube: { icon: Youtube, color: "text-red-400" },
        instagram: { icon: Instagram, color: "text-pink-400" },
        tiktok: { icon: Music, color: "text-purple-400" },
        linkedin: { icon: Linkedin, color: "text-blue-600" },
        community: { icon: Users, color: "text-green-400" }
      };

      const platform = task.category?.toLowerCase() || 'general';
      const config = platformConfig[platform] || { icon: Target, color: "text-gray-400" };

      return {
        id: task.id,
        title: task.title,
        platform: platform,
        icon: config.icon,
        color: config.color,
        points: task.points,
        completedAt: task.updatedAt,
        verificationUrl: verificationData.url || "",
        status: "verified"
      };
    })
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const handleStartTask = (task: any) => {
    triggerHaptic("light");
    setSelectedTask(task);
    toast({
      title: "Task started!",
      description: `You've started "${task.title}". Complete it and submit for verification.`,
    });
  };

  const handleVerifyTask = async () => {
    if (!verificationUrl.trim()) {
      triggerHaptic("error");
      toast({
        title: "URL required",
        description: "Please provide a URL to verify your task completion",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate task verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if this is the MVP Demo Test Task
      let isValid = false;
      if (selectedTask?.id === 0) {
        // MVP Demo Test Task - always verify successfully if URL contains "test", "demo", or "veri"
        isValid = verificationUrl.toLowerCase().includes('test') || 
                  verificationUrl.toLowerCase().includes('demo') || 
                  verificationUrl.toLowerCase().includes('veri') ||
                  verificationUrl === 'demo.veri.app';
      } else {
        // Regular tasks - mock verification with 80% success rate
        isValid = Math.random() > 0.2;
      }
      
      if (isValid) {
        // Call backend to verify task and award XP
        try {
          const response = await apiRequest(
            "POST",
            "/api/tasks/verify",
            {
              taskId: selectedTask.id,
              verificationUrl: verificationUrl,
              points: selectedTask.points,
              title: selectedTask.title,
              description: selectedTask.description,
              category: selectedTask.category,
              streakBonus: selectedTask.streakBonus || 1
            }
          );
          
          const result = await response.json();
          if (result.success) {
            triggerHaptic("success");
            const isSpecialTask = selectedTask.id === 0;
            const message = isSpecialTask 
              ? `Amazing! You've earned ${selectedTask.points} XP points and ${selectedTask.streakBonus || 1} day streak! AI Agent tooling is now unlocked.`
              : `Great work! You've earned ${selectedTask.points} XP points.`;
            
            toast({
              title: "Task verified!",
              description: message,
            });
            
            setSelectedTask(null);
            setVerificationUrl("");
            setActiveTab("completed");
            
            // Invalidate and refetch user data to trigger VeriScore animation
            await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
            await queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
            // Force immediate refresh to trigger animation
            await queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
          } else {
            throw new Error("Backend verification failed");
          }
        } catch (backendError) {
          console.error("Backend verification error:", backendError);
          triggerHaptic("error");
          toast({
            title: "Verification error",
            description: "Task verified but failed to update backend. Please refresh the page.",
            variant: "destructive",
          });
        }
      } else {
        triggerHaptic("error");
        toast({
          title: "Verification failed",
          description: selectedTask?.id === 0 ? 
            "URL must contain 'test', 'demo', or 'veri' for the MVP Test Task" : 
            "We couldn't verify your task. Please check the URL and requirements.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400";
      case "Medium": return "bg-yellow-500/20 text-yellow-400";
      case "Hard": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <Card className="glass-medium border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-400" />
            <CardTitle className="text-white">Task Verification</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              {userXP} XP
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
              {userStreak} Day Streak
            </Badge>
          </div>
        </div>
        <CardDescription className="text-white/60">
          Complete tasks to earn XP points and build your creator streak
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="available">Available ({availableTasks.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({selectedTask ? 1 : 0})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            <div className="space-y-4">
              {availableTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="group glass-subtle p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer animate-fade-in hover:bg-white/[0.08]"
                  style={{
                    animationDelay: `${task.id * 100}ms`
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center group-hover:bg-white/5 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                        <task.icon className={`h-5 w-5 ${task.color} group-hover:scale-105 transition-transform duration-300`} />
                      </div>
                      <div className="group-hover:translate-x-1 transition-transform duration-300">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-300">{task.title}</h3>
                          {task.brand && (
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                              {task.brand}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 group-hover:scale-105 transition-transform duration-300">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300 transition-all duration-300">
                        {task.points} XP
                      </Badge>
                      <Badge variant="secondary" className={`${getDifficultyColor(task.difficulty)} group-hover:scale-105 transition-all duration-300`}>
                        {task.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform duration-300">
                    <div className="flex items-center space-x-4 text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                      <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                        <Clock className="h-4 w-4 group-hover:text-green-300 transition-colors duration-300" />
                        <span>{task.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                        <Hash className="h-4 w-4 group-hover:text-purple-300 transition-colors duration-300" />
                        <span>{task.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleStartTask(task)}
                      size="sm"
                      className="veri-gradient group-hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
                      disabled={selectedTask?.id === task.id}
                    >
                      {selectedTask?.id === task.id ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Started
                        </>
                      ) : (
                        <>
                          Start Task
                          <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Requirements with enhanced hover animations */}
                  <div className="mt-3 pt-3 border-t border-white/15 group-hover:border-white/25 transition-colors duration-300">
                    <h4 className="text-sm font-medium text-white mb-2 group-hover:text-green-300 transition-colors duration-300">Requirements:</h4>
                    <ul className="space-y-1">
                      {task.requirements.map((req, index) => (
                        <li 
                          key={index} 
                          className="text-sm text-white/70 flex items-center space-x-2 group-hover:text-white/90 transition-all duration-300 group-hover:translate-x-1"
                          style={{
                            animationDelay: `${(task.id * 100) + (index * 50)}ms`
                          }}
                        >
                          <div className="w-1 h-1 rounded-full bg-white/50 group-hover:bg-green-300 group-hover:scale-150 transition-all duration-300"></div>
                          <span className="group-hover:font-medium transition-all duration-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {selectedTask ? (
              <div className="space-y-4">
                <div className="glass-subtle p-4 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center animate-pulse">
                        <selectedTask.icon className={`h-5 w-5 ${selectedTask.color} animate-pulse`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{selectedTask.title}</h3>
                          {selectedTask.brand && (
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                              {selectedTask.brand}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60">{selectedTask.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                      In Progress
                    </Badge>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                    <ul className="space-y-1 mb-4">
                      {selectedTask.requirements.map((req: string, index: number) => (
                        <li key={index} className="text-sm text-white/60 flex items-center space-x-2">
                          <div className="w-1 h-1 rounded-full bg-white/40"></div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="glass-subtle p-4 rounded-lg border border-white/10">
                  <h4 className="font-medium text-white mb-3">Submit for Verification</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white text-sm">Verification URL</Label>
                      <Input
                        placeholder="Paste the URL of your completed task (e.g., Tweet URL, Instagram post URL)"
                        value={verificationUrl}
                        onChange={(e) => setVerificationUrl(e.target.value)}
                        className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleVerifyTask}
                        disabled={isVerifying}
                        className="flex-1 veri-gradient"
                      >
                        {isVerifying ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Verify Task
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => setSelectedTask(null)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Active Tasks</h3>
                <p className="text-white/60 mb-4">
                  Start a task from the available list to begin earning XP
                </p>
                <Button
                  onClick={() => setActiveTab("available")}
                  className="veri-gradient"
                >
                  Browse Available Tasks
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Completed Tasks</h3>
                <p className="text-white/60">
                  Complete your first task to start building your portfolio
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="group glass-subtle p-4 rounded-lg border border-green-500/20 hover:border-green-400/40 transition-all duration-300 animate-fade-in relative hover:bg-white/[0.08]"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative">
                          <CheckCircle2 className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="group-hover:translate-x-1 transition-transform duration-300">
                          <h3 className="font-medium text-white group-hover:text-green-300 transition-colors duration-300">{task.title}</h3>
                          <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                            Completed {new Date(task.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 group-hover:scale-105 transition-transform duration-300">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 group-hover:bg-green-500/30 group-hover:text-green-300 transition-all duration-300">
                          <CheckCircle2 className="mr-1 h-3 w-3 group-hover:rotate-12 transition-transform duration-300" />
                          Verified
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300 transition-all duration-300 animate-bounce-in">
                          +{task.points} XP
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform duration-300">
                      <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                        Status: <span className="text-green-300 group-hover:font-medium transition-all duration-300">{task.status}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-green-500/10 hover:border-green-400/40 hover:text-green-400 group-hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
                        onClick={() => window.open(task.verificationUrl, '_blank')}
                      >
                        View Submission
                        <ExternalLink className="ml-1 h-3 w-3 group-hover:rotate-12 transition-transform duration-300" />
                      </Button>
                    </div>
                    
                    {/* Success indicator */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
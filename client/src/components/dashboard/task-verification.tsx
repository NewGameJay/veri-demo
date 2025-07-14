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
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TaskVerificationProps {
  userId: number;
  userStreak: number;
  userXP: number;
  showFilters?: boolean;
}

export function TaskVerification({ userId, userStreak, userXP, showFilters = false }: TaskVerificationProps) {
  const [activeTab, setActiveTab] = useState("available");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [brandFilter, setBrandFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showAllTasks, setShowAllTasks] = useState(false);
  const { toast } = useToast();

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getTaskGradient = (platform: string, category: string) => {
    if (platform === 'demo' || category === 'mvp_demo') {
      return 'bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-teal-500/30';
    }
    if (platform === 'youtube' || platform === 'twitch' || category.includes('gaming')) {
      return 'bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-indigo-500/30';
    }
    if (platform === 'twitter' || platform === 'instagram' || platform === 'tiktok') {
      return 'bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-blue-500/30';
    }
    return 'bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20';
  };

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

  // Filter available tasks based on filters
  const availableTasksFiltered = availableTasks.filter(task => {
    const completedTaskIds = new Set(completedTasksData?.map(task => task.id) || []);
    if (completedTaskIds.has(task.id)) return false;
    
    // Brand filter
    if (brandFilter !== "all") {
      if (!task.brand || task.brand.toLowerCase() !== brandFilter.toLowerCase()) {
        return false;
      }
    }
    
    // Difficulty filter
    if (difficultyFilter !== "all") {
      if (task.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
        return false;
      }
    }
    
    return true;
  });

  // Limit to 6 tasks unless showAllTasks is true
  const displayedTasks = showAllTasks ? availableTasksFiltered : availableTasksFiltered.slice(0, 6);
  const hasMoreTasks = availableTasksFiltered.length > 6;

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
            <TabsTrigger value="available">Available ({availableTasksFiltered.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({selectedTask ? 1 : 0})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>
          
          {/* Combined Filters - Show only when showFilters is true and on available tab */}
          {showFilters && activeTab === "available" && (
            <div className="mt-4 mb-4 p-4 glass-subtle rounded-lg border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Filter Label and Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-white/80 mr-2">Filter By:</span>
                  
                  {/* Brand Tags */}
                  <button
                    onClick={() => setBrandFilter("all")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      brandFilter === "all" 
                        ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50" 
                        : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    All Brands
                  </button>
                  <button
                    onClick={() => setBrandFilter("Veri Platform")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      brandFilter === "Veri Platform" 
                        ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" 
                        : "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 hover:text-purple-300"
                    }`}
                  >
                    Veri
                  </button>
                  <button
                    onClick={() => setBrandFilter("Hyve.gg")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      brandFilter === "Hyve.gg" 
                        ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" 
                        : "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 hover:text-purple-300"
                    }`}
                  >
                    Hyve
                  </button>
                  <button
                    onClick={() => setBrandFilter("Lusterlabs.xyz")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      brandFilter === "Lusterlabs.xyz" 
                        ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" 
                        : "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 hover:text-purple-300"
                    }`}
                  >
                    Lusterlabs
                  </button>
                  
                  {/* Separator */}
                  <div className="w-px h-4 bg-white/20 mx-1"></div>
                  
                  {/* Difficulty Tags */}
                  <button
                    onClick={() => setDifficultyFilter("all")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      difficultyFilter === "all" 
                        ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50" 
                        : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    All Levels
                  </button>
                  <button
                    onClick={() => setDifficultyFilter("easy")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      difficultyFilter === "easy" 
                        ? "bg-green-500/30 text-green-300 border border-green-500/50" 
                        : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 hover:text-green-300"
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => setDifficultyFilter("medium")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      difficultyFilter === "medium" 
                        ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" 
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 hover:text-yellow-300"
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setDifficultyFilter("hard")}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      difficultyFilter === "hard" 
                        ? "bg-red-500/30 text-red-300 border border-red-500/50" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:text-red-300"
                    }`}
                  >
                    Hard
                  </button>
                </div>

                {/* Clear Filters */}
                <div className="flex items-center gap-4">
                  {(brandFilter !== "all" || difficultyFilter !== "all") && (
                    <button
                      onClick={() => {
                        setBrandFilter("all");
                        setDifficultyFilter("all");
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedTasks.map((task) => {
                const isExpanded = expandedTasks.has(task.id);
                return (
                  <div 
                    key={task.id} 
                    className="group glass-subtle p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in relative"
                    style={{
                      animationDelay: `${task.id * 100}ms`
                    }}
                  >
                    {/* Task Image Header */}
                    <div className="relative mb-3 overflow-hidden rounded-lg">
                      <div className={`h-32 relative ${getTaskGradient(task.platform, task.category)}`}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <task.icon className={`h-8 w-8 ${task.color} mb-2 mx-auto`} />
                            <div className="text-white/90 font-semibold text-sm">{task.platform.toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-black/50 text-white text-xs">
                            {task.points} XP
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      {/* Title */}
                      <div className="mb-2">
                        <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-300">{task.title}</h3>
                      </div>
                      
                      {/* Badges below title */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={`${getDifficultyColor(task.difficulty)} transition-all duration-300`}>
                            {task.difficulty}
                          </Badge>
                          {task.brand && (
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                              {task.brand.replace('.gg', '').replace('.xyz', '')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 transition-transform duration-300">
                      <div className="flex items-center space-x-4 text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                        <div className="flex items-center space-x-1 transition-transform duration-300">
                          <Clock className="h-4 w-4 transition-colors duration-300" />
                          <span>{task.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 transition-transform duration-300">
                          <Hash className="h-4 w-4 transition-colors duration-300" />
                          <span>{task.category.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => toggleTaskExpansion(task.id)}
                        size="sm"
                        variant="ghost"
                        className="text-white/60 hover:text-white hover:bg-white/10 p-1 h-6 w-6"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Expandable Requirements Section */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3 pt-3 border-t border-white/15 group-hover:border-white/25 transition-colors duration-300"
                      >
                        <h4 className="text-sm font-medium text-white mb-2 group-hover:text-green-300 transition-colors duration-300">Full Requirements:</h4>
                        <ul className="space-y-2">
                          {task.requirements.map((req, index) => (
                            <li 
                              key={index} 
                              className="text-sm text-white/70 flex items-start space-x-2 group-hover:text-white/90 transition-all duration-300 group-hover:translate-x-1"
                              style={{
                                animationDelay: `${(task.id * 100) + (index * 50)}ms`
                              }}
                            >
                              <div className="w-1 h-1 rounded-full bg-white/50 group-hover:bg-green-300 group-hover:scale-150 transition-all duration-300 mt-2"></div>
                              <span className="group-hover:font-medium transition-all duration-300 flex-1">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={() => handleStartTask(task)}
                        size="sm"
                        className="veri-gradient transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 w-full"
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
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* View More Tasks Button */}
            {hasMoreTasks && !showAllTasks && (
              <div className="flex justify-center mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={() => {
                      setShowAllTasks(true);
                      triggerHaptic("light");
                    }}
                    variant="outline"
                    className="glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover-lift group"
                  >
                    View More Tasks ({availableTasksFiltered.length - 6} remaining)
                    <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </div>
            )}
            
            {/* Show Less Tasks Button */}
            {showAllTasks && hasMoreTasks && (
              <div className="flex justify-center mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={() => {
                      setShowAllTasks(false);
                      triggerHaptic("light");
                      // Smooth scroll to top of tasks
                      document.querySelector('[value="available"]')?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }}
                    variant="outline"
                    className="glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover-lift group"
                  >
                    Show Less Tasks
                    <ChevronUp className="ml-2 h-4 w-4 group-hover:-translate-y-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {selectedTask ? (
              <div className="space-y-4">
                <div className="glass-subtle p-4 rounded-lg border border-white/10">
                  <div className="mb-3">
                    {/* Title at the top */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center animate-pulse">
                        <selectedTask.icon className={`h-5 w-5 ${selectedTask.color} animate-pulse`} />
                      </div>
                      <h3 className="font-semibold text-white flex-1">{selectedTask.title}</h3>
                    </div>
                    
                    {/* Badges below title */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                          In Progress
                        </Badge>
                        {selectedTask.brand && (
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                            {selectedTask.brand}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-white/60">{selectedTask.description}</p>
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
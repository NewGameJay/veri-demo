import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TaskSkeleton } from "@/components/ui/veri-skeleton";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Twitter,
  Youtube,
  Instagram,
  Music,
  Linkedin,
  Target,
  Users,
  Trophy,
  RefreshCw,
  Hash
} from "lucide-react";

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

  const availableTasks = [
    {
      id: 1,
      title: "Share on Twitter",
      description: "Share your latest content on Twitter with #VeriCreator hashtag",
      platform: "twitter",
      icon: Twitter,
      color: "text-blue-400",
      points: 50,
      difficulty: "Easy",
      estimatedTime: "2 minutes",
      requirements: ["Include #VeriCreator hashtag", "Tag @VeriPlatform", "Add relevant content"],
      category: "social_engagement"
    },
    {
      id: 2,
      title: "Create YouTube Short",
      description: "Create a 60-second YouTube Short about your creator journey",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 150,
      difficulty: "Medium",
      estimatedTime: "15 minutes",
      requirements: ["60 seconds or less", "Mention Veri platform", "Include creator tips"],
      category: "content_creation"
    },
    {
      id: 3,
      title: "Instagram Story Series",
      description: "Create a 3-part Instagram Story series about your content strategy",
      platform: "instagram",
      icon: Instagram,
      color: "text-pink-400",
      points: 100,
      difficulty: "Medium",
      estimatedTime: "10 minutes",
      requirements: ["3 connected stories", "Include polls/questions", "Tag @VeriPlatform"],
      category: "content_creation"
    },
    {
      id: 4,
      title: "Community Engagement",
      description: "Engage with 5 posts from other Veri creators",
      platform: "community",
      icon: Users,
      color: "text-green-400",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "5 minutes",
      requirements: ["Meaningful comments", "Support other creators", "Share valuable insights"],
      category: "community_engagement"
    },
    {
      id: 5,
      title: "TikTok Creative Challenge",
      description: "Create a TikTok video showcasing your creative process",
      platform: "tiktok",
      icon: Music,
      color: "text-purple-400",
      points: 200,
      difficulty: "Hard",
      estimatedTime: "30 minutes",
      requirements: ["Show creative process", "Use trending sounds", "Include #VeriCreator"],
      category: "content_creation"
    },
    {
      id: 6,
      title: "LinkedIn Professional Post",
      description: "Write a professional post about creator economy insights",
      platform: "linkedin",
      icon: Linkedin,
      color: "text-blue-600",
      points: 75,
      difficulty: "Medium",
      estimatedTime: "8 minutes",
      requirements: ["Professional tone", "Industry insights", "Mention Veri platform"],
      category: "professional_content"
    }
  ];

  const completedTasks = [
    {
      id: 7,
      title: "Twitter Engagement Post",
      platform: "twitter",
      icon: Twitter,
      color: "text-blue-400",
      points: 50,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      verificationUrl: "https://twitter.com/user/status/123456789",
      status: "verified"
    },
    {
      id: 8,
      title: "Instagram Story",
      platform: "instagram",
      icon: Instagram,
      color: "text-pink-400",
      points: 75,
      completedAt: new Date(Date.now() - 172800000).toISOString(),
      verificationUrl: "https://instagram.com/stories/highlights/123456789",
      status: "verified"
    }
  ];

  const handleStartTask = (task: any) => {
    setSelectedTask(task);
    toast({
      title: "Task started!",
      description: `You've started "${task.title}". Complete it and submit for verification.`,
    });
  };

  const handleVerifyTask = async () => {
    if (!verificationUrl.trim()) {
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock verification success
      const isValid = Math.random() > 0.2; // 80% success rate
      
      if (isValid) {
        toast({
          title: "Task verified!",
          description: `Great work! You've earned ${selectedTask.points} XP points.`,
        });
        
        // Add to completed tasks
        completedTasks.unshift({
          id: Date.now(),
          title: selectedTask.title,
          platform: selectedTask.platform,
          icon: selectedTask.icon,
          color: selectedTask.color,
          points: selectedTask.points,
          completedAt: new Date().toISOString(),
          verificationUrl: verificationUrl,
          status: "verified"
        });
        
        setSelectedTask(null);
        setVerificationUrl("");
        setActiveTab("completed");
      } else {
        toast({
          title: "Verification failed",
          description: "We couldn't verify your task. Please check the URL and requirements.",
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
                        <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-300">{task.title}</h3>
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
                      <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                        <selectedTask.icon className={`h-5 w-5 ${selectedTask.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{selectedTask.title}</h3>
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
                          <task.icon className={`h-4 w-4 ${task.color} group-hover:scale-110 transition-transform duration-300`} />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
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
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
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
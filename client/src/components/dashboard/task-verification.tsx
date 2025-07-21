import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TaskSkeleton } from "@/components/ui/veri-skeleton";
import { useQuery } from "@tanstack/react-query";
import { triggerHaptic } from "@/lib/haptic";
import { SocialShare } from "@/components/social/social-share";
import { useAuth } from "@/contexts/auth-context";
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
import { Share2 } from 'lucide-react';
import { Twitch } from 'lucide-react';
import { Filter } from 'lucide-react';
import { Expand, Minimize2 } from 'lucide-react';
import { Eye } from 'lucide-react';
import { EmojiReaction, useEmojiReaction, getContextualEmojiConfig } from "@/components/ui/emoji-reaction";

// Floating Points Animation Component
function FloatingPointsAnimation({ points, onComplete }: { points: number; onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl"
        initial={{ scale: 0, y: 20 }}
        animate={{ 
          scale: [0, 1.2, 1], 
          y: [20, 0, -50], 
          opacity: [0, 1, 0] 
        }}
        transition={{ 
          duration: 2,
          times: [0, 0.3, 1],
          ease: "easeOut"
        }}
      >
        +{points} XP
      </motion.div>
    </motion.div>
  );
}

interface TaskVerificationProps {
  userId: number;
  userStreak: number;
  userXP: number;
  showFilters?: boolean;
  onGridExpansionChange?: (isExpanded: boolean) => void;
}

export function TaskVerification({ userId, userStreak, userXP, showFilters = false, onGridExpansionChange }: TaskVerificationProps) {
  const [activeTab, setActiveTab] = useState("available");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const [brandFilter, setBrandFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [tasksPerPage, setTasksPerPage] = useState(16);
  const INITIAL_TASKS_PER_PAGE = 16;
  const LOAD_MORE_INCREMENT = 6;
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTaskData, setShareTaskData] = useState<any>(null);
  const [showFloatingPoints, setShowFloatingPoints] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState(0);
  const [lastAnimatedTaskId, setLastAnimatedTaskId] = useState<number | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [isGridExpanded, setIsGridExpanded] = useState(false);
  const [showTaskPreview, setShowTaskPreview] = useState(false);
  const [previewTask, setPreviewTask] = useState<any>(null);
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const { reactions, triggerReaction } = useEmojiReaction();



  const getPartnerGradient = (brand: string, taskId: number) => {
    // Create unique gradients for different partners and tasks
    switch (brand) {
      case 'Hyve.gg':
        // Dynamic gradients inspired by the examples - orange to pink to black
        const hyveGradients = [
          'bg-gradient-to-br from-orange-400 via-pink-500 to-black',
          'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600',
          'bg-gradient-to-br from-orange-500 via-red-500 to-purple-900',
          'bg-gradient-to-br from-amber-400 via-pink-500 to-violet-900'
        ];
        return hyveGradients[taskId % hyveGradients.length];
      
      case 'Lusterlabs.xyz':
        // Blue to teal gradients
        const lusterGradients = [
          'bg-gradient-to-br from-blue-400 via-teal-500 to-green-600',
          'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600',
          'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-700',
          'bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-700'
        ];
        return lusterGradients[taskId % lusterGradients.length];
      
      case 'Veri Platform':
        // Veri signature gradients
        const veriGradients = [
          'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600',
          'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-700',
          'bg-gradient-to-br from-lime-400 via-green-500 to-emerald-700'
        ];
        return veriGradients[taskId % veriGradients.length];
      
      default:
        // Default dynamic gradients
        const defaultGradients = [
          'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
          'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600',
          'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600',
          'bg-gradient-to-br from-fuchsia-400 via-pink-500 to-rose-600'
        ];
        return defaultGradients[taskId % defaultGradients.length];
    }
  };

  // Fetch completed tasks from backend
  const { data: completedTasksData = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/tasks/${userId}`],
    enabled: !!userId,
  });

  // Comprehensive gaming task data (80 total tasks)
  const microTasks = [
    {
      id: 0,
      title: "MVP Demo Test Task",
      description: "Complete this test task to unlock features",
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
      title: "Retweet Gaming Content",
      description: "Share this gaming announcement with your audience",
      platform: "twitter",
      icon: Twitter,
      color: "text-blue-400",
      points: 10,
      difficulty: "Easy",
      estimatedTime: "1 minute",
      requirements: ["Retweet the pinned post", "Add relevant comment"],
      category: "social_engagement",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 2,
      title: "Share Blog Post to IG Stories",
      description: "Reformat this blog post for Instagram Stories",
      platform: "instagram",
      icon: Instagram,
      color: "text-pink-400",
      points: 15,
      difficulty: "Easy",
      estimatedTime: "3-5 minutes",
      requirements: ["Create story slide", "Tag brand account", "Include swipe-up link"],
      category: "content_sharing",
      brand: "Luster Labs",
      streakBonus: 1
    },
    {
      id: 3,
      title: "Like & Comment on Post",
      description: "Engage with this brand post authentically",
      platform: "twitter",
      icon: Twitter,
      color: "text-blue-400",
      points: 5,
      difficulty: "Easy",
      estimatedTime: "30 seconds",
      requirements: ["Like the post", "Leave thoughtful comment"],
      category: "social_engagement",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 4,
      title: "Quick Gaming Tip Tweet",
      description: "Share one quick gaming tip in a tweet",
      platform: "twitter",
      icon: Twitter,
      color: "text-blue-400",
      points: 20,
      difficulty: "Easy",
      estimatedTime: "2-3 minutes",
      requirements: ["Include #VeriTips hashtag", "Tag @VeriClub", "Share personal gaming advice"],
      category: "gaming_tips",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 5,
      title: "Cross-Platform Content Share",
      description: "Share your latest stream highlight to TikTok",
      platform: "tiktok",
      icon: Music,
      color: "text-pink-400",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "5 minutes",
      requirements: ["Upload 30-60 second clip", "Use trending audio", "Include brand hashtag"],
      category: "content_sharing",
      brand: "Luster Labs",
      streakBonus: 1
    },
    // Continue with more gaming tasks
    {
      id: 6,
      title: "Gaming Setup Tour",
      description: "Show off your gaming setup and streaming gear",
      platform: "instagram",
      icon: Instagram,
      color: "text-pink-400",
      points: 30,
      difficulty: "Easy",
      estimatedTime: "10-15 minutes",
      requirements: ["Film setup walkthrough", "Show key gaming gear", "Share setup tips", "Use branded hashtags"],
      category: "lifestyle_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 7,
      title: "Gaming News Reaction",
      description: "React to latest gaming industry news",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "15-20 minutes",
      requirements: ["Pick trending gaming news", "Record reaction video", "Share personal insights", "Encourage discussion"],
      category: "reaction_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 101,
      title: "Gaming Highlights Reel Creation",
      description: "Create a comprehensive gaming highlights reel showcasing your best moments",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 500,
      difficulty: "Hard",
      estimatedTime: "4-6 hours",
      requirements: ["Record 10+ highlight clips", "Professional editing", "Custom thumbnail", "Upload to YouTube"],
      category: "video_content",
      brand: "Hyve.gg",
      streakBonus: 3,
      isLocked: true
    },
    {
      id: 102,
      title: "Multi-Platform Content Campaign",
      description: "Create a coordinated content campaign across multiple platforms",
      platform: "multi",
      icon: Users,
      color: "text-purple-400",
      points: 750,
      difficulty: "Hard",
      estimatedTime: "8-10 hours",
      requirements: ["Content for 3+ platforms", "Consistent branding", "Scheduled posting", "Community engagement"],
      category: "brand_partnership",
      brand: "Luster Labs",
      streakBonus: 5,
      isLocked: true
    },
    {
      id: 103,
      title: "Full Video Tutorial Series",
      description: "Create a comprehensive tutorial series for gaming strategies",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 1000,
      difficulty: "Expert",
      estimatedTime: "12-15 hours",
      requirements: ["5+ episode series", "Professional production", "Detailed script", "Community follow-up"],
      category: "educational_content",
      brand: "Hyve.gg",
      streakBonus: 7,
      isLocked: true
    },
    {
      id: 104,
      title: "Brand Partnership Execution",
      description: "Execute a full brand partnership with deliverables and reporting",
      platform: "multi",
      icon: Trophy,
      color: "text-yellow-400",
      points: 1500,
      difficulty: "Expert",
      estimatedTime: "20+ hours",
      requirements: ["Contract negotiations", "Content creation", "Performance reporting", "Relationship management"],
      category: "brand_partnership",
      brand: "Luster Labs",
      streakBonus: 10,
      isLocked: true
    },
    // Additional Gaming Tasks (10-50)
    {
      id: 10,
      title: "Create Valorant Gameplay Highlights",
      description: "Share your best Valorant plays with the gaming community",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "15-20 minutes",
      requirements: ["Record 2-3 gameplay clips", "Edit highlights video", "Upload to YouTube", "Use hashtags #Valorant #Gaming"],
      category: "gaming_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 11,
      title: "Stream FPS Tips on Twitch",
      description: "Share aim training and positioning tips live",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 50,
      difficulty: "Hard",
      estimatedTime: "1-2 hours",
      requirements: ["Stream for minimum 1 hour", "Share 5+ concrete tips", "Engage with chat", "Use !tips command"],
      category: "live_streaming",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 12,
      title: "Review New Gaming Mouse",
      description: "Test and review the latest gaming peripherals",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "20-30 minutes",
      requirements: ["Unbox and test mouse", "Record review video", "Cover DPI, weight, features", "Include gameplay footage"],
      category: "hardware_review",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 13,
      title: "Create CSGO Strategy Guide",
      description: "Share advanced strategies for competitive play",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Hard",
      estimatedTime: "30-45 minutes",
      requirements: ["Cover map strategies", "Include smoke/flash tips", "Record gameplay examples", "Add timestamps"],
      category: "educational_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 14,
      title: "React to Gaming News",
      description: "Share thoughts on latest gaming industry news",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "10-15 minutes",
      requirements: ["Pick trending gaming news", "Stream reaction live", "Share personal opinion", "Engage with viewers"],
      category: "reaction_content",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 15,
      title: "Host Among Us Community Game",
      description: "Organize and host a community gaming session",
      platform: "discord",
      icon: Users,
      color: "text-indigo-400",
      points: 30,
      difficulty: "Medium",
      estimatedTime: "45-60 minutes",
      requirements: ["Set up Discord voice channel", "Invite 8+ community members", "Host full game session", "Keep energy high"],
      category: "community_engagement",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 16,
      title: "Speedrun Challenge Attempt",
      description: "Attempt a speedrun of your favorite indie game",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 55,
      difficulty: "Hard",
      estimatedTime: "2-3 hours",
      requirements: ["Choose speedrun category", "Stream attempt live", "Explain strategies", "Compare to PB/WR"],
      category: "speedrun_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    },
    {
      id: 17,
      title: "Create Gaming Setup Tour",
      description: "Showcase your complete gaming battlestation",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "15-25 minutes",
      requirements: ["Film complete setup", "Detail each component", "Mention specs and prices", "Include cable management"],
      category: "setup_showcase",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 18,
      title: "Collaborate on Minecraft Build",
      description: "Work with another creator on epic build project",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 60,
      difficulty: "Hard",
      estimatedTime: "2-4 hours",
      requirements: ["Find collaboration partner", "Plan build project", "Record building process", "Create time-lapse"],
      category: "collaboration",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    },
    {
      id: 19,
      title: "Host Retro Gaming Night",
      description: "Stream classic games with nostalgic commentary",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "1-2 hours",
      requirements: ["Choose retro game (90s-2000s)", "Share personal memories", "Engage chat with stories", "Play for full stream"],
      category: "retro_gaming",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 20,
      title: "Create Mobile Gaming Content",
      description: "Review and play trending mobile games",
      platform: "tiktok",
      icon: Music,
      color: "text-purple-400",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "10-15 minutes",
      requirements: ["Download trending mobile game", "Record gameplay", "Add trendy audio", "Use relevant hashtags"],
      category: "mobile_gaming",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    // More Gaming Tasks (21-50)
    {
      id: 21,
      title: "League of Legends Jungle Guide",
      description: "Create comprehensive jungle pathing guide",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Hard",
      estimatedTime: "45-60 minutes",
      requirements: ["Cover optimal pathing", "Explain gank timings", "Show ward placements", "Include team fight positioning"],
      category: "educational_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 22,
      title: "Unbox Gaming Headset Live",
      description: "Live unboxing and first impressions stream",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 30,
      difficulty: "Easy",
      estimatedTime: "20-30 minutes",
      requirements: ["Stream unboxing live", "Test audio quality", "Compare to current headset", "Answer chat questions"],
      category: "unboxing_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 23,
      title: "Create Gaming Meme Compilation",
      description: "Compile funny gaming moments into short video",
      platform: "tiktok",
      icon: Music,
      color: "text-purple-400",
      points: 20,
      difficulty: "Easy",
      estimatedTime: "15-20 minutes",
      requirements: ["Collect funny gaming clips", "Add trending audio", "Use popular meme format", "Post with gaming hashtags"],
      category: "meme_content",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 24,
      title: "Apex Legends Ranked Climb",
      description: "Document your ranked progression journey",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 45,
      difficulty: "Medium",
      estimatedTime: "2-3 hours",
      requirements: ["Stream ranked matches", "Explain decision making", "Track RP progression", "Set climbing goals"],
      category: "ranked_gameplay",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 25,
      title: "Host Gaming Quiz Night",
      description: "Run interactive gaming trivia for community",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "60-90 minutes",
      requirements: ["Prepare 20+ trivia questions", "Use interactive tools", "Award prizes to winners", "Cover multiple game genres"],
      category: "community_engagement",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 26,
      title: "Review Indie Game Discovery",
      description: "Play and review hidden gem indie games",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "30-45 minutes",
      requirements: ["Play for minimum 2 hours", "Cover gameplay mechanics", "Discuss art style and music", "Give honest recommendation"],
      category: "indie_game_review",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 27,
      title: "Create Controller Settings Guide",
      description: "Share optimal controller configurations",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "10-15 minutes",
      requirements: ["Show controller interface", "Explain each setting", "Test in actual gameplay", "Provide downloadable config"],
      category: "tutorial_content",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 28,
      title: "Stream Horror Game Marathon",
      description: "Play scary games with live reactions",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 55,
      difficulty: "Hard",
      estimatedTime: "3-4 hours",
      requirements: ["Play 3+ horror games", "Maintain high energy", "Interact with scared chat", "Use face cam for reactions"],
      category: "horror_gaming",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    },
    {
      id: 29,
      title: "Gaming Chair Review",
      description: "Test and review ergonomic gaming chairs",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "20-30 minutes",
      requirements: ["Test for 1 week minimum", "Cover comfort and build quality", "Compare to previous chair", "Include assembly footage"],
      category: "hardware_review",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 30,
      title: "Create Gaming Workout Video",
      description: "Show exercises designed for gamers",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 30,
      difficulty: "Medium",
      estimatedTime: "20-25 minutes",
      requirements: ["Demonstrate 8+ exercises", "Focus on wrist/back health", "Show proper form", "Create beginner routine"],
      category: "health_fitness",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 31,
      title: "Fortnite Building Tutorial",
      description: "Teach advanced building techniques",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "25-35 minutes",
      requirements: ["Cover basic to advanced builds", "Show key bindings", "Practice in creative mode", "Include combat scenarios"],
      category: "tutorial_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 32,
      title: "Host Charity Gaming Stream",
      description: "Organize fundraising stream for good cause",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 75,
      difficulty: "Hard",
      estimatedTime: "4-6 hours",
      requirements: ["Set up donation tracking", "Stream for extended period", "Engage with donors", "Reach fundraising goal"],
      category: "charity_stream",
      brand: "Lusterlabs.xyz",
      streakBonus: 5
    },
    {
      id: 33,
      title: "Gaming News Weekly Roundup",
      description: "Summarize week's biggest gaming news",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "30-40 minutes",
      requirements: ["Cover 5+ major news items", "Add personal commentary", "Include relevant footage", "Post every Friday"],
      category: "news_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 34,
      title: "Competitive Overwatch Analysis",
      description: "Break down professional match strategies",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Hard",
      estimatedTime: "45-60 minutes",
      requirements: ["Analyze recent pro match", "Explain team compositions", "Break down key moments", "Use slow-motion replays"],
      category: "esports_analysis",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 35,
      title: "Gaming Setup Budget Guide",
      description: "Create affordable gaming setup recommendations",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "25-35 minutes",
      requirements: ["Set $500, $1000, $2000 budgets", "Recommend specific products", "Explain price-to-performance", "Include future upgrade paths"],
      category: "buyer_guide",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 36,
      title: "Stream Variety Game Night",
      description: "Play multiple games based on chat votes",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 45,
      difficulty: "Medium",
      estimatedTime: "2-3 hours",
      requirements: ["Let chat choose games", "Play 4+ different games", "Switch every 30-45 minutes", "Maintain high energy"],
      category: "variety_streaming",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 37,
      title: "Gaming Keyboard Sound Test",
      description: "Test and compare mechanical keyboard switches",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 30,
      difficulty: "Easy",
      estimatedTime: "15-20 minutes",
      requirements: ["Test 3+ switch types", "Record typing audio", "Gaming performance test", "Discuss tactile feedback"],
      category: "hardware_review",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 38,
      title: "Create Gaming Highlight Montage",
      description: "Edit epic gaming moments into cinematic video",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Hard",
      estimatedTime: "2-3 hours",
      requirements: ["Collect best clips from month", "Add dynamic editing", "Sync to epic music", "Include slow-motion effects"],
      category: "montage_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 39,
      title: "Host Gaming Podcast Episode",
      description: "Record gaming discussion with guest or solo",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Medium",
      estimatedTime: "60-90 minutes",
      requirements: ["Prepare discussion topics", "Record high quality audio", "Edit for smooth flow", "Post with timestamps"],
      category: "podcast_content",
      brand: "Hyve.gg",
      streakBonus: 3
    },
    {
      id: 40,
      title: "Gaming Monitor Comparison",
      description: "Compare different gaming monitor specifications",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Medium",
      estimatedTime: "30-40 minutes",
      requirements: ["Test 2+ monitors side by side", "Compare refresh rates", "Show color accuracy", "Test input lag"],
      category: "hardware_review",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 41,
      title: "Stream Cozy Gaming Session",
      description: "Play relaxing games with chill vibes",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 35,
      difficulty: "Easy",
      estimatedTime: "1-2 hours",
      requirements: ["Choose calming games", "Create cozy atmosphere", "Chat casually with viewers", "Play lo-fi background music"],
      category: "cozy_gaming",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 42,
      title: "Gaming Culture Deep Dive",
      description: "Explore gaming subculture or community",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 55,
      difficulty: "Hard",
      estimatedTime: "60-90 minutes",
      requirements: ["Research gaming community", "Interview community members", "Explain culture significance", "Show gameplay examples"],
      category: "documentary_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    },
    {
      id: 43,
      title: "Gaming Fails Compilation",
      description: "Compile funny gaming mistakes and fails",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "20-30 minutes",
      requirements: ["Collect funny fail clips", "Add comedic editing", "Include sound effects", "Keep positive tone"],
      category: "comedy_content",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 44,
      title: "Pro Gamer Daily Routine",
      description: "Document a day in the life of competitive gaming",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Medium",
      estimatedTime: "Full day filming",
      requirements: ["Film morning to night", "Show practice routine", "Include meal prep", "Discuss mental health"],
      category: "lifestyle_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 45,
      title: "Gaming Accessibility Review",
      description: "Review gaming accessibility features",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "30-45 minutes",
      requirements: ["Test accessibility options", "Interview disabled gamers", "Show adaptive controllers", "Advocate for inclusion"],
      category: "accessibility_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 46,
      title: "Stream Viewer Game Requests",
      description: "Play games suggested by your community",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "2-3 hours",
      requirements: ["Take viewer suggestions", "Try each game for 30+ minutes", "Give honest first impressions", "Thank viewers for suggestions"],
      category: "community_requested",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 47,
      title: "Gaming Graphics Settings Guide",
      description: "Optimize graphics settings for performance",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "25-35 minutes",
      requirements: ["Test different settings", "Show FPS comparisons", "Explain visual quality impact", "Provide recommended configs"],
      category: "optimization_guide",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 48,
      title: "Gaming Industry Career Guide",
      description: "Explore different gaming industry career paths",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Hard",
      estimatedTime: "45-60 minutes",
      requirements: ["Interview industry professionals", "Explain career requirements", "Show portfolio examples", "Provide actionable advice"],
      category: "career_advice",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 49,
      title: "Gaming Community Art Showcase",
      description: "Feature fan art and community creations",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 30,
      difficulty: "Easy",
      estimatedTime: "20-30 minutes",
      requirements: ["Collect community submissions", "Feature 10+ artworks", "Credit all artists", "Encourage more submissions"],
      category: "community_showcase",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 50,
      title: "Ultimate Gaming Challenge Stream",
      description: "Complete an epic gaming challenge live",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 100,
      difficulty: "Extreme",
      estimatedTime: "6-12 hours",
      requirements: ["Choose major challenge (speedrun, 24hr stream, etc)", "Engage viewers throughout", "Document entire journey", "Celebrate completion"],
      category: "marathon_challenge",
      brand: "Lusterlabs.xyz",
      streakBonus: 10
    },
    // Extended Gaming Tasks (51-100) for comprehensive testing
    {
      id: 51,
      title: "Minecraft Redstone Tutorial",
      description: "Teach complex redstone contraptions and circuits",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Hard",
      estimatedTime: "45-60 minutes",
      requirements: ["Build working redstone device", "Explain logic step-by-step", "Show practical applications", "Provide schematic diagram"],
      category: "tutorial_content",
      brand: "Hyve.gg",
      streakBonus: 3
    },
    {
      id: 52,
      title: "Fighting Game Combo Guide",
      description: "Master and teach advanced fighting game combos",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Hard",
      estimatedTime: "30-40 minutes",
      requirements: ["Demonstrate 5+ combos", "Show input timing", "Practice against CPU", "Include frame data"],
      category: "fighting_game",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 53,
      title: "Gaming Productivity Tips",
      description: "Share time management for gaming content creators",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "20-30 minutes",
      requirements: ["Cover scheduling tips", "Show workflow tools", "Discuss work-life balance", "Share personal strategies"],
      category: "productivity_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 54,
      title: "VR Gaming First Impressions",
      description: "Try and review virtual reality gaming experience",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Medium",
      estimatedTime: "40-60 minutes",
      requirements: ["Test VR headset/game", "Show gameplay footage", "Discuss motion sickness", "Compare to traditional gaming"],
      category: "vr_gaming",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 55,
      title: "Gaming Voice Chat Etiquette",
      description: "Discuss proper communication in multiplayer games",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "15-20 minutes",
      requirements: ["Cover basic etiquette rules", "Show positive examples", "Discuss toxicity solutions", "Include accessibility tips"],
      category: "community_guide",
      brand: "Hyve.gg",
      streakBonus: 1
    },
    {
      id: 56,
      title: "Sim Racing Championship",
      description: "Compete in online racing league and document journey",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 60,
      difficulty: "Hard",
      estimatedTime: "3-4 hours",
      requirements: ["Join racing league", "Stream practice sessions", "Compete in championship", "Analyze performance"],
      category: "racing_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    },
    {
      id: 57,
      title: "Gaming Graphics Card Benchmark",
      description: "Test gaming performance across different graphics cards",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Hard",
      estimatedTime: "60-90 minutes",
      requirements: ["Test 3+ graphics cards", "Run same games/settings", "Show FPS comparisons", "Discuss value proposition"],
      category: "hardware_benchmark",
      brand: "Hyve.gg",
      streakBonus: 3
    },
    {
      id: 58,
      title: "MMO Guild Leadership Guide",
      description: "Share strategies for leading gaming communities",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Medium",
      estimatedTime: "35-45 minutes",
      requirements: ["Discuss leadership qualities", "Show guild management tools", "Handle conflict resolution", "Plan group activities"],
      category: "leadership_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 59,
      title: "Gaming Snack Tier List",
      description: "Rank and review gaming snacks for long sessions",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 30,
      difficulty: "Easy",
      estimatedTime: "20-25 minutes",
      requirements: ["Test 10+ gaming snacks", "Rate on taste/convenience", "Consider hand cleanliness", "Suggest alternatives"],
      category: "lifestyle_content",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 60,
      title: "Gaming Posture and Health",
      description: "Demonstrate proper ergonomics for gamers",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "25-30 minutes",
      requirements: ["Show proper desk setup", "Demonstrate stretches", "Discuss break schedules", "Address common injuries"],
      category: "health_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 61,
      title: "Puzzle Game Speedsolve",
      description: "Attempt to solve puzzle games as quickly as possible",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "1-2 hours",
      requirements: ["Choose challenging puzzle game", "Stream solving attempts", "Explain thought process", "Compare times with community"],
      category: "puzzle_gaming",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 62,
      title: "Gaming Soundtrack Analysis",
      description: "Analyze and appreciate video game music composition",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "30-40 minutes",
      requirements: ["Choose iconic game soundtrack", "Discuss musical elements", "Show gameplay context", "Interview composer if possible"],
      category: "music_analysis",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 63,
      title: "Gaming Laptop vs Desktop",
      description: "Compare gaming performance between laptop and desktop",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Medium",
      estimatedTime: "40-50 minutes",
      requirements: ["Test same games on both", "Compare thermals and noise", "Discuss portability trade-offs", "Show price comparisons"],
      category: "hardware_comparison",
      brand: "Hyve.gg",
      streakBonus: 3
    },
    {
      id: 64,
      title: "Co-op Game Night Stream",
      description: "Host multiplayer gaming session with friends",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 50,
      difficulty: "Medium",
      estimatedTime: "2-3 hours",
      requirements: ["Play co-op games with 2+ friends", "Maintain engaging commentary", "Include viewers in decisions", "Switch between multiple games"],
      category: "multiplayer_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 65,
      title: "Gaming Subscription Service Review",
      description: "Compare different gaming subscription platforms",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "30-35 minutes",
      requirements: ["Test 3+ gaming services", "Compare game libraries", "Discuss pricing value", "Show platform performance"],
      category: "service_review",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 66,
      title: "Competitive Gaming Mindset",
      description: "Discuss mental strategies for competitive play",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "25-30 minutes",
      requirements: ["Cover pre-game preparation", "Discuss tilt management", "Show breathing techniques", "Address performance anxiety"],
      category: "mental_coaching",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 67,
      title: "Gaming Room Tour and Setup",
      description: "Showcase complete gaming environment and decorations",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Easy",
      estimatedTime: "20-30 minutes",
      requirements: ["Show entire gaming space", "Detail decoration choices", "Discuss lighting setup", "Include storage solutions"],
      category: "room_tour",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 68,
      title: "Gaming Controller Modding",
      description: "Customize and modify gaming controllers",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 55,
      difficulty: "Hard",
      estimatedTime: "60-90 minutes",
      requirements: ["Disassemble controller safely", "Show modding process", "Test modifications", "Discuss warranty implications"],
      category: "hardware_modding",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    },
    {
      id: 69,
      title: "Gaming Influencer Interview",
      description: "Interview established gaming content creator",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 60,
      difficulty: "Hard",
      estimatedTime: "45-75 minutes",
      requirements: ["Secure interview with gaming influencer", "Prepare thoughtful questions", "Discuss their journey", "Share growth tips"],
      category: "interview_content",
      brand: "Hyve.gg",
      streakBonus: 4
    },
    {
      id: 70,
      title: "Gaming Convention Coverage",
      description: "Cover gaming convention or expo event",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 70,
      difficulty: "Hard",
      estimatedTime: "Full day event",
      requirements: ["Attend gaming convention", "Interview developers", "Show new game demos", "Create highlights reel"],
      category: "event_coverage",
      brand: "Lusterlabs.xyz",
      streakBonus: 5
    },
    {
      id: 71,
      title: "Game Development Basics",
      description: "Introduce viewers to game development fundamentals",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Hard",
      estimatedTime: "45-60 minutes",
      requirements: ["Show game development tools", "Create simple game prototype", "Explain coding concepts", "Discuss design principles"],
      category: "gamedev_content",
      brand: "Hyve.gg",
      streakBonus: 3
    },
    {
      id: 72,
      title: "Gaming Memory Lane",
      description: "Revisit classic games from gaming history",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "35-45 minutes",
      requirements: ["Play classic retro game", "Discuss historical significance", "Compare to modern games", "Share personal memories"],
      category: "retro_analysis",
      brand: "Lusterlabs.xyz",
      streakBonus: 2
    },
    {
      id: 73,
      title: "Gaming Community Highlights",
      description: "Showcase amazing community-created content",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 35,
      difficulty: "Medium",
      estimatedTime: "25-35 minutes",
      requirements: ["Feature 5+ community creations", "Credit all creators", "Show diverse content types", "Encourage more submissions"],
      category: "community_highlights",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 74,
      title: "Gaming Ethics Discussion",
      description: "Discuss ethical issues in gaming industry",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Hard",
      estimatedTime: "30-40 minutes",
      requirements: ["Choose relevant ethical topic", "Present multiple viewpoints", "Encourage civil discussion", "Provide thoughtful conclusion"],
      category: "ethics_discussion",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 75,
      title: "Gaming Performance Optimization",
      description: "Show how to optimize PC performance for gaming",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "30-40 minutes",
      requirements: ["Show system optimization", "Demonstrate FPS improvements", "Cover driver updates", "Discuss overclocking basics"],
      category: "performance_guide",
      brand: "Hyve.gg",
      streakBonus: 2
    },
    {
      id: 76,
      title: "Gaming Streaming Setup Guide",
      description: "Complete guide to setting up a gaming stream",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 55,
      difficulty: "Hard",
      estimatedTime: "60-75 minutes",
      requirements: ["Show streaming software setup", "Configure overlays and alerts", "Test stream quality", "Cover engagement strategies"],
      category: "streaming_guide",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    },
    {
      id: 77,
      title: "Gaming Predictions and Trends",
      description: "Analyze and predict future gaming industry trends",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 45,
      difficulty: "Medium",
      estimatedTime: "30-40 minutes",
      requirements: ["Research current trends", "Make informed predictions", "Support with evidence", "Discuss potential impacts"],
      category: "industry_analysis",
      brand: "Hyve.gg",
      streakBonus: 3
    },
    {
      id: 78,
      title: "Gaming Crossover Content",
      description: "Create content combining gaming with other interests",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 50,
      difficulty: "Hard",
      estimatedTime: "45-60 minutes",
      requirements: ["Combine gaming with cooking/fitness/art", "Show creative integration", "Appeal to broader audience", "Maintain gaming focus"],
      category: "crossover_content",
      brand: "Lusterlabs.xyz",
      streakBonus: 3
    },
    {
      id: 79,
      title: "Gaming Challenge Tournament",
      description: "Organize and host community gaming tournament",
      platform: "twitch",
      icon: Twitch,
      color: "text-purple-400",
      points: 80,
      difficulty: "Extreme",
      estimatedTime: "4-6 hours",
      requirements: ["Organize bracket tournament", "Stream entire event", "Manage multiple participants", "Award prizes to winners"],
      category: "tournament_hosting",
      brand: "Hyve.gg",
      streakBonus: 6
    },
    {
      id: 80,
      title: "Gaming Year in Review",
      description: "Comprehensive review of gaming year highlights",
      platform: "youtube",
      icon: Youtube,
      color: "text-red-400",
      points: 60,
      difficulty: "Hard",
      estimatedTime: "60-90 minutes",
      requirements: ["Cover major gaming releases", "Discuss industry events", "Share personal gaming highlights", "Make predictions for next year"],
      category: "annual_review",
      brand: "Lusterlabs.xyz",
      streakBonus: 4
    }
  ];

  // Get the current active tasks (all 80 gaming tasks)
  const availableTasks = microTasks;

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

  // Limit tasks based on tasksPerPage
  const displayedTasks = availableTasksFiltered.slice(0, tasksPerPage);
  const hasMoreTasks = availableTasksFiltered.length > tasksPerPage;
  

  
  const handleLoadMore = () => {
    triggerHaptic("light");
    setTasksPerPage(prev => prev + LOAD_MORE_INCREMENT);
  };
  
  const handleShowLess = () => {
    triggerHaptic("light");
    setTasksPerPage(INITIAL_TASKS_PER_PAGE);
  };

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
        completedAt: task.completedAt,
        verificationUrl: verificationData.url || "",
        status: "verified"
      };
    })
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });

  const handleStartTask = (task: any) => {
    triggerHaptic("light");
    setSelectedTask(task);
    setShowTaskPreview(false); // Close preview modal
    toast({
      title: "Task started!",
      description: `You've started "${task.title}". Complete it and submit for verification.`,
    });
  };

  const handleTaskPreview = (task: any) => {
    triggerHaptic("light");
    setPreviewTask(task);
    setShowTaskPreview(true);
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
            
            // Trigger contextual emoji reaction based on task type
            const emojiConfig = getContextualEmojiConfig(
              'task_complete', 
              selectedTask.platform, 
              selectedTask.category
            );
            
            // Special handling for streak milestones and MVP task
            const isSpecialTask = selectedTask.id === 0;
            const isStreakMilestone = (userStreak + (selectedTask.streakBonus || 1)) % 5 === 0;
            const isHighPointTask = selectedTask.points >= 50;
            
            if (isSpecialTask) {
              // Special burst for MVP completion with extra count and size
              triggerReaction({
                type: 'milestone',
                category: 'firstTime',
                style: 'burst',
                count: 8,
                size: 'lg',
                duration: 4000
              });
            } else if (isStreakMilestone) {
              // Streak milestone celebration
              triggerReaction({
                type: 'taskComplete',
                category: 'streak',
                style: 'cascade',
                count: 6,
                size: 'md',
                duration: 3500
              });
            } else if (isHighPointTask) {
              // High-value task completion
              triggerReaction({
                type: 'taskComplete',
                category: 'achievement',
                style: 'burst',
                count: 7,
                size: 'md',
                duration: 3000
              });
            } else {
              // Regular task completion
              triggerReaction({
                ...emojiConfig,
                count: 5,
                size: 'sm',
                duration: 2500
              });
            }
            
            // Show floating points animation only if this task hasn't been animated before
            if (lastAnimatedTaskId !== selectedTask.id) {
              setFloatingPoints(selectedTask.points);
              setShowFloatingPoints(true);
              setLastAnimatedTaskId(selectedTask.id);
            }
            
            // Invalidate queries immediately for real-time updates
            queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
            queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
            queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
            
            // Refresh user data in auth context for real-time updates
            await refreshUser();
            
            const message = isSpecialTask 
              ? `Amazing! You've earned ${selectedTask.points} XP points and ${selectedTask.streakBonus || 1} day streak! AI Agent tooling is now unlocked.`
              : `Great work! You've earned ${selectedTask.points} XP points.`;
            
            // Delayed toast to appear after floating animation starts
            setTimeout(() => {
              toast({
                title: "Task verified!",
                description: message,
              });
            }, 800);

            // Prepare share data and show social sharing modal
            setShareTaskData({
              type: "task",
              title: selectedTask.title,
              description: selectedTask.description || `Completed ${selectedTask.title} on Veri platform`,
              xpEarned: selectedTask.points,
              streakDay: userStreak + (selectedTask.streakBonus || 1), // Add streak bonus
              veriScore: Math.min(100, Math.floor((userXP + selectedTask.points) / 10)), // Calculate new VeriScore
              platform: selectedTask.platform
            });
            
            setSelectedTask(null);
            setVerificationUrl("");
            setActiveTab("completed");

            // Show social sharing modal after floating animation completes
            setTimeout(() => {
              setShowShareModal(true);
            }, 2500);
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
            <CardTitle className="text-white">Partner Quests</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              {userXP} XP
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
              {userStreak} Day Streak
            </Badge>
            {/* Expansion Toggle - Moved to far right */}
            <Button
              onClick={() => {
                const newExpanded = !isGridExpanded;
                setIsGridExpanded(newExpanded);
                onGridExpansionChange?.(newExpanded);
              }}
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 p-2 h-8 w-8"
              title={isGridExpanded ? "Exit fullscreen view" : "Expand to fullscreen view"}
            >
              {isGridExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Expand className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <CardDescription className="text-white/60 space-y-3">
          <div>Complete tasks to earn XP points and build your creator streak</div>
          
          {/* Streak Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Daily Streak Progress</span>
              <span className="text-orange-400 font-medium">{userStreak}/30 days</span>
            </div>
            <Progress 
              value={(userStreak / 30) * 100} 
              className="h-2 bg-white/10"
            />
            <div className="flex justify-between text-xs text-white/50">
              <span>Start</span>
              <span>Monthly Goal</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>


        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="available">Available ({availableTasksFiltered.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({selectedTask ? 1 : 0})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>
          
          {/* Filter Toggle Button - Show only when showFilters is true and on available tab */}
          {showFilters && activeTab === "available" && (
            <div className="mt-4 mb-4">
              <Button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                variant="outline"
                size="sm"
                className="glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 mb-3"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {filtersExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
                {(brandFilter !== "all" || difficultyFilter !== "all") && (
                  <Badge variant="secondary" className="ml-2 bg-emerald-500/20 text-emerald-400 text-xs">
                    Active
                  </Badge>
                )}
              </Button>
              
              {/* Collapsible Filters */}
              {filtersExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 glass-subtle rounded-lg border border-white/10"
                >
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
                </motion.div>
              )}
            </div>
          )}
          
          <TabsContent value="available" className="space-y-4">
              <div 
                className={isGridExpanded ? "task-grid-fullscreen" : "grid gap-6 grid-cols-1 md:grid-cols-2"}
                style={isGridExpanded ? {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  width: '100%'
                } : {}}
              >
                {displayedTasks.map((task) => {
                  return (
                    <div 
                      key={task.id} 
                      className="group rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in relative hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 transform-gpu hover:z-10 cursor-pointer"
                      style={{
                        animationDelay: `${task.id * 100}ms`,
                        transformOrigin: 'center center'
                      }}
                      onClick={() => handleTaskPreview(task)}
                    >
                      {/* Full Background with Partner Gradient */}
                      <div className={`relative h-48 ${getPartnerGradient(task.brand, task.id)}`}>
                        {/* Subtle overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30"></div>
                        
                        {/* Top Row - Partner Badge and XP with pulse animation */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-full border-0 group-hover:bg-white/30 transition-all">
                            {task.brand?.replace('.gg', '').replace('.xyz', '') || 'Partner'}
                          </Badge>
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 backdrop-blur-md text-white font-semibold text-xs px-2 py-1 rounded-full border-0 flex items-center animate-pulse group-hover:animate-none group-hover:from-green-400 group-hover:to-emerald-400">
                            <span className="text-white mr-1">💎</span>
                            {task.points} XP
                          </Badge>
                        </div>
                        
                        {/* Bottom Glass Overlay with Content */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10">
                          <div className="p-3 flex items-center justify-between">
                            {/* Left side - Platform icon and title */}
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <task.icon className="h-5 w-5 text-white flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold text-sm truncate group-hover:text-green-300 transition-colors">
                                  {task.title}
                                </h3>
                                <div className="text-white/70 text-xs capitalize">
                                  {task.platform} • {task.difficulty}
                                </div>
                              </div>
                            </div>
                            
                            {/* Right side - Start button */}
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskPreview(task);
                                }}
                                size="sm"
                                className="relative bg-transparent border border-teal-400/40 text-teal-300 hover:text-white font-bold px-4 py-1.5 text-xs rounded-lg transition-all duration-300 hover:scale-105 hover:border-teal-300 hover:shadow-[0_0_15px_rgba(20,184,166,0.6),0_0_30px_rgba(20,184,166,0.3)] hover:animate-pulse group"
                              >
                                <span className="relative z-10">Start</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      

                      

                  </div>
                );
                })}
              </div>
            
            {/* View More Tasks Button */}
            {hasMoreTasks && (
              <div className="flex justify-center mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover-lift group px-6 py-3 font-medium"
                  >
                    View More Tasks ({availableTasksFiltered.length - tasksPerPage} remaining)
                    <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </div>
            )}
            
            {/* Show Less Tasks Button */}
            {tasksPerPage > INITIAL_TASKS_PER_PAGE && (
              <div className="flex justify-center mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={handleShowLess}
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
                            Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Recently'}
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/40 hover:text-blue-300 group-hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                          onClick={() => {
                            triggerHaptic("light");
                            setShareTaskData({
                              type: "task",
                              title: task.title,
                              description: `Completed ${task.title} on Veri platform`,
                              xpEarned: task.points,
                              streakDay: userStreak,
                              veriScore: Math.min(100, Math.floor(userXP / 10)),
                              platform: task.platform
                            });
                            setShowShareModal(true);
                          }}
                        >
                          <Share2 className="mr-1 h-3 w-3 group-hover:rotate-12 transition-transform duration-300" />
                          Share
                        </Button>
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
      {/* Floating Points Animation */}
      {showFloatingPoints && (
        <FloatingPointsAnimation 
          points={floatingPoints} 
          onComplete={() => setShowFloatingPoints(false)} 
        />
      )}
      {/* Task Preview Modal */}
      <Dialog open={showTaskPreview} onOpenChange={setShowTaskPreview}>
        <DialogContent className="glass-primary border-white/20 max-w-2xl">
          {previewTask && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${getPartnerGradient(previewTask.brand, previewTask.id)} flex items-center justify-center`}>
                    <previewTask.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-semibold text-white mb-1">
                      {previewTask.title}
                    </DialogTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        {previewTask.brand?.replace('.gg', '').replace('.xyz', '') || 'Partner'}
                      </Badge>
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white text-xs">
                        💎 {previewTask.points} XP
                      </Badge>
                      <Badge variant="secondary" className={getDifficultyColor(previewTask.difficulty)}>
                        {previewTask.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <DialogDescription asChild>
                <div className="space-y-6">
                  {/* Task Description */}
                  <div>
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Task Overview
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      {previewTask.description}
                    </p>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-secondary rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-emerald-400" />
                        <span className="text-white font-medium">Duration</span>
                      </div>
                      <p className="text-white/70">{previewTask.estimatedTime}</p>
                    </div>
                    <div className="glass-secondary rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="h-4 w-4 text-emerald-400" />
                        <span className="text-white font-medium">Category</span>
                      </div>
                      <p className="text-white/70 capitalize">{previewTask.category.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Requirements ({previewTask.requirements.length})
                    </h4>
                    <div className="space-y-2">
                      {previewTask.requirements.map((req: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 text-white/80">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                          <span className="text-sm leading-relaxed">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() => setShowTaskPreview(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Close Preview
                    </Button>
                    <Button
                      onClick={() => handleStartTask(previewTask)}
                      className="veri-gradient text-white font-medium px-6"
                      disabled={selectedTask?.id === previewTask.id}
                    >
                      {selectedTask?.id === previewTask.id ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Task Started
                        </>
                      ) : (
                        <>
                          Start Task
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Social Share Modal */}
      {showShareModal && shareTaskData && user && (
        <SocialShare
          type={shareTaskData.type}
          title={shareTaskData.title}
          description={shareTaskData.description}
          xpEarned={shareTaskData.xpEarned}
          streakDay={shareTaskData.streakDay}
          veriScore={shareTaskData.veriScore}
          platform={shareTaskData.platform}
          onClose={() => setShowShareModal(false)}
        />
      )}
      
      {/* Contextual Emoji Reactions */}
      {reactions.map((reaction) => (
        <EmojiReaction
          key={reaction.id}
          type={reaction.type}
          category={reaction.category}
          count={reaction.count}
          size={reaction.size}
          duration={reaction.duration}
          position={reaction.position}
          style={reaction.style}
          trigger={true}
          onComplete={() => {}}
        />
      ))}
    </Card>
  );
}
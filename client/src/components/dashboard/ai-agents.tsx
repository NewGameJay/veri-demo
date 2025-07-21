import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { VeriLogo } from "@/components/ui/veri-logo";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from 'lucide-react';
import { Zap } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Video } from 'lucide-react';
import { Search } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { Coins } from 'lucide-react';
import { Gamepad2 } from 'lucide-react';
import { Lock } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Target } from 'lucide-react';
import { BarChart3 } from 'lucide-react';
import { Upload } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Trophy } from 'lucide-react';
import { Scissors } from 'lucide-react';
import { Lightbulb } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Gem } from 'lucide-react';
import { Rocket } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Play } from 'lucide-react';
import { X } from 'lucide-react';

interface AIAgentsProps {
  userPoints: number;
  userStreak: number;
  onUseAgent?: (agentId: string, pointsCost: number) => void;
}

const AGENT_CATEGORIES = {
  monetization: {
    name: "Monetization Suite",
    description: "AI agents that optimize your content for maximum revenue",
    icon: DollarSign,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    agents: [
      {
        id: "thumbnail-optimizer",
        name: "Thumbnail & Title Revenue Refresh",
        description: "Auto-optimizes back-catalog using real-time trend & keyword data for instant RPM lift",
        icon: Upload,
        pointsCost: 10,
        estimatedLift: "+15-30% CPM",
        processingTime: "2-3 minutes",
        features: [
          "Real-time trend analysis",
          "A/B testing recommendations",
          "Keyword optimization",
          "Performance predictions"
        ]
      },
      {
        id: "clipping-agent",
        name: "Smart Clipping Agent",
        description: "Detects high-engagement moments and creates sponsor-friendly clips automatically",
        icon: Scissors,
        pointsCost: 15,
        estimatedLift: "+25% reach",
        processingTime: "5-10 minutes",
        features: [
          "AI moment detection",
          "Multi-platform formatting",
          "Sponsor-safe content",
          "Engagement scoring"
        ]
      },
      {
        id: "trend-hunter",
        name: "Trend-Hunter Ideation Agent",
        description: "Scans trends across platforms and generates monetizable content ideas",
        icon: Lightbulb,
        pointsCost: 10,
        estimatedLift: "3x topic relevance",
        processingTime: "1-2 minutes",
        features: [
          "Cross-platform scanning",
          "Topic monetization analysis",
          "Content gap detection",
          "Viral potential scoring"
        ]
      }
    ]
  },
  web3Gaming: {
    name: "Web3 Gaming Suite",
    description: "Specialized agents for gaming creators in the Web3 ecosystem",
    icon: Gamepad2,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    agents: [
      {
        id: "airdrop-scanner",
        name: "Gaming Airdrop Eligibility Scanner",
        description: "Tracks your wallet against curated gaming airdrops and shows missing steps",
        icon: Coins,
        pointsCost: 5,
        estimatedValue: "Free tokens/NFTs",
        processingTime: "30 seconds",
        features: [
          "Daily airdrop checks",
          "Eligibility tracking",
          "Action recommendations",
          "Value estimations"
        ]
      },
      {
        id: "alpha-aggregator",
        name: "Web3 Gaming Alpha Aggregator",
        description: "Curates early intel from X & Reddit filtered by your gaming interests",
        icon: Search,
        pointsCost: 10,
        estimatedValue: "First-mover advantage",
        processingTime: "2-3 minutes",
        features: [
          "Real-time alpha feeds",
          "Community sentiment",
          "Early access alerts",
          "Trend predictions"
        ]
      },
      {
        id: "nft-drop-hunter",
        name: "Gaming NFT & Token Drop Hunter",
        description: "Tracks upcoming gaming NFT/token launches with personalized alerts",
        icon: Gem,
        pointsCost: 10,
        estimatedValue: "Early mint access",
        processingTime: "1-2 minutes",
        features: [
          "Launch calendar",
          "Mint price tracking",
          "Community hype metrics",
          "ROI projections"
        ]
      }
    ]
  }
};

export function AIAgents({ userPoints, userStreak, onUseAgent }: AIAgentsProps) {
  const [activeCategory, setActiveCategory] = useState("monetization");
  const [processingAgents, setProcessingAgents] = useState<Set<string>>(new Set());
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set());
  const [showUnlockedCelebration, setShowUnlockedCelebration] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState("brightmatter-1.0");
  const [showChatbot, setShowChatbot] = useState(false);
  const { toast } = useToast();

  // Check if AI agents just became unlocked and show celebration
  useEffect(() => {
    if (userStreak >= 7 && !localStorage.getItem('ai-agents-unlocked-celebration-shown')) {
      setShowUnlockedCelebration(true);
      localStorage.setItem('ai-agents-unlocked-celebration-shown', 'true');
      
      toast({
        title: "🎉 AI Agents Unlocked!",
        description: "Congratulations! You've earned access to our powerful AI agent suite.",
      });

      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowUnlockedCelebration(false);
      }, 3000);
    }
  }, [userStreak, toast]);

  const handleLaunchAgent = async (agentId: string, pointsCost: number) => {
    if (userPoints < pointsCost) {
      toast({
        title: "Insufficient points",
        description: `You need ${pointsCost - userPoints} more points to launch this agent.`,
        variant: "destructive",
      });
      return;
    }

    // Start the chatbot with the selected agent
    setShowChatbot(true);
    setProcessingAgents(prev => new Set(prev).add(agentId));

    toast({
      title: "Agent launched!",
      description: `${AGENT_CATEGORIES[activeCategory as keyof typeof AGENT_CATEGORIES].agents.find(a => a.id === agentId)?.name} is now running in the Veri AI Assistant.`,
    });

    try {
      // Simulate agent processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setCompletedAgents(prev => new Set(prev).add(agentId));
      
      toast({
        title: "Agent completed!",
        description: "Your content has been optimized. Check the results in your dashboard.",
      });

      if (onUseAgent) {
        onUseAgent(agentId, pointsCost);
      }
    } catch (error) {
      toast({
        title: "Agent failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  const isAgentLocked = userStreak < 7;

  return (
    <Card className="glass-medium border-white/20 relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">AI Agent Studio</CardTitle>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              <Sparkles className="mr-1 h-3 w-3" />
              Powered by Brightmatter
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-white/20 text-white">
              <Zap className="mr-1 h-3 w-3" />
              {userPoints} points
            </Badge>
          </div>
        </div>
        <CardDescription className="text-white/60">
          Memory-driven AI agents that optimize your content and unlock new revenue streams
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Veri Branded Chatbot with Engine Options */}
        {!isAgentLocked && (
          <div className="mb-6">
            <Card className="glass-subtle border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 veri-gradient rounded-xl flex items-center justify-center">
                      <VeriLogo size="md" showText={false} clickable={false} />
                    </div>
                    <div>
                      <h3 className="text-lg font-termina text-white">Veri AI Assistant</h3>
                      <p className="text-sm text-emerald-400">Your personal AI agent orchestrator</p>
                    </div>
                  </div>
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                </div>

                {/* Engine Options */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-white/70 mb-2 block">Engine Options</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={selectedEngine === "brightmatter-1.0" ? "default" : "outline"}
                      onClick={() => setSelectedEngine("brightmatter-1.0")}
                      className={`justify-start ${
                        selectedEngine === "brightmatter-1.0" 
                          ? "veri-gradient text-white" 
                          : "glass-subtle border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Brightmatter 1.0
                    </Button>
                    <Button
                      variant="outline"
                      disabled
                      className="justify-start glass-subtle border-white/10 text-white/40 cursor-not-allowed"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Brightmatter 1.5+
                      <Badge variant="secondary" className="ml-2 bg-orange-500/20 text-orange-400 text-xs">
                        Upgrade
                      </Badge>
                    </Button>
                  </div>
                </div>

                {/* Chat Interface Preview */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-400 font-medium">Ready to assist</span>
                  </div>
                  <p className="text-white/60 text-sm">
                    Hi! I'm your Veri AI Assistant. I can help you launch agents, analyze performance, and optimize your content strategy. What would you like to work on today?
                  </p>
                </div>

                {/* Start Chat Button */}
                <Button 
                  onClick={() => setShowChatbot(true)}
                  className="w-full veri-gradient hover:opacity-90 transition-all duration-300"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start AI Assistant Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {isAgentLocked ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <Lock className="h-10 w-10 text-white/60" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-3">AI Agents Locked</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Build a 7-day streak to unlock access to our powerful AI agent suite. 
              These agents will help you optimize content, find trends, and maximize revenue.
            </p>
            <div className="space-y-3 max-w-xs mx-auto">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Streak Progress</span>
                <span className="text-white font-medium">{userStreak}/7 days</span>
              </div>
              <Progress value={(userStreak / 7) * 100} className="h-2" />
              <p className="text-sm text-white/40">
                {7 - userStreak} more days to unlock
              </p>
            </div>
          </div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
              {Object.entries(AGENT_CATEGORIES).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={key} value={key} className="data-[state=active]:bg-white/10">
                    <Icon className={`h-4 w-4 mr-2 ${category.color}`} />
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <AnimatePresence mode="wait">
              {Object.entries(AGENT_CATEGORIES).map(([key, category]) => (
                <TabsContent key={key} value={key}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-white/60 text-sm mb-6">{category.description}</p>
                    
                    <div className="grid gap-4">
                      {category.agents.map((agent) => {
                        const Icon = agent.icon;
                        const isProcessing = processingAgents.has(agent.id);
                        const isCompleted = completedAgents.has(agent.id);
                        
                        return (
                          <motion.div
                            key={agent.id}
                            whileHover={{ scale: 1.02 }}
                            className="glass-subtle p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-3">
                                <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                                  <Icon className={`h-5 w-5 ${category.color}`} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white mb-1">{agent.name}</h4>
                                  <p className="text-white/60 text-sm">{agent.description}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="border-white/20 text-white">
                                <Zap className="mr-1 h-3 w-3" />
                                {agent.pointsCost} pts
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-400 mb-1">
                                  {agent.estimatedLift || agent.estimatedValue}
                                </div>
                                <p className="text-xs text-white/40">Expected Impact</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-white mb-1">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">{agent.processingTime}</span>
                                </div>
                                <p className="text-xs text-white/40">Processing Time</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-purple-400 mb-1">
                                  <Target className="h-4 w-4" />
                                  <span className="text-sm">High</span>
                                </div>
                                <p className="text-xs text-white/40">Accuracy</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {agent.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                                  <span className="text-xs text-white/60">{feature}</span>
                                </div>
                              ))}
                            </div>

                            <Button
                              onClick={() => handleLaunchAgent(agent.id, agent.pointsCost)}
                              disabled={isProcessing || isCompleted || userPoints < agent.pointsCost}
                              className={`w-full ${
                                isCompleted 
                                  ? "bg-green-500/20 text-green-400 cursor-default" 
                                  : "veri-gradient hover:opacity-90"
                              }`}
                            >
                              {isProcessing ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : isCompleted ? (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <Rocket className="mr-2 h-4 w-4" />
                                  Launch Agent ({agent.pointsCost} pts)
                                </>
                              )}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        )}

        {/* Memory Profile Indicator */}
        <div className="mt-6 p-4 glass-subtle rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Memory Profile Status</span>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              Active
            </Badge>
          </div>
          <p className="text-xs text-white/60 mb-3">
            Your creator profile is continuously learning from your interactions to provide personalized recommendations.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-white/5 rounded">
              <div className="font-semibold text-white">2.3k</div>
              <div className="text-white/40">Memories</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded">
              <div className="font-semibold text-white">94%</div>
              <div className="text-white/40">Accuracy</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded">
              <div className="font-semibold text-white">Live</div>
              <div className="text-white/40">Learning</div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Celebration Overlay for Unlocked AI Agents */}
      <AnimatePresence>
        {showUnlockedCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">🎉 AI Agents Unlocked!</h3>
              <p className="text-white/80">
                Congratulations on your 7-day streak!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Veri AI Assistant Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowChatbot(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl w-full max-w-2xl h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chatbot Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 veri-gradient rounded-xl flex items-center justify-center">
                      <VeriLogo size="sm" showText={false} clickable={false} />
                    </div>
                    <div>
                      <h3 className="text-lg font-termina text-white">Veri AI Assistant</h3>
                      <p className="text-sm text-emerald-400">Engine: {selectedEngine === "brightmatter-1.0" ? "Brightmatter 1.0" : "Brightmatter 1.5+"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-400">Active</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowChatbot(false)}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* AI Welcome Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 veri-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <VeriLogo size="sm" showText={false} clickable={false} />
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 max-w-md">
                      <p className="text-white/90 text-sm">
                        👋 Hi! I'm your Veri AI Assistant powered by {selectedEngine === "brightmatter-1.0" ? "Brightmatter 1.0" : "Brightmatter 1.5+"}. 
                        I can help you launch and manage your AI agents, analyze performance data, and optimize your content strategy. 
                        What would you like to work on today?
                      </p>
                    </div>
                  </div>

                  {/* Show active agents if any */}
                  {processingAgents.size > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 veri-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                        <VeriLogo size="sm" showText={false} clickable={false} />
                      </div>
                      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 max-w-md">
                        <p className="text-blue-300 text-sm font-medium mb-2">🚀 Active Agents</p>
                        <div className="space-y-1">
                          {Array.from(processingAgents).map(agentId => {
                            const agent = Object.values(AGENT_CATEGORIES)
                              .flatMap(cat => cat.agents)
                              .find(a => a.id === agentId);
                            return (
                              <div key={agentId} className="flex items-center space-x-2">
                                <RefreshCw className="h-3 w-3 animate-spin text-blue-300" />
                                <span className="text-white/80 text-xs">{agent?.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input Area */}
              <div className="p-6 border-t border-white/10">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Ask me to launch an agent, analyze your content, or optimize your strategy..."
                      className="w-full bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                    />
                  </div>
                  <Button className="veri-gradient hover:opacity-90 px-6">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-white/40 mt-2">
                  Try: "Launch the thumbnail optimizer" or "Show me my performance analytics"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
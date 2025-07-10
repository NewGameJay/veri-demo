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
import { 
  Database, 
  Brain, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  GitBranch,
  Github,
  Link,
  RefreshCw,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Code,
  FileText,
  Cpu,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  Rocket,
  Shield,
  Key,
  Lock
} from "lucide-react";

interface MemorizzIntegrationProps {
  userStreak: number;
  isUnlocked: boolean;
}

export function MemorizzIntegration({ userStreak, isUnlocked }: MemorizzIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [memories, setMemories] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleConnectRepo = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Repository URL required",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Simulate connection to memorizz repository
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setMemories([
        {
          id: 1,
          type: "user_interaction",
          content: "User preference: Prefers dark theme with glass morphism effects",
          timestamp: new Date().toISOString(),
          confidence: 0.95,
          category: "ui_preferences"
        },
        {
          id: 2,
          type: "behavioral_pattern",
          content: "User tends to engage more with visual content during evening hours",
          timestamp: new Date().toISOString(),
          confidence: 0.87,
          category: "engagement_patterns"
        },
        {
          id: 3,
          type: "content_style",
          content: "User responds well to step-by-step tutorials and interactive demos",
          timestamp: new Date().toISOString(),
          confidence: 0.92,
          category: "learning_style"
        }
      ]);

      toast({
        title: "Repository connected!",
        description: "Memorizz integration is now active and learning from your interactions",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to the repository. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleProcessMemories = async () => {
    setIsProcessing(true);
    try {
      // Simulate memory processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Memories processed!",
        description: "AI agent has been updated with new insights from your interactions",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Unable to process memories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateInsights = async () => {
    try {
      const insights = [
        "Your audience engagement peaks at 7PM EST",
        "Visual content performs 3x better than text-only posts",
        "Tutorial content has 85% completion rate",
        "Mobile users make up 68% of your audience"
      ];
      
      toast({
        title: "Insights generated!",
        description: `Generated ${insights.length} new insights from your data`,
      });
    } catch (error) {
      toast({
        title: "Insight generation failed",
        description: "Unable to generate insights. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isUnlocked) {
    return (
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Memorizz AI Agent</CardTitle>
            </div>
            <Lock className="h-5 w-5 text-white/40" />
          </div>
          <CardDescription className="text-white/60">
            Memory-driven AI agent for personalized content optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Feature Locked</h3>
            <p className="text-white/60 mb-4">
              Build a {Math.max(10 - userStreak, 0)} day streak to unlock AI agent features
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Progress</span>
                <span className="text-white font-medium">{userStreak}/10 days</span>
              </div>
              <Progress value={(userStreak / 10) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Memorizz AI Agent</CardTitle>
            {isConnected && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            )}
          </div>
          <Sparkles className="h-5 w-5 text-purple-400" />
        </div>
        <CardDescription className="text-white/60">
          Memory-driven AI agent for personalized content optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="memories">Memories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {!isConnected ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Connect Repository</h3>
                <p className="text-white/60 mb-4">
                  Connect your memorizz repository to enable AI-powered memory-driven intelligence
                </p>
                <Button 
                  onClick={() => setActiveTab("setup")}
                  className="veri-gradient"
                >
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-effect p-4 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Database className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">Memories Stored</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{memories.length}</div>
                  </div>
                  
                  <div className="glass-effect p-4 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Insights Generated</span>
                    </div>
                    <div className="text-2xl font-bold text-white">12</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleProcessMemories}
                    disabled={isProcessing}
                    className="w-full veri-gradient"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing Memories...
                      </>
                    ) : (
                      <>
                        <Cpu className="mr-2 h-4 w-4" />
                        Process New Memories
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateInsights}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Insights
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="setup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-white text-sm">Repository URL</Label>
                <Input
                  placeholder="https://github.com/username/memorizz-repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white text-sm">Access Token (Optional)</Label>
                <Input
                  type="password"
                  placeholder="GitHub access token for private repositories"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                />
              </div>
              
              <Button 
                onClick={handleConnectRepo}
                disabled={isConnecting}
                className="w-full veri-gradient"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    Connect Repository
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="memories" className="space-y-4">
            {memories.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Memories Yet</h3>
                <p className="text-white/60">
                  Connect your repository to start collecting memories
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {memories.map((memory: any) => (
                  <div key={memory.id} className="glass-effect p-4 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-sm font-medium text-white capitalize">
                          {memory.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-white/60">
                          {Math.round(memory.confidence * 100)}%
                        </span>
                        <BarChart3 className="h-3 w-3 text-white/60" />
                      </div>
                    </div>
                    <p className="text-sm text-white/80 mb-2">{memory.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">
                        {new Date(memory.timestamp).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
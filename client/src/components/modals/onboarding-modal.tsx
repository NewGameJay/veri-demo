import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Twitter } from 'lucide-react';
import { Youtube } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Users } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  const handleConnectSocial = async (platform: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/social-connections", {
        userId: user?.id,
        platform,
        isConnected: true,
        followerCount: Math.floor(Math.random() * 10000) + 1000, // Demo data
        platformUsername: `@${user?.username}_${platform}`,
      });
      
      setConnectedPlatforms(prev => [...prev, platform]);
      
      // Refresh user data to show updated XP
      await refreshUser();
      
      toast({
        title: "Platform connected!",
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} has been connected successfully. You earned 25 XP!`,
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Onboarding complete!",
      description: "Welcome to Veri! Start earning by completing tasks.",
    });
    onClose();
  };

  const steps = [
    {
      title: "Welcome to Veri!",
      description: "Let's get you set up to start earning points",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Welcome, {user?.firstName || user?.username}!
            </h3>
            <p className="text-white/60">
              You've successfully created your Veri account. Let's get you started with earning points
              through authentic social engagement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-effect p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h4 className="font-semibold text-white">Earn Points</h4>
              </div>
              <p className="text-sm text-white/60">
                Complete tasks and connect social platforms to earn XP points
              </p>
            </div>
            
            <div className="glass-effect p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-purple-400" />
                <h4 className="font-semibold text-white">Build Your Profile</h4>
              </div>
              <p className="text-sm text-white/60">
                Create your creator profile and showcase your work
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setStep(2)}
            className="w-full veri-gradient font-semibold"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    {
      title: "Connect Your Social Platforms",
      description: "Link your social accounts to start earning points",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Connect Your Social Platforms
            </h3>
            <p className="text-white/60">
              Connect your social media accounts to verify your audience and start earning points.
              Each connection earns you 25 XP!
            </p>
          </div>

          <div className="space-y-4">
            {[
              { platform: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
              { platform: "youtube", name: "YouTube", icon: Youtube, color: "text-red-400" },
              { platform: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400" },
            ].map(({ platform, name, icon: Icon, color }) => (
              <div key={platform} className="glass-effect p-4 rounded-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${color}`} />
                    <div>
                      <h4 className="font-semibold text-white">{name}</h4>
                      <p className="text-sm text-white/60">Connect to earn 25 XP</p>
                    </div>
                  </div>
                  
                  {connectedPlatforms.includes(platform) ? (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handleConnectSocial(platform)}
                      disabled={isLoading}
                      size="sm"
                      className="veri-gradient"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => setStep(3)}
            className="w-full veri-gradient font-semibold"
            disabled={connectedPlatforms.length === 0}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start earning points through authentic engagement",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              You're All Set!
            </h3>
            <p className="text-white/60">
              You've successfully connected {connectedPlatforms.length} platform(s) and earned{" "}
              {25 + connectedPlatforms.length * 25} XP points!
            </p>
          </div>

          <div className="glass-effect p-4 rounded-lg border border-white/20">
            <h4 className="font-semibold text-white mb-2">What's Next?</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>• Complete tasks to earn more XP points</li>
              <li>• Build your creator profile</li>
              <li>• Climb the leaderboard</li>
              <li>• Unlock AI agent features with higher streak</li>
            </ul>
          </div>

          <Button 
            onClick={handleComplete}
            className="w-full veri-gradient font-semibold"
          >
            Start Using Veri
          </Button>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];
  const progress = (step / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass-effect border-white/20 bg-gray-900/95">
        <DialogHeader>
          <DialogTitle className="text-white">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-white/60">{currentStep.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Step {step} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {currentStep.content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
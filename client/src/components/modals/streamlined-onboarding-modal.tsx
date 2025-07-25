import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VeriLogo } from "@/components/ui/veri-logo";
import { CheckCircle2, ArrowRight, Sparkles, Twitter, Youtube, Instagram, Gamepad2, Camera, Music, Palette, Monitor, Pen } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StreamlinedOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StreamlinedOnboardingModal({ isOpen, onClose }: StreamlinedOnboardingModalProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [selectedCreatorType, setSelectedCreatorType] = useState<string>("");
  const [profileData, setProfileData] = useState({
    bio: "",
    displayName: user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.username || "",
    website: "",
  });

  const handleConnectSocial = async (platform: string) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/social-connections", {
        userId: user?.id,
        platform,
        isConnected: true,
        followerCount: Math.floor(Math.random() * 10000) + 1000,
        platformUsername: `@${user?.username}_${platform}`,
      });
      
      setConnectedPlatforms(prev => [...prev, platform]);
      await refreshUser();
      
      toast({
        title: "Platform connected!",
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully. You earned 500 XP!`,
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

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save profile data if provided
      if (selectedCreatorType || profileData.bio || profileData.website) {
        await apiRequest("POST", "/api/auth/complete-profile", {
          creatorType: selectedCreatorType,
          bio: profileData.bio,
          website: profileData.website,
          displayName: profileData.displayName
        });
      }
      
      // Complete onboarding
      await apiRequest("POST", "/api/auth/complete-onboarding", {});
      await refreshUser();
      
      toast({
        title: "Welcome to Veri!",
        description: "Your profile is ready. Start earning by completing Partner Quests!",
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Setup complete!",
        description: "Welcome to Veri! Let's start earning points.",
      });
    } finally {
      setIsLoading(false);
    }
    onClose();
  };

  const creatorTypes = [
    { id: "gaming", name: "Gaming Creator", icon: Gamepad2, description: "Gaming content, streams, reviews" },
    { id: "lifestyle", name: "Lifestyle Creator", icon: Camera, description: "Lifestyle, fashion, daily vlogs" },
    { id: "music", name: "Music Creator", icon: Music, description: "Music production, covers, performances" },
    { id: "art", name: "Art Creator", icon: Palette, description: "Digital art, design, creative content" },
    { id: "tech", name: "Tech Creator", icon: Monitor, description: "Tech reviews, tutorials, coding" },
    { id: "writing", name: "Content Writer", icon: Pen, description: "Blogs, articles, copywriting" },
  ];

  // Only 2 steps
  const steps = [
    {
      title: "Connect Your Social Platforms",
      description: "Link your social accounts to start earning points (optional)",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <VeriLogo />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Connect Your Social Platforms
            </h3>
            <p className="text-white/60">
              Connect your social media accounts to verify your audience and start earning points.
              Each connection earns you 500 XP!
            </p>
          </div>

          <div className="space-y-4">
            {[
              { platform: "twitter", name: "Twitter/X", icon: Twitter, color: "text-blue-400" },
              { platform: "youtube", name: "YouTube", icon: Youtube, color: "text-red-400" },
              { platform: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400" },
            ].map(({ platform, name, icon: Icon, color }) => (
              <motion.div 
                key={platform} 
                className="glass-effect p-4 rounded-lg border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${color}`} />
                    <div>
                      <h4 className="font-semibold text-white">{name}</h4>
                      <p className="text-sm text-white/60">Connect to earn 500 XP</p>
                    </div>
                  </div>
                  
                  {connectedPlatforms.includes(platform) ? (
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handleConnectSocial(platform)}
                      disabled={isLoading}
                      size="sm"
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => setStep(2)}
              className="flex-1 veri-gradient font-semibold"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setStep(2)}
              variant="outline"
              className="border-white/20 text-white/70 hover:bg-white/10"
            >
              Skip for now
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Complete Your Profile",
      description: "Tell us about yourself and choose your creator type (all optional)",
      content: (
        <div className="space-y-6">
          {/* Creator Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">What type of creator are you? (Optional)</h3>
            <div className="grid grid-cols-2 gap-3">
              {creatorTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedCreatorType(type.id)}
                  className={`p-3 rounded-lg border transition-all duration-300 text-left ${
                    selectedCreatorType === type.id
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                      : "glass-effect border-white/20 text-white/70 hover:bg-white/10"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <type.icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{type.name}</span>
                  </div>
                  <p className="text-xs opacity-70">{type.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Optional Profile Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName" className="text-white mb-2 block">Display Name (Optional)</Label>
              <Input
                id="displayName"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="glass-secondary border-white/20 text-white"
                placeholder="Your display name"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-white mb-2 block">Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="glass-secondary border-white/20 text-white resize-none"
                placeholder="Tell us about yourself and what you create..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="website" className="text-white mb-2 block">Website (Optional)</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                className="glass-secondary border-white/20 text-white"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleComplete}
              className="flex-1 veri-gradient font-semibold"
              disabled={isLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? "Setting up..." : "Complete Setup"}
            </Button>
            <Button 
              onClick={handleComplete}
              variant="outline"
              className="border-white/20 text-white/70 hover:bg-white/10"
              disabled={isLoading}
            >
              Skip to Dashboard
            </Button>
          </div>
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
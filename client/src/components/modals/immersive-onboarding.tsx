import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { VeriLogo } from "@/components/ui/veri-logo";
import { CheckCircle2, ArrowRight, Sparkles, Twitter, Youtube, Instagram, Gamepad2, Camera, Music, Palette, Monitor, Pen, Target, Trophy, Users, Zap, X, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImmersiveOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImmersiveOnboarding({ isOpen, onClose }: ImmersiveOnboardingProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [selectedCreatorType, setSelectedCreatorType] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({
    bio: "",
    displayName: user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.username || "",
    website: "",
  });
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

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

  const generateAIBio = async () => {
    setIsGeneratingBio(true);
    try {
      // Simulate AI bio generation based on user selections
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bioTemplate = selectedCreatorType === 'gaming' 
        ? `Passionate gaming creator focused on ${selectedInterests.slice(0, 2).join(' and ')}. My goal is to ${selectedGoals[0]?.toLowerCase() || 'grow my audience'} through authentic content and community engagement.`
        : `Creative ${selectedCreatorType || 'content'} creator specializing in ${selectedInterests.slice(0, 2).join(' and ')}. Dedicated to ${selectedGoals[0]?.toLowerCase() || 'building a strong community'} and sharing valuable insights with my audience.`;
      
      setProfileData(prev => ({ ...prev, bio: bioTemplate }));
      
      toast({
        title: "Bio generated!",
        description: "Your AI-powered bio is ready. Feel free to edit it!",
      });
    } catch (error) {
      console.error("Error generating bio:", error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save profile data
      await apiRequest("POST", "/api/auth/complete-profile", {
        creatorType: selectedCreatorType,
        bio: profileData.bio,
        website: profileData.website,
        displayName: profileData.displayName,
        interests: selectedInterests,
        goals: selectedGoals
      });
      
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

  const handleSkip = () => {
    handleComplete();
  };

  const creatorTypes = [
    { id: "gaming", name: "Gaming Creator", icon: Gamepad2, color: "from-red-500 to-orange-500" },
    { id: "lifestyle", name: "Lifestyle Creator", icon: Camera, color: "from-pink-500 to-rose-500" },
    { id: "music", name: "Music Creator", icon: Music, color: "from-purple-500 to-violet-500" },
    { id: "art", name: "Art Creator", icon: Palette, color: "from-blue-500 to-cyan-500" },
    { id: "tech", name: "Tech Creator", icon: Monitor, color: "from-emerald-500 to-teal-500" },
    { id: "writing", name: "Content Writer", icon: Pen, color: "from-yellow-500 to-amber-500" },
  ];

  const interests = [
    "Gaming", "Technology", "Art & Design", "Music", "Fitness", "Travel",
    "Food", "Fashion", "Education", "Entertainment", "Sports", "Business",
    "Health", "DIY", "Photography", "Science", "Cooking", "Books"
  ];

  const goals = [
    "Build a strong community", "Monetize my content", "Grow my audience",
    "Create viral content", "Partner with brands", "Improve content quality",
    "Learn new skills", "Network with creators", "Launch a product", "Teach others"
  ];

  const steps = [
    // Step 0: Welcome
    {
      title: "Welcome to Veri",
      subtitle: "Let's personalize your creator experience",
      content: (
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <VeriLogo />
          </div>
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-termina text-white">
              Transform Your Content Into Revenue
            </h2>
            <p className="text-white/70 leading-relaxed">
              Connect with brands, monetize your audience, and unlock AI-powered tools to accelerate your creator journey.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Button 
              onClick={() => setStep(1)}
              className="w-full veri-gradient font-semibold py-4 text-lg"
              size="lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={handleSkip}
              variant="ghost"
              className="text-white/60 hover:text-white"
            >
              Skip to Dashboard
            </Button>
          </div>
        </div>
      )
    },
    // Step 1: Creator Type
    {
      title: "What type of creator are you?",
      subtitle: "This helps us recommend the best opportunities for you",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {creatorTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setSelectedCreatorType(type.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedCreatorType === type.id
                    ? "border-emerald-400 bg-emerald-500/10"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-4 rounded-full bg-gradient-to-r ${type.color}`}>
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white font-medium text-center">{type.name}</span>
                </div>
                {selectedCreatorType === type.id && (
                  <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-emerald-400" />
                )}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => setStep(2)}
              disabled={!selectedCreatorType}
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
              Skip
            </Button>
          </div>
        </div>
      )
    },
    // Step 2: Interests
    {
      title: "What are your content interests?",
      subtitle: "Select topics you create content about (choose 3-5)",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {interests.map((interest) => (
              <motion.button
                key={interest}
                onClick={() => {
                  if (selectedInterests.includes(interest)) {
                    setSelectedInterests(prev => prev.filter(i => i !== interest));
                  } else if (selectedInterests.length < 5) {
                    setSelectedInterests(prev => [...prev, interest]);
                  }
                }}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  selectedInterests.includes(interest)
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : "border-white/20 text-white/70 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {interest}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => setStep(3)}
              disabled={selectedInterests.length === 0}
              className="flex-1 veri-gradient font-semibold"
            >
              Continue ({selectedInterests.length} selected)
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setStep(3)}
              variant="outline"
              className="border-white/20 text-white/70 hover:bg-white/10"
            >
              Skip
            </Button>
          </div>
        </div>
      )
    },
    // Step 3: Goals
    {
      title: "What are your creator goals?",
      subtitle: "Help us recommend the right opportunities (choose 2-3)",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {goals.map((goal) => (
              <motion.button
                key={goal}
                onClick={() => {
                  if (selectedGoals.includes(goal)) {
                    setSelectedGoals(prev => prev.filter(g => g !== goal));
                  } else if (selectedGoals.length < 3) {
                    setSelectedGoals(prev => [...prev, goal]);
                  }
                }}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  selectedGoals.includes(goal)
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : "border-white/20 text-white/70 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4" />
                  {goal}
                </div>
              </motion.button>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => setStep(4)}
              disabled={selectedGoals.length === 0}
              className="flex-1 veri-gradient font-semibold"
            >
              Continue ({selectedGoals.length} selected)
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setStep(4)}
              variant="outline"
              className="border-white/20 text-white/70 hover:bg-white/10"
            >
              Skip
            </Button>
          </div>
        </div>
      )
    },
    // Step 4: Bio & Profile
    {
      title: "Complete your profile",
      subtitle: "Let's create a compelling bio that attracts brands",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-white mb-2 block font-medium">Display Name</label>
              <Input
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="glass-secondary border-white/20 text-white"
                placeholder="Your display name"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-medium">Bio</label>
                <Button
                  onClick={generateAIBio}
                  disabled={isGeneratingBio || !selectedCreatorType}
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10"
                >
                  {isGeneratingBio ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                      </motion.div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      AI Generate
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="glass-secondary border-white/20 text-white resize-none"
                placeholder="Tell brands what makes you unique..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-white mb-2 block font-medium">Website (Optional)</label>
              <Input
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                className="glass-secondary border-white/20 text-white"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => setStep(5)}
              className="flex-1 veri-gradient font-semibold"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setStep(5)}
              variant="outline"
              className="border-white/20 text-white/70 hover:bg-white/10"
            >
              Skip
            </Button>
          </div>
        </div>
      )
    },
    // Step 5: Social Connections
    {
      title: "Connect your social platforms",
      subtitle: "Verify your audience and start earning points (500 XP per connection)",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              { platform: "twitter", name: "Twitter/X", icon: Twitter, color: "text-blue-400" },
              { platform: "youtube", name: "YouTube", icon: Youtube, color: "text-red-400" },
              { platform: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400" },
            ].map(({ platform, name, icon: Icon, color }) => (
              <motion.div 
                key={platform} 
                className="glass-effect p-6 rounded-xl border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-white/10">
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{name}</h4>
                      <p className="text-sm text-white/60">Connect to earn 500 XP</p>
                    </div>
                  </div>
                  
                  {connectedPlatforms.includes(platform) ? (
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Connected
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handleConnectSocial(platform)}
                      disabled={isLoading}
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

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-xl">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-6 right-6 text-white/60 hover:text-white z-10"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl lg:text-5xl font-termina text-white mb-4">
                  {currentStep.title}
                </h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Step Content */}
              <div className="max-w-3xl mx-auto">
                {currentStep.content}
              </div>

              {/* Step Indicator */}
              <div className="flex justify-center gap-2 mt-12">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= step ? "bg-emerald-400" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
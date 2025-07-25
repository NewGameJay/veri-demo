import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VeriLogo } from "@/components/ui/veri-logo";
import { ArrowRight, ArrowLeft, X, Sparkles, Zap, Users, Target, Twitter, Youtube, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InterestSelector } from "@/components/profile/interest-selector";
import { VeriScoreReveal } from "./veriscore-reveal";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { triggerHaptic } from "@/lib/haptic";
import { useToast } from "@/hooks/use-toast";

interface ConsolidatedOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  onShowDashboardTour?: () => void;
}

type OnboardingStep = 'welcome' | 'profile-setup' | 'social';

const creatorTypes = [
  {
    id: 'gaming',
    label: 'Gaming Creator',
    emoji: '🎮',
    description: 'Twitch streams, YouTube gaming, esports content'
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle Influencer',
    emoji: '✨',
    description: 'Fashion, beauty, wellness, daily life content'
  },
  {
    id: 'business',
    label: 'Business Creator',
    emoji: '💼',
    description: 'Entrepreneurship, finance, productivity content'
  },
  {
    id: 'education',
    label: 'Educational Creator',
    emoji: '📚',
    description: 'Tutorials, courses, skill development content'
  },
  {
    id: 'entertainment',
    label: 'Entertainment Creator',
    emoji: '🎭',
    description: 'Comedy, music, arts, viral content'
  },
  {
    id: 'tech',
    label: 'Tech Creator',
    emoji: '💻',
    description: 'Reviews, coding, AI, digital innovation'
  }
];

export function ConsolidatedOnboarding({ isOpen, onComplete, onShowDashboardTour }: ConsolidatedOnboardingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isCompleting, setIsCompleting] = useState(false);
  const [showVeriScoreReveal, setShowVeriScoreReveal] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  
  // Form data
  const [creatorType, setCreatorType] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  const goalOptions = [
    { id: 'monetize', label: 'Monetize Content', icon: '💰' },
    { id: 'grow-audience', label: 'Grow Audience', icon: '📈' },
    { id: 'brand-deals', label: 'Brand Partnerships', icon: '🤝' },
    { id: 'optimize-content', label: 'Optimize Content', icon: '⚡' },
    { id: 'analytics', label: 'Better Analytics', icon: '📊' },
    { id: 'automation', label: 'Automate Workflows', icon: '🤖' }
  ];

  const handleNext = () => {
    triggerHaptic('light');
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('profile-setup');
        break;
      case 'profile-setup':
        if (!creatorType || interests.length === 0 || goals.length === 0) {
          toast({
            title: "Complete your profile",
            description: "Please fill in all required fields to continue.",
            variant: "destructive",
          });
          return;
        }
        setCurrentStep('social');
        break;
      case 'social':
        handleComplete();
        break;
    }
  };

  const handleBack = () => {
    triggerHaptic('light');
    switch (currentStep) {
      case 'profile-setup':
        setCurrentStep('welcome');
        break;
      case 'social':
        setCurrentStep('profile-setup');
        break;
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    if (currentStep === 'social') {
      handleComplete();
    } else {
      setCurrentStep('social');
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Save onboarding data
      await apiRequest(`/api/users/${user?.id}/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorType,
          interests,
          goals,
          bio: `${creatorTypes.find(t => t.id === creatorType)?.emoji} ${creatorTypes.find(t => t.id === creatorType)?.label} | ${interests.slice(0, 3).join(', ')} | ${goals.slice(0, 2).join(' & ')}`
        })
      });

      triggerHaptic('success');
      setShowVeriScoreReveal(true);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      triggerHaptic('error');
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleVeriScoreComplete = () => {
    setShowVeriScoreReveal(false);
    onComplete();
    // Show dashboard tour after a short delay
    setTimeout(() => {
      onShowDashboardTour?.();
    }, 500);
  };

  // Demo social media connection
  const handleDemoSocialConnect = (platform: string) => {
    triggerHaptic('success');
    setConnectedPlatforms(prev => [...prev, platform]);
    
    // Generate fake follower numbers
    const fakeFollowers = {
      'twitter': Math.floor(Math.random() * 50000) + 5000,
      'youtube': Math.floor(Math.random() * 100000) + 10000,
      'instagram': Math.floor(Math.random() * 75000) + 8000
    };

    toast({
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Connected!`,
      description: `${fakeFollowers[platform as keyof typeof fakeFollowers]?.toLocaleString()} followers detected`,
      variant: "default",
    });

    // Auto-advance after connecting one platform
    setTimeout(() => {
      handleComplete();
    }, 1500);
  };

  if (!isOpen) return null;

  const stepOrder: OnboardingStep[] = ['welcome', 'profile-setup', 'social'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {currentStep !== 'welcome' && (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-sm font-medium">
              Step {currentStepIndex + 1} of {stepOrder.length}
            </span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {currentStep !== 'welcome' && (
            <Button
              onClick={handleSkip}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Skip
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)] overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-4xl"
            >
              {/* Welcome Step */}
              {currentStep === 'welcome' && (
                <div className="text-center space-y-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  >
                    <VeriLogo className="w-24 h-24 mx-auto mb-6" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-termina text-white mb-4 flex items-center justify-center gap-4 flex-wrap">
                      Welcome to 
                      <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                        <VeriLogo className="h-10 w-auto" />
                        <span className="veri-gradient bg-clip-text text-transparent font-termina">Veri</span>
                      </div>
                    </h1>
                    <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                      Set up your creator profile in just 2 quick steps and start earning with authentic engagement tasks.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="veri-gradient text-lg px-8 py-6"
                    >
                      Let's Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Consolidated Profile Setup Step */}
              {currentStep === 'profile-setup' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-termina text-white mb-4">Set Up Your Creator Profile</h2>
                    <p className="text-white/70 text-lg">Tell us about yourself to get personalized opportunities</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Creator Type Selection */}
                    <Card className="glass-effect border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-emerald-400" />
                          What type of creator are you?
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {creatorTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              onClick={() => setCreatorType(type.id)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                creatorType === type.id
                                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{type.emoji}</span>
                                <div>
                                  <div className="text-white font-medium">{type.label}</div>
                                  <div className="text-white/60 text-sm mt-1">{type.description}</div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Interests & Goals */}
                    <div className="space-y-6">
                      {/* Interests */}
                      <Card className="glass-effect border-white/20">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-emerald-400" />
                            Your Interests
                          </h3>
                          <p className="text-white/60 text-sm mb-4">Select 3-5 interests that describe your content</p>
                          <InterestSelector
                            interests={interests}
                            onChange={setInterests}
                            maxSelections={5}
                            minSelections={3}
                          />
                        </CardContent>
                      </Card>

                      {/* Goals */}
                      <Card className="glass-effect border-white/20">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-emerald-400" />
                            Your Goals
                          </h3>
                          <p className="text-white/60 text-sm mb-4">Choose 2-3 goals for using Veri</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {goalOptions.map((goal) => (
                              <motion.button
                                key={goal.id}
                                onClick={() => {
                                  if (goals.includes(goal.id)) {
                                    setGoals(goals.filter(g => g !== goal.id));
                                  } else if (goals.length < 3) {
                                    setGoals([...goals, goal.id]);
                                  }
                                }}
                                disabled={!goals.includes(goal.id) && goals.length >= 3}
                                className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                                  goals.includes(goal.id)
                                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                                    : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                                whileHover={{ scale: goals.includes(goal.id) || goals.length < 3 ? 1.02 : 1 }}
                                whileTap={{ scale: goals.includes(goal.id) || goals.length < 3 ? 0.98 : 1 }}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{goal.icon}</span>
                                  <span className="text-white font-medium">{goal.label}</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                          <p className="text-emerald-400 text-sm mt-3">
                            {goals.length}/3 goals selected
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleNext}
                      disabled={!creatorType || interests.length < 3 || goals.length === 0}
                      size="lg"
                      className="veri-gradient px-8 py-3"
                    >
                      Continue to Social Connections
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Social Connections Step */}
              {currentStep === 'social' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-termina text-white mb-4">Connect Your Social Media</h2>
                    <p className="text-white/70 text-lg">Connect at least one platform to calculate your VeriScore</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {/* Twitter/X */}
                    <Card className="glass-effect border-white/20 hover:border-blue-500/30 transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Twitter className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Twitter / X</h3>
                        <p className="text-white/60 text-sm mb-4">Connect your X account</p>
                        <Button
                          onClick={() => handleDemoSocialConnect('twitter')}
                          disabled={connectedPlatforms.includes('twitter')}
                          className={connectedPlatforms.includes('twitter') 
                            ? "bg-emerald-500 hover:bg-emerald-600" 
                            : "bg-blue-500 hover:bg-blue-600"
                          }
                          size="sm"
                        >
                          {connectedPlatforms.includes('twitter') ? 'Connected ✓' : 'Connect'}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* YouTube */}
                    <Card className="glass-effect border-white/20 hover:border-red-500/30 transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Youtube className="h-8 w-8 text-red-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">YouTube</h3>
                        <p className="text-white/60 text-sm mb-4">Connect your YouTube channel</p>
                        <Button
                          onClick={() => handleDemoSocialConnect('youtube')}
                          disabled={connectedPlatforms.includes('youtube')}
                          className={connectedPlatforms.includes('youtube') 
                            ? "bg-emerald-500 hover:bg-emerald-600" 
                            : "bg-red-500 hover:bg-red-600"
                          }
                          size="sm"
                        >
                          {connectedPlatforms.includes('youtube') ? 'Connected ✓' : 'Connect'}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Instagram */}
                    <Card className="glass-effect border-white/20 hover:border-pink-500/30 transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Instagram className="h-8 w-8 text-pink-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Instagram</h3>
                        <p className="text-white/60 text-sm mb-4">Connect your Instagram</p>
                        <Button
                          onClick={() => handleDemoSocialConnect('instagram')}
                          disabled={connectedPlatforms.includes('instagram')}
                          className={connectedPlatforms.includes('instagram') 
                            ? "bg-emerald-500 hover:bg-emerald-600" 
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          }
                          size="sm"
                        >
                          {connectedPlatforms.includes('instagram') ? 'Connected ✓' : 'Connect'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-6">
                      {connectedPlatforms.length > 0 
                        ? `Great! ${connectedPlatforms.length} platform${connectedPlatforms.length > 1 ? 's' : ''} connected. Ready to reveal your VeriScore!`
                        : "Connect at least one platform to continue"
                      }
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={handleSkip}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Skip for Now
                      </Button>
                      
                      <Button
                        onClick={handleComplete}
                        disabled={isCompleting}
                        size="lg"
                        className="veri-gradient px-8 py-3"
                      >
                        {isCompleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Completing...
                          </>
                        ) : (
                          <>
                            Reveal My VeriScore
                            <Sparkles className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* VeriScore Reveal Modal */}
      <VeriScoreReveal
        isOpen={showVeriScoreReveal}
        onComplete={handleVeriScoreComplete}
        userScore={connectedPlatforms.length > 0 ? 85 : 65}
        userName={user?.username}
      />
    </div>
  );
}
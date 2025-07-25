import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VeriLogo } from "@/components/ui/veri-logo";
import { ArrowRight, ArrowLeft, X, Star, Trophy, Target, Users, Zap, Settings, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface TourTriggerProps {
  onOpenTour: () => void;
}

export function TourTrigger({ onOpenTour }: TourTriggerProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5, ease: "easeOut" }}
    >
      <motion.button
        onClick={onOpenTour}
        className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing ring animation */}
        <motion.div
          className="absolute inset-0 bg-emerald-400 rounded-full opacity-30"
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        
        <HelpCircle className="h-6 w-6 relative z-10" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Take a quick tour
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </motion.button>
    </motion.div>
  );
}

export function InteractiveTour({ isOpen, onClose, onComplete }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const tourSteps = [
    {
      title: "Welcome to Veri!",
      description: "Let's take a quick tour of your creator dashboard and show you how to start earning points.",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <VeriLogo />
          </div>
          <p className="text-white/80">
            Your creator dashboard is designed to help you monetize your content and grow your audience. 
            This quick tour will show you everything you need to know.
          </p>
        </div>
      )
    },
    {
      title: "Your VeriScore Card",
      description: "Track your reputation and earnings in real-time",
      icon: Star,
      content: (
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-5 w-5 text-emerald-400" />
              <span className="text-white font-semibold">VeriScore: 85</span>
              <Badge className="bg-emerald-500/20 text-emerald-300">Diamond</Badge>
            </div>
            <p className="text-white/70 text-sm">
              Your VeriScore reflects your reputation and engagement quality. Higher scores unlock better opportunities!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Partner Quests & Tasks",
      description: "Complete tasks to earn XP and unlock features",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Partner Quest: Share Your Profile</span>
              <Badge className="bg-emerald-500/20 text-emerald-300">+10,000 XP</Badge>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Share your Veri profile on social media to unlock AI Agent tooling
            </p>
            <Button size="sm" className="veri-gradient">
              Start Quest
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Social Connections",
      description: "Connect your platforms to verify your audience",
      icon: Users,
      content: (
        <div className="space-y-3">
          {["Twitter", "YouTube", "Instagram"].map((platform) => (
            <div key={platform} className="glass-effect p-3 rounded-lg border border-white/20 flex items-center justify-between">
              <span className="text-white">{platform}</span>
              <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-300">
                Connect
              </Button>
            </div>
          ))}
          <p className="text-white/70 text-sm">
            Each platform connection earns you 500 XP and helps brands discover you!
          </p>
        </div>
      )
    },
    {
      title: "Global Leaderboard",
      description: "See how you rank against other creators worldwide",
      icon: Trophy,
      content: (
        <div className="space-y-3">
          <div className="glass-effect p-4 rounded-lg border border-yellow-500/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white">Your Rank</span>
                <Badge className="bg-yellow-500/20 text-yellow-300">#247</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Tier</span>
                <span className="text-yellow-300">Gold</span>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-sm">
            Climb the ranks by completing tasks and maintaining engagement!
          </p>
        </div>
      )
    },
    {
      title: "AI Agent Studio",
      description: "Unlock AI-powered content optimization tools",
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-purple-400" />
              <span className="text-white font-semibold">AI Content Optimizer</span>
              <Badge className="bg-orange-500/20 text-orange-300">Locked</Badge>
            </div>
            <p className="text-white/70 text-sm">
              Complete the Partner Quest to unlock AI agents that help optimize your content for maximum engagement!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Campaign Explorer",
      description: "Discover sponsored collaboration opportunities",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg border border-pink-500/30">
            <h4 className="text-white font-semibold mb-2">Featured Campaigns</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Gaming Content</span>
                <Badge className="bg-green-500/20 text-green-300">$500</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Tech Reviews</span>
                <Badge className="bg-blue-500/20 text-blue-300">$750</Badge>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start your creator journey and earn your first XP",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-emerald-500/20 p-4 rounded-full">
              <Sparkles className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <p className="text-white/80">
            You're ready to start earning! Begin with the Partner Quest to unlock AI features, 
            then explore campaigns and connect your social platforms.
          </p>
          <div className="glass-effect p-3 rounded-lg border border-emerald-500/30">
            <p className="text-emerald-300 font-semibold">Pro Tip: Complete daily tasks to maintain your streak and earn bonus XP!</p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-2xl glass-effect border border-white/20 rounded-2xl p-8"
      >
        {/* Header */}
        <div className="relative pb-6">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500/20 p-3 rounded-full">
                <currentStepData.icon className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-2xl font-termina text-white mb-2">
              {currentStepData.title}
            </h1>
            <p className="text-white/70 mb-4">{currentStepData.description}</p>
            
            <div className="flex justify-center gap-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-emerald-400"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div 
                className="bg-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step Description */}
          <p className="text-white/60">{currentStepData.description}</p>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="border-white/20 text-white/70 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="flex-1 veri-gradient font-semibold"
            >
              {isLastStep ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Creating!
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {!isLastStep && (
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="text-white/60 hover:text-white"
              >
                Skip Tour
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
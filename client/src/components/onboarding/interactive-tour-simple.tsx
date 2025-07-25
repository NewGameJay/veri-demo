import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VeriLogo } from "@/components/ui/veri-logo";
import { ArrowRight, ArrowLeft, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
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
      description: "Let's take a quick tour of your creator dashboard.",
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
      content: (
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg border border-emerald-500/30">
            <h4 className="text-white font-semibold mb-2">VeriScore Features</h4>
            <div className="space-y-2 text-white/80">
              <p>• Real-time reputation tracking</p>
              <p>• XP points from completed tasks</p>
              <p>• Progress towards unlock goals</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Complete Partner Quests",
      description: "Earn XP and unlock AI features by completing tasks",
      content: (
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg border border-blue-500/30">
            <h4 className="text-white font-semibold mb-2">Partner Quest: Share Your Profile</h4>
            <p className="text-white/80 mb-3">
              Share your Veri profile on social media to earn 10,000 XP and unlock AI agents!
            </p>
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <p className="text-emerald-300 font-semibold">Reward: 10,000 XP + AI Agent Unlock</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Social Media Connections",
      description: "Connect your platforms to verify your audience",
      content: (
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg border border-purple-500/30">
            <h4 className="text-white font-semibold mb-2">Connect Your Platforms</h4>
            <div className="space-y-2 text-white/80">
              <p>• Verify your audience size</p>
              <p>• Unlock brand collaboration opportunities</p>
              <p>• Earn 500 XP per connection</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start your creator journey and build your profile",
      content: (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-emerald-500/20 p-4 rounded-full">
              <Sparkles className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <p className="text-white/80">
            Most features are locked until you complete your profile. 
            Head to the Profile tab to add your interests, goals, and content details!
          </p>
          <div className="glass-effect p-3 rounded-lg border border-emerald-500/30">
            <p className="text-emerald-300 font-semibold">Pro Tip: Complete your profile to unlock all dashboard features!</p>
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
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    handleComplete();
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
        
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {currentStepData.content}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex gap-2">
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
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="border-white/20 text-white/70 hover:bg-white/10"
            >
              Skip Tour
            </Button>
            <Button
              onClick={handleNext}
              className="veri-gradient font-semibold"
            >
              {isLastStep ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build Profile
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
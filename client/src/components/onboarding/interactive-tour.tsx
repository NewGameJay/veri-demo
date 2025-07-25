import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  TrendingUp, 
  Zap, 
  Users, 
  BarChart3, 
  Bot, 
  User, 
  Target,
  Sparkles,
  Play
} from "lucide-react";
import { VeriLogo } from "@/components/ui/veri-logo";

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function InteractiveTour({ isOpen, onClose, onComplete }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: "Welcome to Your Dashboard!",
      description: "Let's take a quick tour of your creator command center",
      icon: Sparkles,
      content: "This is where you'll manage your entire creator journey - from completing tasks to tracking your growth and connecting with brands.",
      action: "Let's explore"
    },
    {
      title: "VeriScore & Points",
      description: "Track your creator reputation and XP",
      icon: TrendingUp,
      content: "Your VeriScore shows your credibility as a creator. Complete tasks and connect social platforms to earn XP and increase your score.",
      action: "Next: Tasks"
    },
    {
      title: "Task Verification",
      description: "Complete tasks to earn XP and unlock features",
      icon: Zap,
      content: "Tasks are quick actions that help you grow your audience and earn points. Your first Partner Quest task is to share your Veri profile!",
      action: "Next: Campaigns"
    },
    {
      title: "Campaign Explorer",
      description: "Discover brand collaboration opportunities",
      icon: Target,
      content: "Build a 3-day task streak to unlock Veri+ Creator status and access high-paying brand campaigns. Filter by your interests!",
      action: "Next: Analytics"
    },
    {
      title: "Analytics Dashboard",
      description: "Track your content performance across platforms",
      icon: BarChart3,
      content: "View your content metrics, audience insights, and revenue tracking all in one place. See what's working best for your brand.",
      action: "Next: AI Agents"
    },
    {
      title: "AI Agent Studio",
      description: "Get AI-powered insights for your content",
      icon: Bot,
      content: "Launch AI agents to optimize your content strategy, analyze engagement patterns, and get personalized recommendations.",
      action: "Next: Profile"
    },
    {
      title: "Profile Builder",
      description: "Showcase your creator brand to the world",
      icon: User,
      content: "Build your public Veri profile with custom URLs, featured content, and social connections. Share it to attract collaborations!",
      action: "Next: Community"
    },
    {
      title: "Community & Leaderboard",
      description: "Connect with other creators and compete",
      icon: Users,
      content: "Climb the global leaderboard, see top performers, and connect with fellow creators in your niche.",
      action: "Start creating!"
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentTour = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass-effect border-white/20 bg-gray-900/95">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VeriLogo />
              <DialogTitle className="text-white">Interactive Tour</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Tour Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <currentTour.icon className="h-8 w-8 text-emerald-400" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {currentTour.title}
                </h3>
                
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 mb-3">
                  {currentTour.description}
                </Badge>
                
                <p className="text-white/70 leading-relaxed">
                  {currentTour.content}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-white/20 text-white/70 hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-emerald-500"
                      : index < currentStep
                      ? "bg-emerald-500/50"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="veri-gradient font-semibold"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {currentTour.action}
                </>
              ) : (
                <>
                  {currentTour.action}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-white/50 hover:text-white/70 text-sm"
            >
              Skip tour and explore on my own
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Persistent Tour Trigger Component for bottom-right corner
interface TourTriggerProps {
  onOpenTour: () => void;
}

export function TourTrigger({ onOpenTour }: TourTriggerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={onOpenTour}
        className="glass-effect border border-emerald-500/30 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-500/25 rounded-full p-3"
        size="sm"
      >
        <Play className="h-4 w-4 mr-2" />
        Tour
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-gray-800 hover:bg-gray-700 text-white/60 hover:text-white"
      >
        <X className="h-3 w-3" />
      </Button>
    </motion.div>
  );
}
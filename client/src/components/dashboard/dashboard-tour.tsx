import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowLeft, ArrowRight, User, Zap, Briefcase, Bot, BarChart3, Share2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";

interface DashboardTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string; // CSS selector for highlighting
  action?: string;
  actionIcon?: React.ReactNode;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Creator Dashboard",
    description: "Let's take a quick tour to help you get the most out of Veri. This will only take 2 minutes.",
    icon: <Zap className="h-6 w-6" />,
    target: "",
  },
  {
    id: "profile",
    title: "Profile Builder",
    description: "Complete your creator profile to unlock opportunities. A complete profile gets 3x more campaign invitations.",
    icon: <User className="h-6 w-6" />,
    target: "[data-tour='profile-builder']",
    action: "Complete Profile",
    actionIcon: <User className="h-4 w-4" />,
  },
  {
    id: "questing",
    title: "Questing System",
    description: "Complete micro-tasks to earn XP and VeriScore points. Start with simple tasks like connecting social media.",
    icon: <Zap className="h-6 w-6" />,
    target: "[data-tour='questing']",
    action: "View Tasks",
    actionIcon: <Zap className="h-4 w-4" />,
  },
  {
    id: "campaigns",
    title: "Brand Campaigns",
    description: "Apply to sponsored campaigns from top brands. Higher VeriScore = better opportunities.",
    icon: <Briefcase className="h-6 w-6" />,
    target: "[data-tour='campaigns']",
    action: "Browse Campaigns",
    actionIcon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: "ai-agent",
    title: "AI Agent Studio",
    description: "Get personalized insights and optimization recommendations to grow your creator business.",
    icon: <Bot className="h-6 w-6" />,
    target: "[data-tour='ai-agent']",
    action: "Launch AI Agent",
    actionIcon: <Bot className="h-4 w-4" />,
  },
  {
    id: "analytics",
    title: "Creator Analytics",
    description: "Track your performance across platforms and see detailed insights about your audience and content.",
    icon: <BarChart3 className="h-6 w-6" />,
    target: "[data-tour='analytics']",
    action: "View Analytics",
    actionIcon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "share-profile",
    title: "Share Your Profile",
    description: "Ready to start? Complete your profile setup and share it to earn your first 1000 XP bonus!",
    icon: <Share2 className="h-6 w-6" />,
    target: "[data-tour='profile-builder']",
    action: "Complete & Share Profile",
    actionIcon: <Share2 className="h-4 w-4" />,
  },
];

export function DashboardTour({ isOpen, onComplete, onClose }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    if (isOpen && currentStep > 0) {
      // Add highlight to target element
      const targetElement = document.querySelector(tourSteps[currentStep].target);
      if (targetElement) {
        targetElement.classList.add('tour-highlight');
        setShowHighlight(true);
      }
    }

    return () => {
      // Clean up highlights
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      setShowHighlight(false);
    };
  }, [currentStep, isOpen]);

  const handleNext = () => {
    triggerHaptic('light');
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    triggerHaptic('light');
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    onClose();
  };

  const handleComplete = () => {
    triggerHaptic('success');
    onComplete();
  };

  const handleAction = () => {
    const step = tourSteps[currentStep];
    triggerHaptic('success');
    
    // Navigate to specific sections based on step
    switch (step.id) {
      case "profile":
      case "share-profile":
        // Trigger profile builder
        const profileTab = document.querySelector('[data-tour="profile-builder"]');
        if (profileTab) {
          (profileTab as HTMLElement).click();
        }
        break;
      case "questing":
        // Switch to questing tab
        const questingTab = document.querySelector('[data-tour="questing"]');
        if (questingTab) {
          (questingTab as HTMLElement).click();
        }
        break;
      case "campaigns":
        const campaignsTab = document.querySelector('[data-tour="campaigns"]');
        if (campaignsTab) {
          (campaignsTab as HTMLElement).click();
        }
        break;
      case "ai-agent":
        const aiTab = document.querySelector('[data-tour="ai-agent"]');
        if (aiTab) {
          (aiTab as HTMLElement).click();
        }
        break;
      case "analytics":
        const analyticsTab = document.querySelector('[data-tour="analytics"]');
        if (analyticsTab) {
          (analyticsTab as HTMLElement).click();
        }
        break;
    }
    
    // Continue to next step after action
    setTimeout(() => {
      if (step.id === "share-profile") {
        handleComplete();
      } else {
        handleNext();
      }
    }, 500);
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />
      
      {/* Tour Card */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="glass-effect border-emerald-500/20 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-emerald-400 text-sm">
                          {currentStep + 1} of {tourSteps.length}
                        </div>
                        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white hover:bg-white/10 -mt-1 -mr-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <p className="text-white/80 mb-6 leading-relaxed">
                  {step.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button
                        onClick={handlePrevious}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white/70 hover:bg-white/10"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {step.action && (
                      <Button
                        onClick={handleAction}
                        className="veri-gradient text-sm px-4"
                      >
                        {step.actionIcon}
                        <span className="ml-2">{step.action}</span>
                      </Button>
                    )}
                    
                    <Button
                      onClick={currentStep === tourSteps.length - 1 ? handleComplete : handleNext}
                      className={step.action ? "bg-white/10 hover:bg-white/20 text-white" : "veri-gradient"}
                      size="sm"
                    >
                      {currentStep === tourSteps.length - 1 ? (
                        "Finish Tour"
                      ) : (
                        <>
                          {step.action ? "Skip" : "Next"}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tour Styles */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          animation: tour-pulse 2s infinite;
        }
        
        @keyframes tour-pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.2), 0 0 30px rgba(16, 185, 129, 0.3);
          }
        }
      `}</style>
    </>
  );
}
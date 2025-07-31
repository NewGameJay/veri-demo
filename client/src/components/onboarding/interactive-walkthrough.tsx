import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, X, Target, Sparkles, Brain, TrendingUp, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";

interface InteractiveWalkthroughProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
  highlight?: boolean;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'profile-builder',
    title: 'Profile Builder',
    description: 'Build and customize your creator profile to attract brand partnerships and showcase your content.',
    icon: <Users className="h-5 w-5" />,
    targetSelector: '[data-tour="profile-builder"]',
    position: 'right',
    action: 'Click to build your profile',
    highlight: true
  },
  {
    id: 'veriscore-card',
    title: 'Your VeriScore',
    description: 'Your VeriScore measures your authenticity and engagement quality. Complete tasks and connect platforms to increase it.',
    icon: <Target className="h-5 w-5" />,
    targetSelector: '[data-tour="veriscore-card"]',
    position: 'left',
    highlight: true
  },
  {
    id: 'questing',
    title: 'Questing System',
    description: 'Complete micro-tasks to earn XP points and climb the leaderboard. Start with simple engagement tasks.',
    icon: <Sparkles className="h-5 w-5" />,
    targetSelector: '[data-tour="questing"]',
    position: 'right',
    action: 'Try completing a task'
  },
  {
    id: 'ai-agent',
    title: 'AI Content Optimization',
    description: 'Use AI agents to analyze your content performance and get personalized recommendations for growth.',
    icon: <Brain className="h-5 w-5" />,
    targetSelector: '[data-tour="ai-agent"]',
    position: 'right',
    action: 'Launch your first AI agent'
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    description: 'Track your content performance, audience growth, and revenue optimization across all platforms.',
    icon: <TrendingUp className="h-5 w-5" />,
    targetSelector: '[data-tour="analytics"]',
    position: 'right'
  },
  {
    id: 'social-connections',
    title: 'Social Connections',
    description: 'Connect more platforms to increase your VeriScore and unlock additional earning opportunities.',
    icon: <Users className="h-5 w-5" />,
    targetSelector: '[data-tour="social-connections"]',
    position: 'left',
    action: 'Connect more platforms'
  }
];

export function InteractiveWalkthrough({ isOpen, onComplete, onClose }: InteractiveWalkthroughProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPositionStable, setIsPositionStable] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const positionUpdateRef = useRef<NodeJS.Timeout>();
  const repositionTimeoutRef = useRef<NodeJS.Timeout>();

  const currentStep = walkthroughSteps[currentStepIndex];
  const isLastStep = currentStepIndex === walkthroughSteps.length - 1;

  // Debounced position update function
  const debouncedUpdatePosition = useCallback(() => {
    if (positionUpdateRef.current) {
      clearTimeout(positionUpdateRef.current);
    }
    
    positionUpdateRef.current = setTimeout(() => {
      if (!currentStep) return;

      const targetElement = document.querySelector(currentStep.targetSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 100); // Reduced debounce time for responsiveness
  }, [currentStep]);

  const updateTargetPosition = useCallback(() => {
    if (!currentStep) return;

    setIsPositionStable(false);
    
    const targetElement = document.querySelector(currentStep.targetSelector);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setTargetPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
      setIsVisible(true);

      // Scroll target into view with reduced movement
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest', // Changed from 'center' to reduce scroll jumping
        inline: 'nearest'
      });

      // Mark position as stable after scroll completes
      if (repositionTimeoutRef.current) {
        clearTimeout(repositionTimeoutRef.current);
      }
      repositionTimeoutRef.current = setTimeout(() => {
        setIsPositionStable(true);
      }, 300);
    } else {
      setIsVisible(false);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) return;

    // Initial position update with delay for DOM settling
    const initialTimeoutId = setTimeout(updateTargetPosition, 250);

    // Throttled resize and scroll handlers
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(debouncedUpdatePosition, 150);
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(debouncedUpdatePosition, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimeoutId);
      if (positionUpdateRef.current) clearTimeout(positionUpdateRef.current);
      if (repositionTimeoutRef.current) clearTimeout(repositionTimeoutRef.current);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentStep, isOpen, updateTargetPosition, debouncedUpdatePosition]);

  const handleNext = () => {
    triggerHaptic('light');
    setIsPositionStable(false); // Reset stability for transition
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    triggerHaptic('light');
    setIsPositionStable(false); // Reset stability for transition
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    triggerHaptic('success');
    setIsVisible(false);
    onComplete();
    localStorage.setItem('interactiveWalkthroughCompleted', 'true');
  };

  const handleSkip = () => {
    triggerHaptic('light');
    handleComplete();
  };

  const getTooltipPosition = useCallback(() => {
    if (!currentStep || !isVisible || !isPositionStable) return {};

    const tooltipWidth = 320;
    const tooltipHeight = 180;
    const offset = 20; // Increased offset for better separation
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = 0;
    let y = 0;

    switch (currentStep.position) {
      case 'right':
        x = targetPosition.x + targetPosition.width + offset;
        y = targetPosition.y + (targetPosition.height / 2) - (tooltipHeight / 2);
        break;
      case 'left':
        x = targetPosition.x - tooltipWidth - offset;
        y = targetPosition.y + (targetPosition.height / 2) - (tooltipHeight / 2);
        break;
      case 'top':
        x = targetPosition.x + (targetPosition.width / 2) - (tooltipWidth / 2);
        y = targetPosition.y - tooltipHeight - offset;
        break;
      case 'bottom':
        x = targetPosition.x + (targetPosition.width / 2) - (tooltipWidth / 2);
        y = targetPosition.y + targetPosition.height + offset;
        break;
    }

    // Keep tooltip within viewport bounds with generous padding
    const padding = 24;
    x = Math.max(padding, Math.min(x, viewportWidth - tooltipWidth - padding));
    y = Math.max(padding, Math.min(y, viewportHeight - tooltipHeight - padding));

    return {
      left: `${Math.round(x)}px`, // Round to prevent sub-pixel rendering
      top: `${Math.round(y)}px`,
      width: `${tooltipWidth}px`
    };
  }, [currentStep, isVisible, isPositionStable, targetPosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay with spotlight effect */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto">
        {isVisible && currentStep.highlight && (
          <div
            className="absolute border-2 border-emerald-400 rounded-lg shadow-lg shadow-emerald-400/50 pointer-events-none"
            style={{
              left: `${targetPosition.x - 4}px`,
              top: `${targetPosition.y - 4}px`,
              width: `${targetPosition.width + 8}px`,
              height: `${targetPosition.height + 8}px`,
              animation: 'pulse 3s infinite'
            }}
          />
        )}
        
        {/* Spotlight cutout */}
        {isVisible && (
          <div
            className="absolute bg-transparent pointer-events-auto"
            style={{
              left: `${targetPosition.x}px`,
              top: `${targetPosition.y}px`,
              width: `${targetPosition.width}px`,
              height: `${targetPosition.height}px`,
              boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        {isVisible && currentStep && isPositionStable && (
          <motion.div
            ref={tooltipRef}
            key={`tooltip-${currentStepIndex}`} // Add key for proper remounting
            initial={{ opacity: 0, y: 8 }} // Removed scale to prevent shake
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.23, 1, 0.32, 1], // Smooth Apple-like easing
              delay: isPositionStable ? 0 : 0.1 // Small delay for position stability
            }}
            className="absolute pointer-events-auto z-60 walkthrough-tooltip"
            style={getTooltipPosition()}
          >
            <Card className="glass-effect border-emerald-500/30 shadow-2xl onboarding-stable">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-emerald-400">{currentStep.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{currentStep.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{currentStep.description}</p>
                    {currentStep.action && (
                      <div className="mt-3 px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-emerald-400 text-sm font-medium">{currentStep.action}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white/70 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">
                      {currentStepIndex + 1} of {walkthroughSteps.length}
                    </span>
                    <div className="flex gap-1">
                      {walkthroughSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index <= currentStepIndex ? 'bg-emerald-400' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {currentStepIndex > 0 && (
                      <Button
                        onClick={handlePrevious}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      size="sm"
                      className="veri-gradient"
                    >
                      {isLastStep ? (
                        <>
                          Complete
                          <Sparkles className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pointer arrow */}
            <div
              className={`absolute w-0 h-0 ${
                currentStep.position === 'right'
                  ? 'border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/10 -left-2 top-1/2 -translate-y-1/2'
                  : currentStep.position === 'left'
                  ? 'border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white/10 -right-2 top-1/2 -translate-y-1/2'
                  : currentStep.position === 'top'
                  ? 'border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/10 -bottom-2 left-1/2 -translate-x-1/2'
                  : 'border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white/10 -top-2 left-1/2 -translate-x-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip walkthrough button */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <Button
          onClick={handleSkip}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Skip Walkthrough
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
          <span className="text-white/70 text-sm">Walkthrough Progress</span>
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / walkthroughSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-emerald-400 text-sm font-medium">
            {Math.round(((currentStepIndex + 1) / walkthroughSteps.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
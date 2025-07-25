import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VeriLogo } from "@/components/ui/veri-logo";
import { Trophy, Star, Zap, Share2, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { SocialShare } from "@/components/social/social-share";
import { useAuth } from "@/contexts/auth-context";

interface TaskCelebrationCardProps {
  xpEarned: number;
  taskName: string;
  shareEnabled?: boolean;
  isSpecialTask?: boolean;
  streakBonus?: number;
  category?: string;
  onClose: () => void;
}

export function TaskCelebrationCard({ 
  xpEarned, 
  taskName, 
  shareEnabled = true, 
  isSpecialTask = false,
  streakBonus = 1,
  category = "general",
  onClose 
}: TaskCelebrationCardProps) {
  const [showShare, setShowShare] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    triggerHaptic("success");
  }, []);

  const getCelebrationIcon = () => {
    if (isSpecialTask) {
      return <Trophy className="h-8 w-8 text-yellow-400" />;
    }
    if (xpEarned >= 50) {
      return <Star className="h-8 w-8 text-orange-400" />;
    }
    return <Zap className="h-8 w-8 text-green-400" />;
  };

  const getCelebrationColor = () => {
    if (isSpecialTask) {
      return "from-yellow-500 to-amber-600";
    }
    if (xpEarned >= 50) {
      return "from-orange-500 to-red-600";
    }
    return "from-green-500 to-emerald-600";
  };

  const getCelebrationTitle = () => {
    if (isSpecialTask) {
      return "Milestone Achieved!";
    }
    return "Task Completed!";
  };

  const handleShare = () => {
    setShowCelebration(false);
    setShowShare(true);
  };

  const handleClose = () => {
    triggerHaptic("light");
    onClose();
  };

  if (showShare && user && shareEnabled) {
    return (
      <SocialShare
        type="task"
        title={taskName}
        description={`Completed ${taskName} on Veri platform`}
        xpEarned={xpEarned}
        streakDay={user.streak || 0}
        veriScore={Math.min(100, Math.floor((user.xpPoints || 0) / 10))}
        onClose={() => {
          setShowShare(false);
          onClose();
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 300
              }
            }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            className="w-full max-w-md relative"
          >
            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -100],
                    transition: {
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 3
                    }
                  }}
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 200}%`,
                    top: `${50 + (Math.random() - 0.5) * 200}%`
                  }}
                />
              ))}
            </div>

            <Card className="glass-medium border-white/20 overflow-hidden relative">
              {/* Close Button */}
              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="absolute top-4 right-4 z-10 text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>

              <CardContent className="p-8 text-center space-y-6">
                {/* Celebration Icon with Gradient Background */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    transition: {
                      type: "spring",
                      damping: 10,
                      stiffness: 200,
                      delay: 0.3
                    }
                  }}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${getCelebrationColor()} flex items-center justify-center mx-auto shadow-2xl`}
                >
                  {getCelebrationIcon()}
                </motion.div>

                {/* Task Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.5 }
                  }}
                  className="space-y-3"
                >
                  <h2 className="text-2xl font-bold text-white">
                    {getCelebrationTitle()}
                  </h2>
                  <h3 className="text-xl font-semibold text-green-400">
                    {taskName}
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white/70">Task verified successfully</span>
                  </div>
                </motion.div>

                {/* XP Display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 0.7 }
                  }}
                  className="space-y-2"
                >
                  <Badge 
                    variant="secondary" 
                    className={`bg-gradient-to-r ${getCelebrationColor()} text-white px-6 py-3 text-2xl font-bold`}
                  >
                    +{xpEarned} XP
                  </Badge>
                  {streakBonus > 1 && (
                    <div className="text-orange-400 text-sm font-medium">
                      +{streakBonus} day streak bonus!
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.9 }
                  }}
                  className="flex gap-3 pt-4"
                >
                  {shareEnabled && (
                    <Button
                      onClick={handleShare}
                      className="flex-1 veri-gradient hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Achievement
                    </Button>
                  )}
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1 glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    Continue
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
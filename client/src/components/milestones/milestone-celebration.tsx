import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { SocialShare } from "@/components/social/social-share";
import { useAuth } from "@/contexts/auth-context";

interface MilestoneCelebrationProps {
  milestone: {
    id: string;
    title: string;
    description: string;
    requirement: number;
    type: "xp" | "streak" | "score" | "tasks";
  };
  onClose: () => void;
}

export function MilestoneCelebration({ milestone, onClose }: MilestoneCelebrationProps) {
  const [showShare, setShowShare] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    triggerHaptic("success");
  }, []);

  const getMilestoneIcon = () => {
    switch (milestone.type) {
      case "xp":
        return <Zap className="h-8 w-8 text-yellow-400" />;
      case "streak":
        return <Star className="h-8 w-8 text-orange-400" />;
      case "score":
        return <Trophy className="h-8 w-8 text-purple-400" />;
      case "tasks":
        return <Trophy className="h-8 w-8 text-green-400" />;
      default:
        return <Trophy className="h-8 w-8 text-blue-400" />;
    }
  };

  const getMilestoneColor = () => {
    switch (milestone.type) {
      case "xp":
        return "from-yellow-500 to-amber-600";
      case "streak":
        return "from-orange-500 to-red-600";
      case "score":
        return "from-purple-500 to-indigo-600";
      case "tasks":
        return "from-green-500 to-emerald-600";
      default:
        return "from-blue-500 to-cyan-600";
    }
  };

  const handleShare = () => {
    setShowCelebration(false);
    setShowShare(true);
  };

  const handleClose = () => {
    triggerHaptic("light");
    onClose();
  };

  if (showShare && user) {
    return (
      <SocialShare
        type="milestone"
        title={milestone.title}
        description={milestone.description}
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
            {/* Celebration Effects */}
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
                {/* Milestone Icon with Gradient Background */}
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
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${getMilestoneColor()} flex items-center justify-center mx-auto shadow-2xl`}
                >
                  {getMilestoneIcon()}
                </motion.div>

                {/* Milestone Info */}
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
                    Milestone Achieved!
                  </h2>
                  <h3 className="text-xl font-semibold text-green-400">
                    {milestone.title}
                  </h3>
                  <p className="text-white/70">
                    {milestone.description}
                  </p>
                </motion.div>

                {/* Achievement Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 0.7 }
                  }}
                >
                  <Badge 
                    variant="secondary" 
                    className={`bg-gradient-to-r ${getMilestoneColor()} text-white px-4 py-2 text-lg font-semibold`}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    {milestone.requirement} {milestone.type.toUpperCase()}
                  </Badge>
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
                  <Button
                    onClick={handleShare}
                    className="flex-1 veri-gradient hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Achievement
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
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
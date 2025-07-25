import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VeriLogo } from "@/components/ui/veri-logo";
import { Share2, Twitter, Linkedin, Copy, Sparkles, Trophy, ArrowRight, Star, Zap, Award, Crown } from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";
import { useToast } from "@/hooks/use-toast";

interface VeriScoreRevealProps {
  isOpen: boolean;
  onComplete: () => void;
  userScore?: number;
  userName?: string;
}

export function VeriScoreReveal({ isOpen, onComplete, userScore = 85, userName = "Creator" }: VeriScoreRevealProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'copy') => {
    setIsSharing(true);
    triggerHaptic('success');

    const shareText = `🎉 Just launched my creator profile on @Veri with a VeriScore of ${userScore}! Building authentic connections in the creator economy. #VeriCreator #Web3Creator`;
    const shareUrl = `https://veri.club/${userName?.toLowerCase()}`;

    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Copied to clipboard!",
            description: "Share text copied. Paste it anywhere to share your VeriScore.",
            variant: "default",
          });
          break;
      }
      
      // Award XP for sharing (simulate API call)
      setTimeout(() => {
        toast({
          title: "+500 XP Earned!",
          description: "Bonus XP for sharing your VeriScore",
          variant: "default",
        });
      }, 1000);

    } catch (error) {
      toast({
        title: "Share failed",
        description: "Please try again or copy the link manually.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleContinue = () => {
    triggerHaptic('success');
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full max-w-sm"
        style={{ perspective: "1000px" }}
      >
        {/* Credit Card Style VeriScore Card */}
        <motion.div
          whileHover={{ 
            rotateY: 15,
            rotateX: 10,
            scale: 1.05,
          }}
          transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          className="relative w-full h-64"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Card className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden"
                style={{ 
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                }}>
            {/* Card Header - Credit Card Style */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <VeriLogo size="md" />
                  </motion.div>
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-xl font-termina text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"
                    >
                      VeriScore
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-white/60 text-sm font-medium"
                    >
                      Creator Rating
                    </motion.p>
                  </div>
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-sm"
                >
                  {userScore >= 80 ? "DIAMOND" : userScore >= 60 ? "GOLD" : userScore >= 40 ? "SILVER" : "BRONZE"}
                </motion.div>
              </div>

              {/* Center Section - Main Score */}
              <div className="flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      {/* Animated ring */}
                      <motion.div 
                        className="absolute inset-0 rounded-full border-4 border-emerald-400/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div 
                        className="absolute inset-2 rounded-full border-2 border-emerald-500/50"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Score */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="text-4xl font-termina text-emerald-400 drop-shadow-lg"
                        >
                          {userScore}
                        </motion.span>
                      </div>
                      
                      {/* Tier icon */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        {userScore >= 80 ? <Crown className="h-4 w-4 text-white" /> :
                         userScore >= 60 ? <Trophy className="h-4 w-4 text-white" /> :
                         userScore >= 40 ? <Award className="h-4 w-4 text-white" /> :
                         <Star className="h-4 w-4 text-white" />}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Section - Stats */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-4 text-center"
              >
                <div>
                  <div className="text-emerald-400 text-lg font-bold font-termina">{Math.min(userScore + 5, 100)}</div>
                  <div className="text-white/60 text-xs">Authenticity</div>
                </div>
                <div>
                  <div className="text-emerald-400 text-lg font-bold font-termina">{Math.min(userScore + 3, 100)}</div>
                  <div className="text-white/60 text-xs">Engagement</div>
                </div>
                <div>
                  <div className="text-emerald-400 text-lg font-bold font-termina">{Math.max(userScore - 10, 0)}</div>
                  <div className="text-white/60 text-xs">Growth</div>
                </div>
              </motion.div>

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
              
              {/* Floating sparkles */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity }
                }}
                className="absolute top-6 right-16 opacity-30"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, delay: 2 }
                }}
                className="absolute bottom-8 left-8 opacity-20"
              >
                <Sparkles className="h-3 w-3 text-teal-400" />
              </motion.div>
            </div>

          </Card>
        </motion.div>

        {/* Success Message & Actions Below Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center space-y-6"
        >
          <div>
            <h3 className="text-2xl font-termina text-white mb-2">Congratulations!</h3>
            <p className="text-white/70">Your VeriScore card is ready to share</p>
          </div>

          {/* Share Section */}
          <div className="space-y-4">
            <p className="text-emerald-400 font-medium">Share your achievement and earn +500 XP</p>
            
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => handleShare('twitter')}
                disabled={isSharing}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={() => handleShare('linkedin')}
                disabled={isSharing}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                onClick={() => handleShare('copy')}
                disabled={isSharing}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-4 py-2 text-sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleContinue}
                className="veri-gradient w-full py-3"
                size="lg"
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="text-white/50 text-xs">
              You can always share your VeriScore later from your profile
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
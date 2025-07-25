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
        className="relative max-w-lg w-full"
      >
        {/* Main VeriScore Card */}
        <motion.div
          whileHover={{ 
            rotateY: 5,
            rotateX: 5,
            scale: 1.02,
          }}
          transition={{ duration: 0.3 }}
          className="perspective-1000"
        >
          <Card className="glass-effect border-emerald-500/20 shadow-2xl shadow-emerald-500/10 bg-gradient-to-br from-gray-900/90 to-gray-800/90 hover:from-gray-800/90 hover:to-gray-700/90 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <VeriLogo size="sm" />
                  <div>
                    <CardTitle className="text-white text-lg font-termina">VeriScore</CardTitle>
                    <p className="text-white/60 text-sm">Creator Rating</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-medium px-3 py-1"
                >
                  {userScore >= 80 ? "Diamond" : userScore >= 60 ? "Gold" : userScore >= 40 ? "Silver" : "Bronze"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Main Score Circle */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                {/* Animated background circle */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-500/20"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity }
                  }}
                />
                
                {/* Score circle */}
                <div className="absolute inset-1 bg-gray-900/80 rounded-full border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-2xl font-termina text-emerald-400"
                  >
                    {userScore}
                  </motion.span>
                </div>
                
                {/* Tier icon */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500/20 rounded-full border border-emerald-500/50 flex items-center justify-center"
                >
                  {userScore >= 80 ? <Crown className="h-3 w-3 text-emerald-400" /> :
                   userScore >= 60 ? <Trophy className="h-3 w-3 text-emerald-400" /> :
                   userScore >= 40 ? <Award className="h-3 w-3 text-emerald-400" /> :
                   <Star className="h-3 w-3 text-emerald-400" />}
                </motion.div>
              </motion.div>

              {/* Score breakdown */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-3 mb-6"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Authenticity</span>
                  <span className="text-emerald-400 font-medium">{Math.min(userScore + 5, 100)}/100</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Engagement</span>
                  <span className="text-emerald-400 font-medium">{Math.min(userScore + 3, 100)}/100</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Growth</span>
                  <span className="text-emerald-400 font-medium">{Math.max(userScore - 10, 0)}/100</span>
                </div>
              </motion.div>

              {/* Success message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center mb-6"
              >
                <h3 className="text-xl font-termina text-white mb-2">Congratulations!</h3>
                <p className="text-white/70 text-sm">Your creator profile is ready to grow</p>
              </motion.div>

              {/* Share Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <h3 className="text-white font-semibold mb-4">Share your achievement and earn +500 XP</h3>
                
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

                <div className="pt-6">
                  <Button
                    onClick={handleContinue}
                    className="veri-gradient w-full py-3"
                    size="lg"
                  >
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <p className="text-white/50 text-xs mt-4">
                  You can always share your VeriScore later from your profile
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
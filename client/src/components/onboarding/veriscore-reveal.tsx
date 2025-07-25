import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VeriLogo } from "@/components/ui/veri-logo";
import { Share2, Twitter, Linkedin, Copy, Sparkles, Trophy, ArrowRight } from "lucide-react";
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
          <Card className="glass-effect border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden">
            <CardContent className="p-8 text-center relative">
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-4 right-4"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-emerald-400" />
                </div>
              </motion.div>

              {/* Sparkle Effects */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="absolute top-6 left-6"
              >
                <Sparkles className="h-5 w-5 text-yellow-400/60" />
              </motion.div>

              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, delay: 1 }
                }}
                className="absolute bottom-6 right-8"
              >
                <Sparkles className="h-4 w-4 text-purple-400/60" />
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <VeriLogo className="h-8 w-auto" />
                  <span className="text-2xl font-termina text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                    VeriScore
                  </span>
                </div>
                <h2 className="text-3xl font-termina text-white mb-2">Congratulations!</h2>
                <p className="text-white/70">Your creator profile is ready</p>
              </motion.div>

              {/* VeriScore Display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", bounce: 0.5 }}
                className="mb-8"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse opacity-20"></div>
                  <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                    <span className="text-4xl font-termina text-emerald-400">{userScore}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-lg">Your VeriScore</p>
                  <p className="text-emerald-400 text-sm font-medium">Ready to grow!</p>
                </div>
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
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Copy, 
  Check,
  Trophy,
  Zap,
  Star,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  type: "task" | "milestone";
  title: string;
  description: string;
  xpEarned?: number;
  streakDay?: number;
  veriScore?: number;
  platform?: string;
  onClose: () => void;
}

export function SocialShare({ 
  type, 
  title, 
  description, 
  xpEarned, 
  streakDay, 
  veriScore,
  platform,
  onClose 
}: SocialShareProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate share content based on type
  const generateShareContent = (platform: string) => {
    const baseUrl = window.location.origin;
    const veriUrl = `${baseUrl}?ref=creator_achievement`;
    
    if (type === "task") {
      const content = {
        twitter: `🎮 Just completed "${title}" on @VeriPlatform!\n\n${description}\n\n✨ Earned ${xpEarned} XP\n🔥 ${streakDay}-day streak\n📊 VeriScore: ${veriScore}/100\n\n#Web3Gaming #CreatorEconomy #VeriTasks\n\n${veriUrl}`,
        instagram: `🎮 Gaming Creator Achievement Unlocked! 🏆\n\nJust completed: ${title}\n\n${description}\n\n✨ +${xpEarned} XP earned\n🔥 ${streakDay}-day streak maintained\n📊 VeriScore: ${veriScore}/100\n\n#Web3Gaming #CreatorEconomy #VeriPlatform #Gaming #Blockchain`,
        linkedin: `Excited to share my latest achievement on the Veri Creator Platform! 🎮\n\nCompleted: ${title}\n${description}\n\nEarned ${xpEarned} XP and maintained my ${streakDay}-day creator streak. My VeriScore is now ${veriScore}/100.\n\nVeri is revolutionizing how gaming creators connect with Web3 brands for authentic collaborations.\n\n${veriUrl}\n\n#Web3 #Gaming #CreatorEconomy #Blockchain`
      };
      return content[platform as keyof typeof content] || content.twitter;
    } else {
      // Milestone content
      const content = {
        twitter: `🏆 Milestone Achieved on @VeriPlatform!\n\n${title}\n${description}\n\n🔥 ${streakDay}-day streak\n📊 VeriScore: ${veriScore}/100\n\n#Web3Gaming #CreatorMilestone #VeriPlatform\n\n${veriUrl}`,
        instagram: `🏆 Major Milestone Unlocked! 🎉\n\n${title}\n\n${description}\n\n🔥 ${streakDay}-day creator streak\n📊 VeriScore: ${veriScore}/100\n\nBuilding my Web3 gaming creator journey one milestone at a time! 🚀\n\n#CreatorMilestone #Web3Gaming #VeriPlatform #Gaming #Achievement`,
        linkedin: `Proud to announce a significant milestone in my creator journey! 🏆\n\n${title}\n${description}\n\nCurrent streak: ${streakDay} days\nVeriScore: ${veriScore}/100\n\nThe Veri Platform continues to provide incredible opportunities for gaming creators in the Web3 space.\n\n${veriUrl}\n\n#CreatorMilestone #Web3Gaming #Blockchain #CreatorEconomy`
      };
      return content[platform as keyof typeof content] || content.twitter;
    }
  };

  // Generate share URLs
  const generateShareUrl = (platform: string) => {
    const content = generateShareContent(platform);
    const encodedContent = encodeURIComponent(content);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedContent}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct text sharing
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodedContent}`
    };
    
    return urls[platform as keyof typeof urls];
  };

  const handleShare = async (platform: string) => {
    triggerHaptic("light");
    setSelectedPlatform(platform);
    
    if (platform === "copy") {
      try {
        const content = generateShareContent("twitter");
        await navigator.clipboard.writeText(content);
        setCopiedUrl(true);
        toast({
          title: "Copied to clipboard!",
          description: "Share content has been copied to your clipboard.",
        });
        setTimeout(() => setCopiedUrl(false), 2000);
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (platform === "instagram") {
      // For Instagram, copy content and show instructions
      try {
        const content = generateShareContent("instagram");
        await navigator.clipboard.writeText(content);
        toast({
          title: "Content copied!",
          description: "Open Instagram and paste this content with your achievement image.",
        });
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Unable to copy Instagram content.",
          variant: "destructive"
        });
      }
      return;
    }

    // For Twitter and LinkedIn, open sharing URL
    const shareUrl = generateShareUrl(platform);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      toast({
        title: "Share window opened",
        description: `Opening ${platform} share dialog...`,
      });
    }
  };

  const downloadAchievementCard = () => {
    triggerHaptic("success");
    // This would generate an achievement card image
    toast({
      title: "Coming Soon",
      description: "Achievement card download will be available soon!",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="glass-medium border-white/20 overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto">
                  {type === "task" ? (
                    <Zap className="h-8 w-8 text-white" />
                  ) : (
                    <Trophy className="h-8 w-8 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {type === "task" ? "Task Completed!" : "Milestone Achieved!"}
                  </h3>
                  <p className="text-white/70 text-sm">{title}</p>
                </div>
              </div>

              {/* Achievement Stats */}
              <div className="grid grid-cols-3 gap-3">
                {xpEarned && (
                  <div className="text-center glass-subtle p-3 rounded-lg">
                    <div className="text-green-400 font-semibold text-lg">{xpEarned}</div>
                    <div className="text-white/60 text-xs">XP Earned</div>
                  </div>
                )}
                {streakDay && (
                  <div className="text-center glass-subtle p-3 rounded-lg">
                    <div className="text-orange-400 font-semibold text-lg">{streakDay}</div>
                    <div className="text-white/60 text-xs">Day Streak</div>
                  </div>
                )}
                {veriScore && (
                  <div className="text-center glass-subtle p-3 rounded-lg">
                    <div className="text-purple-400 font-semibold text-lg">{veriScore}</div>
                    <div className="text-white/60 text-xs">VeriScore</div>
                  </div>
                )}
              </div>

              {/* Share Buttons */}
              <div className="space-y-4">
                <h4 className="text-white font-medium text-center">Share Your Achievement</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleShare("twitter")}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 hover:border-blue-500/70 transition-all duration-300"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  
                  <Button
                    onClick={() => handleShare("instagram")}
                    className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/50 hover:border-pink-500/70 transition-all duration-300"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                  
                  <Button
                    onClick={() => handleShare("linkedin")}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/50 hover:border-blue-600/70 transition-all duration-300"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  
                  <Button
                    onClick={() => handleShare("copy")}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 hover:border-green-500/70 transition-all duration-300"
                  >
                    {copiedUrl ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedUrl ? "Copied!" : "Copy Text"}
                  </Button>
                </div>
              </div>

              {/* Download Achievement Card */}
              <Button
                onClick={downloadAchievementCard}
                variant="outline"
                className="w-full glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Achievement Card
              </Button>

              {/* Close Button */}
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
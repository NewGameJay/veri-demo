import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Share2, 
  Copy, 
  ExternalLink, 
  Twitter, 
  Instagram, 
  Youtube,
  Link2,
  Download,
  QrCode,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaDiscord } from "react-icons/fa";

interface ProfileShareProps {
  profileData: any;
  onClose?: () => void;
}

export function ProfileShare({ profileData, onClose }: ProfileShareProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Generate shareable profile URL
  const profileUrl = `https://veri.club/profile/${profileData.username}`;
  
  // Generate preview card data
  const previewData = {
    title: `${profileData.name} on Veri`,
    description: `Gaming Creator • VeriScore: ${profileData.veriScore} • ${profileData.followers.toLocaleString()} followers`,
    image: profileData.avatar,
    url: profileUrl
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try copying the link manually",
        variant: "destructive"
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    setSelectedPlatform(platform);
    const text = `Check out my gaming creator profile on Veri! 🎮 VeriScore: ${profileData.veriScore}/100`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
      youtube: `https://www.youtube.com/`, // YouTube doesn't support direct URL sharing
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
      discord: `https://discord.com/`, // Discord doesn't support direct URL sharing
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }

    toast({
      title: `Sharing to ${platform}`,
      description: "Opening share dialog...",
    });
  };

  const handleDownloadCard = () => {
    // Generate downloadable profile card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 800;
      canvas.height = 400;
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#00d6a2');
      gradient.addColorStop(1, '#8456ff');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add profile info (simplified version)
      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Inter';
      ctx.fillText(profileData.name, 50, 100);
      
      ctx.font = '24px Inter';
      ctx.fillText(`VeriScore: ${profileData.veriScore}`, 50, 150);
      ctx.fillText(`${profileData.followers.toLocaleString()} followers`, 50, 190);
      
      // Download the image
      const link = document.createElement('a');
      link.download = `${profileData.username}-veri-profile.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Profile card downloaded",
        description: "Your profile card has been saved to downloads",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-emerald-400 mr-2" />
          <h3 className="text-2xl font-bold text-white">Share Your Profile</h3>
        </div>
        <p className="text-white/70">Let others discover your gaming creator journey</p>
      </div>

      {/* Profile Preview Card */}
      <Card className="glass-effect border-white/20 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {profileData.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-xl font-semibold text-white">{profileData.name}</h4>
              {profileData.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <p className="text-emerald-400">@{profileData.username}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                VeriScore: {profileData.veriScore}
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                Rank #{profileData.rank}
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-white/80 mb-4">{profileData.bio}</p>
        
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>{profileData.followers.toLocaleString()} followers</span>
          <span>Gaming Creator since {profileData.joinDate}</span>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleCopyLink}
          className="glass-subtle border-white/20 text-white hover:bg-white/10 h-12"
          variant="outline"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
        
        <Button
          onClick={handleDownloadCard}
          className="glass-subtle border-white/20 text-white hover:bg-white/10 h-12"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Card
        </Button>
      </div>

      {/* Social Platform Sharing */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Share to Social Platforms</h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleSocialShare('twitter')}
            className="glass-subtle border-blue-500/20 text-blue-400 hover:bg-blue-500/10 h-12 justify-start"
            variant="outline"
          >
            <FaTwitter className="w-5 h-5 mr-3" />
            Twitter
          </Button>
          
          <Button
            onClick={() => handleSocialShare('linkedin')}
            className="glass-subtle border-blue-600/20 text-blue-500 hover:bg-blue-600/10 h-12 justify-start"
            variant="outline"
          >
            <FaLinkedin className="w-5 h-5 mr-3" />
            LinkedIn
          </Button>
          
          <Button
            onClick={() => handleSocialShare('discord')}
            className="glass-subtle border-purple-500/20 text-purple-400 hover:bg-purple-500/10 h-12 justify-start"
            variant="outline"
          >
            <FaDiscord className="w-5 h-5 mr-3" />
            Discord
          </Button>
          
          <Button
            onClick={() => handleSocialShare('instagram')}
            className="glass-subtle border-pink-500/20 text-pink-400 hover:bg-pink-500/10 h-12 justify-start"
            variant="outline"
          >
            <FaInstagram className="w-5 h-5 mr-3" />
            Instagram
          </Button>
        </div>
      </div>

      {/* Profile URL Display */}
      <div className="glass-effect p-4 rounded-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-white/60 text-sm mb-1">Your profile URL:</p>
            <p className="text-emerald-400 font-mono text-sm truncate">{profileUrl}</p>
          </div>
          <Button
            onClick={handleCopyLink}
            size="sm"
            variant="ghost"
            className="text-white/60 hover:text-white ml-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="glass-subtle border-white/20 text-white"
          >
            Close
          </Button>
        </div>
      )}
    </motion.div>
  );
}
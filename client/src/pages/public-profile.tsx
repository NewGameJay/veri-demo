import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Shield, 
  Trophy, 
  ExternalLink, 
  Heart, 
  MessageCircle, 
  Eye,
  Crown,
  Share2,
  ArrowLeft
} from "lucide-react";
import { 
  FaTwitter, 
  FaYoutube, 
  FaInstagram, 
  FaTiktok, 
  FaTwitch,
  FaLinkedin 
} from "react-icons/fa";

const platformIcons = {
  twitter: FaTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  twitch: FaTwitch,
  linkedin: FaLinkedin,
};

const platformColors = {
  twitter: "#1DA1F2",
  youtube: "#FF0000", 
  instagram: "#E4405F",
  tiktok: "#000000",
  twitch: "#9146FF",
  linkedin: "#0077B5",
};

interface PublicProfileData {
  name: string;
  bio: string;
  website: string;
  customUsername: string;
  isVerified: boolean;
  veriScore: number;
  xpPoints: number;
  rank: number;
  tier: string;
  connectedPlatforms: Array<{
    platform: string;
    followers: number;
  }>;
  showcaseContent: Array<{
    id: string;
    platform: string;
    title: string;
    description: string;
    metrics: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
    };
    createdAt: string;
  }>;
  joinedAt: string;
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [isSharing, setIsSharing] = useState(false);

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["/api/public-profile", username],
    queryFn: async () => {
      const response = await fetch(`/api/public-profile/${username}`);
      if (!response.ok) {
        throw new Error("Profile not found");
      }
      return response.json() as PublicProfileData;
    },
    enabled: !!username,
  });

  const getTierBadge = (tier: string) => {
    const configs = {
      Diamond: { color: "from-cyan-400 to-blue-500", icon: Crown },
      Platinum: { color: "from-gray-400 to-gray-600", icon: Trophy },
      Gold: { color: "from-yellow-400 to-yellow-600", icon: Trophy },
      Silver: { color: "from-gray-300 to-gray-500", icon: Trophy },
      Bronze: { color: "from-amber-600 to-amber-800", icon: Trophy },
    };
    return configs[tier as keyof typeof configs] || configs.Bronze;
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData?.name}'s VeriProfile`,
          text: `Check out ${profileData?.name}'s gaming creator profile on Veri!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      setIsSharing(true);
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 hero-gradient flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-800 hero-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
          <p className="text-white/70">The profile you're looking for doesn't exist.</p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Go to Veri
          </Button>
        </div>
      </div>
    );
  }

  const tierConfig = getTierBadge(profileData.tier);

  return (
    <div className="min-h-screen bg-gray-800 hero-gradient">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Veri
          </Button>
          
          <Button
            onClick={shareProfile}
            className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isSharing ? "Copied!" : "Share Profile"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Header */}
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {/* Avatar */}
                  <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-3xl text-emerald-400">
                      {profileData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Name and Verification */}
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-white">{profileData.name}</h1>
                      {profileData.isVerified && (
                        <Shield className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-white/60">@{profileData.customUsername}</p>
                  </div>

                  {/* Bio */}
                  {profileData.bio && (
                    <p className="text-white/80 text-center">{profileData.bio}</p>
                  )}

                  {/* Website */}
                  {profileData.website && (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Website
                    </a>
                  )}

                  {/* Social Platforms */}
                  {profileData.connectedPlatforms.length > 0 && (
                    <div className="flex justify-center gap-3 pt-4">
                      {profileData.connectedPlatforms.map((platform) => {
                        const PlatformIcon = platformIcons[platform.platform as keyof typeof platformIcons];
                        const platformColor = platformColors[platform.platform as keyof typeof platformColors];
                        
                        return (
                          <motion.div
                            key={platform.platform}
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                            title={`${platform.followers.toLocaleString()} followers`}
                          >
                            <PlatformIcon className="w-5 h-5" style={{ color: platformColor }} />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Join Date */}
                  <p className="text-white/40 text-sm">
                    Joined {new Date(profileData.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* VeriScore Card */}
            <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/30">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="text-4xl font-bold text-emerald-400">{profileData.veriScore}</div>
                  <div className="text-white/70">VeriScore</div>
                  <div className="text-2xl font-semibold text-white">{profileData.xpPoints.toLocaleString()}XP</div>
                  <div className="text-white/70 text-sm">VeriPoints</div>
                </div>
              </CardContent>
            </Card>

            {/* Rank Card */}
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">#{profileData.rank}</div>
                    <div className="text-white/70">Global Rank</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <tierConfig.icon className="w-6 h-6 text-emerald-400" />
                    <Badge className={`bg-gradient-to-r ${tierConfig.color} text-white border-0`}>
                      {profileData.tier}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Showcase */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  Featured Content
                  <Badge variant="outline" className="border-white/20 text-white/70">
                    {profileData.showcaseContent?.length || 0} pieces
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileData.showcaseContent && profileData.showcaseContent.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.showcaseContent.map((content) => {
                      const PlatformIcon = platformIcons[content.platform as keyof typeof platformIcons];
                      const platformColor = platformColors[content.platform as keyof typeof platformColors];

                      return (
                        <motion.div
                          key={content.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <PlatformIcon className="w-4 h-4" style={{ color: platformColor }} />
                            <span className="text-xs text-white/60 uppercase tracking-wider">
                              {content.platform}
                            </span>
                            <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                              {new Date(content.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                          
                          <h3 className="text-white font-medium mb-2 line-clamp-2">
                            {content.title}
                          </h3>
                          <p className="text-white/70 text-sm mb-3 line-clamp-2">
                            {content.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.metrics.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {content.metrics.likes.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {content.metrics.comments}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-white/60">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p>No featured content yet</p>
                    <p className="text-sm">This creator hasn't added any showcase content.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
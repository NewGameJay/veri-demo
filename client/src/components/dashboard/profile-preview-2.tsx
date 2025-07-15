import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  Camera, 
  Shield, 
  Star,
  TrendingUp,
  Edit3,
  Sparkles,
  ExternalLink,
  Users,
  MapPin,
  Crown,
  ChevronRight
} from "lucide-react";
import { 
  FaTwitter, 
  FaYoutube, 
  FaInstagram, 
  FaTiktok, 
  FaTwitch 
} from "react-icons/fa";

interface ProfilePreview2Props {
  onOpenProfileBuilder?: () => void;
}

const getTierInfo = (score: number) => {
  if (score >= 90) return { name: "Diamond", color: "from-blue-400 to-cyan-400", icon: "💎" };
  if (score >= 70) return { name: "Platinum", color: "from-gray-300 to-gray-400", icon: "🏆" };
  if (score >= 50) return { name: "Gold", color: "from-yellow-400 to-yellow-500", icon: "👑" };
  return { name: "Silver", color: "from-gray-400 to-gray-500", icon: "⭐" };
};

export function ProfilePreview2({ onOpenProfileBuilder }: ProfilePreview2Props) {
  const { user } = useAuth();
  
  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: [`/api/users/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch social connections
  const { data: socialConnections } = useQuery({
    queryKey: [`/api/social-connections/${user?.id}`],
    enabled: !!user?.id,
  });

  const veriScore = userData?.veriScore || 85;
  const tier = getTierInfo(veriScore);
  const connectedPlatforms = socialConnections?.filter((conn: any) => conn.isConnected) || [];
  const totalFollowers = socialConnections?.reduce((sum: number, conn: any) => sum + (conn.followers || 0), 0) || 12500;

  const profileData = {
    name: user?.username || "Creator",
    bio: "🎮 Gaming content creator | 🔥 Building the future of Web3 | 💡 Authentic storytelling",
    location: "Los Angeles, CA",
    customUsername: user?.username?.toLowerCase() || "creator",
    bannerUrl: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=120&fit=crop",
    verified: true,
    completionScore: 85
  };

  const platformIcons: Record<string, any> = {
    twitter: FaTwitter,
    youtube: FaYoutube,
    instagram: FaInstagram,
    tiktok: FaTiktok,
    twitch: FaTwitch,
  };

  return (
    <Card className="glass-medium border-white/20 overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Profile 2.0</CardTitle>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
              NEW
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white"
            onClick={() => window.location.href = '/profile'}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Mini Profile Preview */}
        <div className="relative">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
            {profileData.bannerUrl && (
              <img 
                src={profileData.bannerUrl} 
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Section */}
          <div className="px-4 pb-4 relative">
            <div className="flex items-end gap-3 -mt-8 relative z-10">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full border-2 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                {profileData.name.substring(0, 2).toUpperCase()}
              </div>
              
              {/* Quick Stats */}
              <div className="flex-1 mt-8">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm">{profileData.name}</h3>
                  {profileData.verified && (
                    <Shield className="w-3 h-3 text-blue-400 fill-current" />
                  )}
                  <Badge className={`bg-gradient-to-r ${tier.color} text-white text-xs px-1 py-0`}>
                    {tier.icon}
                  </Badge>
                </div>
                <p className="text-white/60 text-xs">@{profileData.customUsername}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-white/80 text-xs mt-2 line-clamp-2">
              {profileData.bio}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-3 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profileData.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {totalFollowers.toLocaleString()}
              </div>
            </div>

            {/* Connected Platforms */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-white/60">Connected:</span>
              <div className="flex gap-1">
                {connectedPlatforms.slice(0, 4).map((connection: any) => {
                  const Icon = platformIcons[connection.platform.toLowerCase()];
                  return Icon ? (
                    <div key={connection.id} className="w-5 h-5 bg-white/10 rounded flex items-center justify-center">
                      <Icon className="w-3 h-3 text-white/80" />
                    </div>
                  ) : null;
                })}
                {connectedPlatforms.length > 4 && (
                  <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center">
                    <span className="text-xs text-white/60">+{connectedPlatforms.length - 4}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/80">Profile Completion</span>
                <span className="text-xs font-bold text-white">{profileData.completionScore}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${profileData.completionScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs"
                onClick={() => window.location.href = '/profile'}
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-xs"
                onClick={() => window.open(`https://veri.club/${profileData.customUsername}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>

            {/* Profile 2.0 Features */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white">New in Profile 2.0</p>
                  <p className="text-xs text-white/60">Banner editing, enhanced sharing, X.com-style layout</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
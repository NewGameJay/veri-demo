import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Eye, 
  EyeOff,
  Settings,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Play,
  Heart,
  Share2,
  ExternalLink,
  Crown,
  Star,
  Zap
} from "lucide-react";

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  banner: string;
  veriScore: number;
  xpPoints: number;
  followers: number;
  following: number;
  rank: number;
  totalUsers: number;
  isVerified: boolean;
  joinDate: string;
  socialConnections: {
    twitter?: { followers: number; verified: boolean };
    instagram?: { followers: number; verified: boolean };
    youtube?: { subscribers: number; verified: boolean };
    twitch?: { followers: number; verified: boolean };
  };
  topContent: Array<{
    id: string;
    platform: 'twitter' | 'instagram' | 'youtube' | 'twitch';
    title: string;
    views: number;
    likes: number;
    shares: number;
    revenue: number;
    thumbnail: string;
    date: string;
    engagement: number;
  }>;
  privacySettings: {
    showScore: boolean;
    showRank: boolean;
    showEarnings: boolean;
    showTopContent: boolean;
  };
}

interface ProfileShowcaseProps {
  profileData: ProfileData;
  onEdit: () => void;
  isPreview?: boolean;
}

export function ProfileShowcase({ profileData, onEdit, isPreview = false }: ProfileShowcaseProps) {
  const [privacySettings, setPrivacySettings] = useState(profileData.privacySettings);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'twitch': return Twitch;
      default: return Play;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'text-blue-400';
      case 'instagram': return 'text-pink-400';
      case 'youtube': return 'text-red-400';
      case 'twitch': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTierBadge = (score: number) => {
    if (score >= 90) return { name: "Diamond", color: "bg-blue-500/20 text-blue-400", icon: Crown };
    if (score >= 70) return { name: "Platinum", color: "bg-purple-500/20 text-purple-400", icon: Star };
    if (score >= 50) return { name: "Gold", color: "bg-yellow-500/20 text-yellow-400", icon: Trophy };
    return { name: "Silver", color: "bg-gray-500/20 text-gray-400", icon: Zap };
  };

  const tier = getTierBadge(profileData.veriScore);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Privacy Controls */}
      {!isPreview && (
        <Card className="glass-subtle p-4 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Profile Privacy Settings</h3>
            <Button onClick={onEdit} variant="outline" size="sm" className="glass-subtle border-white/20">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={privacySettings.showScore}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showScore: checked }))}
              />
              <Label className="text-white/70 text-sm">Show VeriScore</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={privacySettings.showRank}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showRank: checked }))}
              />
              <Label className="text-white/70 text-sm">Show Rank</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={privacySettings.showEarnings}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showEarnings: checked }))}
              />
              <Label className="text-white/70 text-sm">Show Earnings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={privacySettings.showTopContent}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showTopContent: checked }))}
              />
              <Label className="text-white/70 text-sm">Show Content</Label>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Header with Banner */}
      <Card className="glass-subtle border-white/10 overflow-hidden">
        {/* Banner */}
        <div 
          className="h-48 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 relative"
          style={{ 
            backgroundImage: profileData.banner ? `url(${profileData.banner})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-4 left-6">
            <div className="flex items-end space-x-4">
              <Avatar className="w-20 h-20 border-4 border-white/20">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="bg-emerald-500 text-white text-xl">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-white font-bold text-2xl">{profileData.name}</h1>
                  {profileData.isVerified && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-white/70">@{profileData.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <p className="text-white/80 mb-4">{profileData.bio}</p>
          
          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(profileData.socialConnections).map(([platform, data]) => {
              const Icon = getPlatformIcon(platform);
              const colorClass = getPlatformColor(platform);
              return (
                <div key={platform} className="flex items-center space-x-2 glass-subtle px-3 py-2 rounded-lg">
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                  <span className="text-white/70 text-sm capitalize">{platform}</span>
                  <span className="text-white text-sm font-medium">{formatNumber(data.followers || data.subscribers)}</span>
                  {data.verified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                </div>
              );
            })}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{formatNumber(profileData.followers)}</div>
              <div className="text-white/60 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{formatNumber(profileData.following)}</div>
              <div className="text-white/60 text-sm">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{profileData.joinDate}</div>
              <div className="text-white/60 text-sm">Member Since</div>
            </div>
            <div className="text-center">
              <Badge className={tier.color}>
                <tier.icon className="w-3 h-3 mr-1" />
                {tier.name}
              </Badge>
              <div className="text-white/60 text-sm mt-1">Tier</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VeriScore Card */}
        <AnimatePresence>
          {privacySettings.showScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-subtle p-6 border-white/10 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">VeriScore</h3>
                <div className="text-4xl font-bold text-emerald-400 mb-2">{profileData.veriScore}</div>
                <div className="text-white/60 text-sm mb-4">Calculated Weekly Based on</div>
                
                <div className="space-y-2 mb-6">
                  <div className="text-white font-medium">VeriPoints</div>
                  <div className="text-2xl font-bold text-emerald-400">{formatNumber(profileData.xpPoints)}XP</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="glass-subtle p-3 rounded-lg">
                    <div className="text-white text-lg font-bold">{formatNumber(profileData.followers)}</div>
                    <div className="text-white/60 text-sm">Followers</div>
                  </div>
                  <div className="glass-subtle p-3 rounded-lg">
                    <div className="text-white text-lg font-bold">{formatNumber(profileData.following)}</div>
                    <div className="text-white/60 text-sm">Following</div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-white font-medium">{profileData.name}</div>
                  <div className="text-white/60 text-sm">Creator & Influencer</div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard Card */}
        <AnimatePresence>
          {privacySettings.showRank && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="glass-subtle p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Leaderboard</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Top {Math.round((profileData.rank / profileData.totalUsers) * 100)}%</Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {/* Current User */}
                  <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="text-emerald-400 font-bold">#{profileData.rank}</div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-white font-medium">{profileData.name}</div>
                      <div className="text-emerald-400 text-sm">{profileData.veriScore} points</div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">You</Badge>
                  </div>

                  {/* Sample rankings around user */}
                  {[
                    { rank: profileData.rank - 1, name: "Alex Chen", score: profileData.veriScore + 5 },
                    { rank: profileData.rank + 1, name: "Maya Patel", score: profileData.veriScore - 8 },
                    { rank: profileData.rank + 2, name: "Jordan Kim", score: profileData.veriScore - 15 }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="text-white/60 font-medium w-8">#{user.rank}</div>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-white/80 text-sm">{user.name}</div>
                        <div className="text-white/50 text-xs">{user.score} points</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full glass-subtle border-white/20 text-white hover:bg-white/10">
                  View Full Leaderboard
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Performing Content */}
      <AnimatePresence>
        {privacySettings.showTopContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="glass-subtle p-6 border-white/10">
              <h3 className="text-white font-semibold mb-6">Top Performing Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.topContent.slice(0, 6).map((content) => {
                  const Icon = getPlatformIcon(content.platform);
                  const colorClass = getPlatformColor(content.platform);
                  
                  return (
                    <Card key={content.id} className="glass-subtle border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 group">
                      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                        {content.thumbnail && (
                          <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute top-2 left-2">
                          <Icon className={`w-4 h-4 ${colorClass}`} />
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-black/60 text-white text-xs">
                            {formatNumber(content.views)} views
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">{content.title}</h4>
                        <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                          <span>{content.date}</span>
                          <span>{content.engagement}% engagement</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span className="text-white/60">{formatNumber(content.likes)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Share2 className="w-3 h-3" />
                              <span className="text-white/60">{formatNumber(content.shares)}</span>
                            </div>
                          </div>
                          {privacySettings.showEarnings && (
                            <div className="text-emerald-400 font-medium">
                              ${content.revenue}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="glass-subtle border-white/20 text-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All Content
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
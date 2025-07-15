import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { apiRequest } from "@/lib/queryClient";
import { 
  Camera, 
  Edit3, 
  Eye, 
  Share2, 
  Copy, 
  Check, 
  Shield, 
  Trophy, 
  ExternalLink,
  MapPin,
  Calendar,
  Link,
  Globe,
  Save,
  Upload,
  X,
  Plus,
  Settings,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  Users,
  Star,
  Award,
  Crown,
  Zap,
  Image as ImageIcon
} from "lucide-react";
import { 
  FaTwitter, 
  FaYoutube, 
  FaInstagram, 
  FaTiktok, 
  FaTwitch,
  FaLinkedin,
  FaDiscord 
} from "react-icons/fa";

interface ProfileBuilder2Props {
  className?: string;
}

interface SocialConnection {
  id: number;
  platform: string;
  username: string;
  followers: number;
  isConnected: boolean;
}

interface ContentItem {
  id: string;
  platform: string;
  title: string;
  views: number;
  likes: number;
  engagement: number;
  date: string;
  thumbnail?: string;
  type: 'video' | 'post' | 'stream';
}

const PLATFORM_ICONS: Record<string, any> = {
  twitter: FaTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  twitch: FaTwitch,
  linkedin: FaLinkedin,
  discord: FaDiscord,
};

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "bg-blue-500",
  youtube: "bg-red-500",
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  tiktok: "bg-black",
  twitch: "bg-purple-600",
  linkedin: "bg-blue-600",
  discord: "bg-indigo-500",
};

const getTierInfo = (score: number) => {
  if (score >= 90) return { name: "Diamond", color: "from-blue-400 to-cyan-400", icon: "💎" };
  if (score >= 70) return { name: "Platinum", color: "from-gray-300 to-gray-400", icon: "🏆" };
  if (score >= 50) return { name: "Gold", color: "from-yellow-400 to-yellow-500", icon: "👑" };
  return { name: "Silver", color: "from-gray-400 to-gray-500", icon: "⭐" };
};

export function ProfileBuilder2({ className = "" }: ProfileBuilder2Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState("edit");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.username || "Creator",
    bio: "🎮 Gaming content creator | 🔥 Building the future of Web3 | 💡 Authentic storytelling",
    location: "Los Angeles, CA",
    website: "https://veri.club/creator",
    customUsername: user?.username?.toLowerCase() || "creator",
    bannerUrl: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1200&h=400&fit=crop",
    avatarUrl: "",
    joinDate: "January 2024",
    pronouns: "they/them",
    verified: true
  });

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

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      return apiRequest(`/api/users/${user?.id}/profile`, {
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: () => {
      triggerHaptic("success");
      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}`] });
    },
    onError: (error) => {
      triggerHaptic("error");
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleFileUpload = async (file: File, type: 'banner' | 'avatar') => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload (in real implementation, upload to your storage service)
    setTimeout(() => {
      const imageUrl = URL.createObjectURL(file);
      if (type === 'banner') {
        setProfileData(prev => ({ ...prev, bannerUrl: imageUrl }));
      } else {
        setProfileData(prev => ({ ...prev, avatarUrl: imageUrl }));
      }
      setIsUploading(false);
      toast({
        title: `${type === 'banner' ? 'Banner' : 'Profile picture'} updated!`,
        description: "Your image has been uploaded successfully.",
      });
    }, 1500);
  };

  const handleCopyProfileUrl = () => {
    const profileUrl = `https://veri.club/${profileData.customUsername}`;
    navigator.clipboard.writeText(profileUrl);
    setCopiedUrl(true);
    triggerHaptic("success");
    toast({
      title: "Link Copied!",
      description: "Profile link copied to clipboard.",
    });
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const veriScore = userData?.veriScore || 85;
  const tier = getTierInfo(veriScore);
  const totalFollowers = socialConnections?.reduce((sum: number, conn: SocialConnection) => sum + (conn.followers || 0), 0) || 12500;
  
  // Mock content data (replace with real data)
  const featuredContent: ContentItem[] = [
    {
      id: "1",
      platform: "youtube",
      title: "Epic Gaming Montage - Best Plays 2024",
      views: 85000,
      likes: 3200,
      engagement: 4.2,
      date: "2 days ago",
      type: "video"
    },
    {
      id: "2", 
      platform: "twitch",
      title: "Live Gaming Session - New Strategy!",
      views: 12000,
      likes: 890,
      engagement: 7.8,
      date: "1 week ago",
      type: "stream"
    },
    {
      id: "3",
      platform: "twitter",
      title: "Thread: How to improve your gaming setup...",
      views: 45000,
      likes: 1200,
      engagement: 3.1,
      date: "3 days ago",
      type: "post"
    }
  ];

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-800/50 border-slate-600">
          <TabsTrigger 
            value="edit" 
            className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger 
            value="share" 
            className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            <Share2 className="w-4 h-4" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          {/* Banner Section */}
          <Card className="overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10">
            <div className="relative h-48 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              {profileData.bannerUrl && (
                <img 
                  src={profileData.bannerUrl} 
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30" />
              <Button
                onClick={() => bannerInputRef.current?.click()}
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Edit Banner"}
              </Button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'banner');
                }}
              />
            </div>

            {/* Profile Picture & Basic Info */}
            <CardContent className="relative pt-0 pb-6 bg-slate-900/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative z-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-2xl">
                    {profileData.avatarUrl ? (
                      <img 
                        src={profileData.avatarUrl} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profileData.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <Button
                    onClick={() => avatarInputRef.current?.click()}
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-2 right-2 rounded-full w-8 h-8 bg-slate-800 hover:bg-slate-700 border-slate-600"
                    disabled={isUploading}
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                  </Button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'avatar');
                    }}
                  />
                </div>
                
                <div className="flex-1 space-y-4 sm:ml-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-emerald-100">Display Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your display name"
                        className="mt-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username" className="text-emerald-100">Username</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm">
                          veri.club/
                        </span>
                        <Input
                          id="username"
                          value={profileData.customUsername}
                          onChange={(e) => setProfileData(prev => ({ ...prev, customUsername: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                          placeholder="username"
                          className="pl-20 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="bio" className="text-emerald-100">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell people about yourself..."
                    className="mt-1 min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                  />
                  <p className="text-sm text-emerald-300 mt-1">
                    {profileData.bio.length}/160 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-emerald-100">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your location"
                      className="mt-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-emerald-100">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://your-website.com"
                      className="mt-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pronouns" className="text-emerald-100">Pronouns (Optional)</Label>
                  <Input
                    id="pronouns"
                    value={profileData.pronouns}
                    onChange={(e) => setProfileData(prev => ({ ...prev, pronouns: e.target.value }))}
                    placeholder="they/them, she/her, he/him"
                    className="mt-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {/* Profile Preview - Reference Layout Style */}
          <Card className="overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10">
            {/* Banner */}
            <div className="relative h-48 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              {profileData.bannerUrl && (
                <img 
                  src={profileData.bannerUrl} 
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30" />
            </div>

            <CardContent className="relative pt-0 pb-6 bg-slate-900/80">
              {/* Profile Header */}
              <div className="flex justify-between items-start -mt-16 relative z-10 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-2xl">
                  {profileData.avatarUrl ? (
                    <img 
                      src={profileData.avatarUrl} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profileData.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                
                <div className="flex gap-2 mt-16">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">
                    Follow
                  </Button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-white">{profileData.name}</h1>
                    {profileData.verified && (
                      <Shield className="w-5 h-5 text-emerald-400 fill-current" />
                    )}
                    <Badge className={`bg-gradient-to-r ${tier.color} text-white`}>
                      {tier.icon} {tier.name}
                    </Badge>
                  </div>
                  <p className="text-slate-400">@{profileData.customUsername}</p>
                  {profileData.pronouns && (
                    <p className="text-slate-400 text-sm">{profileData.pronouns}</p>
                  )}
                </div>

                <p className="text-slate-200 whitespace-pre-wrap">{profileData.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  {profileData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </div>
                  )}
                  {profileData.website && (
                    <div className="flex items-center gap-1">
                      <Link className="w-4 h-4" />
                      <a href={profileData.website} className="text-emerald-400 hover:underline">
                        {profileData.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {profileData.joinDate}
                  </div>
                </div>

                {/* Follower Stats */}
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-bold text-white">285</span>{" "}
                    <span className="text-slate-400">Following</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">{totalFollowers.toLocaleString()}</span>{" "}
                    <span className="text-slate-400">Followers</span>
                  </div>
                </div>

                {/* Social Connections */}
                {socialConnections && socialConnections.length > 0 && (
                  <div className="pt-4 border-t border-slate-600">
                    <h3 className="font-semibold mb-3 text-white">Connected Platforms</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {socialConnections.slice(0, 6).map((connection: SocialConnection) => {
                        const Icon = PLATFORM_ICONS[connection.platform.toLowerCase()];
                        return (
                          <div key={connection.id} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-600">
                            {Icon && <Icon className="w-4 h-4 text-emerald-400" />}
                            <div>
                              <p className="text-xs font-medium capitalize text-slate-200">{connection.platform}</p>
                              <p className="text-xs text-slate-400">{connection.followers?.toLocaleString()} followers</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Featured Content */}
                <div className="pt-4 border-t border-slate-600">
                  <h3 className="font-semibold mb-3 text-white">Featured Content</h3>
                  <div className="space-y-3">
                    {featuredContent.map((content) => {
                      const Icon = PLATFORM_ICONS[content.platform];
                      return (
                        <div key={content.id} className="flex gap-3 p-3 border border-slate-600 rounded-lg hover:bg-slate-800/50 transition-colors">
                          <div className={`w-10 h-10 rounded ${PLATFORM_COLORS[content.platform]} flex items-center justify-center text-white`}>
                            {Icon && <Icon className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-slate-200">{content.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                              <span>{content.views.toLocaleString()} views</span>
                              <span>{content.likes.toLocaleString()} likes</span>
                              <span>{content.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">{content.engagement}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 text-white">Share Your Profile</h2>
                <p className="text-slate-400">Share your Veri profile with your audience</p>
              </div>

              {/* Profile URL */}
              <div className="space-y-2">
                <Label className="text-emerald-100">Your Profile URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={`https://veri.club/${profileData.customUsername}`}
                    readOnly
                    className="flex-1 bg-slate-800/50 border-slate-600 text-white"
                  />
                  <Button
                    onClick={handleCopyProfileUrl}
                    variant="outline"
                    className="flex-shrink-0 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Share on Social Media</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => {
                      const url = `https://twitter.com/intent/tweet?text=Check out my creator profile on @VeriHQ&url=https://veri.club/${profileData.customUsername}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <FaTwitter className="w-4 h-4 text-blue-400" />
                    Share on Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => {
                      const url = `https://www.linkedin.com/sharing/share-offsite/?url=https://veri.club/${profileData.customUsername}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <FaLinkedin className="w-4 h-4 text-blue-400" />
                    Share on LinkedIn
                  </Button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="pt-4 border-t border-slate-600 text-center">
                <h3 className="font-semibold mb-4 text-white">QR Code</h3>
                <div className="w-32 h-32 mx-auto bg-slate-800/50 border border-slate-600 rounded-lg flex items-center justify-center">
                  <div className="text-slate-400 text-xs">QR Code</div>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Scan to view profile
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
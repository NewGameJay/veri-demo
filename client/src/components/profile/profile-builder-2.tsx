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
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [showVeriScore, setShowVeriScore] = useState(true);
  const [showRank, setShowRank] = useState(true);
  const [showSocialIcons, setShowSocialIcons] = useState(true);
  const [hasSharedForXP, setHasSharedForXP] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.username || "Creator",
    bio: "🎮 Gaming content creator | 🔥 Building the future of Web3 | 💡 Authentic storytelling",
    location: "Los Angeles, CA",
    website: "https://veri.club/creator",
    customUsername: user?.username?.toLowerCase() || "creator",
    bannerUrl: "",
    avatarUrl: "",
    joinDate: "January 2024",
    verified: true,
    topContent: [
      { platform: "youtube", title: "Epic Gaming Montage - Best Plays 2024", url: "https://youtube.com/watch?v=abc123" },
      { platform: "twitch", title: "Live Gaming Session - New Strategy!", url: "https://twitch.tv/creator/video/123" },
      { platform: "twitter", title: "Thread: How to improve your gaming setup", url: "https://twitter.com/creator/status/123" }
    ]
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

  // Fetch leaderboard data for rank
  const { data: leaderboardData } = useQuery({
    queryKey: [`/api/leaderboard/user/${user?.id}`],
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const response = await fetch(`/api/users/${user?.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      return response.json();
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

  const handleGenerateAIBio = async () => {
    setIsGeneratingBio(true);
    try {
      // Simulate AI bio generation with BrightMatter AI Engine
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiGeneratedBios = [
        "🎮 Elite gaming creator | 🏆 Championship competitor | 💡 Building Web3 gaming communities | 🔥 Authentic content that inspires millions",
        "🌟 Professional content creator | 🎯 Strategic gameplay expert | 🚀 Pioneering the future of gaming | 💎 Delivering premium gaming experiences",
        "🔥 Gaming industry innovator | 🎮 Competitive esports athlete | 🌐 Web3 gaming evangelist | ⚡ Creating viral gaming content daily"
      ];
      
      const randomBio = aiGeneratedBios[Math.floor(Math.random() * aiGeneratedBios.length)];
      setProfileData(prev => ({ ...prev, bio: randomBio }));
      
      triggerHaptic("success");
      toast({
        title: "Bio Generated!",
        description: "BrightMatter AI has created a new bio for you.",
      });
    } catch (error) {
      triggerHaptic("error");
      toast({
        title: "Generation Failed",
        description: "Failed to generate bio. Please try again.",
        variant: "destructive",
      });
    }
    setIsGeneratingBio(false);
  };

  const addContentLink = () => {
    const newContent = { platform: "youtube", title: "", url: "" };
    setProfileData(prev => ({
      ...prev,
      topContent: [...prev.topContent, newContent]
    }));
  };

  const updateContentLink = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      topContent: prev.topContent.map((content, i) => 
        i === index ? { ...content, [field]: value } : content
      )
    }));
  };

  const removeContentLink = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      topContent: prev.topContent.filter((_, i) => i !== index)
    }));
  };

  const handleShareForXP = async () => {
    if (hasSharedForXP) return;
    
    try {
      // Award 50 XP for sharing profile
      const response = await fetch(`/api/users/${user?.id}/award-xp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points: 50, reason: "Profile sharing reward" }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to award XP");
      }
      
      setHasSharedForXP(true);
      triggerHaptic("success");
      
      toast({
        title: "🎉 50 XP Earned!",
        description: "Thank you for sharing your profile! Your XP has been updated.",
      });
      
      // Invalidate user queries to refresh XP display
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
    } catch (error) {
      triggerHaptic("error");
      toast({
        title: "Error",
        description: "Failed to award XP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const veriScore = userData?.veriScore || 85;
  const tier = getTierInfo(veriScore);
  const totalFollowers = Array.isArray(socialConnections) 
    ? socialConnections.reduce((sum: number, conn: SocialConnection) => sum + (conn.followers || 0), 0) 
    : 12500;
  const userRank = leaderboardData?.user?.rank || 1;
  const connectedSocials = Array.isArray(socialConnections) 
    ? socialConnections.filter((conn: SocialConnection) => conn.isConnected) 
    : [];
  const incompleteConnections = Array.isArray(socialConnections) ? socialConnections.length !== 7 : true; // Assuming 7 major platforms
  
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

                {/* AI Bio Generation */}
                <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-emerald-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      BrightMatter AI Bio Generator
                    </Label>
                    <Button
                      onClick={handleGenerateAIBio}
                      disabled={isGeneratingBio}
                      size="sm"
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                    >
                      {isGeneratingBio ? "Generating..." : "Generate Bio"}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-400">
                    Let our AI create a professional, engaging bio tailored to your gaming content and audience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VeriScore Card Section */}
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  VeriScore & Performance
                </h3>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showVeriScore}
                    onChange={(e) => setShowVeriScore(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  Show on profile
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">{veriScore}</div>
                    <div className="text-sm text-slate-400">VeriScore</div>
                    <Badge className={`mt-2 bg-gradient-to-r ${tier.color} text-white`}>
                      {tier.icon} {tier.name}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">#{userRank}</div>
                    <div className="text-sm text-slate-400">Global Rank</div>
                    <label className="flex items-center gap-2 text-xs text-slate-300 mt-2 justify-center">
                      <input
                        type="checkbox"
                        checked={showRank}
                        onChange={(e) => setShowRank(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                      />
                      Display rank
                    </label>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{totalFollowers.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Total Followers</div>
                    <div className="text-xs text-slate-500 mt-1">Across all platforms</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Connections Section */}
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Social Connections
                </h3>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showSocialIcons}
                    onChange={(e) => setShowSocialIcons(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  Show on profile
                </label>
              </div>

              {incompleteConnections && (
                <div className="mb-4 p-3 bg-amber-900/20 border border-amber-600/30 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-300 mb-2">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Complete Your Social Connections</span>
                  </div>
                  <p className="text-sm text-amber-200 mb-3">
                    Connect more platforms to maximize your profile visibility and attract brand partnerships.
                  </p>
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Connect More Platforms
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {connectedSocials.slice(0, 6).map((connection: SocialConnection) => {
                  const Icon = PLATFORM_ICONS[connection.platform.toLowerCase()];
                  return (
                    <div key={connection.id} className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      {Icon && <Icon className="w-5 h-5 text-emerald-400" />}
                      <div>
                        <p className="text-xs font-medium capitalize text-slate-200">{connection.platform}</p>
                        <p className="text-xs text-slate-400">{connection.followers?.toLocaleString()} followers</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Content Section */}
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Top Performing Content
                </h3>
                <Button
                  onClick={addContentLink}
                  size="sm"
                  variant="outline"
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </div>
              
              <p className="text-sm text-slate-400 mb-4">
                Showcase your best content to attract brand partnerships and demonstrate your reach.
              </p>

              <div className="space-y-3">
                {profileData.topContent.map((content, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="md:col-span-2">
                      <select
                        value={content.platform}
                        onChange={(e) => updateContentLink(index, 'platform', e.target.value)}
                        className="w-full bg-slate-700 border-slate-600 text-white rounded px-2 py-1 text-sm"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="twitch">Twitch</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                      </select>
                    </div>
                    <div className="md:col-span-5">
                      <Input
                        value={content.title}
                        onChange={(e) => updateContentLink(index, 'title', e.target.value)}
                        placeholder="Content title"
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <Input
                        value={content.url}
                        onChange={(e) => updateContentLink(index, 'url', e.target.value)}
                        placeholder="Content URL"
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Button
                        onClick={() => removeContentLink(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Display Preferences */}
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-emerald-400" />
                Profile Display Preferences
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                  <div>
                    <div className="text-white font-medium">Verification Badge</div>
                    <div className="text-sm text-slate-400">Show Veri verification checkmark next to username</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {profileData.verified && <Shield className="w-4 h-4 text-emerald-400" />}
                    <span className="text-sm text-emerald-400">Verified by Veri</span>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-white">{profileData.name}</h1>
                    {profileData.verified && (
                      <Shield className="w-5 h-5 text-emerald-400 fill-current" />
                    )}
                    <Badge className={`bg-gradient-to-r ${tier.color} text-white`}>
                      {tier.icon} {tier.name}
                    </Badge>
                    {showRank && (
                      <Badge className="bg-blue-600 text-white">
                        #{userRank} Global
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400">@{profileData.customUsername}</p>
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

                {/* VeriScore Display */}
                {showVeriScore && (
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-emerald-400" />
                          <span className="text-white font-medium">VeriScore</span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">{veriScore}/100</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-medium">{totalFollowers.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">Total Reach</div>
                      </div>
                    </div>
                  </div>
                )}

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
                {showSocialIcons && connectedSocials && connectedSocials.length > 0 && (
                  <div className="pt-4 border-t border-slate-600">
                    <h3 className="font-semibold mb-3 text-white">Connected Platforms</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {connectedSocials.slice(0, 6).map((connection: SocialConnection) => {
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

                {/* Top Performing Content */}
                {profileData.topContent && profileData.topContent.length > 0 && (
                  <div className="pt-4 border-t border-slate-600">
                    <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Top Performing Content
                    </h3>
                    <div className="space-y-3">
                      {profileData.topContent.map((content, index) => {
                        const Icon = PLATFORM_ICONS[content.platform.toLowerCase()];
                        const platformColor = content.platform === 'youtube' ? 'bg-red-600' :
                                             content.platform === 'twitch' ? 'bg-purple-600' :
                                             content.platform === 'twitter' ? 'bg-blue-600' :
                                             content.platform === 'instagram' ? 'bg-pink-600' :
                                             content.platform === 'tiktok' ? 'bg-gray-800' : 'bg-emerald-600';
                        
                        return (
                          <div key={index} className="flex gap-3 p-3 bg-slate-800/30 border border-slate-600 rounded-lg hover:bg-slate-800/50 transition-colors">
                            <div className={`w-10 h-10 rounded ${platformColor} flex items-center justify-center text-white`}>
                              {Icon && <Icon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-slate-200 mb-1">{content.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span className="capitalize">{content.platform}</span>
                                {content.url && (
                                  <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                                    View Content
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <ExternalLink className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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

              {/* Diamond XP Reward CTA */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border border-emerald-400/30 p-4 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 animate-pulse"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center animate-bounce">
                      <span className="text-2xl">💎</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Earn 50 XP Instantly!</h3>
                      <p className="text-emerald-300 text-sm">Share your profile and get rewarded</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleShareForXP}
                    disabled={hasSharedForXP}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {hasSharedForXP ? '✓ Claimed!' : '💎 Claim 50 XP'}
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
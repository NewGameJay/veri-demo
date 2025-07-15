import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { 
  Edit3, 
  Eye, 
  Share2, 
  Copy, 
  Check, 
  Shield, 
  Trophy, 
  ExternalLink,
  Plus,
  Image,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  BarChart3,
  Calendar,
  Crown,
  X
} from "lucide-react";
import { 
  FaTwitter, 
  FaYoutube, 
  FaInstagram, 
  FaTiktok, 
  FaTwitch,
  FaLinkedin 
} from "react-icons/fa";

interface UnifiedProfileBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
}

interface ProfileData {
  name: string;
  bio: string;
  website: string;
  avatar?: string;
  isVerified: boolean;
  customUsername: string;
  showcaseContent: ContentPiece[];
}

interface ContentPiece {
  id: string;
  platform: string;
  title: string;
  description: string;
  thumbnail: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: string;
  url: string;
}

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

export function UnifiedProfileBuilder({ isOpen, onClose, trigger }: UnifiedProfileBuilderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState("edit");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.username || "",
    bio: "",
    website: "",
    isVerified: false,
    customUsername: user?.username?.toLowerCase().replace(/\s+/g, '') || "",
    showcaseContent: []
  });
  const [linkCopied, setLinkCopied] = useState(false);

  // Fetch user data and social connections
  const { data: userData } = useQuery({
    queryKey: ["/api/users", user?.id],
    enabled: !!user?.id,
  });

  const { data: socialConnections } = useQuery({
    queryKey: ["/api/social-connections", user?.id],
    enabled: !!user?.id,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["/api/leaderboard/user", user?.id],
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      const response = await fetch(`/api/users/${user?.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
      toast({
        title: "Profile Updated",
        description: "Your VeriProfile has been successfully updated.",
      });
      triggerHaptic("success");
    },
  });

  // Initialize profile data
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.username || "",
        bio: userData.bio || "",
        website: userData.website || "",
        isVerified: userData.isVerified || false,
        customUsername: userData.customUsername || userData.username?.toLowerCase().replace(/\s+/g, '') || "",
        showcaseContent: userData.showcaseContent || []
      });
    }
  }, [userData]);

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const copyProfileLink = async () => {
    const profileUrl = `${window.location.origin}/veri.club/${profileData.customUsername}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      triggerHaptic("light");
      toast({
        title: "Link Copied!",
        description: "Your VeriProfile link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToSocial = (platform: string) => {
    const profileUrl = `${window.location.origin}/veri.club/${profileData.customUsername}`;
    const text = `Check out my VeriProfile! I'm verified on Veri as a ${user?.userType || 'creator'} 🎮✨`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
      triggerHaptic("light");
    }
  };

  const connectedPlatforms = socialConnections?.filter((conn: any) => conn.connected) || [];
  const userVeriScore = userData?.veriScore || 0;
  const userXP = userData?.xpPoints || 0;
  const userRank = leaderboardData?.user?.rank || 999;

  const getTierBadge = (score: number) => {
    if (score >= 90) return { name: "Diamond", color: "from-cyan-400 to-blue-500", icon: Crown };
    if (score >= 70) return { name: "Platinum", color: "from-gray-400 to-gray-600", icon: Trophy };
    if (score >= 50) return { name: "Gold", color: "from-yellow-400 to-yellow-600", icon: Trophy };
    return { name: "Silver", color: "from-gray-300 to-gray-500", icon: Trophy };
  };

  const tier = getTierBadge(userVeriScore);

  // Sample showcase content for demo
  const sampleContent: ContentPiece[] = [
    {
      id: "1",
      platform: "youtube",
      title: "Ultimate Gaming Setup Tour 2025",
      description: "Complete walkthrough of my streaming setup",
      thumbnail: "/api/placeholder/300/200",
      metrics: { views: 45200, likes: 2100, comments: 340, shares: 180 },
      createdAt: "2025-01-10",
      url: "https://youtube.com/watch?v=demo"
    },
    {
      id: "2", 
      platform: "twitch",
      title: "Epic 12-Hour Gaming Marathon",
      description: "Charity stream for gaming education",
      thumbnail: "/api/placeholder/300/200",
      metrics: { views: 12800, likes: 890, comments: 120, shares: 45 },
      createdAt: "2025-01-05",
      url: "https://twitch.tv/demo"
    },
    {
      id: "3",
      platform: "twitter",
      title: "Gaming Tips Thread",
      description: "15 pro tips every gamer should know",
      thumbnail: "/api/placeholder/300/200",
      metrics: { views: 8900, likes: 450, comments: 89, shares: 210 },
      createdAt: "2025-01-03",
      url: "https://twitter.com/demo"
    }
  ];

  const ContentPiece = ({ content }: { content: ContentPiece }) => {
    const PlatformIcon = platformIcons[content.platform as keyof typeof platformIcons];
    const platformColor = platformColors[content.platform as keyof typeof platformColors];

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-2 mb-3">
          <PlatformIcon className="w-4 h-4" style={{ color: platformColor }} />
          <span className="text-xs text-white/60 uppercase tracking-wider">{content.platform}</span>
          <Badge variant="outline" className="text-xs border-white/20 text-white/70">
            {new Date(content.createdAt).toLocaleDateString()}
          </Badge>
        </div>
        
        <h3 className="text-white font-medium mb-2 line-clamp-2">{content.title}</h3>
        <p className="text-white/70 text-sm mb-3 line-clamp-2">{content.description}</p>
        
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-emerald-400" />
            VeriProfile Builder
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="edit" className="text-white data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-white data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="share" className="text-white data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </TabsTrigger>
          </TabsList>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/80">Display Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Your display name"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80">Custom Username</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-sm">veri.club/</span>
                      <Input
                        value={profileData.customUsername}
                        onChange={(e) => setProfileData({ ...profileData, customUsername: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/80">Bio</Label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Tell brands and studios about yourself..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white/80">Website</Label>
                    <Input
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-2xl text-emerald-400">
                          {profileData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{profileData.name || "Your Name"}</h3>
                          {profileData.isVerified && (
                            <Shield className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-white/70 text-sm mt-1">
                          {profileData.bio || "Your bio will appear here..."}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {connectedPlatforms.slice(0, 3).map((platform: any) => {
                            const PlatformIcon = platformIcons[platform.platform as keyof typeof platformIcons];
                            return (
                              <PlatformIcon
                                key={platform.platform}
                                className="w-4 h-4 text-white/60 hover:text-white"
                              />
                            );
                          })}
                          {connectedPlatforms.length > 3 && (
                            <span className="text-xs text-white/60">+{connectedPlatforms.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mini VeriScore */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-emerald-400 text-2xl font-bold">{userVeriScore}</div>
                          <div className="text-white/70 text-xs">VeriScore</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-lg font-semibold">{userXP}XP</div>
                          <div className="text-white/70 text-xs">VeriPoints</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Connections Status */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Connected Platforms
                  <Badge variant="outline" className="border-white/20 text-white/70">
                    {connectedPlatforms.length} connected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {Object.entries(platformIcons).map(([platform, Icon]) => {
                    const isConnected = connectedPlatforms.some((conn: any) => conn.platform === platform);
                    const platformColor = platformColors[platform as keyof typeof platformColors];
                    
                    return (
                      <div
                        key={platform}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                          isConnected 
                            ? "border-emerald-500/50 bg-emerald-500/10" 
                            : "border-white/20 bg-white/5"
                        }`}
                      >
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: isConnected ? platformColor : "#ffffff60" }}
                        />
                        <span className="text-xs text-white/70 capitalize">{platform}</span>
                        {isConnected ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Plus className="w-3 h-3 text-white/40" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {connectedPlatforms.length < 3 && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-amber-400 text-sm">
                      Connect more platforms to make your profile stand out to brands and studios!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile} 
                disabled={updateProfileMutation.isPending}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Section */}
              <div className="lg:col-span-1 space-y-4">
                {/* Profile Header */}
                <Card className="bg-white/5 border-white/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-3xl text-emerald-400">
                          {profileData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-2">
                          <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
                          {profileData.isVerified && (
                            <Shield className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-white/70 mt-2">{profileData.bio}</p>
                        
                        {/* Social Icons */}
                        <div className="flex justify-center gap-3 mt-4">
                          {connectedPlatforms.map((platform: any) => {
                            const PlatformIcon = platformIcons[platform.platform as keyof typeof platformIcons];
                            const platformColor = platformColors[platform.platform as keyof typeof platformColors];
                            return (
                              <motion.div
                                key={platform.platform}
                                whileHover={{ scale: 1.1 }}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                              >
                                <PlatformIcon className="w-4 h-4" style={{ color: platformColor }} />
                              </motion.div>
                            );
                          })}
                        </div>

                        {profileData.website && (
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm mt-3"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* VeriScore Card */}
                <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/30">
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-emerald-400">{userVeriScore}</div>
                      <div className="text-white/70 text-sm">VeriScore</div>
                      <div className="text-xl font-semibold text-white">{userXP}XP</div>
                      <div className="text-white/70 text-xs">VeriPoints</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Leaderboard Rank */}
                <Card className="bg-white/5 border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-white">#{userRank}</div>
                        <div className="text-white/70 text-sm">Global Rank</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <tier.icon className="w-5 h-5 text-emerald-400" />
                        <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0`}>
                          {tier.name}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Content */}
              <div className="lg:col-span-2">
                <Card className="bg-white/5 border-white/20 h-full">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Top Performing Content
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        Showcasing best work to attract brands
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {sampleContent.map((content) => (
                        <ContentPiece key={content.id} content={content} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share" className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-white">Share Your VeriProfile</h3>
              <p className="text-white/70">Let brands and studios discover your gaming content and expertise</p>
              
              {/* Profile Link */}
              <Card className="bg-white/5 border-white/20 max-w-md mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={`veri.club/${profileData.customUsername}`}
                      readOnly
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Button
                      onClick={copyProfileLink}
                      size="icon"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Share Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => shareToSocial('twitter')}
                  className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white"
                >
                  <FaTwitter className="w-4 h-4 mr-2" />
                  Share on Twitter
                </Button>
                <Button
                  onClick={() => shareToSocial('linkedin')}
                  className="bg-[#0077B5] hover:bg-[#0077B5]/80 text-white"
                >
                  <FaLinkedin className="w-4 h-4 mr-2" />
                  Share on LinkedIn
                </Button>
              </div>

              {/* Profile Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{connectedPlatforms.length}</div>
                  <div className="text-white/70 text-sm">Platforms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{userVeriScore}</div>
                  <div className="text-white/70 text-sm">VeriScore</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">#{userRank}</div>
                  <div className="text-white/70 text-sm">Rank</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { apiRequest } from "@/lib/queryClient";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  X,
  Globe,
  Save,
  GripVertical,
  Move
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

interface ProfileSection {
  id: string;
  type: 'profile-header' | 'veriscore' | 'rank' | 'social-connections' | 'featured-content';
  title: string;
  enabled: boolean;
  order: number;
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

// Sortable Profile Section Component
function SortableProfileSection({ id, children, isDragging }: { 
  id: string; 
  children: React.ReactNode; 
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <div className="bg-white/10 hover:bg-white/20 rounded-md p-1">
          <GripVertical className="w-4 h-4 text-white/60" />
        </div>
      </div>
      {children}
    </div>
  );
}

export function UnifiedProfileBuilder({ isOpen, onClose }: UnifiedProfileBuilderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "share">("edit");
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.username || "",
    bio: user?.bio || "",
    website: user?.website || "",
    isVerified: user?.isVerified || false,
    customUsername: user?.customUsername || user?.username?.toLowerCase().replace(/\s+/g, '') || "",
    showcaseContent: []
  });

  const [profileSections, setProfileSections] = useState<ProfileSection[]>([
    { id: 'profile-header', type: 'profile-header', title: 'Profile Header', enabled: true, order: 0 },
    { id: 'veriscore', type: 'veriscore', title: 'VeriScore Card', enabled: true, order: 1 },
    { id: 'rank', type: 'rank', title: 'Global Rank', enabled: true, order: 2 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get user's social connections
  const { data: socialConnections = [] } = useQuery({
    queryKey: ["/api/social-connections", user?.id],
    enabled: !!user?.id && isOpen,
  });

  // Get user's leaderboard position
  const { data: leaderboardData } = useQuery({
    queryKey: ["/api/leaderboard/user", user?.id],
    enabled: !!user?.id && isOpen,
  });

  const connectedPlatforms = socialConnections.filter(conn => conn.isConnected);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      return apiRequest(`/api/users/${user?.id}/profile`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your VeriProfile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
      triggerHaptic("success");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
      triggerHaptic("error");
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${profileData.customUsername}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Your VeriProfile link has been copied to clipboard.",
    });
    triggerHaptic("light");
  };

  const shareOnSocial = (platform: string) => {
    const profileUrl = `${window.location.origin}/profile/${profileData.customUsername}`;
    const text = `Check out my VeriProfile: ${profileData.name} - Gaming Creator on Veri`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
    triggerHaptic("light");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProfileSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Update order numbers
        const updatedOrder = newOrder.map((item, index) => ({
          ...item,
          order: index
        }));
        
        // Trigger haptic feedback
        triggerHaptic("light");
        
        return updatedOrder;
      });
    }
  };

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

  const userTier = leaderboardData?.user?.tier || "Bronze";
  const tierConfig = getTierBadge(userTier);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-transparent border-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full h-full bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">VeriProfile Builder</h2>
              <p className="text-white/60">Create your professional gaming creator profile</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Tab Navigation */}
              <div className="flex bg-white/5 rounded-lg p-1">
                {[
                  { id: "edit", label: "Edit", icon: Edit3 },
                  { id: "preview", label: "Preview", icon: Eye },
                  { id: "share", label: "Share", icon: Share2 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        activeTab === tab.id
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(100%-80px)]">
            {/* Left Panel - Profile Preview */}
            <div className="w-1/2 p-6 border-r border-white/10 overflow-y-auto">
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={profileSections.map(section => section.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6 pl-6">
                    {profileSections.map((section) => (
                      <SortableProfileSection key={section.id} id={section.id}>
                        {section.type === 'profile-header' && (
                          <motion.div
                            layout
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                          >
                            <div className="flex items-start gap-4">
                              {/* Avatar */}
                              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30">
                                <span className="text-2xl text-emerald-400">
                                  {profileData.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
                                  {profileData.isVerified && (
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                  )}
                                </div>
                                <p className="text-white/60 mb-1">@{profileData.customUsername}</p>
                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                                  Creator & Influencer
                                </Badge>
                              </div>
                            </div>
                            
                            {profileData.bio && (
                              <p className="text-white/80 mt-4 leading-relaxed">{profileData.bio}</p>
                            )}
                            
                            {profileData.website && (
                              <a
                                href={profileData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 mt-3 text-sm"
                              >
                                <Globe className="w-3 h-3" />
                                {profileData.website}
                              </a>
                            )}

                            {/* Social Icons */}
                            {connectedPlatforms.length > 0 && (
                              <div className="flex gap-3 mt-4">
                                {connectedPlatforms.slice(0, 4).map((platform) => {
                                  const PlatformIcon = platformIcons[platform.platform as keyof typeof platformIcons];
                                  const platformColor = platformColors[platform.platform as keyof typeof platformColors];
                                  
                                  return (
                                    <motion.div
                                      key={platform.platform}
                                      whileHover={{ scale: 1.1 }}
                                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                                      title={`${platform.followerCount?.toLocaleString()} followers`}
                                    >
                                      <PlatformIcon className="w-4 h-4" style={{ color: platformColor }} />
                                    </motion.div>
                                  );
                                })}
                              </div>
                            )}
                          </motion.div>
                        )}

                        {section.type === 'veriscore' && (
                          <motion.div
                            layout
                            className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6"
                          >
                            <div className="text-center space-y-2">
                              <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                                <Trophy className="w-6 h-6 text-emerald-400" />
                              </div>
                              <h4 className="text-white font-semibold">VeriScore</h4>
                              <div className="text-4xl font-bold text-emerald-400">{user?.veriScore || 99}</div>
                              <div className="text-white/70 text-sm">Verified Creator Rating</div>
                              
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="text-2xl font-bold text-white">{(user?.xpPoints || 2500).toLocaleString()}XP</div>
                                <div className="text-white/70 text-sm">VeriPoints</div>
                              </div>
                              
                              <div className="flex items-center justify-center gap-2 mt-3">
                                <tierConfig.icon className="w-4 h-4 text-emerald-400" />
                                <Badge className={`bg-gradient-to-r ${tierConfig.color} text-white border-0 text-xs`}>
                                  {userTier}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {section.type === 'rank' && (
                          <motion.div
                            layout
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold text-white">#{leaderboardData?.user?.rank || 1}</div>
                                <div className="text-white/70 text-sm">Global Rank</div>
                              </div>
                              <div className="text-right">
                                <div className="text-white/70 text-sm">Creator & Influencer</div>
                                <div className="text-emerald-400 text-sm font-medium">Top 1%</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </SortableProfileSection>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Right Panel - Content Based on Active Tab */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "edit" && (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Edit Profile</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-white/80">Display Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="Your display name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="username" className="text-white/80">Custom Username</Label>
                          <div className="relative">
                            <Input
                              id="username"
                              value={profileData.customUsername}
                              onChange={(e) => setProfileData(prev => ({ ...prev, customUsername: e.target.value.toLowerCase().replace(/\s+/g, '') }))}
                              className="bg-white/5 border-white/20 text-white pl-20"
                              placeholder="username"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">
                              veri.club/
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bio" className="text-white/80">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white min-h-[100px] resize-none"
                            placeholder="Tell others about yourself..."
                            maxLength={160}
                          />
                          <div className="text-xs text-white/50 mt-1">
                            {profileData.bio.length}/160 characters
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="website" className="text-white/80">Website</Label>
                          <Input
                            id="website"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="https://your-website.com"
                          />
                        </div>

                        <Button
                          onClick={handleSave}
                          disabled={updateProfileMutation.isPending}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "preview" && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Profile Preview</h3>
                      <p className="text-white/60 mb-6">This is how your profile appears to others</p>
                      
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30">
                            <span className="text-2xl text-emerald-400">
                              {profileData.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
                              {profileData.isVerified && (
                                <Shield className="w-5 h-5 text-emerald-400" />
                              )}
                            </div>
                            <p className="text-white/60">@{profileData.customUsername}</p>
                          </div>

                          {profileData.bio && (
                            <p className="text-white/80 text-center max-w-md mx-auto">{profileData.bio}</p>
                          )}

                          {profileData.website && (
                            <a
                              href={profileData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Visit Website
                            </a>
                          )}

                          <div className="pt-4">
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                              Verified Creator
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "share" && (
                  <motion.div
                    key="share"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Share Profile</h3>
                      <p className="text-white/60 mb-6">Share your VeriProfile with the world</p>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white/80">Your Profile Link</Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              value={`veri.club/${profileData.customUsername}`}
                              readOnly
                              className="bg-white/5 border-white/20 text-white"
                            />
                            <Button
                              onClick={copyProfileLink}
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white/80">Share on Social Media</Label>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <Button
                              onClick={() => shareOnSocial('twitter')}
                              className="bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                            >
                              <FaTwitter className="w-4 h-4 mr-2" />
                              Twitter
                            </Button>
                            <Button
                              onClick={() => shareOnSocial('linkedin')}
                              className="bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30"
                            >
                              <FaLinkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </Button>
                          </div>
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-emerald-400 font-medium">Pro Tip</h4>
                              <p className="text-white/70 text-sm mt-1">
                                Share your VeriProfile to attract brand partnerships and showcase your creator stats.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
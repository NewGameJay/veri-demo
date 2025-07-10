import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Camera, 
  Link, 
  MapPin, 
  Globe,
  Twitter,
  Youtube,
  Instagram,
  Music,
  Linkedin,
  Github,
  Video,
  MessageCircle,
  Facebook,
  Palette,
  ExternalLink,
  Users,
  TrendingUp,
  Star,
  Award,
  Target,
  Zap,
  Sparkles,
  Crown,
  Shield,
  Heart,
  Eye,
  Share,
  Bookmark,
  Edit,
  Settings,
  Plus,
  X,
  ChevronRight,
  Upload,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
  Rocket,
  Gift,
  Coins,
  Trophy,
  Flame,
  Coffee,
  Gamepad2,
  Code,
  Cpu,
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Mic,
  Image,
  FileText,
  Brush,
  Scissors,
  Wand2,
  Layers,
  Filter,
  Maximize,
  Minimize,
  RotateCw,
  RefreshCw
} from "lucide-react";

interface ProfileBuilderProps {
  user: any;
  profileType: "creator" | "studio";
}

export function ProfileBuilder({ user, profileType }: ProfileBuilderProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
    bio: "Creator & Entrepreneur passionate about authentic content",
    location: "San Francisco, CA",
    website: "",
    profileImage: "",
    coverImage: "",
    contentCategories: ["Tech", "Lifestyle"],
    audienceSize: "10K-50K",
    platforms: {
      twitter: "",
      youtube: "",
      instagram: "",
      tiktok: "",
      linkedin: "",
      github: "",
      twitch: "",
      discord: "",
      facebook: "",
      dribbble: "",
      behance: "",
      portfolio: ""
    },
    preferences: {
      publicProfile: true,
      showStats: true,
      showSocialLinks: true,
      showRecentActivity: true,
      allowMessages: true,
      showOnLeaderboard: true
    },
    skills: ["Content Creation", "Social Media", "Video Editing", "Photography"],
    achievements: ["Early Adopter", "Community Builder", "Content Creator"],
    goals: ["Grow audience", "Monetize content", "Build brand partnerships"],
    availability: "Available for collaboration",
    rates: {
      postRate: "",
      storyRate: "",
      videoRate: "",
      consultationRate: ""
    }
  });
  const { toast } = useToast();

  const contentCategories = [
    "Tech", "Lifestyle", "Gaming", "Beauty", "Fashion", "Food", "Travel", 
    "Fitness", "Music", "Art", "Education", "Business", "Finance", "Comedy",
    "DIY", "Pets", "Sports", "Photography", "Design", "Wellness"
  ];

  const socialPlatforms = [
    { key: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
    { key: "youtube", name: "YouTube", icon: Youtube, color: "text-red-400" },
    { key: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400" },
    { key: "tiktok", name: "TikTok", icon: Music, color: "text-purple-400" },
    { key: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
    { key: "github", name: "GitHub", icon: Github, color: "text-gray-400" },
    { key: "twitch", name: "Twitch", icon: Video, color: "text-purple-500" },
    { key: "discord", name: "Discord", icon: MessageCircle, color: "text-indigo-400" },
    { key: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-500" },
    { key: "dribbble", name: "Dribbble", icon: Camera, color: "text-pink-500" },
    { key: "behance", name: "Behance", icon: Palette, color: "text-blue-700" },
    { key: "portfolio", name: "Portfolio", icon: ExternalLink, color: "text-green-400" }
  ];

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Unable to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleToggleCategory = (category: string) => {
    setProfileData(prev => ({
      ...prev,
      contentCategories: prev.contentCategories.includes(category)
        ? prev.contentCategories.filter(c => c !== category)
        : [...prev.contentCategories, category]
    }));
  };

  const ProfilePreview = () => (
    <div className="glass-effect p-6 rounded-lg border border-white/10">
      <div className="relative mb-6">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg mb-4"></div>
        
        {/* Profile Image */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {profileData.displayName.charAt(0)}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">{profileData.displayName}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              {profileType === "creator" ? "Creator" : "Studio"}
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          </div>
        </div>
        
        <p className="text-white/60 mb-4">{profileData.bio}</p>
        
        <div className="flex items-center space-x-4 text-sm text-white/60 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{profileData.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{profileData.audienceSize} followers</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {profileData.contentCategories.map(category => (
            <Badge key={category} variant="secondary" className="bg-blue-500/20 text-blue-400">
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex space-x-2">
          {Object.entries(profileData.platforms)
            .filter(([key, value]) => value)
            .slice(0, 5)
            .map(([key, value]) => {
              const platform = socialPlatforms.find(p => p.key === key);
              return platform ? (
                <Button
                  key={key}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <platform.icon className={`h-4 w-4 ${platform.color}`} />
                </Button>
              ) : null;
            })}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white">Profile Builder</CardTitle>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
        <CardDescription className="text-white/60">
          Build your {profileType} profile to showcase your work and connect with your audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Form */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">Display Name</Label>
                    <Input
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Bio</Label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Location</Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Website</Label>
                    <Input
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="https://your-website.com"
                      className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Audience Size</Label>
                    <Select
                      value={profileData.audienceSize}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, audienceSize: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="glass-effect border-white/20 bg-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1K">0-1K</SelectItem>
                        <SelectItem value="1K-10K">1K-10K</SelectItem>
                        <SelectItem value="10K-50K">10K-50K</SelectItem>
                        <SelectItem value="50K-100K">50K-100K</SelectItem>
                        <SelectItem value="100K-500K">100K-500K</SelectItem>
                        <SelectItem value="500K+">500K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="social" className="space-y-4">
                <div className="space-y-4">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.key}>
                      <Label className="text-white text-sm flex items-center space-x-2">
                        <platform.icon className={`h-4 w-4 ${platform.color}`} />
                        <span>{platform.name}</span>
                      </Label>
                      <Input
                        value={profileData.platforms[platform.key as keyof typeof profileData.platforms]}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          platforms: {
                            ...prev.platforms,
                            [platform.key]: e.target.value
                          }
                        }))}
                        disabled={!isEditing}
                        placeholder={`Your ${platform.name} handle or URL`}
                        className="mt-1 glass-effect border-white/20 bg-white/10 text-white"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">Content Categories</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {contentCategories.map(category => (
                        <Badge
                          key={category}
                          variant={profileData.contentCategories.includes(category) ? "default" : "secondary"}
                          className={`cursor-pointer ${
                            profileData.contentCategories.includes(category)
                              ? "bg-green-500/20 text-green-400"
                              : "bg-white/10 text-white/60 hover:bg-white/20"
                          }`}
                          onClick={() => isEditing && handleToggleCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Skills</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profileData.skills.map(skill => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-400 flex items-center space-x-1"
                        >
                          <span>{skill}</span>
                          {isEditing && (
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-400"
                              onClick={() => handleRemoveSkill(skill)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Availability</Label>
                    <Select
                      value={profileData.availability}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, availability: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="glass-effect border-white/20 bg-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available for collaboration">Available for collaboration</SelectItem>
                        <SelectItem value="Selective collaborations">Selective collaborations</SelectItem>
                        <SelectItem value="Not available">Not available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(profileData.preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-white text-sm">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setProfileData(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            [key]: checked
                          }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {isEditing && (
              <div className="mt-6 flex space-x-2">
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 veri-gradient"
                >
                  Save Profile
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          {/* Profile Preview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Profile Preview</h3>
            <ProfilePreview />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
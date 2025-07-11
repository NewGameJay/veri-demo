import { useState } from "react";
import { User, Camera, Twitter, Instagram, Youtube, Save, Plus } from "lucide-react";
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { VeriScoreCard } from "@/components/dashboard/veri-score-card";

export default function Profile() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    bio: "Creator & Influencer passionate about authentic content and community building.",
    website: "https://veri.app/samhuber",
    location: "Los Angeles, CA",
    interests: ["Gaming", "Web3", "Content Creation", "AI Technology"]
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onDashboardToggle={() => setIsDashboardOpen(!isDashboardOpen)}
        onMobileMenuToggle={() => setIsDashboardOpen(!isDashboardOpen)}
      />
      <DashboardSidebar
        isOpen={isDashboardOpen}
        isPinned={true}
        isCollapsed={isCollapsed}
        onClose={() => setIsDashboardOpen(false)}
        onPin={() => {}}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <main className={`pt-20 transition-all duration-300 ${isDashboardOpen ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-80') : ''}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-medium border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.username?.substring(0, 2).toUpperCase() || "VU"}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user?.username || "Veri User"}</h3>
                      <p className="text-white/60">@{user?.username || "veriuser"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue={user?.firstName || ""}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={user?.lastName || ""}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ""}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website" className="text-white">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <Button
                    onClick={handleSaveProfile}
                    className="veri-gradient text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
              
              {/* Social Connections */}
              <Card className="glass-medium border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Social Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">Twitter</p>
                        <p className="text-sm text-white/60">@samhuber</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="font-medium text-white">Instagram</p>
                        <p className="text-sm text-white/60">@samhuber</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Youtube className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="font-medium text-white">YouTube</p>
                        <p className="text-sm text-white/60">Not connected</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-white/20 text-white">
                      <Plus className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* VeriScore Card */}
            <div>
              <VeriScoreCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
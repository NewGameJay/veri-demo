import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignCreation } from "@/components/campaigns/campaign-creation";
import { CampaignList } from "@/components/campaigns/campaign-list";
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3
} from "lucide-react";

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isDashboardPinned, setIsDashboardPinned] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access campaigns.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  const isBrand = user?.userType === "studio" || user?.profileType === "studio";
  const isCreator = user?.userType === "creator" || user?.profileType === "creator";

  return (
    <div className="min-h-screen bg-gray-900 hero-gradient text-white"
         style={{
           background: `
             radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
             radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
             linear-gradient(to bottom, #111827, #0f172a)
           `
         }}>
      <Header 
        onDashboardToggle={() => setIsDashboardOpen(!isDashboardOpen)}
        onMobileMenuToggle={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />
      
      <DashboardSidebar 
        isOpen={isDashboardOpen}
        isPinned={isDashboardPinned}
        isCollapsed={isCollapsed}
        onClose={() => setIsDashboardOpen(false)}
        onPin={() => setIsDashboardPinned(!isDashboardPinned)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <MobileNav 
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      
      <main className={`pt-20 px-4 lg:px-6 transition-all duration-300 ease-in-out ${
        isDashboardPinned && !isCollapsed ? 'lg:ml-80' : 
        isDashboardPinned && isCollapsed ? 'lg:ml-20' : 
        ''
      }`}>
        <div className={`mx-auto space-y-6 transition-all duration-300 ease-in-out ${
          isDashboardPinned && !isCollapsed ? 'max-w-6xl' : 
          isDashboardPinned && isCollapsed ? 'max-w-7xl' : 
          'max-w-7xl'
        }`}>
          {/* Header */}
          <div className={`flex flex-col justify-between items-start gap-4 transition-all duration-300 ease-in-out ${
            isDashboardPinned && !isCollapsed ? 'lg:flex-row lg:items-center' : 
            'md:flex-row md:items-center'
          }`}>
            <div>
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <p className="text-muted-foreground">
                {isBrand 
                  ? "Create and manage brand campaigns to connect with creators"
                  : "Discover and participate in brand campaigns to earn rewards"
                }
              </p>
            </div>
            
            <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${
              isDashboardPinned && !isCollapsed ? 'flex-wrap' : ''
            }`}>
              <Button 
                variant="outline"
                onClick={() => setActiveTab("browse")}
                className={activeTab === "browse" ? "bg-emerald-50 border-emerald-200" : ""}
              >
                <Target className="h-4 w-4 mr-2" />
                Browse Campaigns
              </Button>
              {isBrand && (
                <Button 
                  onClick={() => setActiveTab("create")}
                  className={activeTab === "create" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`grid gap-4 transition-all duration-300 ease-in-out ${
            isDashboardPinned && !isCollapsed ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 
            'grid-cols-1 md:grid-cols-4'
          }`}>
        <Card className="glass-subtle border-white/10 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-subtle border-white/10 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
                <p className="text-2xl font-bold">$2,450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-subtle border-white/10 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">348</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-subtle border-white/10 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full glass-secondary ${isBrand ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Browse Campaigns
          </TabsTrigger>
          {isBrand && (
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Campaign
            </TabsTrigger>
          )}
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

            <TabsContent value="browse" className="space-y-6">
              <CampaignList />
            </TabsContent>

            {isBrand && (
              <TabsContent value="create" className="space-y-6">
                <CampaignCreation onSuccess={() => setActiveTab("browse")} />
              </TabsContent>
            )}

            <TabsContent value="analytics" className="space-y-6">
          <div className={`grid gap-6 transition-all duration-300 ease-in-out ${
            isDashboardPinned && !isCollapsed ? 'grid-cols-1 xl:grid-cols-2' : 
            'grid-cols-1 md:grid-cols-2'
          }`}>
            <Card className="glass-subtle border-white/10 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Campaign Performance
                </CardTitle>
                <CardDescription>
                  Overview of your campaign metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Campaigns</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Campaigns</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed Campaigns</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Participants</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Completion Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-subtle border-white/10 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Overview
                </CardTitle>
                <CardDescription>
                  Campaign budget and spending insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Budget Allocated</span>
                    <span className="font-medium">$5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount Spent</span>
                    <span className="font-medium">$2,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Remaining Budget</span>
                    <span className="font-medium">$2,550</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Cost per Action</span>
                    <span className="font-medium">$19.30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="font-medium text-green-600">+245%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 glass-subtle border-white/10 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Campaign Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: "Summer Gaming Campaign",
                      action: "New participant joined",
                      time: "2 hours ago",
                      status: "active"
                    },
                    {
                      title: "Tech Review Series",
                      action: "Submission received",
                      time: "5 hours ago",
                      status: "pending"
                    },
                    {
                      title: "Lifestyle Content Push",
                      action: "Campaign completed",
                      time: "1 day ago",
                      status: "completed"
                    },
                    {
                      title: "Social Media Boost",
                      action: "Payment processed",
                      time: "2 days ago",
                      status: "paid"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass-subtle border-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
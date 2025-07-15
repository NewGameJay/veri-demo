import { useState } from "react";
import { Settings as SettingsIcon } from 'lucide-react';
import { Bell } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Palette } from 'lucide-react';
import { Globe } from 'lucide-react';
import { CreditCard } from 'lucide-react';
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/theme-context";
import { WalletDisplay } from "@/components/wallet/wallet-display";
import { VeriConnectors } from "@/components/settings/veri-connectors";

export default function Settings() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      newFollowers: true,
      achievements: true,
    },
    privacy: {
      profilePublic: true,
      showVeriScore: true,
      showStats: false,
    },
    appearance: {
      compactView: false,
    }
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
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
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-white/60">
                  Manage how you receive updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif" className="text-white cursor-pointer">
                    Email Notifications
                  </Label>
                  <Switch
                    id="email-notif"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: checked }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notif" className="text-white cursor-pointer">
                    Push Notifications
                  </Label>
                  <Switch
                    id="push-notif"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, push: checked }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="task-reminders" className="text-white cursor-pointer">
                    Task Reminders
                  </Label>
                  <Switch
                    id="task-reminders"
                    checked={settings.notifications.taskReminders}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, taskReminders: checked }
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy
                </CardTitle>
                <CardDescription className="text-white/60">
                  Control your profile visibility and data sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-profile" className="text-white cursor-pointer">
                    Public Profile
                  </Label>
                  <Switch
                    id="public-profile"
                    checked={settings.privacy.profilePublic}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, profilePublic: checked }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-veriscore" className="text-white cursor-pointer">
                    Show VeriScore
                  </Label>
                  <Switch
                    id="show-veriscore"
                    checked={settings.privacy.showVeriScore}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showVeriScore: checked }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-stats" className="text-white cursor-pointer">
                    Show Statistics
                  </Label>
                  <Switch
                    id="show-stats"
                    checked={settings.privacy.showStats}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showStats: checked }
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription className="text-white/60">
                  Customize your visual experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-white cursor-pointer">
                    Dark Mode
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light");
                      toast({
                        title: "Theme Updated",
                        description: `Switched to ${checked ? "dark" : "light"} mode`,
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-view" className="text-white cursor-pointer">
                    Compact View
                  </Label>
                  <Switch
                    id="compact-view"
                    checked={settings.appearance.compactView}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, compactView: checked }
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Wallet */}
            <WalletDisplay />

            {/* Veri Connectors */}
            <VeriConnectors />

            {/* Subscription */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription
                </CardTitle>
                <CardDescription className="text-white/60">
                  Manage your Veri+ membership
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Veri+ Pro</span>
                      <span className="text-emerald-400">Active</span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">
                      Unlimited AI agent usage, priority support, and exclusive features
                    </p>
                    <p className="text-sm text-white/40">
                      Next billing date: January 30, 2025
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-white/20 text-white">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                className="veri-gradient text-white px-8"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
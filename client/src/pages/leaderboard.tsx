import { useState } from "react";
import { Trophy, Crown, Medal, TrendingUp, Star } from "lucide-react";
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState("global");

  const categories = [
    { id: "global", label: "Global", icon: Trophy },
    { id: "gaming", label: "Gaming", icon: Crown },
    { id: "lifestyle", label: "Lifestyle", icon: Star },
    { id: "tech", label: "Tech", icon: TrendingUp },
  ];

  const leaderboardData = [
    { rank: 1, name: "Alex Chen", username: "@alexchen", score: 2847, change: "+12", avatar: "AC", tier: "Diamond" },
    { rank: 2, name: "Sarah Johnson", username: "@sarahj", score: 2654, change: "+8", avatar: "SJ", tier: "Diamond" },
    { rank: 3, name: "Mike Wilson", username: "@mikew", score: 2432, change: "+15", avatar: "MW", tier: "Platinum" },
    { rank: 4, name: "Emma Davis", username: "@emmad", score: 2198, change: "-3", avatar: "ED", tier: "Platinum" },
    { rank: 5, name: "John Smith", username: "@johns", score: 2087, change: "+5", avatar: "JS", tier: "Platinum" },
    { rank: 6, name: "Lisa Brown", username: "@lisab", score: 1965, change: "+22", avatar: "LB", tier: "Gold" },
    { rank: 7, name: "Tom Garcia", username: "@tomg", score: 1843, change: "-7", avatar: "TG", tier: "Gold" },
    { rank: 8, name: "Amy Lee", username: "@amyl", score: 1721, change: "+11", avatar: "AL", tier: "Gold" },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Diamond": return "bg-blue-500/20 text-blue-400 border-blue-400/20";
      case "Platinum": return "bg-purple-500/20 text-purple-400 border-purple-400/20";
      case "Gold": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/20";
      default: return "bg-gray-500/20 text-gray-400 border-gray-400/20";
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500 text-black";
      case 2: return "bg-gray-400 text-black";
      case 3: return "bg-orange-600 text-white";
      default: return "bg-white/10 text-white";
    }
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Leaderboard
            </h1>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/20">
              Updated Live
            </Badge>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className={activeCategory === category.id ? "veri-gradient text-white" : "border-white/20 text-white"}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Top 3 Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {leaderboardData.slice(0, 3).map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass-medium border-white/20 relative overflow-hidden ${index === 0 ? 'md:scale-105' : ''}`}>
                  <div className="absolute top-0 right-0 p-4">
                    {index === 0 && <Crown className="w-8 h-8 text-yellow-400" />}
                    {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
                    {index === 2 && <Medal className="w-6 h-6 text-orange-600" />}
                  </div>
                  <CardContent className="p-6 text-center">
                    <div className={`w-20 h-20 ${getRankColor(user.rank)} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                      {user.avatar}
                    </div>
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <p className="text-sm text-white/60 mb-2">{user.username}</p>
                    <div className="text-3xl font-bold text-emerald-400 mb-2">{user.score}</div>
                    <Badge className={getTierColor(user.tier)}>{user.tier}</Badge>
                    <div className={`text-sm mt-2 ${user.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {user.change} points today
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card className="glass-medium border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Full Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${getRankColor(user.rank)} rounded-full flex items-center justify-center font-bold`}>
                        {user.rank}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-white/60">{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getTierColor(user.tier)}>{user.tier}</Badge>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">{user.score}</div>
                        <div className={`text-sm ${user.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {user.change}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Your Position */}
          <Card className="glass-medium border-white/20 mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white font-bold">
                    42
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Your Position</p>
                    <p className="text-white/60">Keep pushing to reach the top!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">1,234</div>
                  <div className="text-sm text-green-400">+18 today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
import { useState } from "react";
import { BarChart } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Users } from 'lucide-react';
import { Eye } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { Star } from 'lucide-react';
import { Play } from 'lucide-react';
import { ThumbsUp } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Youtube } from 'lucide-react';
import { TrendingDown } from 'lucide-react';
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Analytics() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");

  const topContent = [
    {
      id: 1,
      title: "Building the Future of Creator Economy",
      platform: "twitter",
      icon: Twitter,
      engagement: 12500,
      views: 45200,
      likes: 890,
      shares: 156,
      revenue: "$234",
      change: "+24%",
      trend: "up",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Gaming Setup Tour 2024",
      platform: "youtube",
      icon: Youtube,
      engagement: 8900,
      views: 23400,
      likes: 1200,
      shares: 89,
      revenue: "$567",
      change: "+18%",
      trend: "up",
      date: "1 week ago"
    },
    {
      id: 3,
      title: "Tech Review: Latest AI Tools",
      platform: "instagram",
      icon: Instagram,
      engagement: 6700,
      views: 18900,
      likes: 945,
      shares: 67,
      revenue: "$189",
      change: "-5%",
      trend: "down",
      date: "3 days ago"
    },
    {
      id: 4,
      title: "Morning Routine for Creators",
      platform: "youtube",
      icon: Youtube,
      engagement: 5400,
      views: 15600,
      likes: 723,
      shares: 45,
      revenue: "$123",
      change: "+12%",
      trend: "up",
      date: "1 week ago"
    }
  ];

  const stats = [
    {
      title: "Total Views",
      value: "124.5K",
      change: "+12.3%",
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Engagement Rate",
      value: "8.4%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      title: "New Followers",
      value: "1,234",
      change: "+18.5%",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Revenue",
      value: "$3,456",
      change: "+24.7%",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    }
  ];

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
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <div className="flex gap-2">
              {["7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? "veri-gradient text-white" : "border-white/20 text-white"}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-medium border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                      </div>
                      <h3 className="text-sm text-white/60 mb-1">{stat.title}</h3>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Engagement Chart */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Engagement Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-white/40">
                  <div className="text-center">
                    <BarChart className="w-16 h-16 mx-auto mb-4" />
                    <p>Engagement chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Platform Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-bold">X</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Twitter</p>
                      <p className="text-sm text-white/60">45.2K impressions</p>
                    </div>
                  </div>
                  <span className="text-green-400">+15.3%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-pink-400 text-xs font-bold">IG</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Instagram</p>
                      <p className="text-sm text-white/60">38.7K reach</p>
                    </div>
                  </div>
                  <span className="text-green-400">+22.1%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-red-400 text-xs font-bold">YT</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">YouTube</p>
                      <p className="text-sm text-white/60">12.3K views</p>
                    </div>
                  </div>
                  <span className="text-red-400">-5.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Content */}
          <Card className="glass-medium border-white/20 mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5" />
                Top Performing Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => {
                  const Icon = content.icon;
                  return (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          content.platform === 'twitter' ? 'bg-blue-500/20' :
                          content.platform === 'instagram' ? 'bg-pink-500/20' :
                          'bg-red-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            content.platform === 'twitter' ? 'text-blue-400' :
                            content.platform === 'instagram' ? 'text-pink-400' :
                            'text-red-400'
                          }`} />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{content.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {content.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {content.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {content.shares}
                          </span>
                          <span className="text-white/40">•</span>
                          <span>{content.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-white">{content.revenue}</div>
                          <div className="text-xs text-white/60">Revenue</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {content.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm font-medium ${
                            content.trend === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {content.change}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-medium border-white/20 mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 hours ago", action: "Posted on Twitter", result: "+234 impressions" },
                  { time: "5 hours ago", action: "Instagram Story", result: "+1.2K views" },
                  { time: "1 day ago", action: "YouTube video uploaded", result: "+3.4K views" },
                  { time: "2 days ago", action: "Completed brand task", result: "+50 XP" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <div>
                      <p className="font-medium text-white">{activity.action}</p>
                      <p className="text-sm text-white/60">{activity.time}</p>
                    </div>
                    <span className="text-green-400 text-sm">{activity.result}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
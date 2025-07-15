import { useState, useMemo } from "react";
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

// Realistic data generation functions
const generateRealisticData = (timeRange: string) => {
  const now = new Date();
  const baseEngagement = 2500;
  const baseViews = 15000;
  const baseRevenue = 150;
  
  let dataPoints: Array<{
    date: string;
    engagement: number;
    views: number;
    revenue: number;
    timestamp: Date;
  }> = [];

  if (timeRange === "7d") {
    // 7 days: Show hourly fluctuations (168 data points)
    for (let i = 168; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = date.getHours();
      
      // Evening peaks (6-10pm)
      const timeMultiplier = hour >= 18 && hour <= 22 ? 1.8 : 
                            hour >= 12 && hour <= 17 ? 1.3 :
                            hour >= 8 && hour <= 11 ? 1.1 : 0.6;
      
      // Weekend spikes
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.4 : 1.0;
      
      // Random variance ±25%
      const variance = 0.75 + Math.random() * 0.5;
      
      // Gradual growth trend
      const trendMultiplier = 1 + ((168 - i) / 1680); // 10% growth over week
      
      // Occasional viral spikes (2% chance)
      const viralMultiplier = Math.random() < 0.02 ? 3.5 : 1.0;
      
      const engagement = Math.round(baseEngagement * timeMultiplier * weekendMultiplier * variance * trendMultiplier * viralMultiplier);
      const views = Math.round(baseViews * timeMultiplier * weekendMultiplier * variance * trendMultiplier * viralMultiplier * 1.2);
      const revenue = Math.round(baseRevenue * timeMultiplier * weekendMultiplier * variance * trendMultiplier * viralMultiplier * 0.8);
      
      dataPoints.push({
        date: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        engagement,
        views,
        revenue,
        timestamp: date
      });
    }
  } else if (timeRange === "30d") {
    // 30 days: Show daily trends (30 data points)
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.5 : 1.0;
      const variance = 0.8 + Math.random() * 0.4;
      const trendMultiplier = 1 + ((30 - i) / 150); // 20% growth over month
      const viralMultiplier = Math.random() < 0.05 ? 2.8 : 1.0;
      
      const engagement = Math.round(baseEngagement * weekendMultiplier * variance * trendMultiplier * viralMultiplier);
      const views = Math.round(baseViews * weekendMultiplier * variance * trendMultiplier * viralMultiplier * 1.1);
      const revenue = Math.round(baseRevenue * weekendMultiplier * variance * trendMultiplier * viralMultiplier * 0.9);
      
      dataPoints.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        engagement,
        views,
        revenue,
        timestamp: date
      });
    }
  } else { // 90d
    // 90 days: Show weekly patterns (13 data points)
    for (let i = 12; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const variance = 0.85 + Math.random() * 0.3;
      const trendMultiplier = 1 + ((12 - i) / 40); // 30% growth over 3 months
      const viralMultiplier = Math.random() < 0.08 ? 2.2 : 1.0;
      
      const engagement = Math.round(baseEngagement * 1.2 * variance * trendMultiplier * viralMultiplier);
      const views = Math.round(baseViews * 1.2 * variance * trendMultiplier * viralMultiplier);
      const revenue = Math.round(baseRevenue * 1.2 * variance * trendMultiplier * viralMultiplier);
      
      dataPoints.push({
        date: `Week ${13 - i}`,
        engagement,
        views,
        revenue,
        timestamp: date
      });
    }
  }
  
  return dataPoints;
};

export default function Analytics() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  // Generate realistic data based on timeRange
  const chartData = useMemo(() => {
    return generateRealisticData(timeRange);
  }, [timeRange]);

  // Calculate dynamic stats based on chart data
  const dynamicStats = useMemo(() => {
    const totalViews = chartData.reduce((sum, point) => sum + point.views, 0);
    const totalEngagement = chartData.reduce((sum, point) => sum + point.engagement, 0);
    const totalRevenue = chartData.reduce((sum, point) => sum + point.revenue, 0);
    const avgEngagementRate = ((totalEngagement / totalViews) * 100);
    
    // Calculate growth rates
    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
    
    const firstHalfViews = firstHalf.reduce((sum, point) => sum + point.views, 0);
    const secondHalfViews = secondHalf.reduce((sum, point) => sum + point.views, 0);
    const viewsGrowth = ((secondHalfViews - firstHalfViews) / firstHalfViews * 100);
    
    const firstHalfEngagement = firstHalf.reduce((sum, point) => sum + point.engagement, 0);
    const secondHalfEngagement = secondHalf.reduce((sum, point) => sum + point.engagement, 0);
    const engagementGrowth = ((secondHalfEngagement - firstHalfEngagement) / firstHalfEngagement * 100);
    
    const revenueGrowth = ((totalRevenue - (totalRevenue * 0.8)) / (totalRevenue * 0.8) * 100);
    
    return [
      {
        title: "Total Views",
        value: `${(totalViews / 1000).toFixed(1)}K`,
        change: `${viewsGrowth > 0 ? '+' : ''}${viewsGrowth.toFixed(1)}%`,
        icon: Eye,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20"
      },
      {
        title: "Engagement Rate",
        value: `${avgEngagementRate.toFixed(1)}%`,
        change: `${engagementGrowth > 0 ? '+' : ''}${engagementGrowth.toFixed(1)}%`,
        icon: TrendingUp,
        color: "text-green-400",
        bgColor: "bg-green-500/20"
      },
      {
        title: "New Followers",
        value: `${Math.round(totalEngagement / 10)}`,
        change: `+${(engagementGrowth / 2).toFixed(1)}%`,
        icon: Users,
        color: "text-purple-400",
        bgColor: "bg-purple-500/20"
      },
      {
        title: "Revenue",
        value: `$${totalRevenue.toFixed(0)}`,
        change: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
        icon: DollarSign,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20"
      }
    ];
  }, [chartData]);

  // Handle time range change with loading animation
  const handleTimeRangeChange = async (range: string) => {
    setIsLoading(true);
    setTimeRange(range);
    
    // Simulate loading delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
  };

  // Calculate projected next payout based on revenue trend
  const nextPayout = useMemo(() => {
    const currentRevenue = chartData.reduce((sum, point) => sum + point.revenue, 0);
    const growth = parseFloat(dynamicStats[3].change.replace('%', '').replace('+', ''));
    const projected = currentRevenue * (1 + growth / 100);
    return Math.round(projected);
  }, [chartData, dynamicStats]);

  // Generate top performing content based on actual data
  const topContent = useMemo(() => {
    const sortedData = [...chartData].sort((a, b) => b.engagement - a.engagement).slice(0, 4);
    const platforms = ['twitter', 'youtube', 'instagram', 'twitch'];
    const titles = [
      'Epic Gaming Montage - Insane Plays',
      'Web3 Gaming Guide - Alpha Access',
      'Breaking: New Blockchain Game Launch',
      'Crypto Gaming Strategy Deep Dive'
    ];
    
    return sortedData.map((data, index) => ({
      id: index + 1,
      title: titles[index],
      platform: platforms[index],
      icon: index === 0 ? Twitter : index === 1 ? Youtube : index === 2 ? Instagram : Youtube,
      engagement: data.engagement,
      views: data.views,
      likes: Math.round(data.engagement * 0.7),
      shares: Math.round(data.engagement * 0.1),
      revenue: `$${data.revenue}`,
      change: `+${Math.round(Math.random() * 30 + 5)}%`,
      trend: "up",
      date: timeRange === "7d" ? `${index + 1} days ago` : timeRange === "30d" ? `${index + 1} weeks ago` : `${index + 1} months ago`
    }));
  }, [chartData, timeRange]);

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
                  onClick={() => handleTimeRangeChange(range)}
                  disabled={isLoading}
                  className={timeRange === range ? "veri-gradient text-white" : "border-white/20 text-white hover:border-white/40"}
                >
                  {isLoading && timeRange === range ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    range
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dynamicStats.map((stat, index) => {
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
                  Engagement Overview ({timeRange})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div 
                  key={timeRange}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-64 relative"
                >
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <svg className="w-full h-full" viewBox="0 0 400 240">
                      <defs>
                        <linearGradient id="engagementGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#00d6a2', stopOpacity: 0.8 }} />
                          <stop offset="100%" style={{ stopColor: '#00d6a2', stopOpacity: 0.1 }} />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      {[0, 60, 120, 180, 240].map((y) => (
                        <line
                          key={y}
                          x1="40"
                          y1={y}
                          x2="380"
                          y2={y}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Chart line */}
                      {chartData.length > 1 && (
                        <>
                          <path
                            d={chartData.reduce((path, point, index) => {
                              const x = 40 + (index / (chartData.length - 1)) * 340;
                              const maxEngagement = Math.max(...chartData.map(d => d.engagement));
                              const y = 220 - (point.engagement / maxEngagement) * 200;
                              return path + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                            }, '')}
                            stroke="#00d6a2"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Area fill */}
                          <path
                            d={chartData.reduce((path, point, index) => {
                              const x = 40 + (index / (chartData.length - 1)) * 340;
                              const maxEngagement = Math.max(...chartData.map(d => d.engagement));
                              const y = 220 - (point.engagement / maxEngagement) * 200;
                              return path + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                            }, '') + ' L 380 220 L 40 220 Z'}
                            fill="url(#engagementGradient)"
                          />
                          
                          {/* Data points */}
                          {chartData.map((point, index) => {
                            const x = 40 + (index / (chartData.length - 1)) * 340;
                            const maxEngagement = Math.max(...chartData.map(d => d.engagement));
                            const y = 220 - (point.engagement / maxEngagement) * 200;
                            
                            return (
                              <g key={index}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#00d6a2"
                                  stroke="white"
                                  strokeWidth="2"
                                  className="hover:r-6 transition-all duration-200 cursor-pointer"
                                />
                                <title>
                                  {point.date}: {point.engagement.toLocaleString()} engagement
                                </title>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* Y-axis labels */}
                      <text x="35" y="25" fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="end">
                        {Math.max(...chartData.map(d => d.engagement)).toLocaleString()}
                      </text>
                      <text x="35" y="225" fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="end">
                        0
                      </text>
                    </svg>
                  )}
                </motion.div>
              </CardContent>
            </Card>

            {/* Revenue Projections */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Revenue Projections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  key={timeRange}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-white mb-2">${nextPayout}</div>
                    <div className="text-sm text-white/60">Est. next payout</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Twitter className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Twitter</p>
                          <p className="text-sm text-white/60">{(chartData.reduce((sum, d) => sum + d.views, 0) * 0.4 / 1000).toFixed(1)}K impressions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${Math.round(nextPayout * 0.35)}</div>
                        <div className="text-xs text-green-400">+{Math.round(Math.random() * 15 + 10)}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <Youtube className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">YouTube</p>
                          <p className="text-sm text-white/60">{(chartData.reduce((sum, d) => sum + d.views, 0) * 0.3 / 1000).toFixed(1)}K views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${Math.round(nextPayout * 0.45)}</div>
                        <div className="text-xs text-green-400">+{Math.round(Math.random() * 20 + 15)}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 text-xs font-bold">TW</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Twitch</p>
                          <p className="text-sm text-white/60">{(chartData.reduce((sum, d) => sum + d.engagement, 0) * 0.15 / 1000).toFixed(1)}K interactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${Math.round(nextPayout * 0.2)}</div>
                        <div className="text-xs text-green-400">+{Math.round(Math.random() * 25 + 20)}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      Projected growth: +{Math.round(Math.random() * 15 + 18)}% this {timeRange === "7d" ? "week" : timeRange === "30d" ? "month" : "quarter"}
                    </div>
                  </div>
                </motion.div>
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
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, ArrowUpRight, TrendingUp, Users, Award, Crown, Zap } from "lucide-react";

export function CreatorShowcase() {
  const topCreators = [
    {
      id: 1,
      name: "Alex Chen",
      username: "@alexcreates",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      score: 2847,
      rank: 1,
      followers: "124K",
      isFollowing: false,
      isVerified: true,
      badge: "gold"
    },
    {
      id: 2,
      name: "Sam Huber",
      username: "@samhuber",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      score: 2500,
      rank: 2,
      followers: "98K",
      isFollowing: true,
      isVerified: true,
      badge: "silver"
    },
    {
      id: 3,
      name: "Maya Patel",
      username: "@mayapatel",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      score: 2156,
      rank: 3,
      followers: "76K",
      isFollowing: false,
      isVerified: false,
      badge: "bronze"
    }
  ];

  const leaderboardData = [
    { rank: 4, name: "Jordan Kim", score: 1987 },
    { rank: 5, name: "Riley Davis", score: 1834 },
    { rank: 6, name: "Casey Wong", score: 1723 },
    { rank: 7, name: "Taylor Smith", score: 1698 },
    { rank: 8, name: "Morgan Lee", score: 1567 }
  ];

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "gold": return <Crown className="w-4 h-4 text-yellow-400" />;
      case "silver": return <Trophy className="w-4 h-4 text-gray-300" />;
      case "bronze": return <Award className="w-4 h-4 text-orange-400" />;
      default: return null;
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Leaderboard styling */}
        <GlassCard className="p-6 mb-12">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground dark:text-white">Leaderboard</h2>
                  <p className="text-muted-foreground dark:text-white/60">Top VeriScore Rankings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>
        
        {/* Top 3 Creators Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topCreators.map((creator) => (
            <GlassCard 
              key={creator.id} 
              hover 
              className={`p-6 relative transition-all duration-300 ${
                creator.rank === 2 ? 'border-green-500/40 bg-green-500/5' : ''
              }`}
            >
              <CardContent className="p-0">
                {/* Rank Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-yellow-400">
                      {getRankEmoji(creator.rank)}
                    </span>
                    {getBadgeIcon(creator.badge)}
                  </div>
                  {creator.rank === 2 && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      You
                    </Badge>
                  )}
                </div>
                
                {/* Creator Profile */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {creator.isVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground dark:text-white">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-white/60">{creator.score.toLocaleString()} points</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">•</span>
                  </div>
                </div>
                
                {/* Following Button */}
                <Button 
                  variant={creator.isFollowing ? "secondary" : "outline"}
                  size="sm"
                  className={`w-full transition-all duration-200 ${
                    creator.isFollowing 
                      ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" 
                      : "border-border dark:border-white/20 text-foreground dark:text-white hover:bg-accent dark:hover:bg-white/10"
                  }`}
                >
                  {creator.isFollowing ? "Following" : "Follow"}
                </Button>
              </CardContent>
            </GlassCard>
          ))}
        </div>
        
        {/* Global Leaderboard */}
        <GlassCard className="p-6">
          <CardContent className="p-0 space-y-3">
            {leaderboardData.map((player, index) => (
              <div key={player.rank} className="flex items-center justify-between py-3 border-b border-border dark:border-white/10 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-muted-foreground dark:text-white/60 w-8">#{player.rank}</span>
                  <div className="w-8 h-8 bg-muted dark:bg-white/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-muted-foreground dark:text-white/60" />
                  </div>
                  <span className="font-medium text-foreground dark:text-white">{player.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground dark:text-white/60">{player.score.toLocaleString()} points</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
            ))}
            
            {/* View Full Leaderboard Button */}
            <div className="pt-4">
              <Button className="w-full veri-gradient text-white">
                View Full Leaderboard
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </section>
  );
}
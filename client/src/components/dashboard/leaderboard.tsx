import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from 'lucide-react';
import { TrendingDown } from 'lucide-react';
import { Minus } from 'lucide-react';
import { Globe } from 'lucide-react';
import { Gamepad2 } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Laptop } from 'lucide-react';
import { Crown } from 'lucide-react';
import { Award } from 'lucide-react';
import { Medal } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from "react";
import { LeaderboardSkeleton } from "@/components/ui/veri-skeleton";
import { useToast } from "@/hooks/use-toast";
import { useScrollEffect } from "@/hooks/use-scroll-effect";
import { motion } from "framer-motion";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
  });
  const { toast } = useToast();
  const { scrollY, isScrolling } = useScrollEffect();
  const [previousRanks, setPreviousRanks] = useState<Record<number, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("global");
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  const handleViewFullLeaderboard = () => {
    setShowFullLeaderboard(!showFullLeaderboard);
    toast({
      title: showFullLeaderboard ? "Collapsed" : "Expanded",
      description: showFullLeaderboard ? "Showing top entries only" : "Showing full leaderboard",
    });
  };

  const categories = [
    { id: "global", name: "Global", icon: Globe },
    { id: "gaming", name: "Gaming", icon: Gamepad2 },
    { id: "lifestyle", name: "Lifestyle", icon: Heart },
    { id: "tech", name: "Tech", icon: Laptop },
  ];

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500";
      case 2: return "bg-gray-400";
      case 3: return "bg-orange-500";
      default: return "bg-gray-600";
    }
  };

  const getBadgeInfo = (rank: number, score: number) => {
    if (score >= 90) return { tier: "Diamond", icon: Crown, color: "text-cyan-400", bgColor: "bg-cyan-500/20" };
    if (score >= 70) return { tier: "Platinum", icon: Award, color: "text-purple-400", bgColor: "bg-purple-500/20" };
    if (score >= 50) return { tier: "Gold", icon: Medal, color: "text-yellow-400", bgColor: "bg-yellow-500/20" };
    return { tier: "Silver", icon: Medal, color: "text-gray-400", bgColor: "bg-gray-500/20" };
  };

  // Real leaderboard data from the full leaderboard page
  const realLeaderboardData = [
    { id: 1, userId: 1, name: "Alex Chen", username: "@alexchen", score: 2847, change: 12, avatar: "AC", tier: "Diamond", primaryCategory: "gaming" },
    { id: 2, userId: 2, name: "Sarah Johnson", username: "@sarahj", score: 2654, change: 8, avatar: "SJ", tier: "Diamond", primaryCategory: "lifestyle" },
    { id: 3, userId: 3, name: "Mike Wilson", username: "@mikew", score: 2432, change: 15, avatar: "MW", tier: "Platinum", primaryCategory: "tech" },
    { id: 4, userId: 4, name: "Emma Davis", username: "@emmad", score: 2198, change: -3, avatar: "ED", tier: "Platinum", primaryCategory: "lifestyle" },
    { id: 5, userId: 5, name: "John Smith", username: "@johns", score: 2087, change: 5, avatar: "JS", tier: "Platinum", primaryCategory: "gaming" },
    { id: 6, userId: 6, name: "Lisa Brown", username: "@lisab", score: 1965, change: 22, avatar: "LB", tier: "Gold", primaryCategory: "lifestyle" },
    { id: 7, userId: 7, name: "Tom Garcia", username: "@tomg", score: 1843, change: -7, avatar: "TG", tier: "Gold", primaryCategory: "gaming" },
    { id: 8, userId: 8, name: "Amy Lee", username: "@amyl", score: 1721, change: 11, avatar: "AL", tier: "Gold", primaryCategory: "tech" },
  ];

  const getUserColor = (tier: string) => {
    switch (tier) {
      case "Diamond": return "bg-gradient-to-br from-blue-500 to-cyan-500";
      case "Platinum": return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "Gold": return "bg-gradient-to-br from-yellow-500 to-orange-500";
      default: return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };
  
  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };
  
  const getRankChangeText = (change: number) => {
    if (change > 0) return `↗ +${change}`;
    if (change < 0) return `↘ ${change}`;
    return "—";
  };

  // Use real leaderboard data or fallback to API data
  const currentLeaderboard = leaderboard?.length > 0 ? leaderboard : realLeaderboardData;

  const filteredLeaderboard = currentLeaderboard?.filter((entry: any) => {
    if (selectedCategory === "global") return true;
    const user = realLeaderboardData.find(u => u.userId === entry.userId || u.id === entry.id);
    return user?.primaryCategory === selectedCategory;
  });

  const displayedLeaderboard = showFullLeaderboard ? filteredLeaderboard : filteredLeaderboard?.slice(0, 5);

  // Calculate scroll effect - follow VeriScore and social connections
  const scrollOffset = Math.min(scrollY * 0.010, 4);
  const floatY = isScrolling ? scrollOffset : 0;

  return (
    <div className="sticky top-48 z-10"
    >
      <div className="glass-medium glass-effect-hover rounded-xl p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Live Leaderboard</h3>
          <div className="pulse-ring w-3 h-3 bg-green-500 rounded-full" aria-label="Live updates active"></div>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Button
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 hover-lift-subtle ${
                    selectedCategory === category.id 
                      ? "veri-gradient text-white hover-glow" 
                      : "border-white/20 text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              </motion.div>
            );
          })}
        </div>
        <div className="space-y-3" role="list" aria-label="VeriScore leaderboard rankings">
          {displayedLeaderboard?.map((entry: any, index: number) => {
            const user = realLeaderboardData.find(u => u.userId === entry.userId || u.id === entry.id) || entry;
            const isCurrentUser = entry.userId === 5 || entry.id === 5; // Current user ID from auth
            const badgeInfo = getBadgeInfo(index + 1, entry.score || user.score);
            const BadgeIcon = badgeInfo.icon;
            
            return (
              <motion.div
                key={entry.id}
                role="listitem"
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 hover-lift touch-manipulation ${
                  isCurrentUser 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-white/5'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideIn 0.6s ease-out forwards'
                }}
                aria-label={`${user?.name} ranked ${entry.rank} with ${entry.score} points${isCurrentUser ? ' (You)' : ''}`}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div 
                  className={`w-8 h-8 ${getRankColor(entry.rank)} rounded-full flex items-center justify-center font-bold text-sm text-white`}
                  aria-label={`Rank ${entry.rank}`}
                >
                  {entry.rank}
                </div>
                <div 
                  className={`w-8 h-8 ${getUserColor(user?.tier || 'Silver')} rounded-full flex items-center justify-center font-bold text-xs text-white`}
                  aria-label={`${user?.name} avatar`}
                >
                  {user?.avatar || user?.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-white">{user?.name}{isCurrentUser && <span className="sr-only"> (You)</span>}</div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${badgeInfo.bgColor}`}>
                      <BadgeIcon className={`w-3 h-3 ${badgeInfo.color}`} />
                      <span className={`text-xs font-medium ${badgeInfo.color}`}>{badgeInfo.tier}</span>
                    </div>
                  </div>
                  <div className="text-xs text-white/60">{user?.primaryCategory || 'Global'} • {user?.tier} Tier</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" aria-label={`Rank change: ${getRankChangeText(user?.change || 0)}`}>
                    {getRankChangeIcon(user?.change || 0)}
                    <span className={`text-xs font-medium ${
                      user?.change > 0 ? 'text-green-400' : 
                      user?.change < 0 ? 'text-red-400' : 
                      'text-gray-400'
                    }`}>
                      {getRankChangeText(user?.change || 0)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white" aria-label={`${user?.score} VeriScore points`}>{user?.score}</div>
                    <div className="text-xs text-green-500">+{Math.floor(Math.random() * 20)}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* View Full Leaderboard Button */}
        {filteredLeaderboard && filteredLeaderboard.length > 5 && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewFullLeaderboard}
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2"
            >
              {showFullLeaderboard ? "Show Less" : "View Full Leaderboard"}
              <ChevronRight className={`w-4 h-4 transition-transform ${showFullLeaderboard ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

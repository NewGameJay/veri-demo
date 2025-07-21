import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Award, Medal, ChevronRight, TrendingUp } from 'lucide-react';
import { useState } from "react";
import { LeaderboardSkeleton } from "@/components/ui/veri-skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
  });

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  // Top leaderboard data
  const topCreators = [
    { id: 1, name: "Alex Chen", score: 2847, tier: "Diamond", rank: 1, avatar: "AC", change: "+12" },
    { id: 2, name: "Sarah Johnson", score: 2654, tier: "Diamond", rank: 2, avatar: "SJ", change: "+8" },
    { id: 3, name: "Mike Wilson", score: 2432, tier: "Platinum", rank: 3, avatar: "MW", change: "+15" }
  ];

  const remainingCreators = [
    { id: 4, name: "Emma Davis", score: 2198, tier: "Platinum", rank: 4, avatar: "ED", change: "-3" },
    { id: 5, name: "John Smith", score: 2087, tier: "Platinum", rank: 5, avatar: "JS", change: "+5" },
    { id: 6, name: "Lisa Brown", score: 1965, tier: "Gold", rank: 6, avatar: "LB", change: "+22" },
    { id: 7, name: "Tom Garcia", score: 1843, tier: "Gold", rank: 7, avatar: "TG", change: "-7" },
    { id: 8, name: "Amy Lee", score: 1721, tier: "Gold", rank: 8, avatar: "AL", change: "+11" },
    { id: 9, name: "Chris Wang", score: 1654, tier: "Gold", rank: 9, avatar: "CW", change: "+3" },
    { id: 10, name: "Sofia Martinez", score: 1598, tier: "Silver", rank: 10, avatar: "SM", change: "+8" }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Diamond": return "from-blue-500 to-cyan-500";
      case "Platinum": return "from-purple-500 to-pink-500";
      case "Gold": return "from-yellow-500 to-orange-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Award className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-orange-400" />;
      default: return <Trophy className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="glass-medium glass-effect-hover rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
            <p className="text-sm text-white/60">Top VeriScore Rankings</p>
          </div>
        </div>
        <div className="pulse-ring w-3 h-3 bg-green-500 rounded-full" aria-label="Live updates active"></div>
      </div>

      {/* Top 3 Creators Highlight - Stacked */}
      <div className="space-y-3 mb-6">
        {topCreators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-effect p-4 rounded-xl relative flex items-center gap-4 ${
              creator.rank === 1 ? 'border-yellow-500/40 bg-yellow-500/5' : 
              creator.rank === 2 ? 'border-gray-400/40 bg-gray-400/5' :
              'border-orange-500/40 bg-orange-500/5'
            }`}
          >
            {/* Rank Badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {getRankIcon(creator.rank)}
              <span className="text-sm font-medium text-white/80">#{creator.rank}</span>
            </div>

            {/* Avatar */}
            <div className={`w-12 h-12 bg-gradient-to-br ${getTierColor(creator.tier)} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>
              {creator.avatar}
            </div>

            {/* Creator Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold text-white text-base">{creator.name}</h4>
                <Badge variant="secondary" className={`bg-gradient-to-r ${getTierColor(creator.tier)} text-white text-xs px-2 py-1`}>
                  {creator.tier}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">VeriScore:</span>
                <span className="font-bold text-white">{creator.score.toLocaleString()}</span>
              </div>
            </div>

            {/* Change Indicator */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">{creator.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Remaining Top Players (4-10) */}
      <div className="space-y-2 mb-4">
        {remainingCreators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 3) * 0.05 }}
            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {creator.rank}
            </div>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${getTierColor(creator.tier)} rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0`}>
              {creator.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">{creator.name}</div>
              <div className="text-xs text-white/60">{creator.tier} Tier</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-white text-sm sm:text-base">{creator.score.toLocaleString()}</div>
              <div className="text-xs text-green-400 flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3" />
                {creator.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Full Leaderboard Button */}
      <Link href="/leaderboard">
        <Button className="w-full veri-gradient text-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
          View Full Leaderboard
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}

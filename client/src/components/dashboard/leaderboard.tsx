import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useEffect } from "react";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
  });
  const [previousRanks, setPreviousRanks] = useState<Record<number, number>>({});

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-white/10 rounded"></div>
              <div className="h-12 bg-white/10 rounded"></div>
              <div className="h-12 bg-white/10 rounded"></div>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    );
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500";
      case 2: return "bg-gray-400";
      case 3: return "bg-orange-500";
      default: return "bg-gray-600";
    }
  };

  const sampleUsers = [
    { id: 2, name: "Alex Kim", category: "Gaming • Veri+ Creator", initials: "AK", color: "bg-purple-500", rankChange: 2 },
    { id: 3, name: "Maria Johnson", category: "Lifestyle • Top 10%", initials: "MJ", color: "bg-blue-500", rankChange: -1 },
    { id: 1, name: "Sam Huber", category: "Tech • Veri+ Creator", initials: "SH", color: "bg-purple-500", rankChange: 0 },
  ];
  
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

  return (
    <GlassCard hover className="p-6 lg:col-span-2">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Live Leaderboard</h3>
          <div className="pulse-ring w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="space-y-3">
          {leaderboard?.map((entry: any, index: number) => {
            const user = sampleUsers.find(u => u.id === entry.userId);
            const isCurrentUser = entry.userId === 1;
            
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 hover-scale ${
                  isCurrentUser 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-white/5'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideIn 0.6s ease-out forwards'
                }}
              >
                <div className={`w-8 h-8 ${getRankColor(entry.rank)} rounded-full flex items-center justify-center font-bold text-sm text-white`}>
                  {entry.rank}
                </div>
                <div className={`w-8 h-8 ${user?.color} rounded-full flex items-center justify-center font-bold text-xs text-white`}>
                  {user?.initials}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{user?.name}</div>
                  <div className="text-xs text-white/60">{user?.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getRankChangeIcon(user?.rankChange || 0)}
                    <span className={`text-xs font-medium ${
                      user?.rankChange > 0 ? 'text-green-400' : 
                      user?.rankChange < 0 ? 'text-red-400' : 
                      'text-gray-400'
                    }`}>
                      {getRankChangeText(user?.rankChange || 0)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{entry.score}</div>
                    <div className="text-xs text-green-500">+{Math.floor(Math.random() * 20)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </GlassCard>
  );
}

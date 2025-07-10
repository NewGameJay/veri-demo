import { useState } from "react";
import { X, Home, User, Trophy, CheckSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VeriScoreCard } from "@/components/dashboard/veri-score-card";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "ai-agent", label: "AI Agent", icon: Bot },
  ];

  return (
    <div
      className={cn(
        "dashboard-sidebar fixed top-0 left-0 h-full w-80 bg-gray-900/95 glass-effect z-30 p-6",
        isOpen && "open"
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Enhanced Navigation with Animations */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full justify-start gap-3 p-3 glass-effect rounded-xl transition-all duration-300 hover-scale font-inter",
                  activeItem === item.id && "veri-gradient text-white shadow-lg",
                  "animate-slide-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Enhanced Leaderboard Preview */}
        <div className="veri-gradient-card rounded-xl p-6 hover-scale animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 veri-gradient rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-termina text-white">Leaderboard</h3>
          </div>
          <div className="text-sm text-green-400 font-inter mb-2">Top VeriScore Rankings</div>
          
          {/* Sample leaderboard entries with animations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">1</div>
                <span className="text-white font-inter text-sm">Alex Chen</span>
              </div>
              <span className="text-green-400 text-sm font-medium">2,847</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                <span className="text-white font-inter text-sm">You</span>
              </div>
              <span className="text-green-400 text-sm font-medium pulse-glow">75</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                <span className="text-white font-inter text-sm">Maya Patel</span>
              </div>
              <span className="text-green-400 text-sm font-medium">2,156</span>
            </div>
          </div>

          <Button className="w-full mt-4 veri-gradient hover:scale-105 transition-all duration-300 font-inter">
            View Full Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}

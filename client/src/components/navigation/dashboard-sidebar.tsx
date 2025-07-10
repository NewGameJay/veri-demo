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
    { id: "tasks", label: "Tasks", icon: CheckSquare },
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
        <VeriScoreCard />

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full justify-start gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors",
                  activeItem === item.id && "bg-white/10 text-green-500"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

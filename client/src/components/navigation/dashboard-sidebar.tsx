import { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { Home } from 'lucide-react';
import { User } from 'lucide-react';
import { Trophy } from 'lucide-react';
import { Bot } from 'lucide-react';
import { Pin } from 'lucide-react';
import { PinOff } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { BarChart } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Target } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { triggerHaptic } from "@/lib/haptic";

interface DashboardSidebarProps {
  isOpen: boolean;
  isPinned: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onPin: () => void;
  onToggleCollapse: () => void;
  className?: string;
}

export function DashboardSidebar({ 
  isOpen, 
  isPinned, 
  isCollapsed,
  onClose, 
  onPin, 
  onToggleCollapse,
  className 
}: DashboardSidebarProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "analytics", label: "Analytics", icon: BarChart, path: "/analytics" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { id: "campaigns", label: "Campaigns", icon: Target, path: "/campaigns" },
    { id: "ai-agent", label: "AI Agent", icon: Bot, path: "/ai-agent" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  // Update active item based on current location
  useEffect(() => {
    const currentPath = location;
    const activeMenuItem = menuItems.find(item => item.path === currentPath);
    if (activeMenuItem) {
      setActiveItem(activeMenuItem.id);
    }
  }, [location]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Alt + number shortcuts for navigation
      if (e.altKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (menuItems[index]) {
          handleNavigation(menuItems[index]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavigation = (item: typeof menuItems[0]) => {
    triggerHaptic("light");
    setActiveItem(item.id);
    setLocation(item.path);
    if (!isPinned) {
      onClose();
    }
  };

  const handleLogout = async () => {
    triggerHaptic("warning");
    try {
      await logout();
      // Navigation will be handled by the logout function
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback navigation if logout fails
      setLocation("/");
    }
  };

  return (
    <div
      className="dashboard-sidebar fixed top-0 left-0 h-full glass-effect z-30 p-6 transition-all duration-300 w-80 translate-x-0 bg-[#090d0ff2]"
    >
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && <h2 className="text-xl font-termina text-white">Dashboard</h2>}
        <div className="flex items-center gap-2">
          {/* Collapse/Expand Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-900/95 hover:shadow-[0_2px_8px_rgba(16,185,129,0.15),0_0_4px_rgba(16,185,129,0.1)] rounded-xl button-3d press-animation ripple-effect transition-all duration-300 touch-manipulation"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            haptic="light"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white/60 icon-float" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white/60 icon-float" />
            )}
          </Button>
          
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="p-2 hover:bg-gray-900/95 hover:shadow-[0_2px_8px_rgba(16,185,129,0.15),0_0_4px_rgba(16,185,129,0.1)] rounded-xl button-3d press-animation ripple-effect transition-all duration-300 touch-manipulation"
              title="Close sidebar"
              aria-label="Close sidebar"
              haptic="light"
            >
              <X className="w-5 h-5 icon-float" />
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {/* Enhanced Navigation with Animations */}
        <nav className="space-y-2" role="navigation" aria-label="Main navigation">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full p-3 glass-subtle rounded-xl font-inter touch-manipulation relative",
                  "button-3d depth-shadow press-animation ripple-effect",
                  "hover:bg-gray-900/95 hover:border-emerald-400/30 hover:shadow-[0_4px_16px_rgba(16,185,129,0.2),0_0_8px_rgba(16,185,129,0.1)] hover:text-emerald-100",
                  "transition-all duration-300 ease-out",
                  isCollapsed ? "justify-center" : "justify-start gap-3",
                  location === item.path && "veri-gradient text-white shadow-lg shadow-emerald-500/50 transform translateY(-1px)",
                  "focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                )}
                title={isCollapsed ? `${item.label} (Alt+${index + 1})` : `Alt+${index + 1}`}
                aria-label={`Navigate to ${item.label}`}
                aria-current={location === item.path ? "page" : undefined}
                haptic="light"
              >
                <Icon className={cn("w-5 h-5 icon-float", location === item.path && "transform translateY(-0.5px)")} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {!isCollapsed && (
                  <span className="sr-only">Press Alt+{index + 1} for keyboard shortcut</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full p-3 glass-subtle rounded-xl font-inter text-red-400 hover:text-red-300 touch-manipulation relative",
              "button-3d depth-shadow press-animation ripple-effect",
              "hover:bg-gray-900/95 hover:border-red-400/30 hover:shadow-[0_4px_16px_rgba(239,68,68,0.2),0_0_8px_rgba(239,68,68,0.1)]",
              "transition-all duration-300 ease-out",
              isCollapsed ? "justify-center" : "justify-start gap-3",
              "focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            )}
            title={isCollapsed ? "Log out" : undefined}
            aria-label="Log out of your account"
            haptic="warning"
          >
            <LogOut className="w-5 h-5 icon-float" />
            {!isCollapsed && <span className="font-medium">Log out</span>}
          </Button>
        </div>

        {/* Enhanced Leaderboard Preview - hidden when collapsed */}
        {!isCollapsed && (
          <div className="veri-gradient-card rounded-xl p-6">
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
        )}
      </div>
    </div>
  );
}
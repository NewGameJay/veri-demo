import { useState } from "react";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { VeriLogo } from "@/components/ui/veri-logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";

interface HeaderProps {
  onDashboardToggle: () => void;
  onMobileMenuToggle: () => void;
}

export function Header({ onDashboardToggle, onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.username?.slice(0, 2).toUpperCase() || "U";
  
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.username || "User";
  
  const userXP = user?.xpPoints || 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 lg:px-6 py-4 glass-effect border-b border-white/10 animate-slide-in">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Dashboard Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDashboardToggle}
          className="hidden lg:block p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <VeriLogo />
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Enhanced Notifications with Animation */}
        <Button
          variant="ghost"
          size="icon"
          className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover-scale relative"
        >
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-4 h-4 veri-gradient rounded-full flex items-center justify-center pulse-glow">
            <span className="text-xs font-medium text-white">3</span>
          </div>
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3 animate-slide-in">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white font-inter">{displayName}</div>
            <div className="text-xs text-green-400 font-medium">{userXP.toLocaleString()} XP</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}

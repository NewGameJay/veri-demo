import { useState } from "react";
import { Menu, Moon, Sun, Bell, LogOut, User, Settings } from "lucide-react";
import { VeriLogo } from "@/components/ui/veri-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";

interface HeaderProps {
  onDashboardToggle: () => void;
  onMobileMenuToggle: () => void;
  onSignIn?: () => void;
}

export function Header({ onDashboardToggle, onMobileMenuToggle, onSignIn }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

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
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 lg:px-6 py-4 glass-effect border-b border-border animate-slide-in">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 hover:bg-accent rounded-xl transition-colors text-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Dashboard Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDashboardToggle}
          className="hidden lg:block p-2 hover:bg-accent rounded-xl transition-colors text-foreground"
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
          className="p-2 hover:bg-accent rounded-xl transition-colors text-foreground"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Show user info only when authenticated */}
        {user ? (
          <>
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

            {/* Profile with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 animate-slide-in cursor-pointer">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-white font-inter">{displayName}</div>
                    <div className="text-xs text-green-400 font-medium font-machina accent-text">{userXP.toLocaleString()} XP</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    {userInitials}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-white/20">
                <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          /* Sign In button for non-authenticated users */
          <Button
            variant="ghost"
            onClick={onSignIn}
            className="px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors font-inter"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}

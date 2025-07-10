import { useState } from "react";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { VeriLogo } from "@/components/ui/veri-logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

interface HeaderProps {
  onDashboardToggle: () => void;
  onMobileMenuToggle: () => void;
}

export function Header({ onDashboardToggle, onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 lg:px-6 py-4 glass-effect">
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

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="p-2 hover:bg-white/10 rounded-xl transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">3</span>
          </div>
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white">Sam Huber</div>
            <div className="text-xs text-white/60">2,500 points</div>
          </div>
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">
            SH
          </div>
        </div>
      </div>
    </header>
  );
}

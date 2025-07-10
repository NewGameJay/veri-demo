import { Home, Search, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-effect border-t border-white/10">
      <div className="flex items-center justify-around py-2">
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 p-2 text-green-500 hover:bg-white/10"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 p-2 text-white/60 hover:bg-white/10"
        >
          <Search className="w-5 h-5" />
          <span className="text-xs">Explore</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 p-2 text-white/60 hover:bg-white/10"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-xs">Leaderboard</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 p-2 text-white/60 hover:bg-white/10"
        >
          <User className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Twitter, Youtube, Instagram } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { VeriSkeleton } from "@/components/ui/veri-skeleton";

export function SocialConnections() {
  const { user } = useAuth();
  const { data: connections, isLoading } = useQuery({
    queryKey: ["/api/social-connections", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="glass-medium rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <VeriSkeleton className="w-8 h-8 rounded-lg" variant="veri" />
          <VeriSkeleton className="h-6 w-32" />
        </div>
        
        {/* Connection items */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-subtle p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <VeriSkeleton className="w-10 h-10 rounded-2xl" variant={i === 1 ? "emerald" : "default"} />
                  <div className="space-y-2">
                    <VeriSkeleton className="h-4 w-24" />
                    <VeriSkeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VeriSkeleton className="h-6 w-20 rounded-full" />
                  <VeriSkeleton className="w-3 h-3 rounded-full" variant="emerald" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const platformIcons = {
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
  };

  // Brand colors matching social icons assets
  const platformColors = {
    twitter: "bg-blue-500", // #1DA1F2
    youtube: "bg-red-500",  // #FF0000
    instagram: "bg-gradient-to-br from-purple-500 to-pink-500", // Instagram gradient
  };

  return (
    <div className="veri-gradient-card rounded-xl p-6 hover-scale animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 veri-gradient rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 className="text-lg font-termina text-white">Social Connections</h3>
      </div>
      
      <div className="space-y-4">
        {connections?.map((connection: any, index: number) => {
          const Icon = platformIcons[connection.platform as keyof typeof platformIcons];
          const bgColor = platformColors[connection.platform as keyof typeof platformColors];
          
          return (
            <div 
              key={connection.id} 
              className="glass-subtle glass-effect-hover p-4 rounded-xl hover-scale animate-slide-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-inter font-medium text-white">
                      {connection.platform.charAt(0).toUpperCase() + connection.platform.slice(1)}
                    </div>
                    <div className="text-xs text-white/60 font-inter">
                      @{connection.platformUsername || `user_${connection.platform}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={connection.isConnected ? "default" : "secondary"}
                    className={`${connection.isConnected ? 'veri-gradient text-white' : 'bg-yellow-500/20 text-yellow-400'} font-inter text-xs`}
                  >
                    {connection.isConnected ? "Connected" : "Pending"}
                  </Badge>
                  <div className={`w-3 h-3 rounded-full pulse-glow ${
                    connection.isConnected ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                </div>
              </div>
              
              {connection.isConnected && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60 font-inter">Followers</span>
                    <span className="text-green-400 font-medium">
                      {(connection.followerCount || 1250).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {!connections?.length && (
          <div className="text-center py-8">
            <div className="text-white/40 font-inter text-sm mb-2">No platforms connected yet</div>
            <div className="text-white/60 font-inter text-xs">Connect your social media to start earning XP!</div>
          </div>
        )}
      </div>
    </div>
  );
}

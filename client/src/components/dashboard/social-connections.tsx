import { useQuery } from "@tanstack/react-query";
import { Twitter, Youtube, Instagram } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

export function SocialConnections() {
  const { user } = useAuth();
  const { data: connections, isLoading } = useQuery({
    queryKey: ["/api/social-connections", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-8 bg-white/10 rounded"></div>
              <div className="h-8 bg-white/10 rounded"></div>
              <div className="h-8 bg-white/10 rounded"></div>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    );
  }

  const platformIcons = {
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
  };

  const platformColors = {
    twitter: "bg-blue-500",
    youtube: "bg-red-500",
    instagram: "bg-pink-500",
  };

  return (
    <GlassCard hover className="p-6">
      <CardContent className="p-0">
        <h3 className="text-lg font-semibold mb-4 text-white">Social Connections</h3>
        <div className="space-y-3">
          {connections?.map((connection: any) => {
            const Icon = platformIcons[connection.platform as keyof typeof platformIcons];
            const bgColor = platformColors[connection.platform as keyof typeof platformColors];
            
            return (
              <div key={connection.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white">{connection.platformUsername}</span>
                <div className="ml-auto">
                  <div className={`w-2 h-2 rounded-full ${
                    connection.isConnected ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </GlassCard>
  );
}

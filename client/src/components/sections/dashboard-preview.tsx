import { Bot, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { VeriScoreCard } from "@/components/dashboard/veri-score-card";
import { SocialConnections } from "@/components/dashboard/social-connections";
import { Leaderboard } from "@/components/dashboard/leaderboard";

export function DashboardPreview() {
  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Your Creator Dashboard</h2>
          <p className="text-xl text-white/60">Track your progress, connect with brands, and grow your influence</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <VeriScoreCard />
          <SocialConnections />
          
          {/* Tasks Progress */}
          <GlassCard hover className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4 text-white">Tasks Progress</h3>
              <div className="text-2xl font-bold text-green-500 mb-2">2/6</div>
              <div className="text-sm text-white/60 mb-4">Completed this week</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-white">Brand collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-white">Content creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                  <span className="text-sm text-white/60">Engagement boost</span>
                </div>
              </div>
            </CardContent>
          </GlassCard>
          
          {/* AI Agent */}
          <GlassCard hover className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Agent</h3>
                  <div className="text-xs text-green-500 font-medium">UNLOCK AT 100 SCORE</div>
                </div>
              </div>
              <p className="text-sm text-white/60">Your personal AI assistant for content creation and audience growth.</p>
            </CardContent>
          </GlassCard>
          
          <Leaderboard />
        </div>
      </div>
    </section>
  );
}

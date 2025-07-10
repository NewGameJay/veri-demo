import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function VeriScoreCard() {
  return (
    <GlassCard gradient className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">VeriScore</h3>
          <div className="pulse-ring w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-4xl font-bold text-green-500 mb-2">99</div>
        <div className="text-sm text-white/60 mb-4">2,500 XP points</div>
        <Progress value={80} className="bg-white/10" />
      </CardContent>
    </GlassCard>
  );
}

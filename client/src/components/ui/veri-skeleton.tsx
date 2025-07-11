import { cn } from "@/lib/utils";

interface VeriSkeletonProps {
  className?: string;
  variant?: "default" | "emerald" | "violet" | "veri";
}

export function VeriSkeleton({ className, variant = "default" }: VeriSkeletonProps) {
  const variantClasses = {
    default: "bg-gradient-to-r from-gray-300/20 via-gray-300/30 to-gray-300/20 dark:from-white/10 dark:via-white/20 dark:to-white/10",
    emerald: "bg-gradient-to-r from-emerald-500/20 via-emerald-500/30 to-emerald-500/20",
    violet: "bg-gradient-to-r from-violet-500/20 via-violet-500/30 to-violet-500/20",
    veri: "bg-gradient-to-r from-green-500/20 via-purple-500/30 to-green-500/20"
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md",
        variantClasses[variant],
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
    </div>
  );
}

export function VeriScoreCardSkeleton() {
  return (
    <div className="glass-medium rounded-xl p-8 space-y-6">
      {/* Header Icon */}
      <div className="flex items-center justify-center">
        <VeriSkeleton className="w-16 h-16 rounded-2xl" variant="veri" />
      </div>
      
      {/* Title */}
      <div className="text-center space-y-2">
        <VeriSkeleton className="h-8 w-32 mx-auto" variant="emerald" />
        <VeriSkeleton className="h-4 w-48 mx-auto" />
      </div>
      
      {/* Score */}
      <div className="text-center">
        <VeriSkeleton className="h-16 w-24 mx-auto" variant="emerald" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <VeriSkeleton className="h-20 rounded-xl" variant="default" />
        <VeriSkeleton className="h-20 rounded-xl" variant="default" />
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="glass-medium rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <VeriSkeleton className="h-6 w-32" variant="violet" />
        <VeriSkeleton className="h-3 w-3 rounded-full" variant="emerald" />
      </div>
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 glass-subtle rounded-xl">
          <VeriSkeleton className="w-8 h-8 rounded-full" variant={i === 1 ? "emerald" : "default"} />
          <VeriSkeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <VeriSkeleton className="h-4 w-24" />
            <VeriSkeleton className="h-3 w-32" />
          </div>
          <div className="space-y-2">
            <VeriSkeleton className="h-4 w-12" variant="violet" />
            <VeriSkeleton className="h-3 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="glass-medium rounded-xl p-6 space-y-4">
      <VeriSkeleton className="h-6 w-40" variant="veri" />
      
      {[1, 2].map((i) => (
        <div key={i} className="p-4 glass-subtle rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <VeriSkeleton className="h-5 w-48" />
            <VeriSkeleton className="h-6 w-16 rounded-full" variant="emerald" />
          </div>
          <VeriSkeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <VeriSkeleton className="h-8 w-24 rounded-lg" variant="veri" />
            <VeriSkeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
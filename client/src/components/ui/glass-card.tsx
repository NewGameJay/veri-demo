import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  gradient = false,
  hover = false 
}: GlassCardProps) {
  return (
    <Card
      className={cn(
        "glass-effect rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl",
        gradient && "bg-gradient-to-br from-green-500/20 to-purple-500/20",
        hover && "hover-scale transition-all duration-200 cursor-pointer",
        className
      )}
    >
      {children}
    </Card>
  );
}

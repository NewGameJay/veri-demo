import { Heart } from "lucide-react";

interface VeriLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function VeriLogo({ size = "md", showText = true }: VeriLogoProps) {
  const iconSize = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const containerSize = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${containerSize[size]} veri-gradient rounded-lg flex items-center justify-center`}>
        <Heart className={`${iconSize[size]} text-white`} />
      </div>
      {showText && (
        <span className={`${textSize[size]} font-bold text-white`}>
          veri
        </span>
      )}
    </div>
  );
}

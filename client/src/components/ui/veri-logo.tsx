import veriIconPath from "@assets/Veri Icon_1752165362121.png";

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
    <div className="flex items-center gap-2 animate-bounce-in">
      <div className={`${containerSize[size]} flex items-center justify-center hover-scale`}>
        <img 
          src={veriIconPath} 
          alt="Veri Logo" 
          className={`${iconSize[size]} object-contain filter brightness-0 invert`}
        />
      </div>
      {showText && (
        <span className={`${textSize[size]} font-termina text-white tracking-tight`}>
          veri
        </span>
      )}
    </div>
  );
}
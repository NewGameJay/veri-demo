import veriIconPath from "@assets/Veri Icon_1752165362121.png";
import { useLocation } from "wouter";

interface VeriLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  clickable?: boolean;
}

export function VeriLogo({ size = "md", showText = true, clickable = true }: VeriLogoProps) {
  const [, setLocation] = useLocation();
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

  const handleClick = () => {
    if (clickable) {
      setLocation("/dashboard");
    }
  };

  return (
    <div 
      className={`flex items-center gap-2 animate-bounce-in ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''}`}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
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
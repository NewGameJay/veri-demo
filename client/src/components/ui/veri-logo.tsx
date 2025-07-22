import { useLocation } from "wouter";

interface VeriLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  clickable?: boolean;
}

// Veri Logo SVG Component - Updated with correct vector design
function VeriLogoSVG({ size }: { size: "sm" | "md" | "lg" }) {
  const dimensions = {
    sm: "20",
    md: "32", 
    lg: "48"
  };

  const dim = dimensions[size];

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hover-scale"
    >
      {/* Veri "V" Logo - Modern geometric design */}
      <defs>
        <linearGradient id="veriGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d6a2" />
          <stop offset="50%" stopColor="#00b894" />
          <stop offset="100%" stopColor="#00a085" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle with gradient */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#veriGradient)" 
        filter="url(#glow)"
        opacity="0.9"
      />
      
      {/* Modern "V" shape */}
      <path
        d="M25 25 L50 70 L75 25 L65 25 L50 55 L35 25 Z"
        fill="white"
        fillOpacity="0.95"
      />
      
      {/* Accent dot */}
      <circle
        cx="50"
        cy="75"
        r="3"
        fill="white"
        fillOpacity="0.8"
      />
    </svg>
  );
}

export function VeriLogo({ size = "md", showText = true, clickable = true }: VeriLogoProps) {
  const [, setLocation] = useLocation();

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
      className={`flex items-center gap-3 animate-bounce-in ${clickable ? 'cursor-pointer hover:opacity-80 transition-all duration-200' : ''}`}
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
      <VeriLogoSVG size={size} />
      {showText && (
        <span className={`${textSize[size]} font-termina text-white tracking-tight font-bold`}>
          veri
        </span>
      )}
    </div>
  );
}
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

  // Veri Logo SVG based on brand assets
  const VeriIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
      <path d="M7 10.5c0-1.38 1.12-2.5 2.5-2.5S12 9.12 12 10.5 10.88 13 9.5 13 7 11.88 7 10.5zm7 0c0-1.38 1.12-2.5 2.5-2.5S19 9.12 19 10.5 17.88 13 16.5 13 14 11.88 14 10.5z"/>
      <path d="M8.5 16.5c.83 1.24 2.24 2 3.5 2s2.67-.76 3.5-2"/>
    </svg>
  );

  return (
    <div className="flex items-center gap-2 animate-bounce-in">
      <div className={`${containerSize[size]} veri-gradient rounded-lg flex items-center justify-center hover-scale shadow-lg`}>
        <VeriIcon className={`${iconSize[size]} text-white`} />
      </div>
      {showText && (
        <span className={`${textSize[size]} font-termina text-white tracking-tight`}>
          veri
        </span>
      )}
    </div>
  );
}

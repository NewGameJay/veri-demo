import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Star } from "lucide-react";

interface AchievementCardProps {
  type: "task" | "milestone";
  title: string;
  description: string;
  xpEarned?: number;
  streakDay?: number;
  veriScore?: number;
  userName: string;
  userAvatar?: string;
  onCardGenerated?: (imageUrl: string) => void;
}

export function AchievementCardGenerator({
  type,
  title,
  description,
  xpEarned,
  streakDay,
  veriScore,
  userName,
  userAvatar,
  onCardGenerated
}: AchievementCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateAchievementCard();
  }, []);

  const generateAchievementCard = async () => {
    const canvas = canvasRef.current;
    const cardElement = cardRef.current;
    
    if (!canvas || !cardElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f172a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add glass morphism effect
    const glassGradient = ctx.createLinearGradient(0, 0, 800, 600);
    glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    
    ctx.fillStyle = glassGradient;
    ctx.fillRect(50, 50, 700, 500);

    // Add Veri branding
    ctx.fillStyle = '#00d6a2';
    ctx.font = 'bold 32px Inter';
    ctx.fillText('VERI', 80, 100);
    
    ctx.fillStyle = '#8456ff';
    ctx.font = '18px Inter';
    ctx.fillText('Creator Platform', 80, 125);

    // Achievement icon
    const iconSize = 80;
    const iconX = 400 - iconSize / 2;
    const iconY = 150;
    
    // Draw achievement circle
    ctx.beginPath();
    ctx.arc(400, iconY + iconSize / 2, iconSize / 2 + 10, 0, 2 * Math.PI);
    ctx.fillStyle = type === 'task' ? '#10b981' : '#f59e0b';
    ctx.fill();

    // Achievement type badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(300, 260, 200, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(type === 'task' ? 'TASK COMPLETED' : 'MILESTONE ACHIEVED', 400, 285);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    
    // Wrap title text
    const maxTitleWidth = 600;
    const words = title.split(' ');
    let line = '';
    let y = 330;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxTitleWidth && n > 0) {
        ctx.fillText(line, 400, y);
        line = words[n] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Stats section
    const statsY = y + 60;
    const statSpacing = 200;
    const startX = 400 - statSpacing;

    if (xpEarned) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 28px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${xpEarned}`, startX, statsY);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter';
      ctx.fillText('XP EARNED', startX, statsY + 25);
    }

    if (streakDay) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 28px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${streakDay}`, 400, statsY);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter';
      ctx.fillText('DAY STREAK', 400, statsY + 25);
    }

    if (veriScore) {
      ctx.fillStyle = '#8456ff';
      ctx.font = 'bold 28px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${veriScore}`, startX + statSpacing * 2, statsY);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter';
      ctx.fillText('VERISCORE', startX + statSpacing * 2, statsY + 25);
    }

    // User info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`@${userName}`, 400, 520);

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Join the Web3 Gaming Creator Revolution', 400, 560);

    // Generate image URL
    const imageUrl = canvas.toDataURL('image/png');
    if (onCardGenerated) {
      onCardGenerated(imageUrl);
    }
  };

  return (
    <div className="hidden">
      <canvas ref={canvasRef} className="hidden" />
      <div ref={cardRef} className="hidden">
        {/* This div is used for measuring text, but we use canvas for actual generation */}
      </div>
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VeriLogo } from "@/components/ui/veri-logo";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useCounter } from "@/hooks/use-counter";
import { useState, useEffect, useRef, useMemo } from "react";
import { Star, Trophy, Zap, Award, Crown } from "lucide-react";
import { VeriScoreCardSkeleton } from "@/components/ui/veri-skeleton";

export function VeriScoreCard() {
  const { user } = useAuth();
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [previousXP, setPreviousXP] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showXPParticles, setShowXPParticles] = useState(false);
  const scoreRef = useRef<HTMLDivElement>(null);
  const xpRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);
  
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
  });

  const activeUser = user || currentUser;

  // Calculate VeriScore based on user activity with memoization
  const veriScore = useMemo(() => {
    if (!activeUser) return 0;
    
    const baseScore = Math.min((activeUser.xpPoints || 0) / 10, 100);
    const streakBonus = Math.min((activeUser.streak || 0) * 2, 20);
    const socialBonus = 10; // Base social connection bonus
    
    return Math.min(baseScore + streakBonus + socialBonus, 100);
  }, [activeUser?.xpPoints, activeUser?.streak]);
  
  // Use useEffect to handle score changes properly
  useEffect(() => {
    console.log('Score effect triggered:', {
      isFirstMount: isFirstMount.current,
      veriScore,
      previousScore,
      currentXP: activeUser?.xpPoints,
      previousXP
    });
    
    if (isFirstMount.current && veriScore > 0) {
      setPreviousScore(veriScore);
      setPreviousXP(activeUser?.xpPoints || 0);
      isFirstMount.current = false;
    } else if (!isFirstMount.current && veriScore !== previousScore && veriScore > 0) {
      // Don't update previousScore immediately - let the animation complete first
      // setPreviousScore will be called in onComplete
      console.log('Score increased! Waiting for animation...');
    }
    
    // Handle XP changes separately
    if (!isFirstMount.current && activeUser?.xpPoints !== previousXP && activeUser?.xpPoints > 0) {
      console.log('XP increased! Waiting for animation...');
    }
  }, [veriScore, previousScore, activeUser?.xpPoints, previousXP]);
  
  // Use the proper start value for animation
  const animationStart = previousScore === null ? veriScore : previousScore;
  
  const animatedScore = useCounter({ 
    end: veriScore, 
    start: animationStart,
    duration: previousScore === null ? 0 : 1500, // No animation on first mount
    onComplete: () => {
      console.log('VeriScore animation complete:', {
        previousScore,
        veriScore,
        didIncrease: previousScore !== null && veriScore > previousScore,
        activeUser
      });
      if (previousScore !== null && veriScore > previousScore) {
        // Show particles first
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 1000);
        // Then update previousScore after particle animation
        setTimeout(() => setPreviousScore(veriScore), 100);
      } else if (previousScore === null || veriScore <= previousScore) {
        // Update previousScore for non-particle cases
        setPreviousScore(veriScore);
      }
    }
  });

  const currentXP = activeUser?.xpPoints || 0;
  const xpAnimationStart = previousXP === null ? currentXP : previousXP;
  
  const animatedXP = useCounter({ 
    end: currentXP, 
    start: xpAnimationStart,
    duration: previousXP === null ? 0 : 1500, // No animation on first mount
    onComplete: () => {
      console.log('XP animation complete:', {
        previousXP,
        currentXP,
        didIncrease: previousXP !== null && currentXP > previousXP,
        activeUser
      });
      if (previousXP !== null && currentXP > previousXP) {
        // Show XP particles first
        setShowXPParticles(true);
        setTimeout(() => setShowXPParticles(false), 1000);
        // Then update previousXP after particle animation
        setTimeout(() => setPreviousXP(currentXP), 100);
      } else if (previousXP === null || currentXP <= previousXP) {
        // Update previousXP for non-particle cases
        setPreviousXP(currentXP);
      }
    }
  });

  const nextLevelThreshold = Math.ceil(veriScore / 25) * 25;
  const isAIUnlocked = (activeUser?.streak || 0) >= 10;

  if (isLoading) {
    return <VeriScoreCardSkeleton />;
  }

  if (!activeUser) {
    return (
      <Card className="glass-medium border-white/20">
        <CardContent className="p-6">
          <div className="text-center text-white/60">
            Please sign in to view your VeriScore and dashboard
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced VeriScore Card matching brand assets */}
      <Card className="veri-gradient-card border-white/20 hover-scale">
        <CardContent className="p-8">
          {/* Header with Veri Icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 veri-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <VeriLogo size="lg" showText={false} />
            </div>
          </div>

          {/* VeriScore Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-termina text-white mb-2">VeriScore</h3>
            <p className="text-white/60 font-inter">Calculated Weekly Based on</p>
            <p className="text-green-400 font-inter text-sm underline cursor-pointer hover:text-green-300 transition-colors">VeriScore Analytics™</p>
          </div>

          {/* Main Score */}
          <div className="text-center mb-8 relative">
            <div 
              ref={scoreRef}
              className="text-6xl font-termina text-green-400 mb-2 transition-all duration-300 cursor-pointer relative"
            >
              {Math.round(animatedScore)}
              {showParticles && (
                <div className="particle-burst">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="particle"
                      style={{
                        '--angle': `${i * 30}deg`,
                        animationDelay: `${i * 0.05}s`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* VeriPoints Section */}
          <div className="text-center mb-8">
            <h4 className="text-xl font-termina text-white mb-4">VeriPoints</h4>
            <div 
              ref={xpRef}
              className="text-4xl font-termina text-green-400 mb-6 relative"
            >
              {Math.round(animatedXP).toLocaleString()}XP
              {showXPParticles && (
                <div className="particle-burst">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="particle"
                      style={{
                        '--angle': `${i * 30}deg`,
                        animationDelay: `${i * 0.05}s`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-subtle p-4 rounded-xl text-center hover-scale">
              <div className="text-2xl font-bold text-white mb-1">8.7K</div>
              <div className="text-sm text-white/60 font-inter">Total Followers</div>
            </div>
            <div className="glass-subtle p-4 rounded-xl text-center hover-scale">
              <div className="text-2xl font-bold text-white mb-1">12.5K</div>
              <div className="text-sm text-white/60 font-inter">Engagement</div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h5 className="text-xl font-termina text-white mb-1">
              {activeUser.firstName && activeUser.lastName 
                ? `${activeUser.firstName} ${activeUser.lastName}`
                : activeUser.username}
            </h5>
            <p className="text-green-400 font-inter">Creator & Influencer</p>
          </div>

          {/* Test Button - Remove after debugging */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                console.log('Test button clicked - triggering particles');
                setShowParticles(true);
                setShowXPParticles(true);
                setTimeout(() => {
                  setShowParticles(false);
                  setShowXPParticles(false);
                }, 1000);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Particles
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

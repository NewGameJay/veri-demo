import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VeriLogo } from "@/components/ui/veri-logo";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useCounter } from "@/hooks/use-counter";

import { useState, useEffect, useRef, useMemo } from "react";
import { Star } from 'lucide-react';
import { Trophy } from 'lucide-react';
import { Zap } from 'lucide-react';
import { Award } from 'lucide-react';
import { Crown } from 'lucide-react';
import { VeriScoreCardSkeleton } from "@/components/ui/veri-skeleton";
import { motion } from "framer-motion";

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
    enabled: !!user
  });

  const activeUser = currentUser || user;

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
    if (isFirstMount.current && veriScore > 0) {
      setPreviousScore(veriScore);
      setPreviousXP(activeUser?.xpPoints || 0);
      isFirstMount.current = false;
      return; // Don't trigger animations on first mount
    }
    
    // Only trigger animations if we're not on first mount and values actually increased
    if (!isFirstMount.current && activeUser?.xpPoints !== undefined) {
      const currentXP = activeUser.xpPoints;
      const prevXP = previousXP || 0;
      
      // Only animate if XP actually increased (not just different)
      if (currentXP > prevXP && prevXP > 0) {
        // XP increased - show particle animation
        setShowXPParticles(true);
        setTimeout(() => setShowXPParticles(false), 1000);
      }
      // Always update previousXP to current value to prevent repeated animations
      setPreviousXP(currentXP);
    }
    
    // Handle VeriScore changes similarly
    if (!isFirstMount.current && veriScore !== previousScore && veriScore > 0) {
      // Don't update previousScore immediately - let the animation complete first
      // setPreviousScore will be called in onComplete
    }
  }, [veriScore, activeUser?.xpPoints]);
  
  // Use the proper start value for animation
  const animationStart = previousScore === null ? veriScore : previousScore;
  
  const animatedScore = useCounter({ 
    end: veriScore, 
    start: animationStart,
    duration: previousScore === null ? 0 : 1500, // No animation on first mount
    onComplete: () => {
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
    duration: (previousXP === null || currentXP <= previousXP) ? 0 : 1500, // No animation if XP didn't increase
    onComplete: () => {
      // Don't trigger particle animations in onComplete - they should only happen in useEffect
      // when XP actually increases, not when animation completes
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

  // Scroll effects removed - static positioning

  return (
    <div>
      <Card 
        variant="glass" 
        hover={true} 
        className="veri-gradient-card border-white/20 hover-lift w-full relative"
      >
      <CardContent className="p-6 flex flex-col space-y-6">
        {/* Top - Logo and VeriScore Text */}
        <div className="text-center space-y-4">
          <motion.div 
            className="w-16 h-16 veri-gradient rounded-2xl flex items-center justify-center shadow-lg mx-auto"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <VeriLogo size="lg" showText={false} />
          </motion.div>
          <h3 className="text-xl font-termina text-white">VeriScore</h3>
        </div>

        {/* Large VeriScore Number */}
        <div className="text-center">
          <div 
            ref={scoreRef}
            className="text-6xl font-termina text-green-400 relative"
          >
            {Math.round(animatedScore)}
            {showParticles && (
              <div className="particle-burst">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Info Box */}
        <div className="bg-gray-700/50 rounded-xl p-3 text-center">
          <p className="text-sm text-white/70">Calculated Weekly Based on</p>
          <p className="text-sm text-green-400 font-medium">VeriScore Analytics™</p>
        </div>

        {/* VeriPoints Section */}
        <div className="text-center space-y-2">
          <h4 className="text-lg font-termina text-white">VeriPoints</h4>
          <div 
            ref={xpRef}
            className="text-4xl font-termina text-green-400 relative"
          >
            {Math.round(animatedXP).toLocaleString()}XP
            {showXPParticles && (
              <div className="particle-burst">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 text-center bg-[#6a6c7a80]">
            <div className="text-xl font-termina text-white">8.7K</div>
            <div className="text-sm text-white/70">Total Followers</div>
          </div>
          <div className="rounded-xl p-4 text-center bg-[#6a6c7a80]">
            <div className="text-xl font-termina text-white">12.5K</div>
            <div className="text-sm text-white/70">Engagement</div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-1">
          <h5 className="text-xl font-termina text-white">
            {activeUser.firstName && activeUser.lastName 
              ? `${activeUser.firstName} ${activeUser.lastName}`
              : activeUser.username}
          </h5>
          <p className="text-green-400 font-inter text-sm">Creator & Influencer</p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

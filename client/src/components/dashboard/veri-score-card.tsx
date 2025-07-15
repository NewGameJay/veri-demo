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
    } else if (!isFirstMount.current && veriScore !== previousScore && veriScore > 0) {
      // Don't update previousScore immediately - let the animation complete first
      // setPreviousScore will be called in onComplete
    }
    
    // Handle XP changes separately - trigger particle animation immediately
    if (!isFirstMount.current && activeUser?.xpPoints !== previousXP && activeUser?.xpPoints > 0) {
      const currentXP = activeUser?.xpPoints || 0;
      const prevXP = previousXP || 0;
      
      if (currentXP > prevXP) {
        // XP increased - show particle animation
        setShowXPParticles(true);
        setTimeout(() => setShowXPParticles(false), 1000);
        setPreviousXP(currentXP);
      }
    }
  }, [veriScore, previousScore, activeUser?.xpPoints, previousXP]);
  
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
    duration: previousXP === null ? 0 : 1500, // No animation on first mount
    onComplete: () => {
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

  // Scroll effects removed - static positioning

  return (
    <div>
      <Card 
        variant="glass" 
        hover={true} 
        className="bg-gray-900/80 backdrop-blur-xl border-white/20 hover-lift w-full relative rounded-2xl shadow-2xl"
      >
      <CardContent className="p-6 h-full flex flex-col space-y-6">
        {/* Top Row - Veri Logo */}
        <div className="flex justify-center">
          <motion.div 
            className="w-12 h-12 veri-gradient rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <VeriLogo size="md" showText={false} />
          </motion.div>
        </div>

        {/* VeriScore Title and Score */}
        <div className="text-center">
          <h3 className="text-xl font-termina text-white mb-3">VeriScore</h3>
          <div 
            ref={scoreRef}
            className="text-6xl font-termina bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative mb-2"
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
          <p className="text-white/60 text-sm">Calculated Weekly Based on VeriScore Analytics™</p>
        </div>

        {/* VeriPoints Section */}
        <div className="text-center">
          <div className="text-lg font-termina text-white mb-2">VeriPoints</div>
          <div 
            ref={xpRef}
            className="text-3xl font-termina text-emerald-400 relative"
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

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-termina text-white">8.7K</div>
            <div className="text-xs text-white/60">Total Followers</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-termina text-white">12.5K</div>
            <div className="text-xs text-white/60">Engagement</div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h5 className="text-lg font-termina text-white mb-1">
            {activeUser.firstName && activeUser.lastName 
              ? `${activeUser.firstName} ${activeUser.lastName}`
              : activeUser.username || "Sam Huber"}
          </h5>
          <p className="text-white/60 font-inter text-sm">Creator & Influencer</p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

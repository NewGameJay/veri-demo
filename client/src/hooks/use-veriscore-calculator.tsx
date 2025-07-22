import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';

export interface VeriScoreFactors {
  socialConnections: number;
  engagement: number;
  consistency: number;
  authenticity: number;
}

export interface VeriScoreData {
  score: number;
  factors: VeriScoreFactors;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  previousScore?: number;
  change?: number;
}

export function useVeriScoreCalculator() {
  const { user } = useAuth();
  const [veriScore, setVeriScore] = useState<VeriScoreData>({
    score: 0,
    factors: {
      socialConnections: 0,
      engagement: 0,
      consistency: 0,
      authenticity: 0
    },
    tier: 'Bronze'
  });

  // Fetch user's social connections
  const { data: socialConnections = [] } = useQuery({
    queryKey: [`/api/social-connections/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch user data for XP and other metrics
  const { data: userData } = useQuery({
    queryKey: ['/api/users', user?.id],
    enabled: !!user?.id,
  });

  // Calculate VeriScore based on available data
  useEffect(() => {
    if (!userData || !user) return;

    const connectedPlatforms = (socialConnections as any[]).filter((conn: any) => conn.isConnected);
    const totalXP = (userData as any).xpPoints || 0;
    const streakDays = (userData as any).streak || 0;

    // Calculate social connections factor (0-30 points)
    const socialConnectionsScore = Math.min(30, connectedPlatforms.length * 10);

    // Calculate engagement factor based on XP (0-25 points)
    const engagementScore = Math.min(25, Math.floor(totalXP / 100));

    // Calculate consistency factor based on streak (0-25 points)
    const consistencyScore = Math.min(25, streakDays * 2);

    // Calculate authenticity factor (0-20 points)
    // Base authenticity on profile completeness and verified connections
    const hasProfilePicture = (userData as any).profilePicture ? 5 : 0;
    const hasUsername = (userData as any).username ? 5 : 0;
    const verifiedConnections = connectedPlatforms.filter((conn: any) => {
      try {
        const data = JSON.parse(conn.connectionData || '{}');
        return data.verified;
      } catch {
        return false;
      }
    }).length;
    const authenticityScore = hasProfilePicture + hasUsername + (verifiedConnections * 5);

    // Calculate total score (0-100)
    const totalScore = socialConnectionsScore + engagementScore + consistencyScore + Math.min(20, authenticityScore);

    // Determine tier
    let tier: VeriScoreData['tier'] = 'Bronze';
    if (totalScore >= 80) tier = 'Diamond';
    else if (totalScore >= 65) tier = 'Platinum';
    else if (totalScore >= 45) tier = 'Gold';
    else if (totalScore >= 25) tier = 'Silver';

    const newVeriScore: VeriScoreData = {
      score: totalScore,
      factors: {
        socialConnections: socialConnectionsScore,
        engagement: engagementScore,
        consistency: consistencyScore,
        authenticity: Math.min(20, authenticityScore)
      },
      tier,
      previousScore: veriScore.score,
      change: totalScore - veriScore.score
    };

    setVeriScore(newVeriScore);
  }, [socialConnections, userData, user]);

  const getNextMilestone = () => {
    const { score } = veriScore;
    if (score < 25) return { target: 25, tier: 'Silver' };
    if (score < 45) return { target: 45, tier: 'Gold' };
    if (score < 65) return { target: 65, tier: 'Platinum' };
    if (score < 80) return { target: 80, tier: 'Diamond' };
    return { target: 100, tier: 'Legendary' };
  };

  const getScoreBreakdown = () => {
    const connectedCount = (socialConnections as any[]).filter((conn: any) => conn.isConnected).length;
    
    return {
      socialConnections: {
        current: veriScore.factors.socialConnections,
        max: 30,
        description: `${connectedCount}/4 platforms connected`,
        suggestions: connectedCount < 4 ? ['Connect more social platforms to increase your score'] : []
      },
      engagement: {
        current: veriScore.factors.engagement,
        max: 25,
        description: `Based on ${(userData as any)?.xpPoints || 0} XP earned`,
        suggestions: veriScore.factors.engagement < 25 ? ['Complete more tasks to earn XP'] : []
      },
      consistency: {
        current: veriScore.factors.consistency,
        max: 25,
        description: `${(userData as any)?.streak || 0} day streak`,
        suggestions: veriScore.factors.consistency < 25 ? ['Maintain daily activity to build your streak'] : []
      },
      authenticity: {
        current: veriScore.factors.authenticity,
        max: 20,
        description: 'Profile completeness and verification',
        suggestions: veriScore.factors.authenticity < 20 ? ['Complete your profile and verify accounts'] : []
      }
    };
  };

  return {
    veriScore,
    nextMilestone: getNextMilestone(),
    scoreBreakdown: getScoreBreakdown(),
    connectedPlatformsCount: (socialConnections as any[]).filter((conn: any) => conn.isConnected).length,
    totalPlatforms: 4
  };
}
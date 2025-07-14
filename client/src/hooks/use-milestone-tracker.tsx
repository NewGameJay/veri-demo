import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

interface Milestone {
  id: string;
  title: string;
  description: string;
  requirement: number;
  type: "xp" | "streak" | "score" | "tasks";
  achieved: boolean;
}

const MILESTONES: Milestone[] = [
  {
    id: "first_task",
    title: "First Steps",
    description: "Complete your first task",
    requirement: 1,
    type: "tasks",
    achieved: false
  },
  {
    id: "xp_100",
    title: "XP Rookie",
    description: "Earn 100 XP points",
    requirement: 100,
    type: "xp",
    achieved: false
  },
  {
    id: "xp_500",
    title: "XP Explorer",
    description: "Earn 500 XP points",
    requirement: 500,
    type: "xp",
    achieved: false
  },
  {
    id: "streak_3",
    title: "Veri+ Creator",
    description: "Maintain a 3-day streak",
    requirement: 3,
    type: "streak",
    achieved: false
  },
  {
    id: "streak_7",
    title: "Weekly Warrior",
    description: "Maintain a 7-day streak",
    requirement: 7,
    type: "streak",
    achieved: false
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    requirement: 30,
    type: "streak",
    achieved: false
  },
  {
    id: "score_50",
    title: "Rising Star",
    description: "Reach VeriScore of 50",
    requirement: 50,
    type: "score",
    achieved: false
  },
  {
    id: "score_80",
    title: "Elite Creator",
    description: "Reach VeriScore of 80",
    requirement: 80,
    type: "score",
    achieved: false
  },
  {
    id: "score_100",
    title: "Veri Legend",
    description: "Reach maximum VeriScore of 100",
    requirement: 100,
    type: "score",
    achieved: false
  }
];

export function useMilestoneTracker() {
  const { user } = useAuth();
  const [newMilestones, setNewMilestones] = useState<Milestone[]>([]);
  const [previousStats, setPreviousStats] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const currentStats = {
      xp: user.xpPoints || 0,
      streak: user.streak || 0,
      score: Math.min(100, Math.floor((user.xpPoints || 0) / 10)),
      tasks: user.xpPoints ? Math.floor((user.xpPoints || 0) / 25) : 0 // Approximate tasks completed
    };

    // Check for new milestones if we have previous stats
    if (previousStats) {
      const justAchieved = MILESTONES.filter(milestone => {
        const currentValue = currentStats[milestone.type];
        const previousValue = previousStats[milestone.type];
        
        return currentValue >= milestone.requirement && 
               previousValue < milestone.requirement;
      });

      if (justAchieved.length > 0) {
        setNewMilestones(justAchieved);
      }
    }

    setPreviousStats(currentStats);
  }, [user?.xpPoints, user?.streak]);

  const clearNewMilestones = () => {
    setNewMilestones([]);
  };

  const getCurrentMilestones = () => {
    if (!user) return MILESTONES;

    const currentStats = {
      xp: user.xpPoints || 0,
      streak: user.streak || 0,
      score: Math.min(100, Math.floor((user.xpPoints || 0) / 10)),
      tasks: user.xpPoints ? Math.floor((user.xpPoints || 0) / 25) : 0
    };

    return MILESTONES.map(milestone => ({
      ...milestone,
      achieved: currentStats[milestone.type] >= milestone.requirement
    }));
  };

  const getNextMilestone = () => {
    const milestones = getCurrentMilestones();
    return milestones.find(m => !m.achieved);
  };

  return {
    newMilestones,
    clearNewMilestones,
    getCurrentMilestones,
    getNextMilestone
  };
}
import { useCelebration } from "@/contexts/celebration-context";
import { useEffect } from "react";

interface MilestoneCelebrationProps {
  milestone: {
    id: string;
    title: string;
    description: string;
    requirement: number;
    type: "xp" | "streak" | "score" | "tasks";
  };
  onClose: () => void;
}

export function MilestoneCelebration({ milestone, onClose }: MilestoneCelebrationProps) {
  const { triggerCelebration } = useCelebration();
  
  // Calculate XP equivalent for the milestone for display purposes
  const getMilestoneXP = () => {
    switch (milestone.type) {
      case "xp":
        return milestone.requirement;
      case "streak":
        return milestone.requirement * 5; // 5 XP per streak day
      case "score":
        return milestone.requirement * 10; // 10 XP per VeriScore point
      case "tasks":
        return milestone.requirement * 25; // 25 XP per task
      default:
        return 50;
    }
  };

  useEffect(() => {
    // Automatically trigger the celebration when component mounts
    triggerCelebration({
      xpEarned: getMilestoneXP(),
      taskName: milestone.title,
      shareEnabled: true,
      isSpecialTask: true,
      streakBonus: 1,
      category: milestone.type,
      type: 'milestone'
    });
  }, [milestone, triggerCelebration]);

  // Return null since the global celebration manager handles display
  return null;
}
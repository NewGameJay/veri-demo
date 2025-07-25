import { TaskCelebrationCard } from "@/components/celebrations/task-celebration-card";

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

  return (
    <TaskCelebrationCard
      xpEarned={getMilestoneXP()}
      taskName={milestone.title}
      shareEnabled={true}
      isSpecialTask={true}
      streakBonus={1}
      category={milestone.type}
      onClose={onClose}
    />
  );
}
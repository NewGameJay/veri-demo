import { TaskCelebrationCard } from "./task-celebration-card";
import { useCelebration } from "@/contexts/celebration-context";

export function GlobalCelebrationManager() {
  const { showCelebration, celebrationData, closeCelebration } = useCelebration();

  if (!showCelebration || !celebrationData) {
    return null;
  }

  return (
    <TaskCelebrationCard
      xpEarned={celebrationData.xpEarned}
      taskName={celebrationData.taskName}
      shareEnabled={celebrationData.shareEnabled ?? true}
      isSpecialTask={celebrationData.isSpecialTask ?? false}
      streakBonus={celebrationData.streakBonus ?? 1}
      category={celebrationData.category ?? "general"}
      onClose={closeCelebration}
    />
  );
}
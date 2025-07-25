import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CelebrationData {
  xpEarned: number;
  taskName: string;
  shareEnabled?: boolean;
  isSpecialTask?: boolean;
  streakBonus?: number;
  category?: string;
  type: 'task' | 'milestone';
}

interface CelebrationContextType {
  showCelebration: boolean;
  celebrationData: CelebrationData | null;
  triggerCelebration: (data: CelebrationData) => void;
  closeCelebration: () => void;
}

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);

  const triggerCelebration = (data: CelebrationData) => {
    // Close any existing celebration first
    setShowCelebration(false);
    setCelebrationData(null);
    
    // Small delay to ensure cleanup, then show new celebration
    setTimeout(() => {
      setCelebrationData(data);
      setShowCelebration(true);
    }, 100);
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setCelebrationData(null);
  };

  return (
    <CelebrationContext.Provider value={{
      showCelebration,
      celebrationData,
      triggerCelebration,
      closeCelebration
    }}>
      {children}
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (context === undefined) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
}
/**
 * Haptic feedback utility for mobile touch interactions
 * Provides tactile feedback for button clicks and user actions
 */

export type HapticPattern = "light" | "success" | "error" | "warning";

interface HapticOptions {
  pattern: HapticPattern;
  fallback?: boolean;
}

const hapticPatterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  success: [10, 50, 10],
  error: [100, 50, 100],
  warning: [50, 30, 50]
};

/**
 * Trigger haptic feedback if supported by the device
 */
export function triggerHaptic(pattern: HapticPattern = "light", options: Partial<HapticOptions> = {}) {
  // Check if vibration API is supported
  if (!navigator.vibrate) {
    return false;
  }

  const vibrationPattern = hapticPatterns[pattern];
  
  try {
    return navigator.vibrate(vibrationPattern);
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
    return false;
  }
}

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
  const haptic = (pattern: HapticPattern = "light") => {
    triggerHaptic(pattern);
  };

  return { haptic, triggerHaptic };
}

/**
 * Enhanced button click handler with haptic feedback
 */
export function withHapticFeedback<T extends (...args: any[]) => any>(
  handler: T,
  pattern: HapticPattern = "light"
): T {
  return ((...args: any[]) => {
    triggerHaptic(pattern);
    return handler(...args);
  }) as T;
}
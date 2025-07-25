import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignupForm } from "./signup-form";
import { LoginForm } from "./login-form";
import { ImmersiveOnboarding } from "@/components/modals/immersive-onboarding";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialMode = "signup", onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  // Update mode when initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleAuthSuccess = () => {
    if (mode === "signup") {
      setShowOnboarding(true);
    } else {
      onClose();
      onSuccess?.();
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {mode === "signup" ? "Sign Up" : "Sign In"}
            </DialogTitle>
            <DialogDescription>
              {mode === "signup" ? "Create your Veri account to start earning points" : "Sign in to your Veri account"}
            </DialogDescription>
          </DialogHeader>
          {mode === "signup" ? (
            <SignupForm 
              onSwitchToLogin={() => setMode("login")}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <LoginForm 
              onSwitchToSignup={() => setMode("signup")}
              onSuccess={handleAuthSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <ImmersiveOnboarding 
        isOpen={showOnboarding} 
        onClose={handleOnboardingComplete}
      />
    </>
  );
}
import { useState } from "react";
import { X, Check, ArrowRight, Twitter, Youtube, Instagram, Send, Linkedin, Facebook } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VeriLogo } from "@/components/ui/veri-logo";
import { useToastEnhanced } from "@/hooks/use-toast-enhanced";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { showSuccess } = useToastEnhanced();

  const handleClose = () => {
    onClose();
    showSuccess("Welcome to Veri! Your dashboard is ready.");
  };

  const connectedPlatforms = [
    { id: 1, name: "Twitter", icon: Twitter, username: "Connected", points: 500, bgColor: "bg-blue-500", isConnected: true },
    { id: 2, name: "YouTube", icon: Youtube, username: "Connected", points: 500, bgColor: "bg-red-500", isConnected: true },
  ];

  const availablePlatforms = [
    { id: 3, name: "Instagram", icon: Instagram, username: "Connect Instagram", points: 500, bgColor: "bg-pink-500", isConnected: false },
  ];

  const comingSoonPlatforms = [
    { id: 4, name: "Telegram", icon: Send },
    { id: 5, name: "LinkedIn", icon: Linkedin },
    { id: 6, name: "Facebook", icon: Facebook },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto glass-effect border-white/20 bg-gray-900/95 text-white">
        <DialogHeader>
          <div className="text-center mb-8">
            <VeriLogo size="lg" />
            <DialogTitle className="text-2xl font-bold mb-2 text-white">
              Hi Sam Huber 👋
            </DialogTitle>
            <p className="text-white/60">
              Connect social accounts to set up your dashboard and start earning 500 Veri points per linked account
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connected Platforms */}
          {connectedPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.id} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <div className={`w-8 h-8 ${platform.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{platform.username}</div>
                  <div className="text-sm text-white/60">+{platform.points} Points</div>
                </div>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}

          {/* Available Platforms */}
          {availablePlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.id}
                variant="ghost"
                className="w-full flex items-center gap-3 p-4 glass-effect rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className={`w-8 h-8 ${platform.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">{platform.username}</div>
                  <div className="text-sm text-white/60">+{platform.points} Pts</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/60" />
              </Button>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-white/10">
          <h3 className="font-semibold mb-2 text-white">Coming soon</h3>
          <div className="space-y-2 text-sm text-white/60">
            {comingSoonPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.id} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{platform.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          onClick={handleClose}
          className="w-full mt-6 px-6 py-3 veri-gradient rounded-xl font-semibold text-white hover-scale transition-all duration-200"
        >
          Continue to Dashboard
        </Button>
      </DialogContent>
    </Dialog>
  );
}

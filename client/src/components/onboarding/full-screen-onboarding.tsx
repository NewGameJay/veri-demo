import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VeriLogo } from "@/components/ui/veri-logo";
import { ArrowRight, Sparkles, Zap, Users, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InterestSelector } from "@/components/profile/interest-selector";
import { AIBioGenerator } from "@/components/profile/ai-bio-generator";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { triggerHaptic } from "@/lib/haptic";

interface FullScreenOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'creator-type' | 'interests' | 'goals' | 'bio' | 'social';

export function FullScreenOnboarding({ isOpen, onComplete }: FullScreenOnboardingProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Form data
  const [creatorType, setCreatorType] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  const steps: OnboardingStep[] = ['welcome', 'creator-type', 'interests', 'goals', 'bio', 'social'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const creatorTypes = [
    { id: "content-creator", label: "Content Creator", emoji: "🎬", description: "Create videos, streams, and multimedia content" },
    { id: "influencer", label: "Influencer", emoji: "⭐", description: "Build audience and promote brands/products" },
    { id: "gamer", label: "Gamer", emoji: "🎮", description: "Gaming content, streams, and esports" },
    { id: "educator", label: "Educator", emoji: "📚", description: "Educational content and tutorials" },
    { id: "entrepreneur", label: "Entrepreneur", emoji: "💼", description: "Business content and startup insights" },
    { id: "artist", label: "Artist", emoji: "🎨", description: "Creative content and artistic expression" },
    { id: "musician", label: "Musician", emoji: "🎵", description: "Music creation and audio content" },
    { id: "fitness", label: "Fitness Coach", emoji: "💪", description: "Health, fitness, and wellness content" },
    { id: "tech", label: "Tech Reviewer", emoji: "📱", description: "Technology reviews and tech content" },
    { id: "lifestyle", label: "Lifestyle", emoji: "✨", description: "Daily life, fashion, and lifestyle content" }
  ];

  const handleNext = () => {
    triggerHaptic('light');
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    if (currentStep === 'social') {
      handleComplete();
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex]);
      }
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Save onboarding data
      await apiRequest(`/api/users/${user?.id}/onboarding`, {
        method: 'POST',
        body: JSON.stringify({
          creatorType,
          interests,
          goals,
          bio: bio || `${creatorTypes.find(t => t.id === creatorType)?.emoji} ${creatorTypes.find(t => t.id === creatorType)?.label} | ${interests.slice(0, 3).join(', ')} | ${goals.slice(0, 2).join(' & ')}`
        })
      });

      triggerHaptic('success');
      onComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      triggerHaptic('error');
    } finally {
      setIsCompleting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'creator-type':
        return creatorType !== "";
      case 'interests':
        return interests.length >= 3;
      case 'goals':
        return goals.length >= 2;
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-4xl"
          >
            {/* Welcome Step */}
            {currentStep === 'welcome' && (
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                >
                  <VeriLogo className="w-24 h-24 mx-auto mb-6" />
                </motion.div>
                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-6xl font-termina text-white mb-4">
                    Welcome to <span className="veri-gradient bg-clip-text text-transparent">Veri</span>
                  </h1>
                  <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                    Let's set up your creator profile in just a few steps. This will help us personalize your experience and connect you with the right opportunities.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="veri-gradient text-lg px-8 py-6"
                  >
                    Let's Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Creator Type Step */}
            {currentStep === 'creator-type' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-termina text-white mb-4">What type of creator are you?</h2>
                  <p className="text-white/70 text-lg">Choose the option that best describes your content style</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {creatorTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setCreatorType(type.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        creatorType === type.id
                          ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                          : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{type.emoji}</span>
                        <div>
                          <div className="text-white font-semibold text-lg">{type.label}</div>
                          <div className="text-white/60 text-sm">{type.description}</div>
                        </div>
                      </div>
                      {creatorType === type.id && (
                        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          Selected
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="veri-gradient px-8"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            )}

            {/* Interests Step */}
            {currentStep === 'interests' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-termina text-white mb-4">What are your interests?</h2>
                  <p className="text-white/70 text-lg">Select 3-5 topics you're passionate about</p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <InterestSelector
                    selectedInterests={interests}
                    onInterestsChange={setInterests}
                    selectedGoals={[]}
                    onGoalsChange={() => {}}
                    creatorType={creatorType}
                    onCreatorTypeChange={setCreatorType}
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="veri-gradient px-8"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            )}

            {/* Goals Step */}
            {currentStep === 'goals' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-termina text-white mb-4">What are your goals?</h2>
                  <p className="text-white/70 text-lg">Choose 2-3 objectives you want to achieve</p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <InterestSelector
                    selectedInterests={interests}
                    onInterestsChange={setInterests}
                    selectedGoals={goals}
                    onGoalsChange={setGoals}
                    creatorType={creatorType}
                    onCreatorTypeChange={setCreatorType}
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="veri-gradient px-8"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            )}

            {/* Bio Step */}
            {currentStep === 'bio' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-termina text-white mb-4">Create your bio</h2>
                  <p className="text-white/70 text-lg">Let AI help you craft the perfect creator bio</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <AIBioGenerator
                    creatorType={creatorType}
                    interests={interests}
                    goals={goals}
                    currentBio={bio}
                    onBioChange={setBio}
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleNext}
                    className="veri-gradient px-8"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            )}

            {/* Social Step */}
            {currentStep === 'social' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-termina text-white mb-4">Connect Your Platforms</h2>
                  <p className="text-white/70 text-lg">Connect your social media accounts to verify your audience and unlock features</p>
                </div>

                <Card className="glass-effect border-white/10 max-w-2xl mx-auto">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Platform Authentication Required</h3>
                      <p className="text-white/60 mb-6">
                        To access your dashboard and unlock all features, you need to connect at least one social media platform. This helps us verify your creator status and provide personalized opportunities.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" size="lg">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Connect Twitter/X
                      </Button>
                      
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white" size="lg">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Connect YouTube
                      </Button>
                      
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" size="lg">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Connect Instagram
                      </Button>
                      
                      <Button className="w-full bg-black hover:bg-gray-800 text-white" size="lg">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.965 1.404-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                        </svg>
                        Connect TikTok
                      </Button>
                    </div>

                    <div className="text-center pt-4">
                      <p className="text-white/50 text-sm mb-4">
                        Don't worry, you can always connect more platforms later in your settings.
                      </p>
                      <Button
                        onClick={handleComplete}
                        disabled={isCompleting}
                        variant="outline"
                        className="border-white/20 text-white/70 hover:bg-white/10"
                      >
                        {isCompleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Setting up...
                          </>
                        ) : (
                          'Skip to Dashboard'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
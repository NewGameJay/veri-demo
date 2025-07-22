import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { User } from 'lucide-react';
import { Globe } from 'lucide-react';
import { Briefcase } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { Shield } from 'lucide-react';
import { X } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";

interface EnhancedProfileBuilderProps {
  onComplete: () => void;
  onClose: () => void;
}

interface ProfileFormData {
  name: string;
  bio: string;
  website: string;
  userType: 'creator' | 'studio' | 'community';
  profileType: 'individual' | 'business';
  interests: string[];
  goals: string[];
}

export function EnhancedProfileBuilder({ onComplete, onClose }: EnhancedProfileBuilderProps) {
  const { user, completeProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    bio: '',
    website: '',
    userType: 'creator',
    profileType: 'individual',
    interests: [],
    goals: []
  });

  const steps = [
    {
      id: 'profile-type',
      title: 'Choose Your Profile',
      description: 'Select what type of creator you are'
    },
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Tell us about yourself'
    },
    {
      id: 'ai-enhancement',
      title: 'AI Profile Enhancement',
      description: 'Let AI optimize your profile'
    },
    {
      id: 'review',
      title: 'Review & Publish',
      description: 'Final review before going live'
    }
  ];

  const profileTypes = [
    {
      id: 'gaming-creator',
      title: 'Gaming Creator',
      description: 'Stream, create content, and build a gaming community',
      icon: '🎮',
      userType: 'creator' as const,
      profileType: 'individual' as const,
      features: ['Gaming content tools', 'Stream integration', 'Community features', 'Gaming analytics'],
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: 'content-creator',
      title: 'Content Creator',
      description: 'Create engaging content across multiple platforms',
      icon: '📱',
      userType: 'creator' as const,
      profileType: 'individual' as const,
      features: ['Multi-platform tools', 'Content scheduling', 'Analytics dashboard', 'Brand partnerships'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'studio',
      title: 'Studio / Agency',
      description: 'Manage multiple creators and campaigns',
      icon: '🏢',
      userType: 'studio' as const,
      profileType: 'business' as const,
      features: ['Creator management', 'Campaign tools', 'Advanced analytics', 'Team collaboration'],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'community',
      title: 'Community Builder',
      description: 'Build and grow engaged communities',
      icon: '👥',
      userType: 'community' as const,
      profileType: 'individual' as const,
      features: ['Community tools', 'Event management', 'Member analytics', 'Engagement tracking'],
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const interests = [
    'Gaming', 'Technology', 'Lifestyle', 'Education', 'Entertainment',
    'Business', 'Health & Fitness', 'Travel', 'Food', 'Fashion',
    'Music', 'Art & Design', 'Photography', 'Sports', 'Comedy'
  ];

  const goals = [
    'Grow my audience', 'Monetize my content', 'Build my brand',
    'Connect with other creators', 'Learn new skills', 'Find collaborations',
    'Get brand partnerships', 'Improve content quality'
  ];

  const handleNext = async () => {
    triggerHaptic("light");
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    triggerHaptic("light");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAIGenerate = async () => {
    setIsAIGenerating(true);
    triggerHaptic("light");
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const aiEnhancedBio = `${formData.userType === 'creator' ? 'Content creator' : 'Professional'} passionate about ${formData.interests.slice(0, 3).join(', ')}. ${formData.goals.includes('Grow my audience') ? 'Focused on building authentic connections and growing a meaningful community.' : 'Dedicated to creating valuable content and meaningful impact.'} ${formData.goals.includes('Build my brand') ? 'Building a strong personal brand through consistent, high-quality content.' : 'Always looking for new ways to connect and collaborate with like-minded individuals.'}`;
    
    setFormData(prev => ({ ...prev, bio: aiEnhancedBio }));
    setIsAIGenerating(false);
    triggerHaptic("success");
  };

  const handleComplete = async () => {
    try {
      await completeProfile();
      triggerHaptic("success");
      onComplete();
    } catch (error) {
      triggerHaptic("error");
      console.error('Failed to complete profile:', error);
    }
  };

  const updateFormData = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const selectProfileType = (profileType: typeof profileTypes[0]) => {
    setFormData(prev => ({
      ...prev,
      userType: profileType.userType,
      profileType: profileType.profileType
    }));
    triggerHaptic("light");
    setTimeout(() => {
      setCurrentStep(1); // Move to basic info step
    }, 300);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.userType !== 'creator' || formData.profileType !== 'individual'; // Profile type selected
      case 1:
        return formData.name.trim() !== '' && formData.interests.length > 0;
      case 2:
        return true; // Bio is optional - users can add it later
      case 3:
        return true;
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" style={{ padding: '15px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-full flex flex-col"
        style={{ maxHeight: 'calc(100vh - 30px)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Build Your Veri Profile</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              haptic="light"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Step Content */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileTypes.map((type) => (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectProfileType(type)}
                        className="cursor-pointer"
                      >
                        <Card className={`h-full glass-subtle border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 overflow-hidden group relative`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                          
                          <CardContent className="p-6 relative z-10">
                            <div className="text-center mb-4">
                              <div className="text-3xl mb-3">{type.icon}</div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{type.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">{type.description}</p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Features included:</h4>
                              {type.features.map((feature, index) => (
                                <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                  <div className="w-1 h-1 rounded-full bg-emerald-500 mr-2" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder="Your display name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website (optional)</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        placeholder="https://your-website.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Interests (select up to 5)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {interests.map((interest) => (
                        <Button
                          key={interest}
                          variant={formData.interests.includes(interest) ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFormData('interests', toggleArrayItem(formData.interests, interest))}
                          disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
                          haptic="light"
                          className="text-xs whitespace-nowrap"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.interests.length}/5 selected
                    </p>
                  </div>

                  <div>
                    <Label>Goals (select up to 3)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {goals.map((goal) => (
                        <Button
                          key={goal}
                          variant={formData.goals.includes(goal) ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFormData('goals', toggleArrayItem(formData.goals, goal))}
                          disabled={!formData.goals.includes(goal) && formData.goals.length >= 3}
                          haptic="light"
                          className="text-xs whitespace-nowrap justify-start"
                        >
                          {goal}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.goals.length}/3 selected
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-6 h-6 text-purple-600" />
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">AI Profile Enhancement</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Let AI create a compelling bio based on your interests and goals
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleAIGenerate}
                          disabled={isAIGenerating}
                          className="bg-purple-600 hover:bg-purple-700"
                          haptic="light"
                        >
                          {isAIGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Bio
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <Label htmlFor="bio">Bio <span className="text-gray-400 font-normal">(Optional)</span></Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      placeholder="Tell people about yourself... (You can also add this later in your profile)"
                      className="mt-1 min-h-[120px]"
                      rows={5}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formData.bio.length}/500 characters • You can complete this later in your profile
                    </p>
                  </div>

                  {formData.bio && (
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900 dark:text-green-100">
                            Preview
                          </span>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          {formData.bio}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                        <h3 className="font-bold text-emerald-900 dark:text-emerald-100">
                          Profile Complete!
                        </h3>
                      </div>
                      <p className="text-emerald-800 dark:text-emerald-200 mb-4">
                        Your Veri profile is ready to go live. You'll now have access to all premium features.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-emerald-800 dark:text-emerald-200">
                            AI Agent tools unlocked
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-emerald-800 dark:text-emerald-200">
                            Engage & Earn tasks available
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-emerald-800 dark:text-emerald-200">
                            Premium creator features enabled
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Profile Summary</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                        <Badge className="ml-2 capitalize">{formData.userType}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Interests:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.interests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Bio:</span>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">{formData.bio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              haptic="light"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-emerald-600 hover:bg-emerald-700"
              haptic="light"
            >
              {currentStep === steps.length - 1 ? 'Complete Profile' : 'Next'}
              {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
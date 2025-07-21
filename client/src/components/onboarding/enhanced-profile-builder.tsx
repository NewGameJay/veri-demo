import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles, User, Globe, Briefcase, CheckCircle, Shield, X, Loader2, Camera, Share2, Twitter, Copy, Users, TrendingUp, Star, Trophy } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { EmojiReaction, useEmojiReaction } from "@/components/ui/emoji-reaction";
import { SocialShare } from "@/components/social/social-share";

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
  profilePicture: string;
}

export function EnhancedProfileBuilder({ onComplete, onClose }: EnhancedProfileBuilderProps) {
  const { user, completeProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [hasSharedProfile, setHasSharedProfile] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { triggerReaction } = useEmojiReaction();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    bio: '',
    website: '',
    userType: 'creator',
    profileType: 'individual',
    interests: [],
    goals: [],
    profilePicture: ''
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
      id: 'profile-preview',
      title: 'Profile Preview',
      description: 'Preview your complete Veri profile'
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

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData('profilePicture', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareProfile = (platform: string) => {
    setHasSharedProfile(true);
    triggerHaptic('light');
    
    // Trigger emoji reaction for sharing
    triggerReaction({
      type: 'socialConnect',
      category: platform,
      style: 'cascade',
      count: 6,
      size: 'md',
      duration: 3000
    });
  };

  const handleCompleteProfile = async () => {
    setIsCompleting(true);
    triggerHaptic('success');
    
    try {
      // Trigger diamond celebration animation
      triggerReaction({
        type: 'milestone',
        category: 'perfect',
        style: 'burst',
        count: 10,
        size: 'lg',
        duration: 4000
      });

      // Complete profile with form data
      await completeProfile();
      
      // Give bonus XP if profile was shared
      if (hasSharedProfile) {
        console.log('Profile shared! +50 XP bonus awarded');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete();
    } catch (error) {
      console.error('Profile completion failed:', error);
    } finally {
      setIsCompleting(false);
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
        return formData.bio.trim() !== '';
      case 3:
        return formData.name.trim() !== '' && formData.bio.trim() !== '';
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
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
        <div className="p-6 max-h-[600px] overflow-y-auto">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      placeholder="Tell people about yourself..."
                      className="mt-1 min-h-[120px]"
                      rows={5}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formData.bio.length}/500 characters
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
                  {/* Profile Picture Upload */}
                  <Card className="glass-medium border-white/20">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
                        <div className="relative mx-auto w-32 h-32 mb-4">
                          {formData.profilePicture ? (
                            <img 
                              src={formData.profilePicture} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover border-4 border-emerald-500"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center border-4 border-emerald-500">
                              <User className="w-16 h-16 text-white" />
                            </div>
                          )}
                          <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                            <Camera className="w-4 h-4" />
                          </label>
                          <input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                            className="hidden"
                          />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click the camera icon to upload your profile picture
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Full Veri Profile Preview */}
                  <Card className="glass-medium border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                    <CardHeader className="text-center pb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-6 h-6 text-emerald-600" />
                        <CardTitle className="text-emerald-900 dark:text-emerald-100">Your Veri Profile Preview</CardTitle>
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-200 text-sm">
                        This is how your profile will appear to other users and brands
                      </p>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Profile Header */}
                      <div className="text-center">
                        <div className="relative mx-auto w-24 h-24 mb-4">
                          {formData.profilePicture ? (
                            <img 
                              src={formData.profilePicture} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover border-3 border-emerald-400"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                              <User className="w-12 h-12 text-white" />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formData.name}</h2>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 capitalize mb-2">
                          {formData.userType} Creator
                        </Badge>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>VeriScore: --</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-emerald-500" />
                            <span>0 XP</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio Section */}
                      <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{formData.bio}</p>
                        {formData.website && (
                          <div className="mt-2">
                            <a href={formData.website} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium inline-flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {formData.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Interests & Goals */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Interests
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.interests.map((interest) => (
                              <Badge key={interest} variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            Goals
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.goals.map((goal) => (
                              <Badge key={goal} variant="outline" className="border-emerald-300 text-emerald-700">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Social Platform Connections */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-600" />
                          Connected Platforms
                        </h4>
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Connect your social platforms to unlock full profile features</p>
                        </div>
                      </div>

                      {/* Features Unlocked */}
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                        <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Premium Features Unlocked
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            AI Agent tools
                          </div>
                          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            Engage & Earn tasks
                          </div>
                          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            Brand partnerships
                          </div>
                          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            Analytics dashboard
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Sharing for XP Bonus */}
                  <Card className="glass-medium border-purple-200/50 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Share2 className="w-5 h-5 text-purple-600" />
                          <h3 className="font-bold text-purple-900 dark:text-purple-100">Share & Earn Bonus XP</h3>
                        </div>
                        <p className="text-purple-700 dark:text-purple-200 text-sm mb-4">
                          Share your new Veri profile and earn +50 XP bonus points!
                        </p>
                        
                        {hasSharedProfile ? (
                          <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-4">
                            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Profile shared! +50 XP bonus earned</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                              onClick={() => handleShareProfile('twitter')}
                              variant="outline"
                              size="sm"
                              className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            >
                              <Twitter className="w-4 h-4 mr-2" />
                              Share on Twitter
                            </Button>
                            <Button
                              onClick={() => handleShareProfile('copy')}
                              variant="outline"
                              size="sm"
                              className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
              onClick={currentStep === steps.length - 1 ? handleCompleteProfile : handleNext}
              disabled={!isStepValid() || (currentStep === steps.length - 1 && isCompleting)}
              className="bg-emerald-600 hover:bg-emerald-700"
              haptic="light"
            >
              {currentStep === steps.length - 1 ? (
                isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-2" />
                    Complete Profile {hasSharedProfile ? '(+50 XP Bonus!)' : ''}
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Emoji Reactions Component */}
        <EmojiReaction 
          type="milestone"
          category="perfect"
          trigger={false}
          position="center"
          style="burst"
        />
      </motion.div>
    </div>
  );
}
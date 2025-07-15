import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Building2, 
  Gamepad2, 
  Camera, 
  Upload,
  Eye,
  ArrowRight,
  ArrowLeft,
  Save,
  Share2,
  Crown,
  Trophy,
  Sparkles
} from "lucide-react";
import { ProfileShowcase } from "./profile-showcase";

interface ProfileBuilderProps {
  onComplete: (profileData: any) => void;
  initialData?: any;
}

type ProfileType = 'creator' | 'studio' | 'gamer';
type BuilderStep = 'type-selection' | 'basic-info' | 'customization' | 'preview';

export function EnhancedProfileBuilder({ onComplete, initialData }: ProfileBuilderProps) {
  const [currentStep, setCurrentStep] = useState<BuilderStep>('type-selection');
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    username: initialData?.username || '',
    bio: initialData?.bio || '',
    avatar: initialData?.avatar || '',
    banner: initialData?.banner || '',
    profileType: initialData?.profileType || '',
    website: initialData?.website || '',
    location: initialData?.location || '',
    privacySettings: {
      showScore: true,
      showRank: true,
      showEarnings: false,
      showTopContent: true,
    }
  });

  const profileTypes = [
    {
      id: 'creator' as ProfileType,
      title: 'Gaming Creator',
      description: 'Content creators, streamers, and influencers',
      icon: Camera,
      features: ['Content Analytics', 'Brand Partnerships', 'Audience Insights', 'Revenue Tracking'],
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'studio' as ProfileType,
      title: 'Gaming Studio',
      description: 'Game developers, publishers, and studios',
      icon: Building2,
      features: ['Campaign Management', 'Creator Network', 'Analytics Dashboard', 'Brand Tools'],
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'gamer' as ProfileType,
      title: 'Pro Gamer',
      description: 'Professional gamers and esports athletes',
      icon: Gamepad2,
      features: ['Performance Tracking', 'Team Management', 'Tournament History', 'Sponsor Connect'],
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    }
  ];

  const sampleProfileData = {
    name: formData.name || 'Sam Huber',
    username: formData.username || 'samhuber',
    bio: formData.bio || 'Web3 Gaming Creator • Content Creator • Digital Avatar Designer • From the intersection of technology and creativity',
    avatar: formData.avatar || '/api/placeholder/100/100',
    banner: formData.banner || '',
    veriScore: 99,
    xpPoints: 2500,
    followers: 8700,
    following: 1250,
    rank: 2,
    totalUsers: 50000,
    isVerified: true,
    joinDate: 'Jan 2024',
    socialConnections: {
      twitter: { followers: 12500, verified: true },
      instagram: { followers: 8900, verified: false },
      youtube: { subscribers: 15600, verified: true },
      twitch: { followers: 3200, verified: false }
    },
    topContent: [
      {
        id: '1',
        platform: 'twitter' as const,
        title: 'Just launched my new course on content creation of "The Marketing Magic of Community" - From solo creator to community builder.',
        views: 15600,
        likes: 847,
        shares: 203,
        revenue: 125,
        thumbnail: '/api/placeholder/400/200',
        date: '4 days ago',
        engagement: 8.2
      },
      {
        id: '2',
        platform: 'instagram' as const,
        title: 'Behind the scenes of my content creation process. From solo creator to community builders.',
        views: 12400,
        likes: 1240,
        shares: 156,
        revenue: 89,
        thumbnail: '/api/placeholder/400/200',
        date: '1 day ago',
        engagement: 12.1
      },
      {
        id: '3',
        platform: 'youtube' as const,
        title: 'How to grow on social media in 2025: The complete guide',
        views: 8900,
        likes: 567,
        shares: 89,
        revenue: 234,
        thumbnail: '/api/placeholder/400/200',
        date: '1 week ago',
        engagement: 7.8
      }
    ],
    privacySettings: formData.privacySettings
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'type-selection':
        if (selectedType) {
          setFormData(prev => ({ ...prev, profileType: selectedType }));
          setCurrentStep('basic-info');
        }
        break;
      case 'basic-info':
        setCurrentStep('customization');
        break;
      case 'customization':
        setCurrentStep('preview');
        break;
      case 'preview':
        onComplete({ ...formData, profileType: selectedType });
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'basic-info':
        setCurrentStep('type-selection');
        break;
      case 'customization':
        setCurrentStep('basic-info');
        break;
      case 'preview':
        setCurrentStep('customization');
        break;
    }
  };

  const renderTypeSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Choose Your Profile Type</h2>
        <p className="text-white/70">Select the profile type that best describes you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profileTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`glass-subtle p-6 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? `${type.borderColor} border-2 ${type.bgColor}` 
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${type.gradient} p-0.5`}>
                    <div className="w-full h-full bg-black/80 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{type.description}</p>
                </div>

                <div className="space-y-2">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center justify-center"
                  >
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      Selected
                    </Badge>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderBasicInfo = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Profile Information</h2>
        <p className="text-white/70">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-subtle p-6 border-white/10">
          <h3 className="text-white font-semibold mb-4">Basic Details</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white/80">Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="glass-effect border-white/20 bg-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80">Username</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="@username"
                className="glass-effect border-white/20 bg-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80">Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://your-website.com"
                className="glass-effect border-white/20 bg-white/10 text-white mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-subtle p-6 border-white/10">
          <h3 className="text-white font-semibold mb-4">Profile Picture & Banner</h3>
          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="bg-emerald-500 text-white text-xl">
                  {formData.name.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="glass-subtle border-white/20 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Avatar
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-full h-24 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg mb-3" />
              <Button variant="outline" size="sm" className="glass-subtle border-white/20 text-white">
                <Camera className="w-4 h-4 mr-2" />
                Upload Banner
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-subtle p-6 border-white/10">
        <h3 className="text-white font-semibold mb-4">Bio</h3>
        <Textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell the world about yourself..."
          rows={4}
          className="glass-effect border-white/20 bg-white/10 text-white resize-none"
        />
        <p className="text-white/50 text-sm mt-2">{formData.bio.length}/280 characters</p>
      </Card>
    </motion.div>
  );

  const renderCustomization = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Privacy & Display Settings</h2>
        <p className="text-white/70">Choose what information to display on your profile</p>
      </div>

      <Card className="glass-subtle p-6 border-white/10">
        <h3 className="text-white font-semibold mb-6">Profile Visibility</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass-subtle rounded-lg">
              <div>
                <div className="text-white font-medium">Show VeriScore</div>
                <div className="text-white/60 text-sm">Display your reputation score</div>
              </div>
              <Switch
                checked={formData.privacySettings.showScore}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, showScore: checked }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 glass-subtle rounded-lg">
              <div>
                <div className="text-white font-medium">Show Leaderboard Rank</div>
                <div className="text-white/60 text-sm">Display your position in rankings</div>
              </div>
              <Switch
                checked={formData.privacySettings.showRank}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, showRank: checked }
                }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass-subtle rounded-lg">
              <div>
                <div className="text-white font-medium">Show Earnings</div>
                <div className="text-white/60 text-sm">Display revenue from content</div>
              </div>
              <Switch
                checked={formData.privacySettings.showEarnings}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, showEarnings: checked }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 glass-subtle rounded-lg">
              <div>
                <div className="text-white font-medium">Show Top Content</div>
                <div className="text-white/60 text-sm">Display your best performing posts</div>
              </div>
              <Switch
                checked={formData.privacySettings.showTopContent}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  privacySettings: { ...prev.privacySettings, showTopContent: checked }
                }))}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const renderPreview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Preview Your Profile</h2>
        <p className="text-white/70">This is how your profile will appear to others</p>
      </div>

      <ProfileShowcase 
        profileData={sampleProfileData}
        onEdit={() => setCurrentStep('customization')}
        isPreview={true}
      />
    </motion.div>
  );

  return (
    <div className="w-full bg-transparent p-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['type-selection', 'basic-info', 'customization', 'preview'].map((step, index) => {
              const isActive = currentStep === step;
              const isCompleted = ['type-selection', 'basic-info', 'customization', 'preview'].indexOf(currentStep) > index;
              
              return (
                <div key={step} className="contents">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive ? 'border-emerald-500 bg-emerald-500 text-white' :
                    isCompleted ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' :
                    'border-white/20 text-white/40'
                  }`}>
                    {isCompleted ? (
                      <Trophy className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'type-selection' && renderTypeSelection()}
            {currentStep === 'basic-info' && renderBasicInfo()}
            {currentStep === 'customization' && renderCustomization()}
            {currentStep === 'preview' && renderPreview()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="glass-subtle border-white/20 text-white"
            disabled={currentStep === 'type-selection'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className="veri-gradient"
            disabled={currentStep === 'type-selection' && !selectedType}
          >
            {currentStep === 'preview' ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Complete Profile
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
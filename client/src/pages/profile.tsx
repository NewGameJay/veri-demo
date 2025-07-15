import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { EnhancedProfileBuilder } from "@/components/profile/enhanced-profile-builder";
import { ProfileShowcase } from "@/components/profile/profile-showcase";
import { useAuth } from "@/contexts/auth-context";
import { Edit, Share2, Settings, Eye } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuth();
  // Start with builder if user hasn't completed profile setup
  const hasCompletedProfile = user?.profileType && user?.bio;
  const [mode, setMode] = useState<'showcase' | 'builder'>(hasCompletedProfile ? 'showcase' : 'builder');
  
  // Fetch user profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}`],
    enabled: !!user?.id,
  });

  // Sample data for demonstration - in real app this would come from the API
  const sampleProfileData = {
    name: user?.username || 'Creator',
    username: user?.email?.split('@')[0] || 'creator',
    bio: 'Web3 Gaming Creator • Content Creator • Digital Avatar Designer • From the intersection of technology and creativity',
    avatar: '/api/placeholder/100/100',
    banner: '',
    veriScore: user?.veriScore || 99,
    xpPoints: user?.xpPoints || 2500,
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
    privacySettings: {
      showScore: true,
      showRank: true,
      showEarnings: false,
      showTopContent: true,
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/70">Build and manage your creator profile</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={() => setMode('showcase')}
            variant={mode === 'showcase' ? 'default' : 'outline'}
            className={mode === 'showcase' ? 'veri-gradient' : 'glass-subtle border-white/20 text-white'}
          >
            <Eye className="w-4 h-4 mr-2" />
            Showcase
          </Button>
          <Button
            onClick={() => setMode('builder')}
            variant={mode === 'builder' ? 'default' : 'outline'}
            className={mode === 'builder' ? 'veri-gradient' : 'glass-subtle border-white/20 text-white'}
          >
            <Settings className="w-4 h-4 mr-2" />
            Builder
          </Button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {mode === 'showcase' && (
            <motion.div
              key="showcase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileShowcase 
                profileData={sampleProfileData}
                onEdit={() => setMode('builder')}
                isPreview={false}
              />
            </motion.div>
          )}

          {mode === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EnhancedProfileBuilder 
                onComplete={(data) => {
                  console.log('Profile completed:', data);
                  setMode('showcase');
                }}
                initialData={sampleProfileData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ProfilePage;
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
  const [mode, setMode] = useState<'view' | 'edit' | 'builder'>('view');
  
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

  const handleProfileComplete = (data: any) => {
    console.log('Profile completed:', data);
    setMode('view');
    // Here you would save the profile data to the backend
  };

  const handleEditProfile = () => {
    setMode('builder');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <AnimatePresence mode="wait">
        {mode === 'builder' && (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnhancedProfileBuilder 
              onComplete={handleProfileComplete}
              initialData={sampleProfileData}
            />
          </motion.div>
        )}

        {mode === 'view' && (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            {/* Header Actions */}
            <div className="max-w-6xl mx-auto mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                  <p className="text-white/70">Manage your creator profile and showcase your achievements</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => setMode('view')} 
                    variant="outline" 
                    className="glass-subtle border-white/20 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    onClick={handleEditProfile}
                    className="veri-gradient"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="glass-subtle border-white/20 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            <ProfileShowcase 
              profileData={sampleProfileData}
              onEdit={handleEditProfile}
              isPreview={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfilePage;
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot } from 'lucide-react';
import { Star } from 'lucide-react';
import { Users } from 'lucide-react';
import { Lock } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Youtube } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";
import { EnhancedProfileBuilder } from "./enhanced-profile-builder";

interface ProfileBuilderOnboardingProps {
  onComplete: () => void;
  onStartProfileBuilder: () => void;
}

export function ProfileBuilderOnboarding({ onComplete, onStartProfileBuilder }: ProfileBuilderOnboardingProps) {
  const { user } = useAuth();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [showEnhancedBuilder, setShowEnhancedBuilder] = useState(false);
  
  const socialPlatforms = [
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black',
      textColor: 'text-white',
      points: 500,
      connected: connectedPlatforms.includes('twitter')
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-500',
      textColor: 'text-white',
      points: 500,
      connected: connectedPlatforms.includes('youtube')
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-white',
      points: 500,
      connected: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600',
      textColor: 'text-white',
      points: 300,
      connected: false
    }
  ];

  const handleSocialConnect = (platformId: string) => {
    triggerHaptic("success");
    setConnectedPlatforms(prev => [...prev, platformId]);
  };

  const handleBuildProfile = () => {
    triggerHaptic("light");
    setShowEnhancedBuilder(true);
  };

  const handleFeatureClick = (feature: string) => {
    triggerHaptic("warning");
    // Show "Complete profile to unlock" message
  };

  const profileProgress = Math.round((connectedPlatforms.length / 4) * 100);
  const hasMinimumConnection = connectedPlatforms.length >= 1;

  // Show enhanced profile builder when requested
  if (showEnhancedBuilder) {
    return (
      <EnhancedProfileBuilder
        onComplete={onComplete}
        onClose={() => setShowEnhancedBuilder(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Hi {user?.firstName || 'Creator'} 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome to Veri! Let's get you set up with your creator profile and social connections.
            <br />
            Connect your platforms and start earning points right away.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Social Connections & Profile Builder */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Social Connections */}
            <Card className="glass-medium border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Connect Your Social Platforms
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start by connecting at least one platform to unlock your VeriScore and begin earning points.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${platform.textColor}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{platform.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            +{platform.points} points
                          </div>
                        </div>
                      </div>
                      {platform.connected ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleSocialConnect(platform.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          size="sm"
                          haptic="light"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Build Profile CTA */}
            <Card className="glass-medium border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Build Your Veri Profile</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Create your professional creator profile with AI-powered optimization, showcase your best content, and unlock premium features.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI-powered generation
                      </Badge>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Cross-platform showcase
                      </Badge>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        <Users className="w-3 h-3 mr-1" />
                        Professional presence
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleBuildProfile}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium"
                  size="lg"
                  haptic="light"
                  disabled={!hasMinimumConnection}
                >
                  {hasMinimumConnection ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Build Your Veri Profile
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Connect a platform to unlock
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* VeriScore Card & Feature Previews */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* VeriScore Card */}
            <Card className="glass-medium border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">VeriScore</h3>
                <div className="text-4xl font-bold text-gray-400 dark:text-gray-500 mb-2">--</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Connect platforms to calculate your VeriScore
                </p>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">VeriPoints</div>
                  <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">0 XP</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Start earning by connecting platforms
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Previews */}
            <div className="space-y-4">
              {/* AI Agent Preview */}
              <Card className="glass-medium border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                <CardContent className="p-4 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-500" />
                      <h3 className="font-bold text-gray-900 dark:text-white">AI Agent</h3>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    AI-powered content optimization and growth analytics
                  </p>
                  <Button 
                    onClick={() => handleFeatureClick('ai-agent')}
                    variant="outline" 
                    size="sm" 
                    className="w-full opacity-60 cursor-not-allowed"
                    disabled
                  >
                    Complete profile to unlock
                  </Button>
                </CardContent>
              </Card>

              {/* Engage & Earn Preview */}
              <Card className="glass-medium border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
                <CardContent className="p-4 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-bold text-gray-900 dark:text-white">Engage & Earn</h3>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Complete tasks and earn VeriPoints
                  </p>
                  <Button 
                    onClick={() => handleFeatureClick('engage-earn')}
                    variant="outline" 
                    size="sm" 
                    className="w-full opacity-60 cursor-not-allowed"
                    disabled
                  >
                    Complete profile to unlock
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Progress Indicator - Moved Below Main Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-md mx-auto mt-8 mb-6"
        >
          <div className="glass-secondary rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Profile Setup Progress</span>
              <span className="text-xs font-semibold text-emerald-600">{profileProgress}%</span>
            </div>
            <Progress value={profileProgress} className="h-1.5" />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {connectedPlatforms.length} of 4 platforms connected
            </p>
          </div>
        </motion.div>

        {/* Skip for now option */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-4"
        >
          <Button 
            onClick={onComplete}
            variant="ghost" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            haptic="light"
          >
            Skip for now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
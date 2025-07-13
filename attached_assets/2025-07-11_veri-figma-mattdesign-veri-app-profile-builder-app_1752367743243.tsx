import React, { useState } from 'react';
import Group6 from "./imports/Group.tsx";
import Asset11 from "./imports/Asset11.tsx";
import Frame3003632 from "./imports/Frame3003632.tsx";
import Frame709 from "./imports/Frame709-29-1522.tsx";
import Group1171275252 from "./imports/Group1171275252.tsx";
import veriLogo from 'figma:asset/ba1b8475279163348b9605299d5754a88f8b3651.png';
import veriScoreImage from 'figma:asset/d147f6fccea1085e238f9bcfe1e3058acf8ddbac.png';
import { LiquidGlassButton } from './components/LiquidGlassButton';
import svgPaths from "./imports/svg-xb4y42j524";

type ProfileBuilderStep = 
  | 'hidden' 
  | 'ai-profile-builder'
  | 'profile-showcase' 
  | 'profile-editor'
  | 'social-connections'
  | 'content-upload'
  | 'earn-points'
  | 'ai-agent'
  | 'veri-plus'
  | 'discovery';

type UserType = 'none' | 'studio' | 'creator';

interface ProfileData {
  name: string;
  bio: string;
  website: string;
  userType: UserType;
  hasProfile: boolean;
  avatar?: string;
  socialConnections: {
    twitter?: { followers: number; connected: boolean };
    instagram?: { followers: number; connected: boolean };
    youtube?: { subscribers: number; connected: boolean };
    linkedin?: { connections: number; connected: boolean };
  };
  topContent: Array<{
    platform: string;
    title: string;
    engagement: number;
    date: string;
  }>;
  plugins: {
    veriCard: boolean;
    socialChannels: boolean;
    pinnedContent: boolean;
    analytics: boolean;
  };
}

function App() {
  const [profileBuilderStep, setProfileBuilderStep] = useState<ProfileBuilderStep>('hidden');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Sam Huber',
    bio: '',
    website: '',
    userType: 'creator',
    hasProfile: false,
    socialConnections: {
      twitter: { followers: 8700, connected: true },
      youtube: { subscribers: 45200, connected: true },
      instagram: { followers: 12500, connected: false },
      linkedin: { connections: 2500, connected: false }
    },
    topContent: [
      { platform: 'twitter', title: 'Building the future of creator economy', engagement: 1250, date: '2 days ago' },
      { platform: 'youtube', title: 'How to grow on social media in 2025', engagement: 5600, date: '1 week ago' },
      { platform: 'instagram', title: 'Behind the scenes content creation', engagement: 890, date: '3 days ago' }
    ],
    plugins: {
      veriCard: true,
      socialChannels: true,
      pinnedContent: true,
      analytics: false
    }
  });

  const [aiGenerating, setAiGenerating] = useState(false);
  const [streakDays, setStreakDays] = useState(7);

  const handleBuildProfile = () => {
    setProfileBuilderStep('ai-profile-builder');
  };

  const handleCloseProfileBuilder = () => {
    setProfileBuilderStep('hidden');
  };

  const generateAIProfile = async () => {
    setAiGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const aiGeneratedProfile = {
      ...profileData,
      bio: "Content creator passionate about technology, social media growth, and the creator economy. Helping others build authentic online presence through strategic content creation and community engagement.",
      website: "https://samhuber.creator",
      userType: 'creator' as UserType,
      hasProfile: true
    };
    setProfileData(aiGeneratedProfile);
    setAiGenerating(false);
    setProfileBuilderStep('profile-showcase');
  };

  const handleAIAgentClick = () => {
    if (!profileData.hasProfile) {
      // If profile not built, show build profile CTA
      handleBuildProfile();
      return;
    }
    setProfileBuilderStep('ai-agent');
  };

  const handleEngageTasksClick = () => {
    setProfileBuilderStep('earn-points');
  };

  const handleNavigationClick = (section: string) => {
    if (!profileData.hasProfile) {
      // If profile not built, show build profile CTA
      handleBuildProfile();
      return;
    }

    // Handle navigation based on section
    switch (section) {
      case 'profile':
        setProfileBuilderStep('ai-profile-builder');
        break;
      case 'discovery':
        setProfileBuilderStep('discovery');
        break;
      case 'engage':
        setProfileBuilderStep('earn-points');
        break;
      case 'agent':
        setProfileBuilderStep('ai-agent');
        break;
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="w-full h-full">
          <Frame709 />
        </div>
      </div>
      
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profileBuilt={profileData.hasProfile}
        onNavigate={handleNavigationClick}
        onBuildProfile={handleBuildProfile}
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <header className="flex items-center justify-between mb-12 rounded-2xl px-6 py-4 shadow-lg" style={{ backgroundColor: '#000000' }}>
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              
              <div className="h-8 w-26 text-white">
                <Asset11 />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full"></div>
              <div className="text-sm">
                <div className="font-semibold text-white">@samhuber.matera.id</div>
                <div className="text-gray-300">
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-semibold">2500</span>
                  <span className="text-gray-300"> points</span>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fill="currentColor" />
              </svg>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-5xl font-bold mb-4 text-white">Hi Sam Huber 👋</h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Connect social accounts and keep creating content as usual.<br />
                  Boost your score and collect points once a week.
                </p>
              </div>
              
              <div className="space-y-3 max-w-sm">
                <SocialButton text="Connected" points="500+ Points" connected={true} platform="twitter" />
                <SocialButton text="Connected" points="500+ Points" connected={true} platform="youtube" />
                <SocialButton text="Connect Instagram" points="+500 Pts" connected={false} platform="instagram" />
                
                {/* Build Your Veri Profile Button */}
                <button 
                  onClick={handleBuildProfile}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold text-white hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <VeriIcon />
                  Build Your Veri Profile
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <VeriScoreCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <AIAgentCard onExplore={handleAIAgentClick} profileBuilt={profileData.hasProfile} />
            <BuildVeriProfileCard onBuildProfile={handleBuildProfile} />
            <EngageTasksButtonCard onEngageTasks={handleEngageTasksClick} streakDays={streakDays} />
          </div>

          <div className="mb-8">
            <GamifiedLeaderboardCard />
          </div>

          <div className="mb-16">
            <ComprehensiveAnalyticsCard />
          </div>

          <FAQSection />

          <div className="mt-16">
            <FooterSection />
          </div>
        </div>
      </div>

      {profileBuilderStep !== 'hidden' && (
        <ProfileBuilderOverlay 
          step={profileBuilderStep}
          profileData={profileData}
          onStepChange={setProfileBuilderStep}
          onProfileUpdate={setProfileData}
          onClose={handleCloseProfileBuilder}
          aiGenerating={aiGenerating}
          onGenerateAI={generateAIProfile}
        />
      )}
    </div>
  );
}

function NavigationSidebar({ isOpen, onClose, profileBuilt, onNavigate, onBuildProfile }: {
  isOpen: boolean;
  onClose: () => void;
  profileBuilt: boolean;
  onNavigate: (section: string) => void;
  onBuildProfile: () => void;
}) {
  const navigationItems = [
    {
      id: 'profile',
      label: 'My Veri Profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      description: 'Manage your creator profile'
    },
    {
      id: 'discovery',
      label: 'Discovery',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      description: 'Find creators and opportunities'
    },
    {
      id: 'engage',
      label: 'Engage to Earn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      description: 'Complete tasks and earn points'
    },
    {
      id: 'agent',
      label: 'My Agent',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
        </svg>
      ),
      description: 'AI-powered creator assistant'
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 text-white">
                <Group6 />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Navigation</h2>
              <p className="text-sm text-gray-600">Quick access to tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Profile Status */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${profileBuilt ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            Profile Status: {profileBuilt ? 'Active' : 'Setup Required'}
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              disabled={!profileBuilt}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 group ${
                profileBuilt
                  ? 'hover:bg-gray-50 hover:scale-[1.02] cursor-pointer'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  profileBuilt
                    ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{item.label}</h3>
                    {!profileBuilt && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Build Profile CTA */}
      {!profileBuilt && (
        <div className="p-6 border-t border-gray-200/50">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1.28 0-2.47-.41-3.44-1.1"/>
                  <path d="M3 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-800">Unlock All Tools</h4>
                <p className="text-sm text-emerald-600">Build your profile to access features</p>
              </div>
            </div>
            <LiquidGlassButton
              variant="emerald"
              onClick={onBuildProfile}
              className="w-full h-10 text-sm"
            >
              Build Your Profile
            </LiquidGlassButton>
          </div>
        </div>
      )}

      {/* Profile Built Success Message */}
      {profileBuilt && (
        <div className="p-6 border-t border-gray-200/50">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Profile Active</h4>
                <p className="text-sm text-green-600">All tools unlocked!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DiscoveryInterface({ onBack, onClose }: {
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Discovery</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Discover Creators & Opportunities</h3>
          <p className="text-lg text-gray-600 mb-8">
            Find like-minded creators, trending content, and collaboration opportunities
          </p>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">Discovery Tools</h4>
            <p className="text-gray-600">Explore trending creators, find collaboration opportunities, and discover new audiences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VeriScoreCard() {
  return (
    <div className="bg-white/95 rounded-3xl p-8 border border-white/30 shadow-lg backdrop-blur-sm w-full">
      {/* Gradient Logo Area */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
          <div className="w-16 h-16 text-white">
            <Group6 />
          </div>
        </div>
      </div>

      {/* VeriScore Section */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-3">VeriScore</h3>
        <div className="text-6xl font-bold text-gray-400 mb-4">99</div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Calculated Weekly Based on<br />
          <span className="underline font-medium">VeriScore Analytics™</span>
        </p>
      </div>

      {/* VeriPoints Section */}
      <div className="text-center mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-2">VeriPoints</h4>
        <div className="text-4xl font-bold text-gray-400">2500XP</div>
      </div>

      {/* User Name */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-600">Sam Huber</p>
      </div>
    </div>
  );
}

function SocialButton({ text, points, connected, platform }: { text: string; points: string; connected: boolean; platform: string }) {
  const getIcon = () => {
    if (platform === 'twitter') {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
      );
    }
    
    if (platform === 'youtube') {
      return (
        <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
      );
    }
    
    if (platform === 'instagram') {
      return (
        <div className="w-6 h-6 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
          </svg>
        </div>
      );
    }
    
    return <div className="w-6 h-6 bg-gray-400 rounded-lg"></div>;
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
      connected 
        ? 'bg-white/95 backdrop-blur-sm shadow-sm border border-white/50' 
        : 'bg-white/95 backdrop-blur-sm shadow-sm border border-white/50 hover:shadow-md hover:scale-[1.02]'
    }`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="font-semibold text-gray-800">{text}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${connected ? 'text-emerald-600' : 'text-emerald-600'}`}>{points}</span>
        {connected && (
          <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
        )}
        {!connected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        )}
      </div>
    </div>
  );
}

function AIAgentCard({ onExplore, profileBuilt }: { onExplore: () => void; profileBuilt: boolean }) {
  const agentTools = [
    {
      name: 'AI Clipping Tool',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1.28 0-2.47-.41-3.44-1.1"/>
          <path d="M3 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10"/>
        </svg>
      )
    },
    {
      name: 'Scheduling Tool',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    {
      name: 'Content Gen Tool',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      name: 'AI Connector Engine',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      )
    },
    {
      name: 'Analytics Dashboard',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">AI Agent</h3>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
          </svg>
        </div>
      </div>
      
      <p className="text-white/90 mb-6">
        Your personal AI assistant with tools for content optimization and growth analytics.
      </p>
      
      {/* AI Tools List */}
      <div className="space-y-3 mb-6">
        {agentTools.map((tool, index) => (
          <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {tool.icon}
              <span className="text-sm font-medium text-white/90">{tool.name}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onExplore}
        className="w-full h-10 bg-white/15 rounded-xl font-semibold text-white/90 cursor-default"
        disabled={!profileBuilt}
      >
        Complete Profile to Unlock
      </button>
    </div>
  );
}

function BuildVeriProfileCard({ onBuildProfile }: { onBuildProfile: () => void }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Build Your Veri Profile</h3>
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <VeriIcon />
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">
        Create your professional Veri profile and showcase your content across platforms.
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          AI-powered profile generation
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          Cross-platform showcase
        </div>
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
          Professional presence
        </div>
      </div>
      
      <button 
        onClick={onBuildProfile}
        className="w-full mt-6 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-colors text-white shadow-lg shadow-emerald-500/30"
      >
        Build Profile
      </button>
    </div>
  );
}

function EngageTasksButtonCard({ onEngageTasks, streakDays }: { onEngageTasks: () => void; streakDays: number }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Engage & Earn</h3>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">
        Complete tasks, earn points, and boost your VeriScore ranking.
      </p>

      {/* Streak Indicator */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6 border border-orange-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span className="font-semibold text-orange-800">{streakDays} Day Streak</span>
          </div>
          <span className="text-sm text-orange-600 font-medium">Keep it going!</span>
        </div>
        
        {/* Streak Dots */}
        <div className="flex gap-1 mb-2">
          {Array.from({ length: 7 }, (_, i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < streakDays ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-orange-700">Daily engagement streak</span>
          <span className="text-orange-600">2x points multiplier active</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Completed Tasks</span>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">2/6</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full" style={{ width: '33%' }}></div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">+1,825</span>
          <span> points available</span>
        </div>
      </div>
      
      <button 
        onClick={onEngageTasks}
        className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors text-white shadow-lg shadow-blue-500/30"
      >
        View Tasks
      </button>
    </div>
  );
}

// Gaming Category Icon Components
function GameCategoryIcon({ category, size = "w-4 h-4" }: { category: string; size?: string }) {
  const iconColor = "#590AA0";
  
  switch (category) {
    case 'FPS':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p17395700} fill={iconColor} />
          </svg>
        </div>
      );
    case 'Fighting':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p1ed1a600} fill={iconColor} />
          </svg>
        </div>
      );
    case 'Adventure':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p174f0080} fill={iconColor} />
          </svg>
        </div>
      );
    case 'Battle Royale':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p10501b80} fill={iconColor} />
          </svg>
        </div>
      );
    case 'RPG':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p163e64f0} fill={iconColor} />
          </svg>
        </div>
      );
    case 'Racing':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p22d71900} fill={iconColor} />
          </svg>
        </div>
      );
    case 'Mini Games':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p31600170} fill={iconColor} />
          </svg>
        </div>
      );
    case 'Strategy':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p2ac2d880} fill={iconColor} />
          </svg>
        </div>
      );
    case 'Survival':
      return (
        <div className={size}>
          <svg viewBox="0 0 55 55" fill="none">
            <path d={svgPaths.p18970880} fill={iconColor} />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

function GameCategoryFilter({ selectedFilter, onFilterChange }: {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  const categories = ['All', 'FPS', 'Fighting', 'Adventure', 'Battle Royale', 'RPG', 'Racing', 'Mini Games', 'Strategy', 'Survival'];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 font-medium mr-2">Filter:</span>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onFilterChange(category)}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105
            ${selectedFilter === category 
              ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }
          `}
        >
          {category !== 'All' && (
            <GameCategoryIcon category={category} size="w-3 h-3" />
          )}
          {category === 'All' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          <span>{category}</span>
        </button>
      ))}
    </div>
  );
}

function GamifiedLeaderboardCard() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const allLeaderboardData = [
    { name: "Alex Chen", rank: 1, score: 15420, badges: ["Veri+ Creator", "Top 1%", "FPS"], tier: "Diamond", change: "+15" },
    { name: "Sam Huber", rank: 2, score: 12500, badges: ["Top 10%", "Lifestyle"], tier: "Platinum", change: "+8" },
    { name: "Maya Rodriguez", rank: 3, score: 11800, badges: ["Top 1%", "Battle Royale"], tier: "Platinum", change: "-1" },
    { name: "Jordan Kim", rank: 4, score: 10950, badges: ["Rising Star", "RPG"], tier: "Gold", change: "+3" },
    { name: "Taylor Swift", rank: 5, score: 9800, badges: ["Veri+ Creator", "Lifestyle"], tier: "Gold", change: "+2" },
    { name: "Emma Davis", rank: 6, score: 9200, badges: ["Top 10%", "Racing"], tier: "Gold", change: "+12" },
    { name: "Ryan Johnson", rank: 7, score: 8750, badges: ["Gaming", "Strategy"], tier: "Silver", change: "-2" },
    { name: "Sophia Lee", rank: 8, score: 8400, badges: ["Rising Star", "Mini Games"], tier: "Silver", change: "+5" },
    { name: "Jake Morrison", rank: 9, score: 8100, badges: ["Top 10%", "Adventure"], tier: "Silver", change: "+7" },
    { name: "Lila Chen", rank: 10, score: 7850, badges: ["Gaming", "Fighting"], tier: "Bronze", change: "+4" },
    { name: "Marcus Reeves", rank: 11, score: 7600, badges: ["Rising Star", "Survival"], tier: "Bronze", change: "+2" },
    { name: "Nina Patel", rank: 12, score: 7350, badges: ["Top 10%", "FPS"], tier: "Bronze", change: "-1" },
  ];

  const filteredLeaderboardData = selectedFilter === 'All' 
    ? allLeaderboardData 
    : allLeaderboardData.filter(user => 
        user.badges.some(badge => badge === selectedFilter)
      );

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Diamond':
        return (
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
            </svg>
          </div>
        );
      case 'Platinum':
        return (
          <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
            </svg>
          </div>
        );
      case 'Gold':
        return (
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
            </svg>
          </div>
        );
      case 'Silver':
        return (
          <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
            </svg>
          </div>
        );
      case 'Bronze':
        return (
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
            </svg>
          </div>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    const badgeStyles = {
      1: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50',
      2: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/50',
      3: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50',
    };

    return rank <= 3 ? badgeStyles[rank] : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white';
  };

  const getBadgeStyle = (badge: string) => {
    // Gaming categories with icons
    const gamingCategories = ['FPS', 'Fighting', 'Adventure', 'Battle Royale', 'RPG', 'Racing', 'Mini Games', 'Strategy', 'Survival'];
    
    if (gamingCategories.includes(badge)) {
      return 'bg-purple-100 text-purple-700 border border-purple-200';
    }
    
    switch (badge) {
      case 'Veri+ Creator':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-orange-200';
      case 'Top 1%':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'Top 10%':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Gaming':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Lifestyle':
        return 'bg-pink-100 text-pink-700 border border-pink-200';
      case 'Rising Star':
        return 'bg-green-100 text-green-700 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <div className="w-6 h-6 text-white">
              <Group6 />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Global Leaderboard</h3>
            <p className="text-gray-600">Compete with creators worldwide</p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <GameCategoryFilter 
            selectedFilter={selectedFilter} 
            onFilterChange={setSelectedFilter} 
          />
          <div className="text-right">
            <div className="text-sm text-gray-600">Live Rankings</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-600">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredLeaderboardData.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GameCategoryIcon category={selectedFilter} size="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No {selectedFilter} creators found</h4>
            <p className="text-gray-500">Try selecting a different category or check back later.</p>
          </div>
        ) : (
          filteredLeaderboardData.map((user, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                user.rank === 2 ? 'bg-gradient-to-r from-blue-50 to-indigo-50/80 border-blue-200 ring-2 ring-blue-300/50' : 
                user.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50/80 border-yellow-200' :
                user.rank === 3 ? 'bg-gradient-to-r from-orange-50 to-red-50/80 border-orange-200' :
                'bg-gradient-to-r from-gray-50/80 to-purple-50/40 border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadge(user.rank)}`}>
                  {user.rank}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{user.name[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{user.name}</span>
                      {getTierIcon(user.tier)}
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {user.badges.map((badge, badgeIndex) => (
                        <span key={badgeIndex} className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${getBadgeStyle(badge)}`}>
                          {['FPS', 'Fighting', 'Adventure', 'Battle Royale', 'RPG', 'Racing', 'Mini Games', 'Strategy', 'Survival'].includes(badge) && (
                            <GameCategoryIcon category={badge} size="w-3 h-3" />
                          )}
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {user.score.toLocaleString()}
                </div>
                <div className={`text-sm font-semibold flex items-center gap-1 ${
                  user.change.startsWith('+') ? 'text-green-600' : 'text-red-500'
                }`}>
                  {user.change.startsWith('+') ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18,15 12,9 6,15"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  )}
                  {user.change}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <LiquidGlassButton variant="primary" className="h-12 px-8">
            View Full Leaderboard
          </LiquidGlassButton>
        </div>
      </div>
    </div>
  );
}

function ComprehensiveAnalyticsCard() {
  const analyticsData = {
    overview: {
      totalFollowers: 66200,
      totalViews: 2450000,
      engagementRate: 8.7,
      monthlyGrowth: 15.3
    },
    platforms: [
      { name: 'YouTube', followers: 45200, growth: '+5.7%', engagement: 12.3, color: 'bg-red-500' },
      { name: 'Instagram', followers: 12500, growth: '+2.3%', engagement: 6.8, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
      { name: 'X (Twitter)', followers: 8700, growth: '+1.9%', engagement: 4.2, color: 'bg-blue-500' },
      { name: 'LinkedIn', followers: 2500, growth: '+12.1%', engagement: 3.1, color: 'bg-blue-600' }
    ],
    topContent: [
      { title: 'How to grow on social media in 2025', platform: 'YouTube', views: 125000, engagement: 15.2, date: '1 week ago' },
      { title: 'Building the future of creator economy', platform: 'Twitter', views: 45000, engagement: 8.7, date: '2 days ago' },
      { title: 'Behind the scenes content creation', platform: 'Instagram', views: 32000, engagement: 12.1, date: '3 days ago' },
      { title: 'AI tools every creator needs', platform: 'YouTube', views: 89000, engagement: 11.4, date: '5 days ago' }
    ]
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <path d="M3 3v18h18M7 16l4-4 4 4 6-6"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Creator Analytics</h3>
            <p className="text-gray-600">Comprehensive performance insights</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
            7 Days
          </button>
          <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
            30 Days
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
            90 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-700">Total Followers</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalFollowers.toLocaleString()}</div>
          <div className="text-sm text-green-600 font-semibold">+{analyticsData.overview.monthlyGrowth}% this month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-700">Total Views</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{(analyticsData.overview.totalViews / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-green-600 font-semibold">+23.4% this month</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-700">Engagement Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{analyticsData.overview.engagementRate}%</div>
          <div className="text-sm text-green-600 font-semibold">+1.2% this month</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" x2="18" y1="20" y2="10"/>
                <line x1="12" x2="12" y1="20" y2="4"/>
                <line x1="6" x2="6" y1="20" y2="14"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-700">VeriScore</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">99</div>
          <div className="text-sm text-green-600 font-semibold">+5 this week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-4">Platform Performance</h4>
          <div className="space-y-4">
            {analyticsData.platforms.map((platform, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{platform.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{platform.name}</div>
                    <div className="text-sm text-gray-600">
                      {platform.followers.toLocaleString()} followers • {platform.engagement}% engagement
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{platform.growth}</div>
                  <div className="text-sm text-gray-600">30d growth</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-4">Top Performing Content</h4>
          <div className="space-y-4">
            {analyticsData.topContent.map((content, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-gray-800 text-sm leading-tight">{content.title}</h5>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{content.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{content.views.toLocaleString()}</span> views • 
                    <span className="font-semibold text-emerald-600"> {content.engagement}%</span> engagement
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{content.platform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Data updated <span className="font-semibold">2 minutes ago</span>
          </div>
          <div className="flex gap-3">
            <LiquidGlassButton variant="secondary" className="h-10 px-6">
              Export Data
            </LiquidGlassButton>
            <LiquidGlassButton variant="emerald" className="h-10 px-6">
              Detailed Report
            </LiquidGlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is VeriScore and how is it calculated?",
      answer: "VeriScore is a comprehensive metric that evaluates your social media performance across platforms. It's calculated weekly based on engagement rates, follower growth, content quality, and authenticity metrics using our proprietary VeriScore Analytics™ algorithm."
    },
    {
      question: "How do I earn VeriPoints?",
      answer: "You can earn VeriPoints by connecting your social media accounts, completing engagement tasks, maintaining consistent content creation, and achieving performance milestones. Points are awarded automatically based on your verified activity."
    },
    {
      question: "What can I do with my VeriPoints?",
      answer: "VeriPoints can be used to unlock premium features, access exclusive creator tools, participate in special events, and exchange for rewards within the Veri ecosystem. Higher point totals also improve your VeriScore ranking."
    },
    {
      question: "How does the AI Agent work?",
      answer: "Your AI Agent analyzes your content performance across platforms, provides optimization recommendations, automates routine tasks, and helps you identify trending opportunities. It learns from your content style and audience preferences to give personalized insights."
    },
    {
      question: "Is my social media data secure?",
      answer: "Yes, we use enterprise-grade encryption and security measures to protect your data. We only access publicly available metrics and content that you explicitly authorize. Your login credentials are never stored, and you can revoke access at any time."
    },
    {
      question: "Can I use Veri for multiple social media accounts?",
      answer: "Absolutely! Veri supports integration with multiple accounts across various platforms including Twitter, Instagram, YouTube, LinkedIn, and more. You can manage and analyze all your accounts from a single dashboard."
    }
  ];

  return (
    <div className="mb-16">
      <div className="bg-black backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-sm">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
          <p className="text-lg text-gray-300">
            Get answers to common questions about Veri and how it works
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-white pr-8">{faq.question}</h3>
                <div className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterSection() {
  return (
    <div className="rounded-2xl px-8 py-6 shadow-lg" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="h-8 w-26 text-white">
              <Asset11 />
            </div>
            <p className="text-sm font-medium text-white/70 leading-6">
              Veri is DeFi for the Creator economy
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-200">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                  <path 
                    d="M19.6667 3.00124H4.3282C3.60819 2.99311 3.00878 3.57859 3 4.29861V19.7008C3.00845 20.4213 3.60778 21.0074 4.3282 20.9997H19.6667C20.3889 21.0088 20.9903 20.4227 21 19.7008V4.29756C20.9903 3.57601 20.3881 2.99061 19.6667 3.00011M18.3372 18.3371H15.67V14.1603C15.67 13.1642 15.6523 11.8821 14.2829 11.8821C12.8938 11.8821 12.6812 12.9672 12.6812 14.0877V18.3367H10.0142V9.74757H12.5745V10.9213H12.6104C13.1318 10.03 14.1047 9.49565 15.1367 9.53397C17.8398 9.53397 18.3383 11.312 18.3383 13.6252L18.3372 18.3371ZM7.00481 8.57346C6.15574 8.57346 5.45673 7.87486 5.45673 7.02579C5.45673 6.17671 6.15541 5.47803 7.00449 5.47803C7.85348 5.47803 8.55208 6.17655 8.55225 7.02546C8.55225 7.87438 7.85373 8.57338 7.00481 8.57346ZM8.33833 18.3371H5.66848V9.74757H8.33833V18.3371Z" 
                    stroke="white" 
                    strokeWidth="1.25" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              <div className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-200">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                  <path 
                    d="M10.9062 12.9375L5 19.5M10.9062 12.9375L15.4701 19.4573C15.4889 19.4841 15.5194 19.5 15.5521 19.5H18.8079C18.8888 19.5 18.9363 19.4089 18.8899 19.3427L12.875 10.75M10.9062 12.9375L5.11014 4.65735C5.06375 4.59107 5.11116 4.5 5.19207 4.5H8.44793C8.48057 4.5 8.51114 4.51592 8.52986 4.54265L12.875 10.75M12.875 10.75L18.5 4.5" 
                    stroke="white" 
                    strokeWidth="1.25" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Product</h4>
            <div className="space-y-3">
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">VeriScore Analytics</div>
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">AI Agent</div>
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">Creator Tools</div>
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">Leaderboard</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <div className="space-y-3">
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">About Us</div>
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">Careers</div>
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">Blog</div>
              <div className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors cursor-pointer">Support</div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-white/70">
              © 2025 Veri
            </div>
            <div className="flex gap-6 items-center">
              <div className="text-sm font-medium text-white/50 hover:text-white/70 transition-colors cursor-pointer">
                Terms of Use
              </div>
              <div className="text-sm font-medium text-white/50 hover:text-white/70 transition-colors cursor-pointer">
                Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileBuilderOverlay({ 
  step, 
  profileData, 
  onStepChange, 
  onProfileUpdate, 
  onClose,
  aiGenerating,
  onGenerateAI
}: {
  step: ProfileBuilderStep;
  profileData: ProfileData;
  onStepChange: (step: ProfileBuilderStep) => void;
  onProfileUpdate: (data: ProfileData) => void;
  onClose: () => void;
  aiGenerating: boolean;
  onGenerateAI: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {step === 'ai-profile-builder' && (
          <AIProfileBuilder 
            profileData={profileData}
            onStepChange={onStepChange}
            onClose={onClose}
            aiGenerating={aiGenerating}
            onGenerateAI={onGenerateAI}
          />
        )}
        {step === 'earn-points' && (
          <EngageToEarnInterface 
            onBack={() => onStepChange('ai-profile-builder')}
            onClose={onClose}
          />
        )}
        {step === 'ai-agent' && (
          <AIAgentInterface 
            profileData={profileData}
            onBack={() => onStepChange('ai-profile-builder')}
            onClose={onClose}
          />
        )}
        {step === 'veri-plus' && (
          <VeriPlusInterface 
            profileData={profileData}
            onBack={() => onStepChange('ai-profile-builder')}
            onClose={onClose}
          />
        )}
        {step === 'discovery' && (
          <DiscoveryInterface 
            onBack={() => onStepChange('ai-profile-builder')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

function AIProfileBuilder({ profileData, onStepChange, onClose, aiGenerating, onGenerateAI }: {
  profileData: ProfileData;
  onStepChange: (step: ProfileBuilderStep) => void;
  onClose: () => void;
  aiGenerating: boolean;
  onGenerateAI: () => void;
}) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: 'linear-gradient(-11.4956deg, rgba(0, 0, 0, 0.5) 8.7885%, rgba(37, 185, 138, 0.5) 56.075%, rgba(0, 99, 85, 0.5) 95.43%)'
        }}
      />
      
      <div className="relative z-10 flex items-center justify-between p-6 text-white">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <div className="flex items-center gap-4">
          <button className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-black/60 transition-colors">
            View Profile
          </button>
          <button className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-black/60 transition-colors">
            Update Banner & Avatar
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center text-white py-8">
        <div className="w-32 h-32 bg-gray-400 rounded-full mb-6 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h3 className="text-3xl font-bold mb-2">{profileData.name}</h3>
        <p className="text-white/70 text-lg max-w-md">
          {profileData.bio || "Edit bio and tell us about your world..."}
        </p>
      </div>

      <div className="relative z-10 px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <ProfileActionButton
            icon={<PersonIcon />}
            label="Account Info"
            onClick={() => onStepChange('profile-editor')}
          />
          <ProfileActionButton
            icon={<SocialIcon />}
            label="Social Connections"
            onClick={() => onStepChange('social-connections')}
          />
          <ProfileActionButton
            icon={<PlusIcon />}
            label="Upload Content"
            onClick={() => onStepChange('content-upload')}
          />
          
          <ProfileActionButton
            icon={<PointsIcon />}
            label="Earn Veri Points"
            onClick={() => onStepChange('earn-points')}
          />
          <ProfileActionButton
            icon={<VeriIcon />}
            label="Meet Your Veri Agent"
            onClick={() => onStepChange('ai-agent')}
          />
          <ProfileActionButton
            icon={<PremiumIcon />}
            label="Become a Veri+ Creator or Studio"
            onClick={() => onStepChange('veri-plus')}
            variant="premium"
          />
        </div>
      </div>

      <div className="relative z-10 px-8 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-3">AI Profile Generation</h4>
            <p className="text-white/80 mb-6">
              Let our AI analyze your connected social accounts to automatically generate an optimized profile, bio, and showcase your best content.
            </p>
            
            {aiGenerating ? (
              <div className="flex items-center justify-center gap-3 text-white">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing your social presence...</span>
              </div>
            ) : (
              <LiquidGlassButton 
                variant="emerald" 
                className="w-full h-12 text-white" 
                onClick={onGenerateAI}
              >
                Generate My Profile with AI ✨
              </LiquidGlassButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EngageToEarnInterface({ onBack, onClose }: {
  onBack: () => void;
  onClose: () => void;
}) {
  const tasks = [
    { title: "Follow Veri on X", points: 100, completed: true, icon: "twitter" },
    { title: "Join Veri Community on Telegram", points: 150, completed: true, icon: "telegram" },
    { title: "Invite a Friend", points: 500, completed: false, icon: "users" },
    { title: "Retweet Veri Announcement", points: 75, completed: false, icon: "retweet" },
    { title: "Create and Verify your Veri ID", points: 300, completed: false, icon: "id" },
    { title: "Share your first achievement", points: 200, completed: false, icon: "share" }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Engage to Earn Points</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Complete Basic Veri Tasks & Earn VeriPoints</h3>
            <p className="text-lg text-gray-600">
              Complete engagement tasks to boost your VeriScore and earn rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tasks.map((task, index) => (
              <div key={index} className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-105 ${
                task.completed 
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50/80 border-emerald-200' 
                  : 'bg-gradient-to-br from-gray-50/80 to-blue-50/40 border-gray-200 hover:border-blue-300'
              }`}>
                <div className="text-center">
                  <h4 className="font-bold mb-3 text-gray-800">{task.title}</h4>
                  <div className={`text-lg font-bold mb-4 ${task.completed ? 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
                    +{task.points}
                  </div>
                  <button className={`w-full h-10 rounded-lg font-semibold transition-colors ${
                    task.completed 
                      ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 cursor-default' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm'
                  }`}>
                    {task.completed ? 'Completed ✓' : 'Start Task'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Build Profile CTA Section */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-purple-200/50 shadow-lg">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Unlock Premium Tasks & Higher Rewards</h4>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Build your Veri profile to access exclusive tasks, earn bigger rewards, and discover all the opportunities waiting for you in the creator economy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    +5,000
                  </div>
                  <div className="text-sm text-gray-600">Additional Points Available</div>
                </div>
                
                <LiquidGlassButton
                  variant="purple"
                  onClick={onBack}
                  className="h-12 px-8 text-lg"
                >
                  Build Veri Profile To Unlock All Tasks
                </LiquidGlassButton>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Premium Creator Tasks
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Higher Point Rewards
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Exclusive Opportunities
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAgentInterface({ profileData, onBack, onClose }: {
  profileData: ProfileData;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">AI Agent Interface</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your AI Agent</h3>
          <p className="text-lg text-gray-600 mb-8">
            Your personalized AI assistant for {profileData.userType === 'studio' ? 'studio management' : 'creator growth'}
          </p>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">AI Agent Active</h4>
            <p className="text-gray-600">Your AI agent is ready to help optimize your content and grow your audience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VeriPlusInterface({ profileData, onBack, onClose }: {
  profileData: ProfileData;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="flex items-center justify-between p-6 border-b border-orange-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Veri+ Premium</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
          </div>
          
          <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Unlock Veri+ Premium
          </h3>
          <p className="text-xl text-gray-700 mb-8">
            Elevate your creator journey with exclusive features and premium benefits
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Priority AI Processing</h4>
              <p className="text-gray-600">Get lightning-fast AI analysis and recommendations with premium processing power</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Advanced Analytics</h4>
              <p className="text-gray-600">Deep insights into audience behavior, content performance, and growth opportunities</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Custom AI Tools</h4>
              <p className="text-gray-600">Access exclusive AI-powered tools for content creation and optimization</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="m22 21-3-3"/>
                  <circle cx="17" cy="17" r="3"/>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Premium Support</h4>
              <p className="text-gray-600">24/7 priority support with dedicated account management and personal guidance</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white shadow-xl shadow-orange-500/30">
            <h4 className="text-2xl font-bold mb-4">Ready to Go Premium?</h4>
            <p className="text-xl mb-6 text-white/90">Join thousands of creators maximizing their potential with Veri+</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-8 py-3 font-semibold transition-colors">
                Learn More
              </button>
              <button className="bg-white text-orange-600 hover:bg-gray-100 rounded-xl px-8 py-3 font-semibold transition-colors shadow-lg">
                Upgrade to Veri+ ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileActionButton({ icon, label, onClick, disabled = false, variant = 'default' }: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'premium';
}) {
  const getVariantStyles = () => {
    if (disabled) {
      return 'bg-gray-600/50 text-white/50 cursor-not-allowed';
    }
    
    switch (variant) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-500/80 to-orange-600/80 hover:from-yellow-500/90 hover:to-orange-600/90 border-yellow-400/30 shadow-lg shadow-yellow-500/20';
      default:
        return 'bg-green-900/50 hover:bg-green-800/60';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        h-14 rounded-lg backdrop-blur-sm border border-white/20 text-white
        flex items-center gap-3 px-4 transition-all duration-200
        ${!disabled ? 'hover:scale-105' : ''}
        ${getVariantStyles()}
      `}
    >
      {icon && <div className="w-6 h-6 flex-shrink-0">{icon}</div>}
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

function VeriIcon() {
  return (
    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center p-1">
      <div className="w-full h-full">
        <Group6 />
      </div>
    </div>
  );
}

function PremiumIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
}

// Icon components
function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
      <path d="M9.16663 2.75047H12.8333C14.7782 2.75047 16.6435 3.52309 18.0187 4.89836C19.394 6.27363 20.1666 8.13889 20.1666 10.0838C20.1666 12.0287 19.394 13.894 18.0187 15.2693C16.6435 16.6445 14.7782 17.4171 12.8333 17.4171V20.6255C8.24996 18.7921 1.8333 16.0421 1.8333 10.0838C1.8333 8.13889 2.60591 6.27363 3.98118 4.89836C5.35645 3.52309 7.22171 2.75047 9.16663 2.75047V2.75047ZM11 15.5838H12.8333C13.5556 15.5838 14.2708 15.4415 14.9381 15.1651C15.6053 14.8887 16.2117 14.4836 16.7224 13.9729C17.2331 13.4622 17.6382 12.8559 17.9146 12.1886C18.191 11.5213 18.3333 10.8061 18.3333 10.0838C18.3333 9.36154 18.191 8.64634 17.9146 7.97905C17.6382 7.31176 17.2331 6.70544 16.7224 6.19472C16.2117 5.684 15.6053 5.27887 14.9381 5.00247C14.2708 4.72607 13.5556 4.58381 12.8333 4.58381H9.16663C7.70794 4.58381 6.30899 5.16327 5.27754 6.19472C4.24609 7.22617 3.66663 8.62512 3.66663 10.0838C3.66663 13.393 5.92346 15.5526 11 17.8571V15.5838Z"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function PointsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
      <path d="M6.48823 0.00310477C8.75131 -0.00405812 11.0143 0.00310477 13.2773 0.0245891C14.4055 0.0454806 15.494 0.260324 16.5429 0.66912C18.0352 1.35422 18.9877 2.49289 19.4003 4.08514C19.5504 4.64927 19.6507 5.22218 19.7011 5.80389C19.7483 7.16393 19.7698 8.52458 19.7656 9.88592C19.7698 11.2473 19.7483 12.6079 19.7011 13.9679C19.4218 17.5129 17.5097 19.425 13.9648 19.7043C12.6047 19.7515 11.2441 19.773 9.88276 19.7687C8.52143 19.773 7.16078 19.7515 5.80073 19.7043C4.70898 19.6319 3.67773 19.3454 2.70698 18.8449C1.34236 17.9939 0.518798 16.7693 0.236279 15.1711C0.116538 14.5609 0.0449218 13.945 0.0214351 13.3234C-0.00721218 11.0318 -0.00721218 8.74007 0.0214351 6.44842C0.142512 2.25246 2.29811 0.104025 6.48823 0.00310477Z"/>
    </svg>
  );
}



export default App;
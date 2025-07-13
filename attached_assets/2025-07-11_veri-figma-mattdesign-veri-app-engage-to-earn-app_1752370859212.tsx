import React, { useState } from 'react';
import Group6 from "./imports/Group.tsx";
import Asset11 from "./imports/Asset11.tsx";
import Frame3003632 from "./imports/Frame3003632.tsx";
import Frame709 from "./imports/Frame709-29-1522.tsx";
import Group1171275252 from "./imports/Group1171275252.tsx";
import veriLogo from 'figma:asset/ba1b8475279163348b9605299d5754a88f8b3651.png';
import veriScoreImage from 'figma:asset/d147f6fccea1085e238f9bcfe1e3058acf8ddbac.png';
import { LiquidGlassButton } from './components/LiquidGlassButton';
import { CreateToEarnPage } from './components/CreateToEarnPage';
import { AIAgentToolsPage } from './components/AIAgentToolsPage';
import svgPaths from "./imports/svg-xb4y42j524";

type AppView = 
  | 'dashboard'
  | 'create-to-earn'
  | 'ai-agent'
  | 'ai-agent-tools'
  | 'profile-builder'
  | 'discovery';

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
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [profileBuilderStep, setProfileBuilderStep] = useState<ProfileBuilderStep>('hidden');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Sam Huber',
    bio: 'Content creator passionate about technology, social media growth, and the creator economy. Helping others build authentic online presence through strategic content creation and community engagement.',
    website: 'https://samhuber.creator',
    userType: 'creator',
    hasProfile: true,
    socialConnections: {
      twitter: { followers: 8700, connected: true },
      youtube: { subscribers: 45200, connected: true },
      instagram: { followers: 12500, connected: true },
      linkedin: { connections: 2500, connected: true }
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
      analytics: true
    }
  });

  const [aiGenerating, setAiGenerating] = useState(false);

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
      handleBuildProfile();
      return;
    }
    setCurrentView('ai-agent-tools');
  };

  const handleEngageTasksClick = () => {
    setCurrentView('create-to-earn');
  };

  const handleNavigationClick = (section: string) => {
    if (!profileData.hasProfile) {
      handleBuildProfile();
      return;
    }

    switch (section) {
      case 'profile':
        setCurrentView('profile-builder');
        break;
      case 'discovery':
        setCurrentView('discovery');
        break;
      case 'engage':
        setCurrentView('create-to-earn');
        break;
      case 'agent':
        setCurrentView('ai-agent-tools');
        break;
      case 'dashboard':
        setCurrentView('dashboard');
        break;
    }
    setSidebarOpen(false);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Render Create to Earn page as full page
  if (currentView === 'create-to-earn') {
    return (
      <div className="min-h-screen">
        <CreateToEarnPage 
          onBack={handleBackToDashboard}
          onClose={handleBackToDashboard}
        />
      </div>
    );
  }

  // Render AI Agent Tools page as full page
  if (currentView === 'ai-agent-tools') {
    return (
      <div className="min-h-screen">
        <AIAgentToolsPage 
          profileData={profileData}
          onBack={handleBackToDashboard}
          onClose={handleBackToDashboard}
        />
      </div>
    );
  }

  // Render other full page views
  if (currentView === 'ai-agent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <AIAgentFullPage 
          profileData={profileData}
          onBack={handleBackToDashboard}
        />
      </div>
    );
  }

  if (currentView === 'discovery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <DiscoveryFullPage 
          onBack={handleBackToDashboard}
        />
      </div>
    );
  }

  if (currentView === 'profile-builder') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <ProfileBuilderFullPage 
          profileData={profileData}
          onBack={handleBackToDashboard}
        />
      </div>
    );
  }

  // Default dashboard view
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="w-full h-full">
          <Frame709 />
        </div>
      </div>
      
      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profileBuilt={profileData.hasProfile}
        onNavigate={handleNavigationClick}
        onBuildProfile={handleBuildProfile}
        currentView={currentView}
      />

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
                  Your Veri profile is active and all tools are unlocked!<br />
                  Keep creating amazing content and watch your VeriScore climb.
                </p>
              </div>
              
              <div className="space-y-3 max-w-sm">
                <SocialButton text="Connected" points="500+ Points" connected={true} platform="twitter" />
                <SocialButton text="Connected" points="500+ Points" connected={true} platform="youtube" />
                <SocialButton text="Connected" points="500+ Points" connected={true} platform="instagram" />
                
                <div className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold text-white shadow-sm flex items-center justify-center gap-2">
                  <VeriIcon />
                  <span>Profile Complete ✓</span>
                  <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <VeriScoreCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <AIAgentCard onExplore={handleAIAgentClick} profileBuilt={profileData.hasProfile} />
            <BuildVeriProfileCard onBuildProfile={handleBuildProfile} />
            <EngageTasksButtonCard onEngageTasks={handleEngageTasksClick} />
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

function NavigationSidebar({ isOpen, onClose, profileBuilt, onNavigate, onBuildProfile, currentView }: {
  isOpen: boolean;
  onClose: () => void;
  profileBuilt: boolean;
  onNavigate: (section: string) => void;
  onBuildProfile: () => void;
  currentView: AppView;
}) {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      description: 'Main dashboard overview'
    },
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
      label: 'Create to Earn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      description: 'Complete tasks and earn points'
    },
    {
      id: 'agent',
      label: 'AI Agent Tools',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
        </svg>
      ),
      description: 'AI-powered creator tools'
    }
  ];

  const getViewIdFromNavId = (navId: string): AppView => {
    switch (navId) {
      case 'dashboard': return 'dashboard';
      case 'engage': return 'create-to-earn';
      case 'agent': return 'ai-agent-tools';
      case 'discovery': return 'discovery';
      case 'profile': return 'profile-builder';
      default: return 'dashboard';
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
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

      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${profileBuilt ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            Profile Status: {profileBuilt ? 'Active' : 'Setup Required'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = getViewIdFromNavId(item.id) === currentView;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                disabled={!profileBuilt && item.id !== 'dashboard'}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-100 border border-emerald-200 scale-[1.02]'
                    : profileBuilt || item.id === 'dashboard'
                    ? 'hover:bg-gray-50 hover:scale-[1.02] cursor-pointer'
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-200 text-emerald-700'
                      : profileBuilt || item.id === 'dashboard'
                      ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${isActive ? 'text-emerald-800' : 'text-gray-800'}`}>
                        {item.label}
                      </h3>
                      {!profileBuilt && item.id !== 'dashboard' && (
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
            );
          })}
        </div>
      </div>

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

// Placeholder full page components
function AIAgentFullPage({ profileData, onBack }: {
  profileData: ProfileData;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">AI Agent Interface</h1>
            <p className="text-gray-600">Your personalized AI assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">AI Agent Active</h2>
          <p className="text-xl text-gray-600">Your AI assistant is ready to help optimize your content and growth.</p>
        </div>
      </div>
    </div>
  );
}

function DiscoveryFullPage({ onBack }: {
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Discovery</h1>
            <p className="text-gray-600">Find creators and opportunities</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Discovery Hub</h2>
          <p className="text-xl text-gray-600">Explore trending creators, find collaboration opportunities, and discover new audiences.</p>
        </div>
      </div>
    </div>
  );
}

function ProfileBuilderFullPage({ profileData, onBack }: {
  profileData: ProfileData;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Veri Profile Builder</h1>
            <p className="text-gray-600">Manage your creator profile</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-12 h-12 text-white">
              <Group6 />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Profile Management</h2>
          <p className="text-xl text-gray-600">Your Veri profile is active and optimized for maximum visibility.</p>
        </div>
      </div>
    </div>
  );
}

// Keep all other existing components unchanged...
function VeriScoreCard() {
  return (
    <div className="bg-white/95 rounded-3xl p-8 border border-white/30 shadow-lg backdrop-blur-sm w-full">
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
          <div className="w-16 h-16 text-white">
            <Group6 />
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-3">VeriScore</h3>
        <div className="text-6xl font-bold text-gray-400 mb-4">99</div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Calculated Weekly Based on<br />
          <span className="underline font-medium">VeriScore Analytics™</span>
        </p>
      </div>

      <div className="text-center mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-2">VeriPoints</h4>
        <div className="text-4xl font-bold text-gray-400">2500XP</div>
      </div>

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
  return (
    <div className={`bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transition-all duration-200 ${
      profileBuilt ? 'hover:shadow-xl' : 'opacity-75'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">AI Agent Tools</h3>
          {!profileBuilt && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          )}
          {profileBuilt && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-200 font-medium">5 TOOLS ACTIVE</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
          </svg>
        </div>
      </div>
      
      <p className={`mb-6 ${profileBuilt ? 'text-white/90' : 'text-white/70'}`}>
        Access your complete suite of AI-powered creator tools for content optimization and automation.
      </p>
      
      <div className="space-y-3">
        <div className={`flex items-center gap-2 text-sm ${profileBuilt ? 'text-white/80' : 'text-white/60'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          AI Clipping Tool
        </div>
        <div className={`flex items-center gap-2 text-sm ${profileBuilt ? 'text-white/80' : 'text-white/60'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Scheduling Tool
        </div>
        <div className={`flex items-center gap-2 text-sm ${profileBuilt ? 'text-white/80' : 'text-white/60'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          Content Generation & Analytics
        </div>
      </div>
      
      <button 
        onClick={onExplore}
        className={`w-full mt-6 h-10 rounded-xl font-semibold transition-colors text-white backdrop-blur-sm flex items-center justify-center gap-2 ${
          profileBuilt 
            ? 'bg-white/20 hover:bg-white/30' 
            : 'bg-white/10 cursor-pointer hover:bg-white/15'
        }`}
      >
        {!profileBuilt && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        )}
        {profileBuilt ? 'Launch Agent' : 'Build Profile to Unlock'}
      </button>
    </div>
  );
}

function BuildVeriProfileCard({ onBuildProfile }: { onBuildProfile: () => void }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Your Veri Profile</h3>
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <VeriIcon />
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">
        Your professional Veri profile is active and showcasing your content across platforms.
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          AI-powered profile active
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          Cross-platform showcase live
        </div>
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
          Professional presence verified
        </div>
      </div>
      
      <button 
        onClick={onBuildProfile}
        className="w-full mt-6 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-colors text-white shadow-lg shadow-emerald-500/30"
      >
        Manage Profile
      </button>
    </div>
  );
}

function EngageTasksButtonCard({ onEngageTasks }: { onEngageTasks: () => void }) {
  // Mock streak data - in a real app this would come from user data
  const currentStreak = 7;
  const longestStreak = 15;
  const streakGoal = 30;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Start Creating</h3>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">
        Complete tasks, earn points, and boost your VeriScore ranking.
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Completed Tasks</span>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">8/12</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full" style={{ width: '67%' }}></div>
        </div>
        
        {/* Streak Status Bar */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="text-orange-500">🔥</div>
              <span className="text-sm font-semibold text-gray-700">Daily Streak</span>
            </div>
            <div className="text-sm font-bold text-orange-600">{currentStreak} days</div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Personal Best: {longestStreak} days</span>
            <span>Goal: {streakGoal} days</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStreak / streakGoal) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-orange-600 mt-1 font-medium">
            Keep going! {streakGoal - currentStreak} days to reach your goal
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">+3,250</span>
          <span> points available</span>
        </div>
      </div>
      
      <button 
        onClick={onEngageTasks}
        className="w-full mt-6 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors text-white shadow-lg shadow-blue-500/30"
      >
        View All Tasks
      </button>
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
  ];

  const getRankBadge = (rank: number) => {
    const badgeStyles = {
      1: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50',
      2: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/50',
      3: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50',
    };
    return rank <= 3 ? badgeStyles[rank] : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white';
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
      </div>

      <div className="space-y-3">
        {allLeaderboardData.map((user, index) => (
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
                  </div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {user.badges.map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700 border border-purple-200">
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
        ))}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="text-2xl font-bold text-gray-800">66.2K</div>
          <div className="text-sm text-gray-600">Total Followers</div>
          <div className="text-sm text-green-600 font-semibold">+15.3% this month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="text-2xl font-bold text-gray-800">2.45M</div>
          <div className="text-sm text-gray-600">Total Views</div>
          <div className="text-sm text-green-600 font-semibold">+23.4% this month</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <div className="text-2xl font-bold text-gray-800">8.7%</div>
          <div className="text-sm text-gray-600">Engagement Rate</div>
          <div className="text-sm text-green-600 font-semibold">+1.2% this month</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <div className="text-2xl font-bold text-gray-800">99</div>
          <div className="text-sm text-gray-600">VeriScore</div>
          <div className="text-sm text-green-600 font-semibold">+5 this week</div>
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
        {/* Add other modal content here as needed */}
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-600">Profile Builder Interface</p>
        </div>
      </div>
    </div>
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

export default App;
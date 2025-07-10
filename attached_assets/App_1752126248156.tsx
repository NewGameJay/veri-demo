import React, { useState } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { LiquidGlassButton } from './components/LiquidGlassButton';
import { VeriLogo } from './components/VeriLogo';
import { Leaderboard } from './components/Leaderboard';
import Group6073870 from './imports/Group-6073-870';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './components/ui/sheet';
import { VeriPlusStudioSignup } from './components/VeriPlusStudioSignup';
import { VeriPlusCreatorSignup } from './components/VeriPlusCreatorSignup';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { Twitter, Instagram, Youtube, MessageCircle, Send, Hash, Share2, Copy, Heart, Users, TrendingUp, Camera, MapPin, Calendar, Link as LinkIcon, Bell, Settings, Sun, Moon, ExternalLink, Eye, Star, Crown, Zap, ArrowRight, Menu, User, Search, Bot, X } from 'lucide-react';

// Mock data for social feeds
const mockSocialFeeds = {
  twitter: [
    {
      id: 1,
      content: "Just launched my new course on content creation! 🚀 The response has been incredible - over 1000 students in the first week. Building authentic connections through content is truly powerful.",
      engagement: 1250,
      date: "2 days ago",
      likes: 892,
      comments: 156,
      shares: 202,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      content: "The creator economy is evolving faster than ever. What I'm seeing: 1) Authenticity beats perfection 2) Community > Followers 3) Value-first content wins every time.",
      engagement: 890,
      date: "4 days ago",
      likes: 654,
      comments: 123,
      shares: 113
    },
    {
      id: 3,
      content: "Hot take: The future of social media isn't about going viral - it's about building genuine relationships with your audience. Quality over quantity, always.",
      engagement: 720,
      date: "1 week ago",
      likes: 521,
      comments: 98,
      shares: 101
    }
  ],
  instagram: [
    {
      id: 1,
      content: "Behind the scenes of my content creation process ✨ From ideation to final edit, here's how I craft posts that resonate with my community.",
      engagement: 5600,
      date: "1 day ago",
      likes: 4200,
      comments: 380,
      shares: 1020,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      content: "Travel content that tells a story 📸 Every frame should evoke emotion and inspire action. What's your favorite travel memory?",
      engagement: 3400,
      date: "3 days ago",
      likes: 2800,
      comments: 290,
      shares: 310,
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      content: "Sunset vibes and creative minds 🌅 Sometimes the best content comes from the simplest moments. What inspires your creativity?",
      engagement: 2900,
      date: "5 days ago",
      likes: 2300,
      comments: 210,
      shares: 390,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
    }
  ],
  youtube: [
    {
      id: 1,
      content: "How to grow on social media in 2025: The complete guide covering algorithm changes, content strategies, and community building tactics that actually work.",
      engagement: 15600,
      date: "1 week ago",
      likes: 12400,
      comments: 890,
      shares: 2310,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop"
    },
    {
      id: 2,
      content: "The psychology of viral content: Why some posts explode and others don't. Breaking down the science behind shareability and engagement.",
      engagement: 9800,
      date: "2 weeks ago",
      likes: 7200,
      comments: 540,
      shares: 2060,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop"
    },
    {
      id: 3,
      content: "Building a personal brand that stands out: From visual identity to voice consistency, here's how to make your mark in the digital world.",
      engagement: 8200,
      date: "3 weeks ago",
      likes: 6100,
      comments: 420,
      shares: 1680,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=225&fit=crop"
    }
  ]
};

export default function App() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPublicPreview, setShowPublicPreview] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showStudioSignup, setShowStudioSignup] = useState(false);
  const [showCreatorSignup, setShowCreatorSignup] = useState(false);

  const generateProfileUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/samhuber-${Math.random().toString(36).substr(2, 8)}`;
  };

  const copyToClipboard = async (text: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Silently fall back to alternative method
      }
    }
    
    // Fallback method for older browsers or non-secure contexts
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      return false;
    }
  };

  const handleShare = async () => {
    const profileUrl = generateProfileUrl();
    const copySuccess = await copyToClipboard(profileUrl);
    
    if (copySuccess) {
      setCopiedLink(true);
      setShowPublicPreview(true);
      toast.success('Profile link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      // Show the URL in a prompt as last resort
      const userAction = window.prompt('Copy this profile URL:', profileUrl);
      if (userAction !== null) {
        setShowPublicPreview(true);
        toast.success('Profile preview opened!');
      } else {
        toast.error('Copy failed. Please copy the URL manually.');
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme-aware color classes
  const themeColors = {
    // Background colors
    mainBg: isDarkMode ? 'bg-black' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-black/80' : 'bg-white/90',
    glassBg: isDarkMode ? 'bg-white/10' : 'bg-black/10',
    hoverGlass: isDarkMode ? 'hover:bg-white/20' : 'hover:bg-black/20',
    
    // Text colors
    primaryText: isDarkMode ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkMode ? 'text-white/80' : 'text-gray-700',
    mutedText: isDarkMode ? 'text-white/60' : 'text-gray-500',
    
    // Border colors
    border: isDarkMode ? 'border-white/10' : 'border-black/10',
    hoverBorder: isDarkMode ? 'hover:border-white/20' : 'hover:border-black/20',
    
    // Header background
    headerBg: isDarkMode ? 'bg-black/20' : 'bg-white/80',
    
    // Banner gradient
    bannerGradient: isDarkMode 
      ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-teal-600'
      : 'bg-gradient-to-br from-gray-200 via-slate-200 to-teal-300',
    
    // Profile picture border
    profileBorder: isDarkMode ? 'border-white' : 'border-white',
    
    // VeriScore card background
    veriScoreBg: isDarkMode 
      ? 'from-slate-700/40 via-slate-600/30 to-teal-600/40'
      : 'from-teal-100/90 via-gray-100/80 to-gray-50/90',
    veriScoreHover: isDarkMode 
      ? 'hover:from-slate-700/50 hover:via-slate-600/40 hover:to-teal-600/50'
      : 'hover:from-teal-200/95 hover:via-gray-200/85 hover:to-gray-100/95',
      
    // Social feed cards
    feedCardBg: isDarkMode ? 'bg-black/20' : 'bg-white/60',
    feedCardHover: isDarkMode ? 'hover:bg-black/30' : 'hover:bg-white/80',
    
    // CTA section
    ctaBg: isDarkMode ? 'bg-white/10' : 'bg-black/10',
    ctaText: isDarkMode ? 'text-gray-300' : 'text-gray-600'
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${themeColors.mainBg}`}>
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <header className={`relative z-50 flex items-center justify-between px-6 py-4 ${themeColors.headerBg} backdrop-blur-xl ${themeColors.border} border-b`}>
          <div className="flex items-center gap-4">
            {/* Dashboard Hamburger Menu */}
            <Sheet open={showDashboard} onOpenChange={setShowDashboard}>
              <SheetTrigger asChild>
                <button className={`p-2 ${themeColors.hoverGlass} rounded-xl transition-all duration-300 group`}>
                  <Menu className={`w-5 h-5 ${themeColors.mutedText} group-hover:text-emerald-400 transition-colors`} />
                </button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className={`w-80 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'} backdrop-blur-xl border-0 p-0`}
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Dashboard Navigation</SheetTitle>
                  <SheetDescription>Quick access to your VeriScore dashboard tools and profile management</SheetDescription>
                </SheetHeader>
                <DashboardNavigation isDarkMode={isDarkMode} themeColors={themeColors} onClose={() => setShowDashboard(false)} />
              </SheetContent>
            </Sheet>
            
            <VeriLogo size="md" variant="gradient" />
          </div>
          
          {/* Navigation Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 ${themeColors.hoverGlass} rounded-xl transition-all duration-300 group`}
            >
              {isDarkMode ? (
                <Sun className={`w-5 h-5 ${themeColors.mutedText} group-hover:text-yellow-400 transition-colors`} />
              ) : (
                <Moon className={`w-5 h-5 ${themeColors.mutedText} group-hover:text-purple-400 transition-colors`} />
              )}
            </button>
            
            <button className={`p-2 ${themeColors.hoverGlass} rounded-xl transition-colors`}>
              <Bell className={`w-5 h-5 ${themeColors.mutedText}`} />
            </button>
            <button className={`p-2 ${themeColors.hoverGlass} rounded-xl transition-colors`}>
              <Settings className={`w-5 h-5 ${themeColors.mutedText}`} />
            </button>
            <button 
              onClick={handleShare}
              className={`group flex items-center gap-2 px-4 py-2 ${themeColors.glassBg} hover:bg-emerald-500/20 ${themeColors.border} hover:border-emerald-400/40 rounded-xl transition-all duration-300`}
            >
              {copiedLink ? (
                <>
                  <div className="w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span className="text-emerald-300 text-sm font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className={`w-4 h-4 ${themeColors.primaryText} group-hover:text-emerald-300 transition-colors`} />
                  <span className={`${themeColors.primaryText} group-hover:text-emerald-300 text-sm font-medium transition-colors`}>Share</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Banner Header */}
        <div className="relative h-64 overflow-hidden">
          {/* Theme-aware Gradient Background */}
          <div className={`absolute inset-0 ${themeColors.bannerGradient}`}>
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/40 via-transparent to-black/10' : 'bg-gradient-to-t from-white/20 via-transparent to-white/10'}`}></div>
          </div>
          
          {/* Banner Edit/Upload Button */}
          <button className={`absolute top-4 right-4 p-3 ${isDarkMode ? 'bg-black/40 hover:bg-black/60' : 'bg-white/40 hover:bg-white/60'} backdrop-blur-sm ${themeColors.border} rounded-xl transition-all duration-300 group`}>
            <Camera className={`w-5 h-5 ${themeColors.primaryText} group-hover:text-emerald-300 transition-colors`} />
          </button>
          
          {/* Optional: Upload instruction text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity">
            <div className="text-center">
              <Camera className={`w-8 h-8 ${themeColors.primaryText} mx-auto mb-2`} />
              <p className={`${themeColors.primaryText} text-sm font-medium`}>Click to upload banner</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative px-6">
          {/* Profile Picture positioned to overlap banner */}
          <div className="relative -mt-16 mb-6">
            <div className="flex items-end justify-between">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 ${themeColors.profileBorder} overflow-hidden ${isDarkMode ? 'bg-white' : 'bg-gray-900'} shadow-2xl`}>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face"
                    alt="Sam Huber"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <div className={`absolute bottom-2 right-2 w-6 h-6 bg-emerald-400 border-4 ${themeColors.profileBorder} rounded-full shadow-lg`}></div>
              </div>
            </div>
          </div>

          {/* Profile Info and Veri+ CTA Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Profile Info */}
            <div className="lg:col-span-8">
              <div className={`${themeColors.cardBg} backdrop-blur-sm rounded-3xl p-6 ${themeColors.border} h-full`}>
                <div className="mb-4">
                  <h1 className={`text-3xl font-bold ${themeColors.primaryText} mb-1`}>Sam Huber</h1>
                  <p className="text-emerald-400 text-lg font-medium">@samhuber</p>
                </div>
                
                <p className={`${themeColors.secondaryText} text-lg mb-4 max-w-xl`}>
                  Veri Community Member • Content Creator • Digital nomad exploring the intersection of technology and creativity.
                </p>
                
                {/* Profile Meta */}
                <div className={`flex items-center gap-6 ${themeColors.mutedText} text-sm mb-6`}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-emerald-400">samhuber.com</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined March 2023</span>
                  </div>
                </div>

                {/* Social Media Stats */}
                <div className="flex items-center gap-6 text-sm mb-6">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold ${themeColors.primaryText}`}>8,712</span>
                    <span className={themeColors.mutedText}>Total Social Media Followers</span>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="flex flex-wrap gap-4">
                  <SocialLink icon={Twitter} href="https://twitter.com/samhuber" platform="twitter" />
                  <SocialLink icon={Instagram} href="https://instagram.com/samhuber" platform="instagram" />
                  <SocialLink icon={Youtube} href="https://youtube.com/@samhuber" platform="youtube" />
                  <SocialLink icon={MessageCircle} href="https://discord.gg/samhuber" platform="discord" />
                </div>
              </div>
            </div>

            {/* Veri+ Creator/Studio CTA - Only visible in management view */}
            <div className="lg:col-span-4">
              <VeriPlusCTA 
                isDarkMode={isDarkMode} 
                themeColors={themeColors} 
                onStudioClick={() => setShowStudioSignup(true)}
                onCreatorClick={() => setShowCreatorSignup(true)}
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* VeriScore Card */}
            <div className="lg:col-span-5">
              <VeriScoreCard isDarkMode={isDarkMode} themeColors={themeColors} />
            </div>

            {/* Leaderboard */}
            <div className="lg:col-span-7">
              <Leaderboard isDarkMode={isDarkMode} themeColors={themeColors} />
            </div>
          </div>

          {/* Enhanced Social Feeds Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-white to-emerald-200' : 'bg-gradient-to-r from-gray-900 to-emerald-600'} bg-clip-text text-transparent mb-4`}>
                Top Performing Content
              </h2>
              <p className={`${themeColors.ctaText} text-lg`}>Showcasing the best posts across all platforms</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <SocialFeedCard 
                platform="twitter" 
                platformName="X (Twitter)" 
                icon={Twitter}
                posts={mockSocialFeeds.twitter}
                color="from-blue-500 to-blue-600"
                themeColors={themeColors}
              />
              <SocialFeedCard 
                platform="instagram" 
                platformName="Instagram" 
                icon={Instagram}
                posts={mockSocialFeeds.instagram}
                color="from-pink-500 to-purple-600"
                themeColors={themeColors}
              />
              <SocialFeedCard 
                platform="youtube" 
                platformName="YouTube" 
                icon={Youtube}
                posts={mockSocialFeeds.youtube}
                color="from-red-500 to-red-600"
                themeColors={themeColors}
              />
            </div>
          </div>

          {/* Call-to-Action Section */}
          <div className="text-center">
            <div className={`${themeColors.ctaBg} backdrop-blur-xl rounded-3xl p-12 ${themeColors.border} shadow-2xl`}>
              <h3 className={`text-3xl font-bold ${themeColors.primaryText} mb-4`}>Want to create your own VeriScore profile?</h3>
              <p className={`${themeColors.ctaText} text-lg mb-8 max-w-2xl mx-auto`}>
                Join thousands of creators who trust VeriScore to showcase their authentic social media presence and build credibility.
              </p>
              <LiquidGlassButton className="px-8 py-4 text-lg font-semibold" variant="emerald">
                Get Started with VeriScore
              </LiquidGlassButton>
            </div>
          </div>
        </div>
      </div>

      {/* Public Profile Preview Modal - Full Desktop Width */}
      <Dialog open={showPublicPreview} onOpenChange={setShowPublicPreview}>
        <DialogContent 
          className={`max-w-[95vw] w-[95vw] max-h-[92vh] overflow-y-auto ${isDarkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl border-0 p-0 m-0`}
          aria-describedby="public-profile-description"
        >
          <DialogHeader className={`w-full ${isDarkMode ? 'bg-black/95' : 'bg-white/95'} p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'} m-0`}>
            <div className="flex items-center justify-between w-full">
              <DialogTitle className={`text-2xl font-bold ${themeColors.primaryText} flex items-center gap-3`}>
                <Eye className="w-6 h-6 text-emerald-400" />
                Public Profile Preview
              </DialogTitle>
              <div className="flex items-center gap-2">
                <button 
                  onClick={async () => {
                    const profileUrl = generateProfileUrl();
                    const copySuccess = await copyToClipboard(profileUrl);
                    
                    if (copySuccess) {
                      toast.success('Link copied again!');
                    } else {
                      const userAction = window.prompt('Copy this profile URL:', profileUrl);
                      if (userAction !== null) {
                        toast.success('URL provided for copying!');
                      } else {
                        toast.error('Copy failed. Please copy the URL manually.');
                      }
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 ${themeColors.glassBg} hover:bg-emerald-500/20 ${themeColors.border} hover:border-emerald-400/40 rounded-lg transition-all duration-300`}
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy Link</span>
                </button>
                <button 
                  onClick={() => window.open(generateProfileUrl(), '_blank')}
                  className={`flex items-center gap-2 px-3 py-2 ${themeColors.glassBg} hover:bg-blue-500/20 ${themeColors.border} hover:border-blue-400/40 rounded-lg transition-all duration-300`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Open</span>
                </button>
              </div>
            </div>
            <DialogDescription 
              id="public-profile-description"
              className={`${themeColors.ctaText} text-sm w-full`}
            >
              This is how your profile will appear to the public. Your link has been copied to clipboard.
            </DialogDescription>
          </DialogHeader>
          
          {/* Public Profile Preview Content - Full Desktop Layout */}
          <div className={`w-full ${themeColors.mainBg} p-8 m-0`}>
            <PublicProfilePreview isDarkMode={isDarkMode} themeColors={themeColors} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <Toaster />

      {/* Veri+ Studio Signup Flow */}
      <VeriPlusStudioSignup
        isOpen={showStudioSignup}
        onClose={() => setShowStudioSignup(false)}
        isDarkMode={isDarkMode}
        themeColors={themeColors}
      />

      {/* Veri+ Creator Signup Flow */}
      <VeriPlusCreatorSignup
        isOpen={showCreatorSignup}
        onClose={() => setShowCreatorSignup(false)}
        isDarkMode={isDarkMode}
        themeColors={themeColors}
      />
    </div>
  );
}

function DashboardNavigation({ isDarkMode, themeColors, onClose }: { isDarkMode: boolean, themeColors: any, onClose: () => void }) {
  const navigationItems = [
    {
      id: 'profile',
      icon: User,
      title: 'My Veri Profile',
      description: 'Manage your creator profile',
      active: true
    },
    {
      id: 'discovery',
      icon: Search,
      title: 'Discovery',
      description: 'Find creators and opportunities'
    },
    {
      id: 'engage',
      icon: Star,
      title: 'Engage to Earn',
      description: 'Complete tasks and earn points'
    },
    {
      id: 'agent',
      icon: Bot,
      title: 'My Agent',
      description: 'AI-powered creator assistant'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-6 border-b ${themeColors.border}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`font-bold ${themeColors.primaryText}`}>Navigation</h2>
              <p className={`text-sm ${themeColors.mutedText}`}>Quick access to tools</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 ${themeColors.hoverGlass} rounded-lg transition-colors`}
          >
            <X className={`w-4 h-4 ${themeColors.mutedText}`} />
          </button>
        </div>
      </div>

      {/* Profile Status */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          <span className={`${themeColors.primaryText} font-medium`}>Profile Status: Active</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-6 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
              item.active 
                ? `${isDarkMode ? 'bg-emerald-500/10 border border-emerald-400/30' : 'bg-emerald-100/80 border border-emerald-300/50'}` 
                : `${themeColors.hoverGlass} hover:scale-[1.02]`
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              item.active 
                ? 'bg-emerald-400/20' 
                : `${themeColors.glassBg}`
            }`}>
              <item.icon className={`w-5 h-5 ${
                item.active 
                  ? 'text-emerald-400' 
                  : themeColors.mutedText
              }`} />
            </div>
            <div className="text-left">
              <div className={`font-medium ${
                item.active 
                  ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-700')
                  : themeColors.primaryText
              }`}>
                {item.title}
              </div>
              <div className={`text-sm ${themeColors.mutedText}`}>
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Profile Active Banner */}
      <div className="p-6 pt-4">
        <div className={`${isDarkMode ? 'bg-emerald-500/10 border border-emerald-400/30' : 'bg-emerald-100/80 border border-emerald-300/50'} rounded-xl p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <div className={`font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                Profile Active
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>
                All tools unlocked!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VeriPlusCTA({ isDarkMode, themeColors, onStudioClick, onCreatorClick }: { isDarkMode: boolean, themeColors: any, onStudioClick: () => void, onCreatorClick: () => void }) {
  return (
    <div className={`bg-gradient-to-br ${themeColors.veriScoreBg} backdrop-blur-sm rounded-3xl p-6 ${themeColors.border} shadow-xl h-full relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-3xl bg-[rgba(28,187,147,0.14)]"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-bl-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-transparent rounded-tr-3xl"></div>
      
      <div className="relative z-10">
        {/* Header with premium badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold ${themeColors.primaryText}`}>Veri+</span>
          </div>
          <div className="px-3 py-1 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full border border-orange-400/30">
            <span className="text-xs font-medium text-orange-400">PREMIUM</span>
          </div>
        </div>

        {/* Main title */}
        <h3 className={`text-xl font-bold ${themeColors.primaryText} mb-3`}>
          Become a Veri+ Creator or Studio
        </h3>
        
        <p className={`${themeColors.secondaryText} text-sm mb-6 leading-relaxed`}>
          Apply for verified status with advanced analytics, custom branding, priority support, and exclusive creator tools.
        </p>

        {/* Feature highlights */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-emerald-400/20 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-emerald-400" />
            </div>
            <span className={`text-sm ${themeColors.secondaryText}`}>Advanced Analytics Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-purple-400/20 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-purple-400" />
            </div>
            <span className={`text-sm ${themeColors.secondaryText}`}>Custom Profile Branding</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-pink-400/20 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-pink-400" />
            </div>
            <span className={`text-sm ${themeColors.secondaryText}`}>Priority Creator Support</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <LiquidGlassButton 
            onClick={onCreatorClick}
            className="w-full py-3 text-sm font-semibold" 
            variant="purple"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Become a Veri+ Creator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </LiquidGlassButton>
          
          <button 
            onClick={onStudioClick}
            className={`w-full py-3 px-4 ${themeColors.glassBg} ${themeColors.border} rounded-xl ${themeColors.primaryText} text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${themeColors.hoverGlass}`}
          >
            Become a Veri+ Studio
          </button>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ icon: Icon, href, platform }: { icon: any, href: string, platform: string }) {
  const getColor = () => {
    switch (platform) {
      case 'twitter': return 'from-blue-500 to-blue-600';
      case 'instagram': return 'from-pink-500 to-purple-600';
      case 'youtube': return 'from-red-500 to-red-600';
      case 'discord': return 'from-indigo-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-4 bg-gradient-to-r ${getColor()} rounded-2xl text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-2xl backdrop-blur-sm`}
    >
      <Icon size={24} />
    </a>
  );
}

function VeriScoreCard({ isDarkMode, themeColors }: { isDarkMode: boolean, themeColors: any }) {
  return (
    <div className={`bg-gradient-to-br ${themeColors.veriScoreBg} backdrop-blur-xl rounded-3xl p-8 ${themeColors.border} shadow-2xl h-fit sticky top-8 ${themeColors.veriScoreHover} transition-all duration-300`}>
      {/* Enhanced VeriScore Logo Area */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-36 h-36 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
            <div 
              className="w-20 h-20"
              style={{
                '--fill-0': 'white'
              } as React.CSSProperties}
            >
              <Group6073870 />
            </div>
          </div>
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-3xl blur-xl opacity-30 -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-3xl blur-2xl opacity-20 -z-20 scale-110"></div>
        </div>
      </div>

      {/* Enhanced VeriScore Section */}
      <div className="text-center mb-8">
        <h3 className={`text-3xl font-bold ${themeColors.primaryText} mb-4`}>VeriScore</h3>
        <div className="relative">
          <div className="text-8xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-4">99</div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent blur-sm opacity-50 text-8xl font-bold">99</div>
        </div>
        <div className={`${themeColors.glassBg} rounded-2xl p-4 mb-4`}>
          <p className={`${themeColors.ctaText} text-sm leading-relaxed`}>
            Calculated Weekly Based on<br />
            <span className={`underline font-medium ${isDarkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-teal-700 hover:text-teal-600'} transition-colors`}>VeriScore Analytics™</span>
          </p>
        </div>
      </div>

      {/* Enhanced VeriPoints Section */}
      <div className="text-center mb-8">
        <h4 className={`text-2xl font-bold ${themeColors.primaryText} mb-3`}>VeriPoints</h4>
        <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">2500XP</div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`${themeColors.glassBg} rounded-2xl p-6 text-center ${themeColors.hoverGlass} transition-all backdrop-blur-sm`}>
          <div className={`text-3xl font-bold ${themeColors.primaryText} mb-1`}>8.7K</div>
          <div className={`text-sm ${themeColors.ctaText} font-medium`}>Total Followers</div>
        </div>
        <div className={`${themeColors.glassBg} rounded-2xl p-6 text-center ${themeColors.hoverGlass} transition-all backdrop-blur-sm`}>
          <div className={`text-3xl font-bold ${themeColors.primaryText} mb-1`}>12.5K</div>
          <div className={`text-sm ${themeColors.ctaText} font-medium`}>Engagement</div>
        </div>
      </div>

      {/* Enhanced User Name */}
      <div className="text-center">
        <p className={`text-2xl font-semibold ${themeColors.primaryText} mb-2`}>Sam Huber</p>
        <p className={`${isDarkMode ? 'text-emerald-300' : 'text-teal-700'} text-base font-medium`}>Creator &amp; Influencer</p>
      </div>
    </div>
  );
}

function PublicProfilePreview({ isDarkMode, themeColors }: { isDarkMode: boolean, themeColors: any }) {
  return (
    <div className="space-y-10 max-w-none w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-8">
        <VeriLogo size="xl" variant="gradient" />
        <div className="flex items-center gap-4 text-emerald-400">
          <div className="w-5 h-5 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-xl font-medium">Public View</span>
        </div>
      </div>

      {/* Banner Area - Desktop Height */}
      <div className="relative h-64 overflow-hidden rounded-3xl">
        <div className={`absolute inset-0 ${themeColors.bannerGradient}`}>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/40 via-transparent to-black/10' : 'bg-gradient-to-t from-white/20 via-transparent to-white/10'}`}></div>
        </div>
      </div>

      {/* Profile Section - Desktop Layout */}
      <div className="relative -mt-24 px-8">
        {/* Profile Picture positioned to overlap banner */}
        <div className="relative mb-12">
          <div className="flex items-end justify-between">
            <div className="relative">
              <div className={`w-40 h-40 rounded-full border-6 ${themeColors.profileBorder} overflow-hidden ${isDarkMode ? 'bg-white' : 'bg-gray-900'} shadow-2xl`}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face"
                  alt="Sam Huber"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute bottom-2 right-2 w-8 h-8 bg-emerald-400 border-6 ${themeColors.profileBorder} rounded-full shadow-lg`}></div>
            </div>
            
            {/* Privacy Badge */}
            <div className={`${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-100/80'} border ${isDarkMode ? 'border-emerald-400/30' : 'border-emerald-300/50'} rounded-2xl px-6 py-3`}>
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-emerald-400" />
                <span className={`text-base font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Public</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info - Desktop Layout */}
        <div className={`mb-12 ${themeColors.cardBg} backdrop-blur-sm rounded-3xl p-10 ${themeColors.border}`}>
          <div className="mb-8">
            <h1 className={`text-5xl font-bold ${themeColors.primaryText} mb-4`}>Sam Huber</h1>
            <p className="text-emerald-400 text-2xl font-medium mb-6">@samhuber</p>
            <p className={`${themeColors.secondaryText} text-lg mb-8 max-w-4xl leading-relaxed`}>
              Veri Community Member • Content Creator • Digital nomad exploring the intersection of technology and creativity.
            </p>
          </div>
          
          {/* Profile Meta - Desktop Layout */}
          <div className={`flex items-center gap-8 ${themeColors.mutedText} mb-8 text-base`}>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5" />
              <span className="text-emerald-400">samhuber.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <span>Joined March 2023</span>
            </div>
          </div>

          {/* Social Media Stats - Desktop Size */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <span className={`text-3xl font-bold ${themeColors.primaryText}`}>8,712</span>
              <span className={`${themeColors.mutedText} text-base`}>Total Social Media Followers</span>
            </div>
          </div>

          {/* Social Media Links - Desktop */}
          <div className="flex gap-5">
            <SocialLink icon={Twitter} href="https://twitter.com/samhuber" platform="twitter" />
            <SocialLink icon={Instagram} href="https://instagram.com/samhuber" platform="instagram" />
            <SocialLink icon={Youtube} href="https://youtube.com/@samhuber" platform="youtube" />
            <SocialLink icon={MessageCircle} href="https://discord.gg/samhuber" platform="discord" />
          </div>
        </div>

        {/* Main Content Grid - Desktop Layout */}
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-12 mb-12">
          {/* VeriScore Card - Desktop Size */}
          <div className="2xl:col-span-4">
            <div className={`bg-gradient-to-br ${themeColors.veriScoreBg} backdrop-blur-xl rounded-3xl p-10 ${themeColors.border} shadow-2xl h-fit`}>
              {/* VeriScore Logo Area */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <div 
                      className="w-16 h-16"
                      style={{
                        '--fill-0': 'white'
                      } as React.CSSProperties}
                    >
                      <Group6073870 />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-3xl blur-xl opacity-30 -z-10"></div>
                </div>
              </div>

              {/* VeriScore Section */}
              <div className="text-center mb-8">
                <h3 className={`text-3xl font-bold ${themeColors.primaryText} mb-4`}>VeriScore</h3>
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-6">99</div>
                <div className={`${themeColors.glassBg} rounded-2xl p-5 mb-6`}>
                  <p className={`${themeColors.ctaText} text-base leading-relaxed`}>
                    Calculated Weekly Based on<br />
                    <span className={`underline font-medium ${isDarkMode ? 'text-emerald-300' : 'text-teal-700'}`}>VeriScore Analytics™</span>
                  </p>
                </div>
              </div>

              {/* VeriPoints */}
              <div className="text-center mb-8">
                <h4 className={`text-2xl font-bold ${themeColors.primaryText} mb-3`}>VeriPoints</h4>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">2500XP</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className={`${themeColors.glassBg} rounded-2xl p-6 text-center backdrop-blur-sm`}>
                  <div className={`text-3xl font-bold ${themeColors.primaryText} mb-2`}>8.7K</div>
                  <div className={`text-sm ${themeColors.ctaText}`}>Followers</div>
                </div>
                <div className={`${themeColors.glassBg} rounded-2xl p-6 text-center backdrop-blur-sm`}>
                  <div className={`text-3xl font-bold ${themeColors.primaryText} mb-2`}>12.5K</div>
                  <div className={`text-sm ${themeColors.ctaText}`}>Engagement</div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard - Desktop Space */}
          <div className="2xl:col-span-8">
            <Leaderboard isDarkMode={isDarkMode} themeColors={themeColors} />
          </div>
        </div>

        {/* Social Feeds Section - Desktop Showcase */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className={`text-5xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-white to-emerald-200' : 'bg-gradient-to-r from-gray-900 to-emerald-600'} bg-clip-text text-transparent mb-6`}>
              Top Performing Content
            </h2>
            <p className={`${themeColors.ctaText} text-xl`}>Showcasing the best posts across all platforms</p>
          </div>
          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-10">
            <SocialFeedCard 
              platform="twitter" 
              platformName="X (Twitter)" 
              icon={Twitter}
              posts={mockSocialFeeds.twitter}
              color="from-blue-500 to-blue-600"
              themeColors={themeColors}
            />
            <SocialFeedCard 
              platform="instagram" 
              platformName="Instagram" 
              icon={Instagram}
              posts={mockSocialFeeds.instagram}
              color="from-pink-500 to-purple-600"
              themeColors={themeColors}
            />
            <SocialFeedCard 
              platform="youtube" 
              platformName="YouTube" 
              icon={Youtube}
              posts={mockSocialFeeds.youtube}
              color="from-red-500 to-red-600"
              themeColors={themeColors}
            />
          </div>
        </div>

        {/* Public Access Notice - Enhanced */}
        <div className={`${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-100/80'} border ${isDarkMode ? 'border-emerald-400/30' : 'border-emerald-300/50'} rounded-3xl p-8`}>
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-emerald-400/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'} text-xl mb-3`}>
                Public Profile Active
              </h4>
              <p className={`text-base ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-700'} leading-relaxed`}>
                Anyone with this link can view your VeriScore, basic profile info, and connected social accounts. Personal details and private metrics remain hidden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialFeedCard({ platform, platformName, icon: Icon, posts, color, themeColors }: {
  platform: string,
  platformName: string,
  icon: any,
  posts: any[],
  color: string,
  themeColors: any
}) {
  return (
    <div className={`${themeColors.feedCardBg} backdrop-blur-sm rounded-3xl p-8 ${themeColors.border} ${themeColors.feedCardHover} transition-all duration-300`}>
      {/* Platform Header - Desktop */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${themeColors.primaryText}`}>{platformName}</h3>
          <p className={`text-base ${themeColors.mutedText}`}>Top performing posts</p>
        </div>
      </div>

      {/* Posts - Desktop Spacing */}
      <div className="space-y-6">
        {posts.slice(0, 3).map((post, index) => (
          <div key={post.id} className={`${themeColors.glassBg} rounded-2xl p-6 backdrop-blur-sm border ${themeColors.border}`}>
            {post.image && (
              <div className="mb-5 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={`${platform} post`}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <p className={`${themeColors.secondaryText} text-base mb-5 leading-relaxed line-clamp-3`}>
              {post.content}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className={themeColors.mutedText}>{post.likes?.toLocaleString() || post.engagement?.toLocaleString()}</span>
                </div>
                {post.comments && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span className={themeColors.mutedText}>{post.comments.toLocaleString()}</span>
                  </div>
                )}
                {post.shares && (
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-green-400" />
                    <span className={themeColors.mutedText}>{post.shares.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <span className={`text-sm ${themeColors.mutedText}`}>{post.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* View More - Desktop */}
      <div className="mt-8 text-center">
        <button className={`text-base ${color.includes('blue') ? 'text-blue-400 hover:text-blue-300' : color.includes('pink') ? 'text-pink-400 hover:text-pink-300' : 'text-red-400 hover:text-red-300'} font-medium transition-colors`}>
          View all {platformName} posts →
        </button>
      </div>
    </div>
  );
}
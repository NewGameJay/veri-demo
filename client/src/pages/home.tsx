import { useState } from "react";
import { ArrowRight, Check, Star, User, BarChart3, Sparkles, ChevronRight, Twitter, Instagram, Youtube } from 'lucide-react';
import { Header } from "@/components/navigation/header";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { OnboardingModal } from "@/components/modals/onboarding-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { VeriLogo } from "@/components/ui/veri-logo";
import { Card } from "@/components/ui/card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";

export default function Home() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      setIsOnboardingOpen(true);
    } else {
      setAuthMode("signup");
      setIsAuthModalOpen(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-emerald-950/50">
      {/* Custom Header for Landing Page */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Left - Logo */}
          <div className="justify-self-start">
            <VeriLogo />
          </div>
          
          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#creators" className="text-white/70 hover:text-white transition-colors">For Creators</a>
            <a href="#brands" className="text-white/70 hover:text-white transition-colors">For Brands</a>
            <a href="#about" className="text-white/70 hover:text-white transition-colors">About</a>
          </nav>

          {/* Right - Auth Buttons */}
          <div className="justify-self-end flex items-center gap-4">
            <button 
              onClick={handleSignIn}
              className="text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <Button
              onClick={handleGetStarted}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>
      <DashboardSidebar
        isOpen={isDashboardOpen}
        isPinned={false}
        isCollapsed={isCollapsed}
        onClose={() => setIsDashboardOpen(false)}
        onPin={() => {}}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold text-white leading-tight mt-[16px] mb-[16px]"
          >
            Create to Resonate.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift">
              Impact to Earn.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Reach new audiences, drive genuine engagement and build your reputation. 
            Veri turns every post, clip and community moment into measurable traction.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 mb-12"
          >
            For Creators, Brands, and Communities.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              onClick={handleGetStarted}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2"
            >
              Sign Up Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <LiquidGlassButton
              variant="outline"
              size="lg"
              className="px-8 py-4"
            >
              Learn More
            </LiquidGlassButton>
          </motion.div>

          {/* Hero Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/70"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm">Active Creators</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">$2M+</div>
              <div className="text-sm">Creator Earnings</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm">Brand Partners</div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Why Creators Choose Veri Section */}
      <section className="py-24 px-8 pt-[55px] pb-[55px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Creators Choose Veri
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              We've built the most comprehensive platform for creator success, 
              combining authenticity verification with real earning opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                <Check className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Verified Authenticity
              </h3>
              <p className="text-white/70 leading-relaxed">
                Build trust with your audience through our comprehensive verification system. 
                Your VeriScore proves your authenticity to brands and followers alike.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                AI-Powered Growth
              </h3>
              <p className="text-white/70 leading-relaxed">
                Let our intelligent agents analyze your content, suggest improvements, 
                and help you create viral content that resonates with your audience.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Real Rewards
              </h3>
              <p className="text-white/70 leading-relaxed">
                Earn VeriPoints and real rewards for your content, engagement, and participation. 
                Turn your creativity into consistent income streams.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* Getting Started Section */}
      <section className="py-24 px-8 pt-[55px] pb-[55px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Getting started</h2>
            <p className="text-lg text-white/70 max-w-lg mx-auto">
              The simple path from connection to compelling content
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Steps */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Connect your social profiles</h3>
                  <p className="text-white/70">Veri pulls data automatically so you can start earning.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Complete content tasks</h3>
                  <p className="text-white/70">Veri partners with leading projects to offer reward-driven campaigns.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Get insights and analytics</h3>
                  <p className="text-white/70">Veri analyzes in-depth metrics to track impact and share insights.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Use your tailored AI agent</h3>
                  <p className="text-white/70">Veri trains AI agents to generate and optimize your content.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Earn XP and rewards</h3>
                  <p className="text-white/70">Veri calculates resonance to update scores and distribute rewards.</p>
                </div>
              </div>
            </div>

            {/* Right Column - VeriScore Card Preview */}
            <div className="flex justify-center">
              <Card className="bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border-white/20 p-8 w-80">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <VeriLogo size="lg" showText={false} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">VeriScore</h3>
                  <div className="text-6xl font-bold text-emerald-400 mb-4">99</div>
                  <p className="text-sm text-white/60 mb-6">Calculated Weekly Based on<br />VeriScore Analytics™</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">VeriPoints</h4>
                      <div className="text-3xl font-bold text-emerald-400">2500XP</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold text-white">8.7K</div>
                        <div className="text-xs text-white/60">Total Followers</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold text-white">12.5K</div>
                        <div className="text-xs text-white/60">Engagement</div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="text-lg font-bold text-white">Sam Huber</div>
                      <div className="text-sm text-emerald-400">Creator & Influencer</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Email Signup */}
          <div className="mt-16 max-w-lg mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400"
              />
              <Button
                onClick={handleGetStarted}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                Sign Up Now
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Trusted By Section */}
      <section className="py-24 px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by leading creators and top brands
            </h2>
            <p className="text-lg text-white/70">
              Join thousands of creators who've already transformed their content strategy
            </p>
          </div>

          {/* Brand Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center mb-16">
            {["Treasure", "avalanche", "polygon", "FIFA", "ARBITRUM", "ACTIVISION", "near", "X1"].map((brand, index) => (
              <div key={index} className="text-center">
                <div className="text-white/60 font-bold text-lg">{brand}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full" />
                <div>
                  <div className="font-bold text-white">Sarah Chen</div>
                  <div className="text-sm text-white/60">@sarahcreates</div>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                "Veri helped me increase my engagement by 200% and connected me with amazing brand partnerships. The AI suggestions are spot-on!"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-white/60 ml-2">VeriScore: 94</span>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-bold text-white">Marcus Rodriguez</div>
                  <div className="text-sm text-white/60">@marcusplays</div>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                "The verification system gave me instant credibility. Brands now reach out to me directly, and my earning potential has skyrocketed."
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-white/60 ml-2">VeriScore: 91</span>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-500 rounded-full" />
                <div>
                  <div className="font-bold text-white">Jessica Davis</div>
                  <div className="text-sm text-white/60">@jessicadaily</div>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                "From struggling to get noticed to landing 6-figure brand deals. Veri didn't just change my content - it changed my life."
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-white/60 ml-2">VeriScore: 96</span>
              </div>
            </Card>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Creator Journey?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join the platform that's redefining creator success. Build your authentic brand, 
            connect with premium opportunities, and earn what you're truly worth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Button>
            <LiquidGlassButton
              variant="outline"
              size="lg"
              className="px-8 py-4"
            >
              Watch Demo
            </LiquidGlassButton>
          </div>
          <p className="text-sm text-white/40 mt-8">
            No setup fees • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-8 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <VeriLogo className="mb-4" />
              <p className="text-sm text-white/60">The future of creator monetization and community building.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Agent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-white/60">© 2025 Veri. All rights reserved.</div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <MobileNav />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
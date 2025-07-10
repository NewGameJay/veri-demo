import { useState } from "react";
import { Users, Heart, Briefcase, Twitter, Instagram, Youtube } from "lucide-react";
import { Header } from "@/components/navigation/header";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { OnboardingModal } from "@/components/modals/onboarding-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { HeroSection } from "@/components/sections/hero-section";
import { GettingStarted } from "@/components/sections/getting-started";
import { DashboardPreviewShowcase } from "@/components/sections/dashboard-preview-showcase";
import { CreatorShowcase } from "@/components/sections/creator-showcase";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VeriLogo } from "@/components/ui/veri-logo";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
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

  const handleSignUp = () => {
    if (user) {
      setIsOnboardingOpen(true);
    } else {
      setAuthMode("signup");
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <Header
        onSignIn={handleSignIn}
      />
      
      <MobileNav 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
      
      <main className="pt-20 pb-24 lg:pb-8">
        <HeroSection onGetStarted={handleGetStarted} />
        <GettingStarted />
        
        {/* Who Veri is For Section */}
        <section className="py-20 px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">Who veri is for</h2>
              <p className="text-xl text-white/60">The future of the creator economy is here for everyone</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard hover className="p-8 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 veri-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Creators</h3>
                  <p className="text-white/60">Content creators, influencers, and social media personalities looking to monetize their audience.</p>
                </CardContent>
              </GlassCard>
              
              <GlassCard hover className="p-8 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 veri-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Communities</h3>
                  <p className="text-white/60">Online communities and groups wanting to reward engagement and build stronger connections.</p>
                </CardContent>
              </GlassCard>
              
              <GlassCard hover className="p-8 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 veri-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Brands</h3>
                  <p className="text-white/60">Brands and businesses looking to connect with authentic creators and communities.</p>
                </CardContent>
              </GlassCard>
            </div>
          </div>
        </section>
        
        <DashboardPreviewShowcase />
        <CreatorShowcase />
        
        {/* Partnerships Section */}
        <section className="py-20 px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">Partnerships</h2>
              <p className="text-xl text-white/60">We work with major brands and innovative companies</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {["Treasure", "Avalanche", "Polygon", "FIFA"].map((partner, index) => (
                <GlassCard key={index} hover className="p-6 flex items-center justify-center">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white/60 mb-2">{partner}</div>
                      <div className="text-xs text-white/40">
                        {index === 0 && "Gaming Platform"}
                        {index === 1 && "Blockchain"}
                        {index === 2 && "Web3 Infrastructure"}
                        {index === 3 && "Sports Gaming"}
                      </div>
                    </div>
                  </CardContent>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">Ready to start earning?</h2>
            <p className="text-xl text-white/60 mb-8">Join thousands of creators who are already building their brands and earning with Veri</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSignUp}
                className="px-8 py-4 veri-gradient rounded-xl font-semibold text-white hover-scale transition-all duration-200"
              >
                Sign Up Now
              </Button>
              <Button
                variant="outline"
                className="px-8 py-4 glass-effect rounded-xl font-semibold hover-scale transition-all duration-200 border-white/20 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 lg:px-6">
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

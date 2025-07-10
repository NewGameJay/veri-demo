import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Twitter, Instagram, Youtube, Trophy } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 via-transparent to-gray-800/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-termina font-bold mb-6 text-foreground">
              Create to Resonate.<br />
              <span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent font-termina">
                Impact to Earn.
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl font-inter">
              Build your audience, drive genuine engagement, and turn your influence into meaningful earnings. Join creators, brands, and communities.
            </p>
            <Button
              onClick={onGetStarted}
              className="px-8 py-4 veri-gradient rounded-xl font-semibold text-white hover-scale transition-all duration-200"
            >
              Get Started
            </Button>
          </div>

          {/* Hero Image/VeriScore Card Preview */}
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute inset-0 veri-gradient opacity-30 blur-3xl rounded-3xl"></div>
              <div className="relative glass-effect p-8 rounded-3xl border border-border">
                <div className="space-y-6">
                  {/* VeriScore Card Preview */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 veri-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <div className="text-2xl font-bold text-white">V</div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground font-termina mb-2">VeriScore</h3>
                    <div className="text-4xl font-bold text-foreground mb-1">95</div>
                    <div className="text-sm text-green-500 font-medium">Excellent Score • Top 5%</div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="glass-effect p-4 rounded-xl text-center border border-border">
                      <div className="text-xl font-bold text-green-500 mb-1">2,540</div>
                      <div className="text-xs text-muted-foreground">VeriPoints</div>
                    </div>
                    <div className="glass-effect p-4 rounded-xl text-center border border-border">
                      <div className="text-xl font-bold text-yellow-500 mb-1">#3</div>
                      <div className="text-xs text-muted-foreground">Global Rank</div>
                    </div>
                  </div>
                  
                  {/* Social Connections Preview */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Connected Platforms</h4>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-foreground">47.2K followers</div>
                        <div className="text-xs text-green-500">8.7% engagement</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 text-xs">+125 XP</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <Youtube className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-foreground">12.8K subscribers</div>
                        <div className="text-xs text-green-500">15.2% engagement</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 text-xs">+200 XP</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Twitter className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-foreground">23.1K followers</div>
                        <div className="text-xs text-green-500">12.4% engagement</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 text-xs">+150 XP</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full veri-gradient text-white font-semibold hover-scale transition-all duration-200">
                    <Trophy className="w-4 h-4 mr-2" />
                    Build Your VeriScore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
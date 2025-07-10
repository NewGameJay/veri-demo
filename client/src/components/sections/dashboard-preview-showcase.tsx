import { Trophy, Star, TrendingUp, Users, Brain, BarChart3, Target, Medal } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardPreviewShowcase() {
  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white font-termina">Your Creator Dashboard Preview</h2>
          <p className="text-xl text-white/60 font-inter">See what you'll unlock after connecting your social accounts</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* VeriScore Preview */}
          <GlassCard hover className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white font-termina">VeriScore Dashboard</h3>
                <Badge className="veri-gradient border-0 text-white">Live Data</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="veri-gradient-card p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-white mb-2">92</div>
                  <div className="text-sm text-white/80">VeriScore</div>
                </div>
                <div className="glass-effect p-4 rounded-xl text-center border border-white/20">
                  <div className="text-3xl font-bold text-green-400 mb-2">2,540</div>
                  <div className="text-sm text-white/80">XP Points</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Engagement Rate</span>
                  <span className="text-green-400 font-medium">8.7%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Follower Growth</span>
                  <span className="text-green-400 font-medium">+12.3%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Content Quality</span>
                  <span className="text-green-400 font-medium">Excellent</span>
                </div>
              </div>
            </CardContent>
          </GlassCard>
          
          {/* Leaderboard Preview */}
          <GlassCard hover className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white font-termina">Global Leaderboard</h3>
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Alex Chen", score: 98, badge: "🥇" },
                  { rank: 2, name: "Sarah Kim", score: 95, badge: "🥈" },
                  { rank: 3, name: "You", score: 92, badge: "🥉", highlight: true },
                  { rank: 4, name: "Mike Torres", score: 89, badge: "4" },
                  { rank: 5, name: "Emma Davis", score: 87, badge: "5" }
                ].map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      user.highlight 
                        ? 'veri-gradient-card border border-green-400/30' 
                        : 'glass-effect border border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {user.badge}
                      </div>
                      <span className={`font-medium ${user.highlight ? 'text-green-300' : 'text-white'}`}>
                        {user.name}
                      </span>
                    </div>
                    <div className={`font-bold ${user.highlight ? 'text-green-300' : 'text-white/80'}`}>
                      {user.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Builder Preview */}
          <GlassCard hover className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 veri-gradient rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white font-termina">Profile Builder</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-white/80">Auto-generated bio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-white/80">Social media sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-white/80">Content highlights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-white/80">Brand partnerships</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Star className="w-4 h-4 mr-2" />
                Build Profile
              </Button>
            </CardContent>
          </GlassCard>
          
          {/* AI Agent Preview */}
          <GlassCard hover className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 veri-gradient rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white font-termina">AI Agent</h3>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  🔒 10 Day Streak
                </Badge>
              </div>
              
              <div className="glass-effect p-3 rounded-lg border border-purple-400/30 mb-4">
                <div className="text-sm text-purple-300 mb-2">Latest Insight:</div>
                <div className="text-xs text-white/80">
                  "Your engagement peaks at 2pm on Tuesdays. Consider posting your best content then for maximum reach."
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Content Optimization</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Revenue Insights</span>
                  <BarChart3 className="w-4 h-4 text-green-400" />
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-purple-400/30 text-purple-300 hover:bg-purple-500/10" disabled>
                <Target className="w-4 h-4 mr-2" />
                Unlock at 10 Day Streak
              </Button>
            </CardContent>
          </GlassCard>
          
          {/* Creator Analytics Preview */}
          <GlassCard hover className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 veri-gradient rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white font-termina">Analytics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">47.2K</div>
                  <div className="text-xs text-white/60">Total Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">+23%</div>
                  <div className="text-xs text-white/60">Growth</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Top Platform</span>
                  <span className="text-white font-medium">Instagram</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Best Content</span>
                  <span className="text-white font-medium">Video Posts</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Medal className="w-4 h-4 mr-2" />
                View Full Analytics
              </Button>
            </CardContent>
          </GlassCard>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-white/60 mb-6 font-inter">
            Connect your social accounts to unlock your personalized creator dashboard
          </p>
          <Button className="px-8 py-4 veri-gradient rounded-xl font-semibold text-white hover-scale transition-all duration-200">
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}
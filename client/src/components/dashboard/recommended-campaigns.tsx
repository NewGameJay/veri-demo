import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Calendar, Users, DollarSign, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";

interface RecommendedCampaignsProps {
  userStreak: number;
  userXP: number;
  onViewAllCampaigns?: () => void;
}

export function RecommendedCampaigns({ userStreak, userXP, onViewAllCampaigns }: RecommendedCampaignsProps) {
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  
  // Check if user is Veri+ Creator (3+ day streak)
  const isVeriPlusCreator = userStreak >= 3;
  
  // Curated recommended campaigns
  const recommendedCampaigns = [
    {
      id: 1,
      title: "Hyve Gaming Showcase",
      brand: "Hyve",
      brandLogo: "🔥",
      budget: 2500,
      creators: 5,
      deadline: "2 days",
      featured: true,
      description: "Quick gaming highlight reel featuring Hyve platform games",
      requirements: ["10K+ followers", "Gaming content"],
      deliverables: ["1 YouTube Short", "Twitter thread"],
      image: "bg-gradient-to-br from-orange-500 to-red-600",
      urgent: true,
      type: "Quick Win"
    },
    {
      id: 2,
      title: "Luster Labs Content",
      brand: "Luster Labs",
      brandLogo: "⚡",
      budget: 1800,
      creators: 8,
      deadline: "4 days",
      featured: false,
      description: "Create engaging content around blockchain gaming trends",
      requirements: ["5K+ followers", "Web3 interest"],
      deliverables: ["TikTok video", "Instagram post"],
      image: "bg-gradient-to-br from-purple-500 to-blue-600",
      urgent: false,
      type: "Trending"
    },
    {
      id: 3,
      title: "Veri Platform Demo",
      brand: "Veri",
      brandLogo: "💎",
      budget: 1200,
      creators: 12,
      deadline: "1 week",
      featured: true,
      description: "Show how creators use Veri to optimize their content strategy",
      requirements: ["Active creator", "Platform experience"],
      deliverables: ["Tutorial video", "Twitter review"],
      image: "bg-gradient-to-br from-emerald-500 to-teal-600",
      urgent: false,
      type: "Platform"
    }
  ];

  const handleApply = (campaignId: number) => {
    triggerHaptic("success");
    console.log(`Applying to campaign ${campaignId}`);
    // Here you would handle the application logic
  };

  const toggleExpanded = (campaignId: number) => {
    triggerHaptic("light");
    setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId);
  };

  return (
    <Card className="glass-effect border-white/20 bg-[#1b1d27]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Veri Recommended
          </CardTitle>
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-xs">
            {recommendedCampaigns.length} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendedCampaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Card 
              className={`glass-subtle border-white/10 bg-white/5 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${
                expandedCampaign === campaign.id ? 'border-emerald-500/40' : ''
              }`}
              onClick={() => toggleExpanded(campaign.id)}
            >
              <CardContent className="p-3 space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{campaign.brandLogo}</span>
                      <h4 className="text-sm font-semibold text-white truncate">
                        {campaign.title}
                      </h4>
                      {campaign.featured && (
                        <Star className="h-3 w-3 text-yellow-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Type Badge */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs border-0 ${
                        campaign.type === 'Quick Win' ? 'bg-green-500/20 text-green-400' :
                        campaign.type === 'Trending' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {campaign.type}
                    </Badge>
                  </div>
                  
                  {/* Urgent Badge */}
                  {campaign.urgent && (
                    <Badge className="bg-red-500/20 text-red-400 text-xs border-red-500/30 animate-pulse">
                      <Zap className="h-2 w-2 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${campaign.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{campaign.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{campaign.creators}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedCampaign === campaign.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-2 border-t border-white/10"
                  >
                    <p className="text-xs text-white/70 leading-relaxed">
                      {campaign.description}
                    </p>
                    
                    {/* Requirements */}
                    <div className="flex flex-wrap gap-1">
                      {campaign.requirements.map((req, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs bg-white/5 border-white/20 text-white/60"
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>

                    {/* Apply Button */}
                    <Button
                      size="sm"
                      className={`w-full transition-all duration-300 ${
                        isVeriPlusCreator
                          ? 'veri-gradient hover:shadow-lg hover:shadow-emerald-500/25 text-white font-medium'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!isVeriPlusCreator}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isVeriPlusCreator) {
                          handleApply(campaign.id);
                        }
                      }}
                    >
                      {!isVeriPlusCreator ? (
                        <>
                          <Lock className="h-3 w-3 mr-2" />
                          3-Day Streak Required
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {/* View All Button */}
        <Button 
          variant="outline"
          className="w-full mt-3 glass-subtle border-white/20 text-white hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300"
          onClick={() => {
            triggerHaptic("light");
            onViewAllCampaigns?.();
          }}
        >
          View All Campaigns
        </Button>
      </CardContent>
    </Card>
  );
}
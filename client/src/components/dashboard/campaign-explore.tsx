import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, Calendar, Users, DollarSign, Gamepad2, Monitor, Headphones, Trophy, Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptic";

interface CampaignExploreProps {
  userStreak: number;
  userXP: number;
}

export function CampaignExplore({ userStreak, userXP }: CampaignExploreProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");

  // Check if user is Veri+ Creator (3+ day streak)
  const isVeriPlusCreator = userStreak >= 3;

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all selected tags
  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Sample campaigns based on web3/blockchain gaming niche
  const campaigns = [
    {
      id: 1,
      title: "Hyve Genesis NFT Collection Launch",
      brand: "Hyve",
      brandLogo: "🔥",
      budget: 15000,
      creators: 8,
      category: "nft",
      deadline: "3 days",
      featured: true,
      description: "Create engaging content around our new Genesis NFT collection featuring rare cross-chain gaming assets",
      requirements: ["25K+ followers", "Gaming niche", "Previous Web3 content"],
      deliverables: ["1 Twitter thread", "1 YouTube review", "3 Instagram stories"],
      image: "bg-gradient-to-br from-orange-500 to-red-600",
      urgent: true
    },
    {
      id: 2,
      title: "Luster Labs Alpha Game Testing",
      brand: "Luster Labs",
      brandLogo: "⚡",
      budget: 12500,
      creators: 15,
      category: "gaming",
      deadline: "1 week",
      featured: true,
      description: "Test and showcase our upcoming blockchain-based strategy game with exclusive alpha access",
      requirements: ["10K+ followers", "Strategy gaming content", "Live streaming capability"],
      deliverables: ["3 hour stream", "Twitter review thread", "TikTok highlights"],
      image: "bg-gradient-to-br from-purple-500 to-blue-600",
      urgent: false
    },
    {
      id: 3,
      title: "BitByte Wallet Integration Showcase",
      brand: "BitByte",
      brandLogo: "₿",
      budget: 8000,
      creators: 12,
      category: "defi",
      deadline: "5 days",
      featured: false,
      description: "Demonstrate seamless Web3 wallet integration for gaming transactions",
      requirements: ["15K+ followers", "DeFi knowledge", "Tutorial creation"],
      deliverables: ["Tutorial video", "Twitter walkthrough", "Discord AMA"],
      image: "bg-gradient-to-br from-green-500 to-teal-600",
      urgent: false
    },
    {
      id: 4,
      title: "Polygon Gaming Ecosystem Deep Dive",
      brand: "Polygon Studios",
      brandLogo: "🔷",
      budget: 20000,
      creators: 6,
      category: "blockchain",
      deadline: "2 weeks",
      featured: true,
      description: "Comprehensive coverage of Polygon's gaming ecosystem and upcoming partnerships",
      requirements: ["50K+ followers", "Blockchain expertise", "Long-form content"],
      deliverables: ["30min documentary", "Research article", "Podcast appearance"],
      image: "bg-gradient-to-br from-indigo-500 to-purple-600",
      urgent: false
    },
    {
      id: 5,
      title: "Solana Gaming Tournament Coverage",
      brand: "Solana Foundation",
      brandLogo: "◎",
      budget: 18000,
      creators: 10,
      category: "esports",
      deadline: "4 days",
      featured: false,
      description: "Live coverage and highlights from the Solana Gaming Championship",
      requirements: ["Esports experience", "Live streaming", "20K+ followers"],
      deliverables: ["Live tournament stream", "Highlight reels", "Interview content"],
      image: "bg-gradient-to-br from-yellow-500 to-orange-600",
      urgent: true
    },
    {
      id: 6,
      title: "Immutable X Gaming Marketplace Review",
      brand: "Immutable",
      brandLogo: "🛡️",
      budget: 10000,
      creators: 8,
      category: "marketplace",
      deadline: "1 week",
      featured: false,
      description: "In-depth review of the Immutable X gaming marketplace and trading features",
      requirements: ["NFT trading experience", "25K+ followers", "Video content"],
      deliverables: ["Marketplace walkthrough", "Trading tutorial", "Community post"],
      image: "bg-gradient-to-br from-cyan-500 to-blue-600",
      urgent: false
    }
  ];

  // Filter campaigns - show all if no tags selected, otherwise match ANY selected tag
  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedTags.length === 0) return true;
    return selectedTags.includes(campaign.category);
  });

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === "popular") return b.creators - a.creators;
    if (sortBy === "budget") return b.budget - a.budget;
    if (sortBy === "deadline") return a.deadline.localeCompare(b.deadline);
    return 0;
  });

  // Top paying brands
  const topBrands = [
    { name: "Polygon Studios", range: "$15K - $25K", logo: "🔷", verified: true },
    { name: "Solana Foundation", range: "$12K - $20K", logo: "◎", verified: true },
    { name: "Hyve", range: "$8K - $15K", logo: "🔥", verified: true },
    { name: "Luster Labs", range: "$10K - $18K", logo: "⚡", verified: true },
    { name: "Immutable", range: "$6K - $12K", logo: "🛡️", verified: true },
    { name: "BitByte", range: "$5K - $10K", logo: "₿", verified: true }
  ];

  const handleCampaignClick = (campaign: any) => {
    triggerHaptic("light");
    if (!isVeriPlusCreator) {
      // Show locked message for non-Veri+ creators
      return;
    }
    // Handle campaign application
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Explore Campaigns</h2>
          <p className="text-white/70">
            {isVeriPlusCreator 
              ? "Discover high-paying brand collaborations in Web3 gaming"
              : `Complete ${3 - userStreak} more daily tasks to unlock campaigns`
            }
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          {/* Multi-Select Tag Filter Buttons */}
          <div className="flex gap-2 flex-wrap items-center">
            {["nft", "gaming", "defi", "blockchain", "esports", "marketplace"].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/25" 
                    : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30"
                }`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
            
            {/* Clear All Button - only show when tags are selected */}
            {selectedTags.length > 0 && (
              <button
                onClick={clearAllTags}
                className="px-3 py-1 text-xs rounded-lg transition-all duration-300 bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:text-red-200 hover:border-red-400/50"
              >
                Clear All
              </button>
            )}
          </div>
          
          {/* Sort Filter Buttons */}
          <div className="flex gap-2">
            {["popular", "budget", "deadline"].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                  sortBy === sort 
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" 
                    : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white"
                }`}
              >
                {sort === "popular" ? "Most Popular" : sort === "budget" ? "Highest Budget" : "Deadline"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Veri+ Status Banner */}
      {!isVeriPlusCreator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-subtle p-4 rounded-lg border border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-yellow-400/20">
                <Lock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Unlock Veri+ Creator Status</h3>
                <p className="text-white/70 text-sm">
                  Complete a 3-day task streak to access high-paying campaigns ({userStreak}/3 days completed)
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
              {userStreak}/3 Days
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCampaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <Card 
              className={`glass-subtle border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden ${
                !isVeriPlusCreator ? 'opacity-70' : 'hover:shadow-lg hover:shadow-purple-500/10'
              }`}
              onClick={() => handleCampaignClick(campaign)}
            >
              {/* Campaign Image Header */}
              <div className={`h-32 relative ${campaign.image} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Urgent Badge */}
                {campaign.urgent && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500/90 text-white text-xs animate-pulse">
                      URGENT
                    </Badge>
                  </div>
                )}
                
                {/* Featured Badge */}
                {campaign.featured && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                )}
                
                {/* Lock Overlay */}
                {!isVeriPlusCreator && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white/60" />
                  </div>
                )}
                
                {/* Budget Badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-green-500/90 text-white text-sm font-semibold">
                    ${campaign.budget.toLocaleString()}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{campaign.brandLogo}</span>
                    <span className="font-semibold text-white text-sm">{campaign.brand}</span>
                    <CheckCircle className="h-3 w-3 text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {campaign.creators} creators
                  </Badge>
                </div>
                
                {/* Campaign Title */}
                <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-green-300 transition-colors">
                  {campaign.title}
                </h3>
                
                {/* Description */}
                <p className="text-white/60 text-xs line-clamp-2">
                  {campaign.description}
                </p>
                
                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{campaign.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{campaign.creators} participating</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button
                  size="sm"
                  className={`w-full transition-all duration-300 ${
                    isVeriPlusCreator
                      ? 'veri-gradient hover:shadow-lg hover:shadow-green-500/25'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isVeriPlusCreator}
                >
                  {isVeriPlusCreator ? 'Apply Now' : 'Locked - Complete Streak'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top Paying Brands Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">Top Paying Brands</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topBrands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-subtle p-4 rounded-lg border border-white/10 text-center hover:border-white/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-2xl mb-2">{brand.logo}</div>
              <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-green-300 transition-colors">
                {brand.name}
              </h4>
              <p className="text-white/60 text-xs">{brand.range}</p>
              {brand.verified && (
                <div className="flex justify-center mt-2">
                  <CheckCircle className="h-3 w-3 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
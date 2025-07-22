import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, TrendingUp, Star, Search, ChevronDown, Users, MapPin, Filter, Loader2, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Header } from "@/components/navigation/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface LeaderboardUser {
  id: number;
  rank: number;
  name: string;
  username: string;
  score: number;
  change: string;
  avatar: string;
  tier: string;
  country: string;
  category: string;
}

interface LeaderboardResponse {
  users: LeaderboardUser[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  totalUsers: number;
}

interface UserPositionResponse {
  user: LeaderboardUser;
  totalUsers: number;
}

export default function Leaderboard() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState("global");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [jumpToRank, setJumpToRank] = useState("");
  const [sortOrder, setSortOrder] = useState<"highest" | "lowest">("highest");
  
  const { user } = useAuth();

  const categories = [
    { id: "global", label: "Global", icon: Trophy },
    { id: "gaming", label: "Gaming", icon: Crown },
    { id: "lifestyle", label: "Lifestyle", icon: Star },
    { id: "tech", label: "Tech", icon: TrendingUp },
  ];

  // Determine limit based on page: 10 for first page, 50 for second, 100+ after
  const getLimit = (page: number) => {
    if (page === 1) return 10;
    if (page === 2) return 50;
    return 100;
  };

  // Fetch leaderboard data with pagination and filters
  const { data: leaderboardData, isLoading, refetch } = useQuery<LeaderboardResponse>({
    queryKey: ['/api/leaderboard', currentPage, activeCategory, tierFilter, searchTerm, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: getLimit(currentPage).toString(),
        sort: sortOrder,
      });
      
      if (activeCategory !== "global") params.append('category', activeCategory);
      if (tierFilter && tierFilter !== "all") params.append('tier', tierFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/leaderboard?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user's position in leaderboard
  const { data: userPosition } = useQuery<UserPositionResponse>({
    queryKey: ['/api/leaderboard/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard/user/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch user position');
      return response.json();
    },
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, tierFilter, searchTerm, sortOrder]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        refetch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Diamond": return "bg-blue-500/20 text-blue-400 border-blue-400/20";
      case "Platinum": return "bg-purple-500/20 text-purple-400 border-purple-400/20";
      case "Gold": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/20";
      case "Silver": return "bg-gray-500/20 text-gray-400 border-gray-400/20";
      case "Bronze": return "bg-orange-500/20 text-orange-400 border-orange-400/20";
      default: return "bg-gray-500/20 text-gray-400 border-gray-400/20";
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500 text-black";
      case 2: return "bg-gray-400 text-black";
      case 3: return "bg-orange-600 text-white";
      default: return "bg-white/10 text-white";
    }
  };

  const getCountryFlag = (countryCode: string) => {
    // Simplified country flag mapping
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'CA': '🇨🇦', 'UK': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'JP': '🇯🇵', 'KR': '🇰🇷', 'AU': '🇦🇺', 'BR': '🇧🇷', 'MX': '🇲🇽'
    };
    return flags[countryCode] || '🌍';
  };

  const handleJumpToRank = () => {
    const rank = parseInt(jumpToRank);
    if (rank > 0) {
      const page = Math.ceil(rank / 100);
      setCurrentPage(page);
      setJumpToRank("");
    }
  };

  const handleLoadMore = () => {
    if (leaderboardData?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getLoadMoreText = () => {
    if (currentPage === 1) return "View Top 50";
    if (currentPage === 2) return "View Top 100";
    return "Load More Rankings";
  };

  return (
    <div className="min-h-screen bg-gray-900 hero-gradient text-white">
      <Header
        onDashboardToggle={() => setIsDashboardOpen(!isDashboardOpen)}
        onMobileMenuToggle={() => setIsDashboardOpen(!isDashboardOpen)}
      />
      <DashboardSidebar
        isOpen={isDashboardOpen}
        isPinned={true}
        isCollapsed={isCollapsed}
        onClose={() => setIsDashboardOpen(false)}
        onPin={() => {}}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <main className={`pt-20 transition-all duration-300 ${isDashboardOpen ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-80') : ''}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                Global Leaderboard
              </h1>
              <p className="text-white/60 mt-2">
                {leaderboardData?.totalUsers ? 
                  `Showing ${currentPage === 1 ? 'Top 10' : currentPage === 2 ? 'Top 50' : `Top ${getLimit(currentPage)}`} of ${leaderboardData.totalUsers.toLocaleString()} creators worldwide` :
                  "Loading global rankings..."
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "highest" ? "lowest" : "highest")}
                className="border-white/20 text-white hover:bg-white/10"
                title={`Currently showing ${sortOrder === "highest" ? "highest to lowest" : "lowest to highest"} rankings`}
              >
                {sortOrder === "highest" ? (
                  <ArrowDown className="w-4 h-4 mr-2" />
                ) : (
                  <ArrowUp className="w-4 h-4 mr-2" />
                )}
                {sortOrder === "highest" ? "High→Low" : "Low→High"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* User Position Banner */}
          {userPosition && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="glass-medium border-emerald-500/30 bg-emerald-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 font-bold">{userPosition.user.avatar}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Your Position</div>
                        <div className="text-emerald-400 text-sm">
                          Ranked #{userPosition.user.rank.toLocaleString()} of {userPosition.totalUsers.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{userPosition.user.score} XP</div>
                      <Badge className={getTierColor(userPosition.user.tier)}>
                        {userPosition.user.tier}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card className="glass-subtle border-white/10 bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      {/* Tier Filter */}
                      <Select value={tierFilter} onValueChange={setTierFilter}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="All Tiers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tiers</SelectItem>
                          <SelectItem value="Diamond">Diamond</SelectItem>
                          <SelectItem value="Platinum">Platinum</SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Jump to Rank */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Jump to rank..."
                          value={jumpToRank}
                          onChange={(e) => setJumpToRank(e.target.value)}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                          type="number"
                        />
                        <Button
                          onClick={handleJumpToRank}
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Reset */}
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setTierFilter("all");
                          setJumpToRank("");
                          setSortOrder("highest");
                          setCurrentPage(1);
                        }}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Reset All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto" role="tablist" aria-label="Leaderboard categories">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className={activeCategory === category.id ? "veri-gradient text-white" : "border-white/20 text-white"}
                  role="tab"
                  aria-selected={activeCategory === category.id}
                  aria-controls={`${category.id}-leaderboard`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-white/60" />
              <span className="ml-3 text-white/60">Loading global leaderboard...</span>
            </div>
          )}

          {/* Leaderboard Data */}
          {!isLoading && leaderboardData && (
            <>
              {/* Top 3 Showcase */}
              {leaderboardData.users.slice(0, 3).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {leaderboardData.users.slice(0, 3).map((user, index) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`glass-subtle border-white/10 bg-gray-800/50 relative overflow-hidden ${index === 0 ? 'md:scale-105' : ''}`}>
                        <div className="absolute top-0 right-0 p-4">
                          {index === 0 && <Crown className="w-8 h-8 text-yellow-400" />}
                          {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
                          {index === 2 && <Medal className="w-6 h-6 text-orange-600" />}
                        </div>
                        <CardContent className="p-6 text-center">
                          <div className={`w-20 h-20 ${getRankColor(user.rank)} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                            {user.avatar}
                          </div>
                          <h3 className="text-lg font-bold text-white">{user.name}</h3>
                          <p className="text-sm text-white/60 mb-2">{user.username}</p>
                          <div className="text-3xl font-bold text-emerald-400 mb-2">{user.score}</div>
                          <Badge className={getTierColor(user.tier)}>{user.tier}</Badge>
                          <div className={`text-sm mt-2 flex items-center justify-center gap-1 ${user.change.startsWith('+') ? 'text-green-400' : user.change.startsWith('-') ? 'text-red-400' : 'text-white/60'}`}>
                            <span>{getCountryFlag(user.country)}</span>
                            <span>{user.change}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Full Leaderboard Table */}
              <Card className="glass-subtle border-white/10 bg-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Full Rankings
                    </CardTitle>
                    <div className="text-sm text-white/60">
                      Page {leaderboardData.currentPage} of {leaderboardData.totalPages}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboardData.users.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${getRankColor(user.rank)} rounded-full flex items-center justify-center font-bold text-sm`}>
                            {user.rank}
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white">{user.name}</p>
                              <span className="text-lg">{getCountryFlag(user.country)}</span>
                            </div>
                            <p className="text-sm text-white/60">{user.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-white font-bold">{user.score.toLocaleString()}</div>
                            <div className={`text-sm ${user.change.startsWith('+') ? 'text-green-400' : user.change.startsWith('-') ? 'text-red-400' : 'text-white/60'}`}>
                              {user.change}
                            </div>
                          </div>
                          <Badge className={getTierColor(user.tier)}>
                            {user.tier}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {leaderboardData.hasMore && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        {getLoadMoreText()}
                      </Button>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{leaderboardData.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-white/60">Total Creators</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">
                        {leaderboardData.users.filter(u => u.tier === "Diamond").length}
                      </div>
                      <div className="text-sm text-white/60">Diamond Tier</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {leaderboardData.users.filter(u => u.tier === "Platinum").length}
                      </div>
                      <div className="text-sm text-white/60">Platinum Tier</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {leaderboardData.users.filter(u => u.tier === "Gold").length}
                      </div>
                      <div className="text-sm text-white/60">Gold Tier</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
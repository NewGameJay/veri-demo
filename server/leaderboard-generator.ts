/**
 * Global Leaderboard Data Generator
 * Generates realistic leaderboard data for thousands of users with proper score distribution
 */

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

// Gaming-focused usernames and names
const gamingNames = [
  "Alex Chen", "Sarah Mitchell", "Mike Rodriguez", "Emma Thompson", "David Kim",
  "Jessica Wong", "Ryan O'Connor", "Maya Patel", "Lucas Silva", "Zoe Williams",
  "Nathan Brown", "Chloe Davis", "Ethan Martinez", "Aria Johnson", "Oliver Lee",
  "Isabella Garcia", "Liam Wilson", "Sophia Anderson", "Noah Jackson", "Ava Taylor",
  "Mason Thompson", "Mia Robinson", "Logan Clark", "Charlotte Lewis", "Jacob Young",
  "Amelia Walker", "William Hall", "Harper Allen", "James King", "Evelyn Wright",
  "Benjamin Lopez", "Abigail Hill", "Samuel Green", "Emily Adams", "Daniel Baker",
  "Madison Gonzalez", "Matthew Nelson", "Elizabeth Carter", "Joseph Mitchell", "Sofia Perez",
  "Anthony Roberts", "Camila Turner", "Mark Phillips", "Layla Campbell", "Andrew Parker",
  "Grace Evans", "Joshua Edwards", "Victoria Collins", "Christopher Stewart", "Penelope Morris"
];

const gamingUsernames = [
  "ProGamer", "PixelMaster", "GameChanger", "ElitePlayer", "RankUpKing", "VictoryQueen",
  "SkillShot", "GameOn", "PowerPlay", "WinStreak", "TopTier", "GameTime", "PlayHard",
  "GameFace", "Victory", "Champion", "Legend", "Master", "Pro", "Elite", "Ace", "Hero",
  "Warrior", "Knight", "Ninja", "Samurai", "Dragon", "Phoenix", "Thunder", "Lightning",
  "Storm", "Blaze", "Frost", "Shadow", "Ghost", "Phantom", "Stealth", "Sniper", "Hunter",
  "Assassin", "Rogue", "Mage", "Wizard", "Sorcerer", "Paladin", "Guardian", "Defender",
  "Crusher", "Destroyer", "Annihilator", "Dominator", "Conqueror", "Overlord"
];

const countries = [
  "US", "CA", "UK", "DE", "FR", "JP", "KR", "AU", "BR", "MX", "IN", "CN", "RU", "IT", "ES",
  "NL", "SE", "NO", "DK", "FI", "PL", "CZ", "HU", "RO", "BG", "GR", "PT", "IE", "AT", "CH",
  "BE", "LU", "SK", "SI", "HR", "EE", "LV", "LT", "MT", "CY", "TH", "VN", "PH", "MY", "SG",
  "ID", "TW", "HK", "NZ", "ZA", "AR", "CL", "CO", "PE", "UY", "VE", "EC", "BO", "PY", "SR"
];

const categories = ["global", "gaming", "lifestyle", "tech"];

/**
 * Generate a realistic score using exponential decay distribution
 * Top players have much higher scores, with natural drop-off
 */
function generateScore(rank: number): number {
  const maxScore = 3000;
  const decayFactor = 0.00035;
  
  // Exponential decay formula: score = maxScore * e^(-decayFactor * rank)
  const baseScore = maxScore * Math.exp(-decayFactor * rank);
  
  // Add some randomness (±5%)
  const variance = baseScore * 0.05;
  const randomScore = baseScore + (Math.random() - 0.5) * variance;
  
  // Ensure minimum score of 100
  return Math.max(100, Math.floor(randomScore));
}

/**
 * Determine tier based on score thresholds
 */
function getTier(score: number): string {
  if (score >= 2500) return "Diamond";
  if (score >= 1800) return "Platinum";
  if (score >= 1200) return "Gold";
  if (score >= 600) return "Silver";
  return "Bronze";
}

/**
 * Generate realistic rank change (daily movement)
 */
function generateRankChange(): string {
  const movement = Math.floor(Math.random() * 30) - 15; // -15 to +15
  if (movement > 0) return `+${movement}`;
  if (movement < 0) return `${movement}`;
  return "—";
}

/**
 * Generate a comprehensive leaderboard with thousands of users
 */
export function generateGlobalLeaderboard(count: number = 10000): LeaderboardUser[] {
  const users: LeaderboardUser[] = [];
  
  for (let i = 1; i <= count; i++) {
    const nameIndex = Math.floor(Math.random() * gamingNames.length);
    const usernameIndex = Math.floor(Math.random() * gamingUsernames.length);
    const countryIndex = Math.floor(Math.random() * countries.length);
    const categoryIndex = Math.floor(Math.random() * categories.length);
    
    const name = gamingNames[nameIndex];
    const baseUsername = gamingUsernames[usernameIndex];
    const username = `@${baseUsername}${Math.floor(Math.random() * 999) + 1}`;
    const score = generateScore(i);
    const tier = getTier(score);
    const country = countries[countryIndex];
    const category = categories[categoryIndex];
    
    // Generate avatar initials
    const nameParts = name.split(' ');
    const avatar = nameParts.map(part => part[0]).join('').toUpperCase();
    
    users.push({
      id: i,
      rank: i,
      name,
      username,
      score,
      change: generateRankChange(),
      avatar,
      tier,
      country,
      category
    });
  }
  
  return users;
}

/**
 * Find a user's position in the leaderboard
 */
export function findUserPosition(users: LeaderboardUser[], searchUsername: string): LeaderboardUser | null {
  return users.find(user => 
    user.username.toLowerCase().includes(searchUsername.toLowerCase()) ||
    user.name.toLowerCase().includes(searchUsername.toLowerCase())
  ) || null;
}

/**
 * Filter users by criteria
 */
export function filterUsers(
  users: LeaderboardUser[],
  filters: {
    category?: string;
    tier?: string;
    country?: string;
    search?: string;
  }
): LeaderboardUser[] {
  let filtered = users;
  
  if (filters.category && filters.category !== "global") {
    filtered = filtered.filter(user => user.category === filters.category);
  }
  
  if (filters.tier) {
    filtered = filtered.filter(user => user.tier === filters.tier);
  }
  
  if (filters.country) {
    filtered = filtered.filter(user => user.country === filters.country);
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm)
    );
  }
  
  return filtered;
}

/**
 * Paginate leaderboard results
 */
export function paginateUsers(
  users: LeaderboardUser[],
  page: number = 1,
  limit: number = 100
): {
  users: LeaderboardUser[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  totalUsers: number;
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / limit);
  
  return {
    users: paginatedUsers,
    totalPages,
    currentPage: page,
    hasMore: page < totalPages,
    totalUsers: users.length
  };
}

// Generate and cache the global leaderboard data
let cachedLeaderboard: LeaderboardUser[] | null = null;

export function getCachedLeaderboard(): LeaderboardUser[] {
  if (!cachedLeaderboard) {
    console.log("Generating global leaderboard with 10,000 users...");
    cachedLeaderboard = generateGlobalLeaderboard(10000);
    console.log("Global leaderboard generated successfully");
  }
  return cachedLeaderboard;
}

export function refreshLeaderboardCache(): void {
  cachedLeaderboard = null;
  getCachedLeaderboard();
}
/**
 * Script to create sample campaigns based on real creator brief formats
 * Inspired by the Hyve Creator Brief structure
 */

import { db } from '../server/db.ts';
import { campaigns } from '../shared/schema.ts';

const sampleCampaigns = [
  {
    userId: 12, // Brand account user ID
    title: "🚀 Hyve BitByte Launch - Creator Partnership Program",
    description: "Join Hyve's exclusive creator program for the BitByte launch on February 26th. Drive your audience to the revolutionary gaming platform with cross-chain compatibility and seamless onboarding. Monthly partnership: $2,000 for 3 months.",
    budget: 600000, // $6,000 total (3 months x $2,000)
    rewardPerAction: 200000, // $2,000 per month
    status: "active",
    campaignType: "content_creation",
    targetAudience: "Web3 gaming creators with 10K+ followers",
    requirements: JSON.stringify({
      minFollowers: 10000,
      platforms: ["Twitter", "Twitch", "YouTube"],
      urgency: "Applications close in 7 days",
      deliverables: {
        weekly: [
          "1 Educational thread about Hyve ecosystem features",
          "1 Live stream with BitByte gameplay walkthrough", 
          "1 VOD with your unique creator referral code",
          "1 Announcement post driving sign-ups"
        ],
        monthly: [
          "Community game night hosting",
          "Social media giveaway with XP boosts",
          "Platform feature breakdown and tips"
        ]
      },
      contentExamples: [
        "Educational Thread: 'The Hyve ecosystem lets you play across platforms without limits – no app stores, no fees and no walled gardens. Here's how BitByte is changing Web3 gaming... [thread]'",
        "Stream Title: 'BitByte First Look - Fast & Furious 10-Player Battles + Weekly Prize Pools!'",
        "VOD Example: 'Why Hyve is the Future of Blockchain Gaming - My Creator Code Inside'"
      ],
      duration: "3 months",
      testPeriod: "Month 1 evaluation before continuation"
    }),
    platforms: JSON.stringify(["Twitter", "Twitch", "YouTube"]),
    tags: JSON.stringify(["web3", "blockchain", "gaming", "hyve", "bitbyte"]),
    startDate: new Date("2025-02-24"),
    endDate: new Date("2025-05-24"),
    maxParticipants: 5,
    currentParticipants: 0,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "⏰ Luster Labs - Web3 Gaming Alpha Access (ENDING SOON)",
    description: "EXPIRES IN 2 DAYS! Partner with Luster Labs to showcase their cutting-edge Web3 gaming platform. Early access to alpha builds, exclusive NFT rewards, and creator revenue sharing program.",
    budget: 250000, // $2,500 total
    rewardPerAction: 83333, // ~$833 per creator
    status: "active", 
    campaignType: "review",
    targetAudience: "Web3 gaming creators and blockchain enthusiasts",
    requirements: JSON.stringify({
      minFollowers: 5000,
      platforms: ["Twitter", "YouTube", "Twitch"],
      urgency: "URGENT - Applications close in 2 days",
      deliverables: [
        "1 Alpha gameplay video (10+ minutes)",
        "3 Twitter threads about Web3 gaming innovation",
        "1 Live stream featuring alpha gameplay",
        "Community AMA session about the platform",
        "Honest review and feedback to development team"
      ],
      contentExamples: [
        "Thread Example: 'Just got access to @LusterLabs alpha and wow... This is what Web3 gaming should be. True asset ownership, cross-game compatibility, and actual FUN gameplay. Thread on what makes this different 🧵'",
        "Video Title: 'Luster Labs Alpha Review - The Future of Blockchain Gaming is HERE'",
        "Stream Title: 'EXCLUSIVE: Luster Labs Alpha Gameplay - Web3 Gaming Done Right'"
      ],
      requirements: [
        "Experience with Web3 gaming platforms",
        "Active engagement with blockchain gaming community",
        "Professional video editing and streaming setup",
        "Willingness to provide constructive feedback"
      ]
    }),
    platforms: JSON.stringify(["Twitter", "YouTube", "Twitch"]),
    tags: JSON.stringify(["web3", "blockchain", "gaming", "alpha", "luster-labs"]),
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-01-17"), // Ending soon
    maxParticipants: 3,
    currentParticipants: 1,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "🎮 Hyve Guild Tournament Series - Creator Sponsorship",
    description: "Become an official sponsor for Hyve's Guild Tournament Series featuring BitByte and upcoming games. Drive community engagement and tournament sign-ups while earning revenue from referrals.",
    budget: 400000, // $4,000 total
    rewardPerAction: 100000, // $1,000 per creator
    status: "active",
    campaignType: "engagement",
    targetAudience: "Gaming creators and esports enthusiasts",
    requirements: JSON.stringify({
      minFollowers: 15000,
      platforms: ["Twitch", "YouTube", "Twitter"],
      urgency: "Tournament starts in 10 days",
      deliverables: [
        "1 Tournament announcement stream",
        "2 Practice streams leading up to event",
        "Live tournament co-streaming or commentary",
        "3 Twitter posts promoting guild sign-ups",
        "1 Post-tournament recap and highlights video"
      ],
      contentExamples: [
        "Announcement: 'The @Hyve_Labs Guild Tournament is HERE! $10k prize pool, custom skins, and bragging rights. Join my guild and let's dominate BitByte together!'",
        "Stream Title: 'Guild Tournament Prep - BitByte Strategy & Practice Session'",
        "Thread: 'Guild Tournament Update: Weekly prizes, leaderboard battles, and exclusive NFT rewards. Here's everything you need to know... 🧵'"
      ],
      requirements: [
        "Active in competitive gaming scene",
        "Experience with tournament formats and commentary",
        "Strong streaming setup and audience engagement",
        "Ability to recruit and lead a gaming guild"
      ]
    }),
    platforms: JSON.stringify(["Twitch", "YouTube", "Twitter"]),
    tags: JSON.stringify(["web3", "gaming", "tournament", "guild", "hyve"]),
    startDate: new Date("2025-01-20"),
    endDate: new Date("2025-04-20"),
    maxParticipants: 4,
    currentParticipants: 2,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "💎 Luster Labs - NFT Gaming Integration Showcase",
    description: "Showcase Luster Labs' revolutionary NFT integration in Web3 gaming. Demonstrate true asset ownership, cross-game compatibility, and play-to-earn mechanics to your audience.",
    budget: 300000, // $3,000 total
    rewardPerAction: 75000, // $750 per creator
    status: "active",
    campaignType: "content_creation",
    targetAudience: "NFT creators and Web3 gaming enthusiasts",
    requirements: JSON.stringify({
      minFollowers: 8000,
      platforms: ["YouTube", "Twitter", "Twitch"],
      urgency: "Applications close in 5 days",
      deliverables: [
        "1 In-depth NFT integration breakdown video",
        "3 Educational threads about Web3 gaming economics",
        "1 Live demo of cross-game asset transfers",
        "Community workshop on NFT gaming strategies",
        "Collaboration with other Web3 creators"
      ],
      contentExamples: [
        "Video Title: 'This is How NFTs Should Work in Games - Luster Labs Deep Dive'",
        "Thread: 'Just transferred my sword from Game A to Game B seamlessly. @LusterLabs is solving the biggest problem in Web3 gaming - here's how... 🧵'",
        "Stream: 'Live NFT Trading + Gaming - Real Asset Ownership Demo'"
      ],
      requirements: [
        "Deep understanding of NFT technology",
        "Experience with Web3 gaming platforms",
        "Professional content creation skills",
        "Active NFT community engagement"
      ]
    }),
    platforms: JSON.stringify(["YouTube", "Twitter", "Twitch"]),
    tags: JSON.stringify(["nft", "web3", "gaming", "blockchain", "luster-labs"]),
    startDate: new Date("2025-01-10"),
    endDate: new Date("2025-03-10"),
    maxParticipants: 4,
    currentParticipants: 1,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "🔥 Hyve Platform Beta - Content Creator Early Access",
    description: "Get exclusive early access to Hyve's complete gaming platform before public launch. Create content around the ecosystem, social features, and upcoming game releases.",
    budget: 350000, // $3,500 total
    rewardPerAction: 87500, // $875 per creator
    status: "active",
    campaignType: "content_creation",
    targetAudience: "Web3 gaming content creators",
    requirements: JSON.stringify({
      minFollowers: 12000,
      platforms: ["YouTube", "Twitch", "Twitter"],
      urgency: "Beta access limited - Apply within 4 days",
      deliverables: [
        "1 Platform overview and first impressions video",
        "2 Feature deep-dive videos (wallet, social, games)",
        "3 Twitter threads about platform benefits",
        "1 Live Q&A session with your audience",
        "Beta feedback and bug reporting to development team"
      ],
      contentExamples: [
        "Video: 'Hyve Platform Beta First Look - The Future of Web3 Gaming Ecosystems'",
        "Thread: 'Beta testing @Hyve_Labs platform and the onboarding is SMOOTH. No complex wallet setup, instant gameplay, cross-chain compatibility. This is how Web3 should feel... 🧵'",
        "Stream: 'Hyve Beta Deep Dive - Social Features, Wallet Integration, & More'"
      ],
      requirements: [
        "Experience with Web3 gaming platforms",
        "Strong technical communication skills",
        "Ability to provide constructive development feedback",
        "Regular content creation schedule"
      ]
    }),
    platforms: JSON.stringify(["YouTube", "Twitch", "Twitter"]),
    tags: JSON.stringify(["web3", "gaming", "beta", "platform", "hyve"]),
    startDate: new Date("2025-01-25"),
    endDate: new Date("2025-03-25"),
    maxParticipants: 4,
    currentParticipants: 0,
    isPublic: true,
    verificationRequired: true
  }
];

async function createSampleCampaigns() {
  try {
    console.log('Creating sample campaigns...');
    
    for (const campaign of sampleCampaigns) {
      const [created] = await db
        .insert(campaigns)
        .values({
          ...campaign,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      console.log(`Created campaign: ${created.title}`);
    }
    
    console.log('Sample campaigns created successfully!');
  } catch (error) {
    console.error('Error creating sample campaigns:', error);
  }
}

createSampleCampaigns();
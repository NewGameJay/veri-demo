/**
 * Script to create sample campaigns based on real creator brief formats
 * Inspired by the Hyve Creator Brief structure
 */

import { db } from '../server/db.ts';
import { campaigns } from '../shared/schema.ts';

const sampleCampaigns = [
  {
    userId: 12, // Brand account user ID
    title: "BitByte Gaming Platform Launch - Creator Partnership",
    description: "Drive your audience to sign up for BitByte, the new gaming platform launching February 26th. Earn $2,000/month for 3 months with weekly deliverables including streams, threads, and gameplay content.",
    budget: 600000, // $6,000 total (3 months x $2,000)
    rewardPerAction: 200000, // $2,000 per month
    status: "active",
    campaignType: "content_creation",
    targetAudience: "Gaming creators with 10K+ followers",
    requirements: JSON.stringify({
      minFollowers: 10000,
      platforms: ["Twitter", "Twitch", "YouTube"],
      deliverables: {
        weekly: [
          "1 Educational thread about platform features",
          "1 Live stream with gameplay walkthrough", 
          "1 VOD with creator referral code",
          "1 Announcement post"
        ],
        monthly: [
          "Community game night hosting",
          "Social media giveaway",
          "Platform feature breakdown"
        ]
      },
      duration: "3 months",
      testPeriod: "Month 1 evaluation before continuation"
    }),
    platforms: JSON.stringify(["Twitter", "Twitch", "YouTube"]),
    tags: JSON.stringify(["gaming", "platform-launch", "partnership", "long-term"]),
    startDate: new Date("2025-02-24"),
    endDate: new Date("2025-05-24"),
    maxParticipants: 5,
    currentParticipants: 0,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "Lifestyle Creator - Wellness App Review Campaign",
    description: "Partner with WellnessHub to create authentic content showcasing their new mindfulness app. Perfect for lifestyle creators who want to share genuine health and wellness experiences with their audience.",
    budget: 150000, // $1,500 total
    rewardPerAction: 50000, // $500 per creator
    status: "active", 
    campaignType: "review",
    targetAudience: "Lifestyle & wellness creators",
    requirements: JSON.stringify({
      minFollowers: 5000,
      platforms: ["Instagram", "TikTok", "YouTube"],
      deliverables: [
        "7-day app usage documentation",
        "1 long-form review video (5+ minutes)",
        "3 short-form posts showing app in daily routine",
        "1 Instagram story series",
        "Honest feedback and testimonial"
      ],
      guidelines: [
        "Must use app for minimum 7 days",
        "Content must be authentic and honest",
        "Include personal wellness journey context",
        "Use provided hashtags and mention handles"
      ]
    }),
    platforms: JSON.stringify(["Instagram", "TikTok", "YouTube"]),
    tags: JSON.stringify(["wellness", "app-review", "lifestyle", "authentic"]),
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-02-15"),
    maxParticipants: 3,
    currentParticipants: 1,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "Tech Creator - AI Tool Integration Series",
    description: "Create educational content about integrating AI tools into creator workflows. Perfect for tech creators who want to help their audience understand practical AI applications.",
    budget: 300000, // $3,000 total
    rewardPerAction: 75000, // $750 per creator
    status: "active",
    campaignType: "content_creation",
    targetAudience: "Tech creators and developer educators",
    requirements: JSON.stringify({
      minFollowers: 15000,
      platforms: ["YouTube", "Twitter", "LinkedIn"],
      deliverables: [
        "1 comprehensive tutorial video (15+ minutes)",
        "1 Twitter thread with key insights",
        "1 LinkedIn article with professional insights",
        "2 follow-up posts with tips and tricks",
        "Code examples and resources shared"
      ],
      techRequirements: [
        "Experience with AI tools (ChatGPT, Claude, etc.)",
        "Basic coding knowledge preferred",
        "Screen recording capabilities",
        "Professional video editing skills"
      ]
    }),
    platforms: JSON.stringify(["YouTube", "Twitter", "LinkedIn"]),
    tags: JSON.stringify(["tech", "ai", "education", "tutorial"]),
    startDate: new Date("2025-01-20"),
    endDate: new Date("2025-03-20"),
    maxParticipants: 4,
    currentParticipants: 2,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "Fashion Creator - Summer Collection Showcase",
    description: "Partner with emerging fashion brand StyleForward to showcase their summer collection. Create authentic styling content that resonates with your fashion-forward audience.",
    budget: 200000, // $2,000 total
    rewardPerAction: 40000, // $400 per creator
    status: "active",
    campaignType: "social_post",
    targetAudience: "Fashion and style creators",
    requirements: JSON.stringify({
      minFollowers: 8000,
      platforms: ["Instagram", "TikTok"],
      deliverables: [
        "1 styling video featuring 3+ pieces",
        "3 outfit posts with styling tips",
        "1 Instagram Reel showing versatility",
        "Story series with behind-the-scenes content",
        "Honest styling recommendations"
      ],
      brandGuidelines: [
        "Tag @StyleForward in all posts",
        "Use hashtag #StyleForwardSummer",
        "Include authentic styling tips",
        "Show pieces in different settings"
      ]
    }),
    platforms: JSON.stringify(["Instagram", "TikTok"]),
    tags: JSON.stringify(["fashion", "styling", "summer", "collection"]),
    startDate: new Date("2025-01-10"),
    endDate: new Date("2025-02-28"),
    maxParticipants: 5,
    currentParticipants: 3,
    isPublic: true,
    verificationRequired: true
  },
  {
    userId: 12,
    title: "Gaming Creator - Tournament Series Promotion",
    description: "Promote the upcoming EsportsArena tournament series with engaging content that drives sign-ups and viewership. Perfect for gaming creators who want to support competitive gaming.",
    budget: 400000, // $4,000 total
    rewardPerAction: 100000, // $1,000 per creator
    status: "active",
    campaignType: "engagement",
    targetAudience: "Gaming creators and esports enthusiasts",
    requirements: JSON.stringify({
      minFollowers: 20000,
      platforms: ["Twitch", "YouTube", "Twitter"],
      deliverables: [
        "1 tournament announcement stream",
        "2 practice/training streams leading up to event",
        "Live tournament commentary or co-streaming",
        "3 Twitter posts promoting sign-ups",
        "1 post-tournament recap video"
      ],
      gamingRequirements: [
        "Active in competitive gaming scene",
        "Experience with tournament formats",
        "Good streaming setup and commentary skills",
        "Willingness to participate or promote actively"
      ]
    }),
    platforms: JSON.stringify(["Twitch", "YouTube", "Twitter"]),
    tags: JSON.stringify(["gaming", "esports", "tournament", "competitive"]),
    startDate: new Date("2025-01-25"),
    endDate: new Date("2025-04-25"),
    maxParticipants: 4,
    currentParticipants: 1,
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
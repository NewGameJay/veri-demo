import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  Clock, 
  CheckCircle,
  XCircle,
  ExternalLink,
  Send,
  Eye,
  TrendingUp,
  AlertCircle,
  Zap
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { triggerHaptic } from "@/lib/haptic";
import { formatDistanceToNow } from "date-fns";

interface Campaign {
  id: number;
  title: string;
  description: string;
  budget: number;
  rewardPerAction: number;
  status: string;
  campaignType: string;
  targetAudience?: string;
  requirements?: string;
  platforms?: string;
  tags?: string;
  maxParticipants?: number;
  currentParticipants: number;
  isPublic: boolean;
  verificationRequired: boolean;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  userId: number;
}

interface CampaignParticipant {
  id: number;
  campaignId: number;
  userId: number;
  status: string;
  applicationData?: string;
  submissionData?: string;
  submissionUrl?: string;
  appliedAt: string;
  completedAt?: string;
}

const CAMPAIGN_TYPE_LABELS = {
  content_creation: "Content Creation",
  engagement: "Social Engagement", 
  review: "Product Review",
  social_post: "Social Media Post",
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
};

interface ApplicationFormData {
  interestStatement: string;
  relevantExperience: string;
  contentApproach: string;
  portfolioLinks: string;
  availability: string;
}

// Campaign visual thumbnails mapping
const CAMPAIGN_THUMBNAILS = {
  content_creation: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
  engagement: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=200&fit=crop", 
  review: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
  social_post: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
};

// Top paying brands data
const TOP_BRANDS = [
  { name: "Nike", logo: "N", range: "$200-$5000", color: "bg-black" },
  { name: "Samsung", logo: "S", range: "$150-$4500", color: "bg-blue-600" },
  { name: "Apple", logo: "A", range: "$300-$6000", color: "bg-gray-900" },
  { name: "Sephora", logo: "S", range: "$100-$3000", color: "bg-black" },
  { name: "Zara", logo: "Z", range: "$75-$2500", color: "bg-black" },
  { name: "H&M", logo: "H", range: "$50-$2000", color: "bg-red-600" },
  { name: "Adidas", logo: "A", range: "$150-$4000", color: "bg-black" },
  { name: "Coca Cola", logo: "C", range: "$200-$5500", color: "bg-red-600" },
];

export function CampaignList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [applicationData, setApplicationData] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionData, setSubmissionData] = useState("");
  const [applicationForm, setApplicationForm] = useState<ApplicationFormData>({
    interestStatement: "",
    relevantExperience: "",
    contentApproach: "",
    portfolioLinks: "",
    availability: "immediate"
  });

  const updateApplicationForm = (field: keyof ApplicationFormData, value: string) => {
    setApplicationForm(prev => ({ ...prev, [field]: value }));
  };

  const resetApplicationForm = () => {
    setApplicationForm({
      interestStatement: "",
      relevantExperience: "",
      contentApproach: "",
      portfolioLinks: "",
      availability: "immediate"
    });
  };

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ["/api/campaigns"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/campaigns");
        return await response.json();
      } catch (err) {
        console.error("Campaign fetch error:", err);
        throw err;
      }
    },
  });

  const applyToCampaignMutation = useMutation({
    mutationFn: async ({ campaignId, applicationData }: { campaignId: number; applicationData: string }) => {
      return apiRequest(`/api/campaigns/${campaignId}/apply`, {
        method: "POST",
        body: { applicationData },
      });
    },
    onSuccess: () => {
      triggerHaptic("success");
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setApplicationData("");
      resetApplicationForm();
      setSelectedCampaign(null);
    },
    onError: (error) => {
      triggerHaptic("error");
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitToCampaignMutation = useMutation({
    mutationFn: async ({ campaignId, submissionData, submissionUrl }: { campaignId: number; submissionData: string; submissionUrl: string }) => {
      return apiRequest(`/api/campaigns/${campaignId}/submit`, {
        method: "POST",
        body: { submissionData, submissionUrl },
      });
    },
    onSuccess: () => {
      triggerHaptic("success");
      toast({
        title: "Submission Complete!",
        description: "Your campaign submission has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setSubmissionData("");
      setSubmissionUrl("");
      setSelectedCampaign(null);
    },
    onError: (error) => {
      triggerHaptic("error");
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (!selectedCampaign || !applicationForm.interestStatement.trim()) return;
    
    // Combine all form fields into structured application data
    const structuredApplicationData = {
      interestStatement: applicationForm.interestStatement.trim(),
      relevantExperience: applicationForm.relevantExperience.trim(),
      contentApproach: applicationForm.contentApproach.trim(),
      portfolioLinks: applicationForm.portfolioLinks.trim(),
      availability: applicationForm.availability
    };
    
    applyToCampaignMutation.mutate({
      campaignId: selectedCampaign.id,
      applicationData: JSON.stringify(structuredApplicationData),
    });
  };

  const handleSubmit = () => {
    if (!selectedCampaign || !submissionUrl.trim()) return;
    
    submitToCampaignMutation.mutate({
      campaignId: selectedCampaign.id,
      submissionData: submissionData.trim(),
      submissionUrl: submissionUrl.trim(),
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const parsePlatforms = (platforms?: string) => {
    if (!platforms) return [];
    try {
      return JSON.parse(platforms);
    } catch {
      return [];
    }
  };

  const parseTags = (tags?: string) => {
    if (!tags) return [];
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  const parseRequirements = (requirements?: string) => {
    if (!requirements) return null;
    try {
      return JSON.parse(requirements);
    } catch {
      return null;
    }
  };

  const formatRequirements = (requirements?: string) => {
    const parsed = parseRequirements(requirements);
    if (!parsed) return requirements;
    
    // If it's an array, format as bullet points
    if (Array.isArray(parsed)) {
      return parsed.map(req => `• ${req}`).join('\n');
    }
    
    // If it's an object with deliverables array, format those
    if (parsed.deliverables && Array.isArray(parsed.deliverables)) {
      return parsed.deliverables.map((req: string) => `• ${req}`).join('\n');
    }
    
    // Return original if not an array format we can improve
    return requirements;
  };

  const isUrgent = (campaign: Campaign) => {
    const requirements = parseRequirements(campaign.requirements);
    if (!requirements) return false;
    
    const urgencyText = requirements.urgency || "";
    return urgencyText.includes("URGENT") || urgencyText.includes("ENDING SOON") || urgencyText.includes("days");
  };

  const getUrgencyColor = (urgencyText: string) => {
    if (urgencyText.includes("URGENT") || urgencyText.includes("2 days")) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (urgencyText.includes("ENDING SOON")) {
      return "bg-orange-100 text-orange-800 border-orange-200";
    } else {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-red-500 mb-2">
          <Target className="h-8 w-8 mx-auto mb-2" />
          <h3 className="font-semibold">Error Loading Campaigns</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          {error.message || "Failed to load campaigns. Please try again."}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Available Campaigns</h2>
          <p className="text-muted-foreground">
            Discover and participate in brand campaigns
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          {campaigns?.length || 0} campaigns available
        </div>
      </div>

      {campaigns?.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">No Campaigns Available</h3>
            <p className="text-sm">
              There are currently no active campaigns available. Check back later for new opportunities!
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Visual Campaign Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.sort((a, b) => {
              const aUrgent = isUrgent(a);
              const bUrgent = isUrgent(b);
              if (aUrgent && !bUrgent) return -1;
              if (!aUrgent && bUrgent) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }).map((campaign: Campaign) => {
              const urgent = isUrgent(campaign);
              const requirements = parseRequirements(campaign.requirements);
              const urgencyText = requirements?.urgency || "";
              const thumbnail = CAMPAIGN_THUMBNAILS[campaign.campaignType as keyof typeof CAMPAIGN_THUMBNAILS] || CAMPAIGN_THUMBNAILS.content_creation;
              
              // Get gradient colors based on campaign index
              const gradients = [
                "from-purple-500 to-purple-700",
                "from-green-500 to-green-700", 
                "from-orange-500 to-red-600",
                "from-blue-500 to-blue-700",
                "from-pink-500 to-pink-700",
                "from-teal-500 to-teal-700"
              ];
              const gradientIndex = index % gradients.length;
              const gradientClass = gradients[gradientIndex];

              return (
                <Card key={campaign.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden bg-white rounded-2xl">
                  {/* Campaign Header with Gradient */}
                  <div className={`relative h-32 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
                    {/* Budget Badge - Top Left */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                        {formatCurrency(campaign.budget)}
                      </div>
                    </div>
                    
                    {/* Star Icon - Top Right */}
                    <div className="absolute top-4 right-4">
                      {urgent ? (
                        <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                          URGENT
                        </div>
                      ) : (
                        <div className="text-white/60">
                          <Trophy className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Campaign Content */}
                  <CardContent className="p-4 space-y-3">
                    {/* Brand Name with Verification */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-900 rounded text-white text-xs flex items-center justify-center font-bold">
                        {campaign.title.includes("Hyve") ? "H" : 
                         campaign.title.includes("Luster") ? "L" : 
                         campaign.title.includes("Solana") ? "S" :
                         campaign.title.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {campaign.title.includes("Hyve") ? "Hyve Gaming" : 
                         campaign.title.includes("Luster") ? "Luster Labs" : 
                         campaign.title.includes("Solana") ? "Solana Foundation" :
                         "Verified Brand"}
                      </span>
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 ml-auto">{campaign.currentParticipants} creators</span>
                    </div>
                    
                    {/* Campaign Title */}
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">
                      {campaign.title}
                    </h3>
                    
                    {/* Campaign Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    {/* Duration and Participation Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{Math.floor(Math.random() * 6) + 1} {Math.random() > 0.5 ? 'days' : 'week'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{campaign.currentParticipants} participating</span>
                      </div>
                    </div>
                    
                    {/* Apply Now Button */}
                    <Button 
                      className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg h-10"
                      onClick={() => triggerHaptic("light")}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
            
            {/* Top Paying Brands Section */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Top Paying Brands</h3>
                  <p className="text-muted-foreground text-sm">Explore verified brands with the highest campaign budgets</p>
                </div>
                <Button variant="outline" size="sm">
                  View All Brands
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TOP_BRANDS.map((brand, index) => (
                  <Card key={brand.name} className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${brand.color} rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform`}>
                        {brand.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-semibold text-sm truncate">{brand.name}</h4>
                          <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground">{brand.range}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
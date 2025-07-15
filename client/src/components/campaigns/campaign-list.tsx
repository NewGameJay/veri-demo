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
        <div className="grid gap-4">
          {campaigns?.sort((a, b) => {
            const aUrgent = isUrgent(a);
            const bUrgent = isUrgent(b);
            if (aUrgent && !bUrgent) return -1;
            if (!aUrgent && bUrgent) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }).map((campaign: Campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <Badge className={STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]}>
                      {campaign.status}
                    </Badge>
                    {isUrgent(campaign) && (
                      <Badge className={`${getUrgencyColor(parseRequirements(campaign.requirements)?.urgency || "")} flex items-center gap-1`}>
                        <AlertCircle className="h-3 w-3" />
                        {parseRequirements(campaign.requirements)?.urgency?.includes("URGENT") ? "URGENT" : "ENDING SOON"}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {campaign.description}
                  </CardDescription>
                  {isUrgent(campaign) && (
                    <div className="flex items-center gap-1 mt-2 text-sm font-medium text-orange-600">
                      <Clock className="h-4 w-4" />
                      {parseRequirements(campaign.requirements)?.urgency}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(campaign.rewardPerAction)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per action
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {CAMPAIGN_TYPE_LABELS[campaign.campaignType as keyof typeof CAMPAIGN_TYPE_LABELS]}
                </Badge>
                
                {parsePlatforms(campaign.platforms).map((platform: string) => (
                  <Badge key={platform} variant="secondary">
                    {platform}
                  </Badge>
                ))}
                
                {parseTags(campaign.tags).slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                
                {parseTags(campaign.tags).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{parseTags(campaign.tags).length - 3} more
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatCurrency(campaign.budget)}</span>
                  <span className="text-muted-foreground">budget</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{campaign.currentParticipants}</span>
                  <span className="text-muted-foreground">
                    / {campaign.maxParticipants || "∞"}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {campaign.verificationRequired ? "Verified" : "Auto-approve"}
                  </span>
                </div>
              </div>

              {campaign.targetAudience && (
                <div className="text-sm">
                  <span className="font-medium">Target Audience:</span>
                  <span className="ml-2 text-muted-foreground">{campaign.targetAudience}</span>
                </div>
              )}

              {campaign.requirements && (
                <div className="text-sm">
                  <span className="font-medium">Requirements:</span>
                  <pre className="mt-1 text-muted-foreground whitespace-pre-wrap font-sans">{formatRequirements(campaign.requirements)}</pre>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{campaign.title}</DialogTitle>
                      <DialogDescription>
                        Campaign Details and Requirements
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{campaign.description}</p>
                      </div>
                      
                      {campaign.requirements && (
                        <div>
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{formatRequirements(campaign.requirements)}</pre>
                        </div>
                      )}
                      
                      {parseRequirements(campaign.requirements)?.contentExamples && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Content Examples
                          </h4>
                          <div className="space-y-2">
                            {parseRequirements(campaign.requirements)?.contentExamples.map((example: string, index: number) => (
                              <div key={index} className="bg-muted p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground font-mono">{example}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Budget:</span>
                          <span className="ml-2">{formatCurrency(campaign.budget)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Reward per Action:</span>
                          <span className="ml-2">{formatCurrency(campaign.rewardPerAction)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Max Participants:</span>
                          <span className="ml-2">{campaign.maxParticipants || "Unlimited"}</span>
                        </div>
                        <div>
                          <span className="font-medium">Current Participants:</span>
                          <span className="ml-2">{campaign.currentParticipants}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsePlatforms(campaign.platforms).map((platform: string) => (
                            <Badge key={platform} variant="secondary">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {parseTags(campaign.tags).map((tag: string) => (
                            <Badge key={tag} variant="outline">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedCampaign(campaign)}
                      disabled={campaign.status !== "active"}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Apply to Campaign</DialogTitle>
                      <DialogDescription>
                        Complete your application with detailed information about your experience and approach
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Campaign Interest Statement */}
                      <div>
                        <Label htmlFor="interestStatement">Why are you interested in this campaign? *</Label>
                        <Textarea
                          id="interestStatement"
                          placeholder="Share what excites you about this campaign and why you're the perfect fit (3-5 lines minimum)..."
                          value={applicationForm.interestStatement}
                          onChange={(e) => updateApplicationForm('interestStatement', e.target.value)}
                          className="min-h-[100px] mt-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {applicationForm.interestStatement.length}/500 characters
                        </p>
                      </div>

                      {/* Relevant Experience */}
                      <div>
                        <Label htmlFor="relevantExperience">Share relevant content creation experience</Label>
                        <Textarea
                          id="relevantExperience"
                          placeholder="Describe your experience with similar campaigns, audience engagement, content creation, etc. Include links to previous work if relevant..."
                          value={applicationForm.relevantExperience}
                          onChange={(e) => updateApplicationForm('relevantExperience', e.target.value)}
                          className="min-h-[100px] mt-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {applicationForm.relevantExperience.length}/1000 characters
                        </p>
                      </div>

                      {/* Content Approach */}
                      <div>
                        <Label htmlFor="contentApproach">How would you approach this campaign?</Label>
                        <Textarea
                          id="contentApproach"
                          placeholder="Outline your creative strategy, content ideas, execution plan, and how you'll engage your audience..."
                          value={applicationForm.contentApproach}
                          onChange={(e) => updateApplicationForm('contentApproach', e.target.value)}
                          className="min-h-[100px] mt-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {applicationForm.contentApproach.length}/1000 characters
                        </p>
                      </div>

                      {/* Portfolio Links */}
                      <div>
                        <Label htmlFor="portfolioLinks">Portfolio Links</Label>
                        <Textarea
                          id="portfolioLinks"
                          placeholder="Share your portfolio links (one per line):&#10;YouTube: https://youtube.com/@yourhandle&#10;Twitch: https://twitch.tv/yourhandle&#10;Social profiles: https://...&#10;Previous brand work: https://..."
                          value={applicationForm.portfolioLinks}
                          onChange={(e) => updateApplicationForm('portfolioLinks', e.target.value)}
                          className="min-h-[120px] mt-2 font-mono text-sm"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          One link per line. Include platform name for clarity.
                        </p>
                      </div>

                      {/* Availability */}
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Select
                          value={applicationForm.availability}
                          onValueChange={(value) => updateApplicationForm('availability', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select your availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate start</SelectItem>
                            <SelectItem value="within_1_week">Within 1 week</SelectItem>
                            <SelectItem value="within_2_weeks">Within 2 weeks</SelectItem>
                            <SelectItem value="flexible">Flexible timeline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={() => { setSelectedCampaign(null); resetApplicationForm(); }}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleApply}
                          disabled={!applicationForm.interestStatement.trim() || applyToCampaignMutation.isPending}
                        >
                          {applyToCampaignMutation.isPending ? "Applying..." : "Submit Application"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
}
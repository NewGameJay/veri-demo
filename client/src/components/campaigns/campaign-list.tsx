import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  TrendingUp
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

export function CampaignList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [applicationData, setApplicationData] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionData, setSubmissionData] = useState("");

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
    queryFn: () => apiRequest("/api/campaigns"),
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
    if (!selectedCampaign || !applicationData.trim()) return;
    
    applyToCampaignMutation.mutate({
      campaignId: selectedCampaign.id,
      applicationData: applicationData.trim(),
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

      <div className="grid gap-4">
        {campaigns?.map((campaign: Campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <Badge className={STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {campaign.description}
                  </CardDescription>
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
                  <p className="mt-1 text-muted-foreground">{campaign.requirements}</p>
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
                          <p className="text-sm text-muted-foreground">{campaign.requirements}</p>
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply to Campaign</DialogTitle>
                      <DialogDescription>
                        Tell us why you're perfect for this campaign
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="application">Application Message</Label>
                        <Textarea
                          id="application"
                          placeholder="Describe your relevant experience, audience, and how you plan to complete this campaign..."
                          value={applicationData}
                          onChange={(e) => setApplicationData(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleApply}
                          disabled={!applicationData.trim() || applyToCampaignMutation.isPending}
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

      {(!campaigns || campaigns.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No campaigns available</h3>
              <p>Check back later for new campaign opportunities</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
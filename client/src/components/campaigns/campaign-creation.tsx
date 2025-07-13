import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, DollarSign, Users, Target, Zap, Plus, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { triggerHaptic } from "@/lib/haptic";

const campaignFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().min(1, "Budget must be at least $1"),
  rewardPerAction: z.number().min(1, "Reward per action must be at least $1"),
  campaignType: z.enum(["content_creation", "engagement", "review", "social_post"]),
  targetAudience: z.string().optional(),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  tags: z.array(z.string()).optional(),
  maxParticipants: z.number().min(1, "Maximum participants must be at least 1"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isPublic: z.boolean().default(true),
  verificationRequired: z.boolean().default(true),
  requirements: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignFormSchema>;

const CAMPAIGN_TYPES = [
  { value: "content_creation", label: "Content Creation", icon: "📝" },
  { value: "engagement", label: "Social Engagement", icon: "❤️" },
  { value: "review", label: "Product Review", icon: "⭐" },
  { value: "social_post", label: "Social Media Post", icon: "📱" },
];

const PLATFORMS = [
  { value: "twitter", label: "Twitter", icon: "🐦" },
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "youtube", label: "YouTube", icon: "🎥" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
];

const SAMPLE_TAGS = [
  "gaming", "lifestyle", "tech", "beauty", "fitness", "food", "travel", "fashion", "music", "art"
];

export function CampaignCreation({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 100,
      rewardPerAction: 10,
      campaignType: "content_creation",
      targetAudience: "",
      platforms: [],
      tags: [],
      maxParticipants: 50,
      isPublic: true,
      verificationRequired: true,
      requirements: "",
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const campaignData = {
        ...data,
        budget: data.budget * 100, // Convert to cents
        rewardPerAction: data.rewardPerAction * 100, // Convert to cents
        platforms: JSON.stringify(selectedPlatforms),
        tags: JSON.stringify(selectedTags),
        requirements: data.requirements || "",
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
      };
      
      return apiRequest("/api/campaigns", {
        method: "POST",
        body: campaignData,
      });
    },
    onSuccess: () => {
      triggerHaptic("success");
      toast({
        title: "Campaign Created!",
        description: "Your campaign has been created successfully and is now live.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      form.reset();
      setSelectedPlatforms([]);
      setSelectedTags([]);
      onSuccess?.();
    },
    onError: (error) => {
      triggerHaptic("error");
      toast({
        title: "Failed to create campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
    triggerHaptic("light");
  };

  const handleTagAdd = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
      triggerHaptic("light");
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
    triggerHaptic("light");
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
      triggerHaptic("light");
    }
  };

  const onSubmit = (data: CampaignFormData) => {
    const formData = {
      ...data,
      platforms: selectedPlatforms,
      tags: selectedTags,
    };
    createCampaignMutation.mutate(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Zap className="h-6 w-6 text-emerald-500" />
          Create New Campaign
        </CardTitle>
        <CardDescription>
          Launch a campaign to connect with creators and drive authentic engagement
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Summer Product Launch Campaign"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your campaign objectives, target audience, and key messages..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campaignType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CAMPAIGN_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Budget and Rewards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget & Rewards
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Budget ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="1000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Total amount you're willing to spend on this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rewardPerAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward per Action ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="25"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Amount paid per completed action
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Platforms
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PLATFORMS.map((platform) => (
                  <Button
                    key={platform.value}
                    type="button"
                    variant={selectedPlatforms.includes(platform.value) ? "default" : "outline"}
                    className="flex items-center gap-2 p-3"
                    onClick={() => handlePlatformToggle(platform.value)}
                  >
                    <span>{platform.icon}</span>
                    {platform.label}
                  </Button>
                ))}
              </div>
              
              {selectedPlatforms.length === 0 && (
                <p className="text-sm text-red-500">Please select at least one platform</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              
              <div className="flex flex-wrap gap-2">
                {SAMPLE_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => selectedTags.includes(tag) ? handleTagRemove(tag) : handleTagAdd(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                />
                <Button type="button" onClick={addCustomTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleTagRemove(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Additional Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Participants</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 18-35 gaming enthusiasts"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Public Campaign</FormLabel>
                        <FormDescription>
                          Make this campaign discoverable to all creators
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verificationRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Verification Required</FormLabel>
                        <FormDescription>
                          Require manual verification of submissions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Specific requirements for participants..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedPlatforms([]);
                  setSelectedTags([]);
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={createCampaignMutation.isPending}
                className="min-w-32"
              >
                {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
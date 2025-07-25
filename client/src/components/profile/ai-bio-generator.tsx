import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIBioGeneratorProps {
  creatorType: string;
  interests: string[];
  goals: string[];
  currentBio: string;
  onBioChange: (bio: string) => void;
}

export function AIBioGenerator({ 
  creatorType, 
  interests, 
  goals, 
  currentBio,
  onBioChange 
}: AIBioGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateBio = async () => {
    if (!creatorType || interests.length === 0) {
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI bio generation based on user inputs
      const bios = generateContextualBios(creatorType, interests, goals);
      setGeneratedBios(bios);
    } catch (error) {
      console.error("Error generating bio:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContextualBios = (type: string, userInterests: string[], userGoals: string[]): string[] => {
    const typeEmojis: Record<string, string> = {
      'content-creator': '🎬',
      'influencer': '⭐',
      'gamer': '🎮',
      'educator': '📚',
      'entrepreneur': '💼',
      'artist': '🎨',
      'musician': '🎵',
      'fitness': '💪',
      'tech': '📱',
      'lifestyle': '✨'
    };

    const typeDescriptions: Record<string, string[]> = {
      'content-creator': ['Creating engaging content', 'Storytelling through video', 'Building communities'],
      'influencer': ['Inspiring my audience', 'Building authentic connections', 'Sharing my journey'],
      'gamer': ['Gaming content creator', 'Competitive gaming', 'Building gaming communities'],
      'educator': ['Teaching and inspiring', 'Educational content creator', 'Knowledge sharing'],
      'entrepreneur': ['Building the future', 'Startup insights', 'Business growth stories'],
      'artist': ['Creative expression', 'Artistic storytelling', 'Visual content creation'],
      'musician': ['Music creation', 'Audio storytelling', 'Sound design'],
      'fitness': ['Fitness motivation', 'Wellness coaching', 'Health transformation'],
      'tech': ['Tech reviews', 'Innovation insights', 'Technology education'],
      'lifestyle': ['Daily inspiration', 'Lifestyle content', 'Authentic living']
    };

    const goalPhrases: Record<string, string> = {
      'Grow my audience': 'Growing my community',
      'Increase revenue': 'Monetizing my passion',
      'Build brand partnerships': 'Collaborating with brands',
      'Create viral content': 'Creating viral moments',
      'Improve engagement': 'Building engagement',
      'Launch products': 'Launching innovative products',
      'Build community': 'Building strong communities',
      'Expand to new platforms': 'Expanding my reach',
      'Monetize content': 'Turning passion into profit',
      'Professional growth': 'Growing professionally'
    };

    const emoji = typeEmojis[type] || '🌟';
    const descriptions = typeDescriptions[type] || ['Content creator', 'Digital storyteller'];
    const interestIcons = userInterests.slice(0, 3).map(interest => {
      const iconMap: Record<string, string> = {
        gaming: '🎮', tech: '💻', fitness: '💪', food: '🍕', travel: '✈️',
        fashion: '👗', music: '🎵', art: '🎨', education: '📚', business: '💼',
        crypto: '₿', nft: '🖼️', defi: '💎', entertainment: '🎭', sports: '⚽'
      };
      return iconMap[interest] || '⭐';
    });

    const goalText = userGoals.slice(0, 2).map(goal => goalPhrases[goal] || goal.toLowerCase()).join(' & ');

    const bios = [
      `${emoji} ${descriptions[0]} | ${interestIcons.join(' ')} ${userInterests.slice(0, 3).join(', ')} | ${goalText}`,
      `${descriptions[1]} passionate about ${userInterests.slice(0, 2).join(' & ')} ${emoji} | ${goalText} | Join my journey!`,
      `${emoji} ${userInterests[0]} enthusiast | ${descriptions[0]} | ${goalText} | Let's connect and grow together! ${interestIcons[0]}`,
      `Building in ${userInterests.slice(0, 2).join(' & ')} ${emoji} | ${descriptions[0]} | ${goalText} | DMs open for collabs ${interestIcons.join('')}`,
      `${emoji} Creator focusing on ${userInterests.slice(0, 3).join(', ')} | ${goalText} | ${descriptions[0]} | Follow for daily insights!`
    ];

    return bios.slice(0, 3); // Return 3 variations
  };

  const copyBio = async (bio: string, index: number) => {
    try {
      await navigator.clipboard.writeText(bio);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy bio:", error);
    }
  };

  const useBio = (bio: string) => {
    onBioChange(bio);
  };

  const canGenerate = creatorType && interests.length > 0;

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          AI Bio Generator
        </CardTitle>
        <p className="text-white/60 text-sm">
          Generate personalized bios based on your creator type, interests, and goals
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Bio */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">Current Bio</label>
          <Textarea
            value={currentBio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Enter your bio..."
            className="bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-emerald-500"
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateBio}
          disabled={!canGenerate || isGenerating}
          className="w-full veri-gradient"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Bio Suggestions
            </>
          )}
        </Button>

        {/* Requirements */}
        {!canGenerate && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-amber-300 text-sm">
              Please select a creator type and at least one interest to generate bio suggestions.
            </p>
          </div>
        )}

        {/* Generated Bios */}
        <AnimatePresence>
          {generatedBios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <h4 className="text-white font-medium">Generated Suggestions:</h4>
              {generatedBios.map((bio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <p className="text-white/90 text-sm mb-3">{bio}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => useBio(bio)}
                      className="veri-gradient text-xs"
                    >
                      Use This Bio
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyBio(bio, index)}
                      className="border-white/20 text-white/70 hover:bg-white/10 text-xs"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
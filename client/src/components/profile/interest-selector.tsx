import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InterestSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
  creatorType: string;
  onCreatorTypeChange: (type: string) => void;
}

export function InterestSelector({ 
  selectedInterests, 
  onInterestsChange, 
  selectedGoals, 
  onGoalsChange,
  creatorType,
  onCreatorTypeChange 
}: InterestSelectorProps) {
  const [customInterest, setCustomInterest] = useState("");
  const [customGoal, setCustomGoal] = useState("");

  const creatorTypes = [
    { id: "content-creator", label: "Content Creator", emoji: "🎬", description: "Create videos, streams, and multimedia content" },
    { id: "influencer", label: "Influencer", emoji: "⭐", description: "Build audience and promote brands/products" },
    { id: "gamer", label: "Gamer", emoji: "🎮", description: "Gaming content, streams, and esports" },
    { id: "educator", label: "Educator", emoji: "📚", description: "Educational content and tutorials" },
    { id: "entrepreneur", label: "Entrepreneur", emoji: "💼", description: "Business content and startup insights" },
    { id: "artist", label: "Artist", emoji: "🎨", description: "Creative content and artistic expression" },
    { id: "musician", label: "Musician", emoji: "🎵", description: "Music creation and audio content" },
    { id: "fitness", label: "Fitness Coach", emoji: "💪", description: "Health, fitness, and wellness content" },
    { id: "tech", label: "Tech Reviewer", emoji: "📱", description: "Technology reviews and tech content" },
    { id: "lifestyle", label: "Lifestyle", emoji: "✨", description: "Daily life, fashion, and lifestyle content" }
  ];

  const interestOptions = [
    { id: "gaming", label: "Gaming", color: "bg-purple-500" },
    { id: "tech", label: "Technology", color: "bg-blue-500" },
    { id: "fitness", label: "Fitness", color: "bg-green-500" },
    { id: "food", label: "Food", color: "bg-orange-500" },
    { id: "travel", label: "Travel", color: "bg-cyan-500" },
    { id: "fashion", label: "Fashion", color: "bg-pink-500" },
    { id: "music", label: "Music", color: "bg-red-500" },
    { id: "art", label: "Art", color: "bg-indigo-500" },
    { id: "education", label: "Education", color: "bg-yellow-500" },
    { id: "business", label: "Business", color: "bg-gray-500" },
    { id: "crypto", label: "Crypto", color: "bg-amber-500" },
    { id: "nft", label: "NFTs", color: "bg-violet-500" },
    { id: "defi", label: "DeFi", color: "bg-emerald-500" },
    { id: "entertainment", label: "Entertainment", color: "bg-rose-500" },
    { id: "sports", label: "Sports", color: "bg-green-600" },
    { id: "science", label: "Science", color: "bg-teal-500" },
    { id: "movies", label: "Movies & TV", color: "bg-purple-600" },
    { id: "books", label: "Books", color: "bg-brown-500" },
    { id: "photography", label: "Photography", color: "bg-gray-600" },
    { id: "design", label: "Design", color: "bg-pink-600" }
  ];

  const goalOptions = [
    "Grow my audience",
    "Increase revenue", 
    "Build brand partnerships",
    "Create viral content",
    "Improve engagement",
    "Launch products",
    "Build community",
    "Expand to new platforms",
    "Monetize content",
    "Professional growth",
    "Learn new skills",
    "Network with creators",
    "Diversify income",
    "Build personal brand"
  ];

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId));
    } else if (selectedInterests.length < 5) {
      onInterestsChange([...selectedInterests, interestId]);
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      onGoalsChange(selectedGoals.filter(g => g !== goal));
    } else if (selectedGoals.length < 3) {
      onGoalsChange([...selectedGoals, goal]);
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim()) && selectedInterests.length < 5) {
      onInterestsChange([...selectedInterests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const addCustomGoal = () => {
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim()) && selectedGoals.length < 3) {
      onGoalsChange([...selectedGoals, customGoal.trim()]);
      setCustomGoal("");
    }
  };

  const removeInterest = (interest: string) => {
    onInterestsChange(selectedInterests.filter(i => i !== interest));
  };

  const removeGoal = (goal: string) => {
    onGoalsChange(selectedGoals.filter(g => g !== goal));
  };

  return (
    <div className="space-y-6">
      {/* Creator Type Selection */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Creator Type
          </CardTitle>
          <p className="text-white/60 text-sm">Choose the type that best describes your content</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {creatorTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => onCreatorTypeChange(type.id)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  creatorType === type.id
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{type.emoji}</span>
                  <div>
                    <div className="text-white font-medium">{type.label}</div>
                    <div className="text-white/60 text-sm">{type.description}</div>
                  </div>
                </div>
                {creatorType === type.id && (
                  <div className="mt-2 flex items-center gap-1 text-emerald-400 text-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    Selected
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interests Selection */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-400" />
            Interests ({selectedInterests.length}/5)
          </CardTitle>
          <p className="text-white/60 text-sm">Select 3-5 topics that match your content</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Interests */}
          {selectedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selectedInterests.map((interest) => (
                  <motion.div
                    key={interest}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full"
                  >
                    <span className="text-emerald-300 text-sm">{interest}</span>
                    <button
                      onClick={() => removeInterest(interest)}
                      className="w-4 h-4 rounded-full bg-emerald-500/30 hover:bg-emerald-500/50 flex items-center justify-center transition-colors"
                    >
                      <X className="h-2 w-2 text-emerald-300" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Interest Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {interestOptions.map((option) => {
              const isSelected = selectedInterests.includes(option.id);
              const isDisabled = !isSelected && selectedInterests.length >= 5;
              
              return (
                <Button
                  key={option.id}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleInterest(option.id)}
                  disabled={isDisabled}
                  className={`text-left justify-start transition-all duration-200 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                      : isDisabled
                      ? "border-white/5 bg-white/5 text-white/30 cursor-not-allowed"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${option.color} ${isDisabled ? 'opacity-30' : ''}`}></div>
                  {option.label}
                </Button>
              );
            })}
          </div>

          {/* Custom Interest Input */}
          {selectedInterests.length < 5 && (
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom interest..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
                onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
              />
              <Button
                onClick={addCustomInterest}
                disabled={!customInterest.trim()}
                size="sm"
                className="veri-gradient"
              >
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Selection */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-400" />
            Goals ({selectedGoals.length}/3)
          </CardTitle>
          <p className="text-white/60 text-sm">Select 2-3 goals you want to achieve</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Goals */}
          {selectedGoals.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selectedGoals.map((goal) => (
                  <motion.div
                    key={goal}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full"
                  >
                    <span className="text-purple-300 text-sm">{goal}</span>
                    <button
                      onClick={() => removeGoal(goal)}
                      className="w-4 h-4 rounded-full bg-purple-500/30 hover:bg-purple-500/50 flex items-center justify-center transition-colors"
                    >
                      <X className="h-2 w-2 text-purple-300" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Goal Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {goalOptions.map((goal) => {
              const isSelected = selectedGoals.includes(goal);
              const isDisabled = !isSelected && selectedGoals.length >= 3;
              
              return (
                <Button
                  key={goal}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleGoal(goal)}
                  disabled={isDisabled}
                  className={`text-left justify-start transition-all duration-200 ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/10 text-purple-300"
                      : isDisabled
                      ? "border-white/5 bg-white/5 text-white/30 cursor-not-allowed"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {goal}
                </Button>
              );
            })}
          </div>

          {/* Custom Goal Input */}
          {selectedGoals.length < 3 && (
            <div className="flex gap-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Add custom goal..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
              />
              <Button
                onClick={addCustomGoal}
                disabled={!customGoal.trim()}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { ChevronDown, ChevronUp, ExternalLink, Star, Clock, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedTaskCardProps {
  task: {
    id: number;
    title: string;
    platform: string;
    category: string;
    description: string;
    requirements: string[];
    points: number;
    difficulty: string;
    brand?: string;
    icon: any;
    color: string;
    timeEstimate?: string;
    featured?: boolean;
  };
  onStartTask: (taskId: number) => void;
  onViewDetails: (taskId: number) => void;
  isActive?: boolean;
  isCompleted?: boolean;
}

// Mock image generator for demo purposes
const generateMockImage = (category: string, platform: string) => {
  const imageMap = {
    'gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&auto=format',
    'content': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&auto=format',
    'social': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop&auto=format',
    'engagement': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop&auto=format',
    'default': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop&auto=format'
  };
  
  return imageMap[category as keyof typeof imageMap] || imageMap.default;
};

export function EnhancedTaskCard({ 
  task, 
  onStartTask, 
  onViewDetails, 
  isActive = false, 
  isCompleted = false 
}: EnhancedTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <Trophy className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (isActive) {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return null;
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02]",
        "bg-gradient-to-br from-white/5 to-white/10 border-white/20",
        "hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] hover:border-emerald-400/30",
        isActive && "ring-2 ring-blue-400/50",
        isCompleted && "ring-2 ring-green-400/50"
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Featured badge */}
      {task.featured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Star className="w-3 h-3 mr-1" />
            Spotlight
          </Badge>
        </div>
      )}

      {/* Points badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold">
          <Trophy className="w-3 h-3 mr-1" />
          {task.points}
        </Badge>
      </div>

      {/* Hero image section */}
      <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900">
        <img 
          src={generateMockImage(task.category, task.platform)} 
          alt={`${task.title} preview`}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {/* Category and brand */}
            <div className="flex items-center gap-2 mb-2">
              <task.icon className={`w-4 h-4 ${task.color}`} />
              <span className="text-sm text-white/70 capitalize font-medium">{task.category}</span>
              {task.brand && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                  {task.brand.replace('.gg', '').replace('.xyz', '')}
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-white text-lg leading-tight mb-2 line-clamp-1">
              {task.title}
            </h3>
            
            {/* Status and difficulty badges */}
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge()}
              <Badge className={getDifficultyColor(task.difficulty)}>
                {task.difficulty}
              </Badge>
              {task.timeEstimate && (
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.timeEstimate}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mb-3">
          {!isCompleted && (
            <LiquidGlassButton
              variant="emerald"
              size="sm"
              onClick={() => onStartTask(task.id)}
              className="flex-1"
            >
              {isActive ? 'Continue Task' : 'Start Task'}
            </LiquidGlassButton>
          )}
          
          <LiquidGlassButton
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className=""
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </LiquidGlassButton>
        </div>

        {/* Collapsible details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-white/10">
                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white/90 mb-2">Description</h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Requirements */}
                {task.requirements && task.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white/90 mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {task.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional actions */}
                <div className="flex gap-2">
                  <LiquidGlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(task.id)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View Details
                  </LiquidGlassButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
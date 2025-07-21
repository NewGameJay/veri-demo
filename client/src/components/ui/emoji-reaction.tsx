import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Contextual emoji mappings for different interaction types
const contextualEmojis = {
  taskComplete: {
    gaming: ["🎮", "🔥", "🎯", "⚡", "🚀", "💥", "🏆", "⭐"],
    social: ["📱", "❤️", "👥", "🔔", "📢", "✨", "🌟", "💫"],
    achievement: ["🏅", "👑", "💎", "🎊", "🎉", "🥇", "⚡", "💪"],
    streak: ["🔥", "⚡", "💥", "🚀", "⭐", "✨", "💯", "🎯"],
    xpGain: ["📈", "💰", "⬆️", "🔺", "💎", "⚡", "🌟", "🎊"]
  },
  socialConnect: {
    twitter: ["🐦", "💙", "📱", "🔄", "✨", "🎉", "🤝", "🔗"],
    instagram: ["📸", "💗", "🌈", "✨", "🎨", "💫", "📱", "⭐"],
    youtube: ["📺", "❤️", "🎬", "🔔", "👥", "🎥", "⭐", "🚀"],
    twitch: ["💜", "🎮", "📺", "⚡", "🔥", "🎯", "👥", "✨"],
    general: ["🎉", "✨", "🤝", "💫", "🌟", "🔗", "📱", "⭐"]
  },
  milestone: {
    levelUp: ["📈", "⬆️", "🌟", "💫", "✨", "🎊", "🎉", "🚀"],
    rankUp: ["👑", "🏆", "🥇", "💎", "⚡", "🔥", "⭐", "💪"],
    firstTime: ["🎉", "🎊", "✨", "⭐", "🌟", "💫", "🎈", "🎁"],
    perfect: ["💯", "⭐", "🏆", "💎", "👑", "🔥", "✨", "💫"]
  },
  engagement: {
    like: ["❤️", "💕", "😍", "🔥", "⚡", "✨", "💯", "👍"],
    share: ["🔄", "📢", "💫", "⭐", "🚀", "✨", "📱", "🌟"],
    comment: ["💬", "🗨️", "💭", "✨", "🤝", "👥", "📝", "⭐"],
    follow: ["👥", "🤝", "⭐", "💫", "✨", "🔔", "📱", "🌟"]
  }
};

interface EmojiReactionProps {
  type: 'taskComplete' | 'socialConnect' | 'milestone' | 'engagement';
  category?: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
  onComplete?: () => void;
  trigger?: boolean;
  position?: 'center' | 'corner' | 'follow-cursor';
  style?: 'burst' | 'cascade' | 'pulse' | 'float';
}

export function EmojiReaction({ 
  type, 
  category = 'general', 
  count = 5, 
  size = 'md', 
  duration = 3000,
  onComplete,
  trigger = false,
  position = 'center',
  style = 'burst'
}: EmojiReactionProps) {
  const [showReaction, setShowReaction] = useState(false);
  const [emojis, setEmojis] = useState<string[]>([]);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  // Get contextual emojis based on type and category
  const getContextualEmojis = () => {
    const categoryEmojis = contextualEmojis[type]?.[category as keyof typeof contextualEmojis[typeof type]] || 
                          contextualEmojis[type]?.['general' as keyof typeof contextualEmojis[typeof type]] ||
                          ['⭐', '✨', '🎉'];
    
    // Shuffle and pick random emojis
    const shuffled = [...categoryEmojis].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (trigger) {
      setEmojis(getContextualEmojis());
      setShowReaction(true);
      
      const timer = setTimeout(() => {
        setShowReaction(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, type, category, count, duration]);

  const getPositionClasses = () => {
    switch (position) {
      case 'center':
        return 'fixed inset-0 flex items-center justify-center';
      case 'corner':
        return 'fixed top-4 right-4';
      case 'follow-cursor':
        return 'fixed pointer-events-none';
      default:
        return 'fixed inset-0 flex items-center justify-center';
    }
  };

  const renderBurstStyle = () => (
    <div className="relative">
      {emojis.map((emoji, index) => (
        <motion.div
          key={`${emoji}-${index}`}
          className={`absolute ${sizeClasses[size]} select-none`}
          initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0],
            x: Math.cos((index / emojis.length) * 2 * Math.PI) * 100,
            y: Math.sin((index / emojis.length) * 2 * Math.PI) * 100,
            rotate: [0, 360]
          }}
          transition={{ 
            duration: duration / 1000,
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );

  const renderCascadeStyle = () => (
    <div className="relative">
      {emojis.map((emoji, index) => (
        <motion.div
          key={`${emoji}-${index}`}
          className={`absolute ${sizeClasses[size]} select-none`}
          initial={{ scale: 0, opacity: 0, y: -20 }}
          animate={{ 
            scale: [0, 1.1, 1],
            opacity: [0, 1, 0],
            y: [-20, 0, 50],
            x: (index - emojis.length / 2) * 30
          }}
          transition={{ 
            duration: duration / 1000,
            delay: index * 0.2,
            ease: "easeOut"
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );

  const renderPulseStyle = () => (
    <div className="flex gap-2">
      {emojis.map((emoji, index) => (
        <motion.div
          key={`${emoji}-${index}`}
          className={`${sizeClasses[size]} select-none`}
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.3, 1, 1.1, 1],
            opacity: [0, 1, 1, 1, 0]
          }}
          transition={{ 
            duration: duration / 1000,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );

  const renderFloatStyle = () => (
    <div className="relative">
      {emojis.map((emoji, index) => (
        <motion.div
          key={`${emoji}-${index}`}
          className={`absolute ${sizeClasses[size]} select-none`}
          initial={{ scale: 0, opacity: 0, y: 0 }}
          animate={{ 
            scale: [0, 1, 1],
            opacity: [0, 1, 0],
            y: [0, -80, -120],
            x: (index - emojis.length / 2) * 20 + Math.random() * 40 - 20
          }}
          transition={{ 
            duration: duration / 1000,
            delay: index * 0.15,
            ease: "easeOut"
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );

  const renderStyleContent = () => {
    switch (style) {
      case 'burst': return renderBurstStyle();
      case 'cascade': return renderCascadeStyle();
      case 'pulse': return renderPulseStyle();
      case 'float': return renderFloatStyle();
      default: return renderBurstStyle();
    }
  };

  return (
    <AnimatePresence>
      {showReaction && (
        <motion.div
          className={`${getPositionClasses()} pointer-events-none z-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {renderStyleContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy emoji reactions
export function useEmojiReaction() {
  const [reactions, setReactions] = useState<Array<{
    id: string;
    type: EmojiReactionProps['type'];
    category?: string;
    count?: number;
    size?: EmojiReactionProps['size'];
    duration?: number;
    position?: EmojiReactionProps['position'];
    style?: EmojiReactionProps['style'];
  }>>([]);

  const triggerReaction = (config: {
    type: EmojiReactionProps['type'];
    category?: string;
    count?: number;
    size?: EmojiReactionProps['size'];
    duration?: number;
    position?: EmojiReactionProps['position'];
    style?: EmojiReactionProps['style'];
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newReaction = { ...config, id };
    
    setReactions(prev => [...prev, newReaction]);
    
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, config.duration || 3000);
  };

  return { reactions, triggerReaction };
}

// Contextual emoji trigger based on interaction context
export function getContextualEmojiConfig(
  interaction: string, 
  platform?: string, 
  achievement?: string
): { type: EmojiReactionProps['type']; category: string; style: EmojiReactionProps['style'] } {
  // Task completion reactions
  if (interaction.includes('task') && interaction.includes('complete')) {
    if (platform?.includes('gaming') || achievement?.includes('game')) {
      return { type: 'taskComplete', category: 'gaming', style: 'burst' };
    }
    if (platform?.includes('social') || achievement?.includes('social')) {
      return { type: 'taskComplete', category: 'social', style: 'cascade' };
    }
    if (achievement?.includes('streak')) {
      return { type: 'taskComplete', category: 'streak', style: 'pulse' };
    }
    return { type: 'taskComplete', category: 'achievement', style: 'burst' };
  }

  // Social connection reactions
  if (interaction.includes('social') || interaction.includes('connect')) {
    const socialPlatform = platform?.toLowerCase() || 'general';
    return { type: 'socialConnect', category: socialPlatform, style: 'cascade' };
  }

  // Milestone reactions
  if (interaction.includes('milestone') || interaction.includes('level') || interaction.includes('rank')) {
    if (achievement?.includes('first')) {
      return { type: 'milestone', category: 'firstTime', style: 'burst' };
    }
    if (achievement?.includes('perfect') || achievement?.includes('100')) {
      return { type: 'milestone', category: 'perfect', style: 'pulse' };
    }
    if (interaction.includes('level')) {
      return { type: 'milestone', category: 'levelUp', style: 'float' };
    }
    return { type: 'milestone', category: 'rankUp', style: 'burst' };
  }

  // Engagement reactions
  if (interaction.includes('like') || interaction.includes('heart')) {
    return { type: 'engagement', category: 'like', style: 'pulse' };
  }
  if (interaction.includes('share') || interaction.includes('retweet')) {
    return { type: 'engagement', category: 'share', style: 'cascade' };
  }
  if (interaction.includes('comment') || interaction.includes('reply')) {
    return { type: 'engagement', category: 'comment', style: 'float' };
  }
  if (interaction.includes('follow') || interaction.includes('subscribe')) {
    return { type: 'engagement', category: 'follow', style: 'burst' };
  }

  // Default fallback
  return { type: 'taskComplete', category: 'achievement', style: 'burst' };
}
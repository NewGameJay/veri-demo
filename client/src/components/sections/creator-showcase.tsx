import { Twitter, Instagram, Youtube, Heart, MessageCircle, Share, Play, ThumbsUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";

export function CreatorShowcase() {
  const showcaseItems = [
    {
      id: 1,
      platform: "twitter",
      icon: Twitter,
      username: "@samhuber",
      timeAgo: "2 days ago",
      content: "Just launched my new course on content creation! 🚀 The response has been incredible - over 1000 students in the first week.",
      bgColor: "bg-blue-500",
      stats: [
        { icon: Heart, count: 892 },
        { icon: MessageCircle, count: 156 },
        { icon: Share, count: 202 },
      ],
    },
    {
      id: 2,
      platform: "instagram",
      icon: Instagram,
      username: "@samhuber",
      timeAgo: "1 day ago",
      content: "Behind the scenes of my content creation process ✨",
      bgColor: "bg-pink-500",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      stats: [
        { icon: Heart, count: 4200 },
        { icon: MessageCircle, count: 380 },
      ],
    },
    {
      id: 3,
      platform: "youtube",
      icon: Youtube,
      username: "Sam Huber",
      timeAgo: "1 week ago",
      content: "How to grow on social media in 2025: The complete guide",
      bgColor: "bg-red-500",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
      stats: [
        { icon: Play, count: 15600 },
        { icon: ThumbsUp, count: 12400 },
      ],
    },
  ];

  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Creator Showcase</h2>
          <p className="text-xl text-white/60">See how creators are building their brands and earning with Veri</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item) => {
            const Icon = item.icon;
            return (
              <GlassCard key={item.id} hover className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 ${item.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.username}</div>
                      <div className="text-xs text-white/60">{item.timeAgo}</div>
                    </div>
                  </div>
                  
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={`${item.platform} content`} 
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <p className="text-sm text-white/80 mb-4">{item.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    {item.stats.map((stat, index) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={index} className="flex items-center gap-1">
                          <StatIcon className="w-4 h-4" />
                          <span>{stat.count > 1000 ? `${(stat.count / 1000).toFixed(1)}K` : stat.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

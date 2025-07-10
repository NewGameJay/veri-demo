import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";

import Screenshot_2025_07_10_at_2_22_43_PM_1 from "@assets/Screenshot 2025-07-10 at 2.22.43 PM 1.png";

export function GettingStarted() {
  const steps = [
    {
      number: 1,
      title: "Connect your social profiles",
      description: "Link your Twitter, Instagram, YouTube, and other social media accounts to get started.",
    },
    {
      number: 2,
      title: "Complete content tasks",
      description: "Participate in sponsored content opportunities and brand partnerships.",
    },
    {
      number: 3,
      title: "Get insights and analytics",
      description: "Track your performance and optimize your content strategy with detailed analytics.",
    },
    {
      number: 4,
      title: "Use your VeriAd AI agent",
      description: "Let AI help you create better content and find new opportunities.",
    },
    {
      number: 5,
      title: "Earn XP and rewards",
      description: "Build your VeriScore and unlock better opportunities and higher payouts.",
    },
  ];

  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Getting started</h2>
          <p className="text-xl text-white/60">The steps to get your revenue flowing from social</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-sm text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <GlassCard className="p-8">
            <CardContent className="p-0">
              <img 
                src={Screenshot_2025_07_10_at_2_22_43_PM_1} 
                alt="Social media analytics dashboard" 
                className="w-full h-auto rounded-xl mb-6"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-2">Join 10,000+ creators</div>
                <p className="text-white/60">Already earning with Veri</p>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 via-transparent to-gray-800/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      ></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white">
          Create to Resonate.<br />
          <span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">
            Impact to Earn.
          </span>
        </h1>
        <p className="text-xl lg:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
          Build your audience, drive genuine engagement, and turn your influence into meaningful earnings. Join creators, brands, and communities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onGetStarted}
            className="px-8 py-4 veri-gradient rounded-xl font-semibold text-white hover-scale transition-all duration-200"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="px-8 py-4 glass-effect rounded-xl font-semibold hover-scale transition-all duration-200 border-white/20 text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
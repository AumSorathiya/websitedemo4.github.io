import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExploreClick: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6 leading-tight">
          "Drape yourself<br />
          <span className="text-bravenza-gold font-medium">in Legacy."</span>
        </h1>
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-bravenza-gold transform rotate-45"></div>
            <div className="w-3 h-3 bg-bravenza-gold transform rotate-45"></div>
            <div className="w-3 h-3 bg-bravenza-gold transform rotate-45"></div>
          </div>
        </div>
        <Button 
          onClick={onExploreClick}
          variant="outline"
          className="bg-transparent border-2 border-bravenza-gold text-bravenza-gold hover:bg-bravenza-gold hover:text-black transition-all duration-300 font-medium px-8 py-3"
        >
          Explore Now
        </Button>
      </div>
    </section>
  );
}

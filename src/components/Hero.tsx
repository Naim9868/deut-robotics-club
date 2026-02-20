import React, { useState, useEffect } from 'react';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  images: { url: string; alt: string; order: number }[];
  primaryButton: { text: string; link: string };
  secondaryButton: { text: string; link: string };
  autoSlideInterval: number;
  isActive: boolean;
}

const Hero: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch hero data from API only on page load
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/hero');
        
        if (!res.ok) {
          throw new Error(`Failed to fetch hero data: ${res.status}`);
        }
        const data = await res.json();

        if (data.length > 0) {
          const item = data[0];
          setHeroData(item);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching hero data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load hero data');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Image slider effect
  useEffect(() => {
    if (!heroData?.images?.length || !heroData?.isActive) return;

    const interval = heroData.autoSlideInterval || 6000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroData.images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [heroData?.images?.length, heroData?.autoSlideInterval, heroData?.isActive]);

  // Show loading state if needed
  if (loading) {
    return (
      <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if needed
  if (error || !heroData) {
    return (
      <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-dark">
        <div className="text-center text-white">
          <p className="text-red-500 text-xl mb-4">Error loading content</p>
          <p className="text-gray-400">{error || 'No hero data available'}</p>
        </div>
      </div>
    );
  }

  // Sort images by order
  const sortedImages = [...heroData.images].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-dark">
      {/* Dynamic Image Slider */}
      <div className="absolute inset-0 z-0">
        {sortedImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out transform ${
              index === currentIndex 
                ? 'opacity-100 translate-x-0 scale-100' 
                : index < currentIndex 
                ? 'opacity-0 -translate-x-full scale-110' 
                : 'opacity-0 translate-x-full scale-110'
            }`}
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.50), rgba(5,5,5,0.2), rgba(5,5,5,0.75)), url('${img.url}')`,
              zIndex: index === currentIndex ? 1 : 0
            }}
            role="img"
            aria-label={img.alt || 'Hero background'}
          />
        ))}
      </div>

      {/* Simplified Overlay Grid */}
      <div className="absolute inset-0 z-[2] opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #e63946 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <p className="text-primary text-sm font-black mb-4 uppercase tracking-wider">
                    {heroData.subtitle}
                  </p>
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-tight mb-8 text-white select-none whitespace-nowrap overflow-hidden">
          <span className="inline-block animate-[fadeInUp_1s_ease-out_forwards]">
            {heroData.title.split('Innovators')[0]} 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary text-glow drop-shadow-2xl">
              Innovators
            </span><br/>
            {heroData.title.split('Innovators')[1]}
          </span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-100 mb-12 font-medium tracking-wide leading-relaxed animate-[fadeIn_2s_ease-out_forwards] drop-shadow-lg">
          {heroData.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-[fadeIn_2.5s_ease-out_forwards]">
          <a 
            href={heroData.primaryButton.link}
            className="group relative px-12 py-5 bg-primary overflow-hidden text-white font-black uppercase tracking-[0.2em] text-[12px] transition-all rounded-sm hover:scale-105 active:scale-95 shadow-2xl"
          >
            <span className="relative z-10 group-hover:text-dark transition-colors duration-300">{heroData.primaryButton.text}</span>
            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </a>
          
          <a 
            href={heroData.secondaryButton.link}
            className="group relative px-12 py-5 border-2 border-white/20 text-white font-black uppercase tracking-[0.2em] text-[12px] hover:border-primary transition-all overflow-hidden rounded-sm bg-black/30 backdrop-blur-md shadow-2xl"
          >
            <span className="relative z-10">{heroData.secondaryButton.text}</span>
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        </div>
      </div>

      {/* Visual Navigation Indicators */}
      {sortedImages.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {sortedImages.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-16 bg-primary' : 'w-4 bg-white/30'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
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

// Fallback data in case API fails
const FALLBACK_DATA: HeroData = {
  title: 'Empowering Future Innovators Through Robotics',
  subtitle: 'DUET Robotics Club',
  description: 'Transforming robotics at Dhaka University of Engineering & Technology(DUET). The future is autonomous, and we are building it.',
  images: [
    {
      url: 'https://drc.duetbd.org/wp-content/uploads/2020/02/DRC-techfest.jpg',
      alt: 'DRC Techfest',
      order: 0
    },
    {
      url: 'https://media.licdn.com/dms/image/v2/D5622AQF6f76CDIlH-g/feedshare-shrink_800/B56ZZxkuf8GUAg-/0/1745662177924?e=1772064000&v=beta&t=odVGNYcbLBXMtXdQ3JKP8LjZW4_Q6LZWDPocqBxV47Q',
      alt: 'DRC Event',
      order: 1
    },
    {
      url: 'https://www.ewubd.edu/storage/app/public/news/image/1703661271news-single.jpg',
      alt: 'EWU Event',
      order: 2
    }
  ],
  primaryButton: { text: 'Join the Mission', link: '#contact' },
  secondaryButton: { text: 'Explore Projects', link: '#projects' },
  autoSlideInterval: 6000,
  isActive: true
};

const Hero: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
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
          setHeroData(data[0]);
        }
      } catch (err) {
        console.error('Error fetching hero data, using fallback:', err);
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Image slider effect
  useEffect(() => {
    if (!heroData?.images?.length || !heroData?.isActive) return;

    const interval = heroData.autoSlideInterval || 6000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroData.images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [heroData?.images?.length, heroData?.autoSlideInterval, heroData?.isActive]);

  // Sort images by order
  const sortedImages = [...(heroData?.images || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Safe title rendering function
  const renderTitle = () => {
    if (!heroData?.title) return null;
    
    const title = heroData.title;
    
    if (title.includes('Innovators')) {
      const parts = title.split('Innovators');
      return (
        <span className="inline-block animate-[fadeInUp_1s_ease-out_forwards]">
          {parts[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary text-glow drop-shadow-2xl">
            Innovators
          </span>
          {parts[1]}
        </span>
      );
    }
    
    // If "Innovators" not found, return full title
    return (
      <span className="inline-block animate-[fadeInUp_1s_ease-out_forwards]">
        {title}
      </span>
    );
  };

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

  return (
    <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-dark">
      {/* Dynamic Image Slider */}
      {sortedImages.length > 0 && (
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
      )}

      {/* Simplified Overlay Grid */}
      <div className="absolute inset-0 z-[2] opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #e63946 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {heroData?.subtitle && (
          <p className="text-primary text-sm font-black mb-4 uppercase tracking-wider">
            {heroData.subtitle}
          </p>
        )}
        
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-tight mb-8 text-white select-none overflow-hidden">
          {renderTitle()}
        </h1>
        
        {heroData?.description && (
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-100 mb-12 font-medium tracking-wide leading-relaxed animate-[fadeIn_2s_ease-out_forwards] drop-shadow-lg">
            {heroData.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-[fadeIn_2.5s_ease-out_forwards]">
          {heroData?.primaryButton && (
            <a 
              href={heroData.primaryButton.link || '#contact'}
              className="group relative px-12 py-5 bg-primary overflow-hidden text-white font-black uppercase tracking-[0.2em] text-[12px] transition-all rounded-sm hover:scale-105 active:scale-95 shadow-2xl"
            >
              <span className="relative z-10 group-hover:text-dark transition-colors duration-300">
                {heroData.primaryButton.text || 'Join the Mission'}
              </span>
              <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </a>
          )}
          
          {heroData?.secondaryButton && (
            <a 
              href={heroData.secondaryButton.link || '#projects'}
              className="group relative px-12 py-5 border-2 border-white/20 text-white font-black uppercase tracking-[0.2em] text-[12px] hover:border-primary transition-all overflow-hidden rounded-sm bg-black/30 backdrop-blur-md shadow-2xl"
            >
              <span className="relative z-10">{heroData.secondaryButton.text || 'Explore Projects'}</span>
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
          )}
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
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import FocusAreaIcon from './FocusAreaIcon';

interface FocusAreaData {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  icon: string;
  iconType?: 'lucide' | 'image';
  color: string;
  order: number;
  isActive: boolean;
}

const FocusAreas: React.FC = () => {
  const [focusAreas, setFocusAreas] = useState<FocusAreaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFocusAreas = async () => {
      try {
        const response = await fetch('/api/focus-areas');
        if (!response.ok) {
          throw new Error('Failed to fetch focus areas data');
        }
        const data = await response.json();
        
        const activeAreas = Array.isArray(data) 
          ? data
              .filter((item: FocusAreaData) => item.isActive)
              .sort((a, b) => a.order - b.order)
              .map((item: FocusAreaData) => ({
                ...item,
                description: item.description || item.shortDescription || '',
              }))
          : [];
        
        setFocusAreas(activeAreas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFocusAreas();
  }, []);

  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-500 text-sm sm:text-base">
          {error}
        </div>
      </div>
    );
  }

  const displayAreas = focusAreas.length > 0 ? focusAreas : [
    {
      _id: '1',
      title: 'Line Follower',
      slug: 'line-follower',
      description: 'Engineering high-precision autonomous vehicles that navigate complex paths with PID control.',
      icon: 'Bot',
      iconType: 'lucide' as const,
      color: '#e63946',
      order: 0,
      isActive: true
    },
    {
      _id: '2',
      title: 'Fire Fighting',
      slug: 'fire-fighting',
      description: 'Smart robotics integrated with flame detection sensors and autonomous firefighting mechanisms.',
      icon: 'Flame',
      iconType: 'lucide' as const,
      color: '#e63946',
      order: 1,
      isActive: true
    },
    {
      _id: '3',
      title: 'Aerial Drones',
      slug: 'aerial-drones',
      description: 'Developing VTOL systems and autonomous flight path algorithms for surveillance and delivery.',
      icon: 'Plane',
      iconType: 'lucide' as const,
      color: '#e63946',
      order: 2,
      isActive: true
    },
    {
      _id: '4',
      title: 'Soccer Bots',
      slug: 'soccer-bots',
      description: 'Advanced real-time control systems for high-speed dynamic gameplay and strategic maneuvering.',
      icon: 'Gamepad2',
      iconType: 'lucide' as const,
      color: '#e63946',
      order: 3,
      isActive: true
    }
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 md:mb-14 lg:mb-20 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title sm:text-left">
              Our Focus
            </h2>
            <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm lg:text-base max-w-xl mx-auto sm:mx-0 text-center sm:text-left uppercase tracking-[0.1em] sm:tracking-[0.2em]">
              We are actively developing and researching these core robotic systems to solve real-world problems.
            </p>
          </div>
          <Link href={displayAreas.length > 0 && displayAreas[0].slug ? `/focus-areas/${displayAreas[0].slug}` : '#'} className="flex-shrink-0">
            <button className="group inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs rounded-full hover:border-primary/50 hover:text-primary transition-all duration-300">
              See All
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {displayAreas.map((area, index) => (
          <ScrollReveal key={area._id || index} animation="up" delay={index * 100}>
            <Link href={area.slug ? `/focus-areas/${area.slug}` : '#'}>
            <div 
              className="group p-4 sm:p-5 md:p-6 lg:p-8 bg-card border border-white/[0.06] sm:border-white/5 rounded-xl sm:hover:border-primary/50 transition-all duration-500 sm:hover:-translate-y-1 shadow-[0_1px_3px_rgba(0,0,0,0.3)] sm:shadow-none h-full flex flex-col cursor-pointer"
            >
              <div 
                className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4 lg:mb-6 transition-all transform sm:group-hover:scale-110 sm:group-hover:rotate-6"
              >
                <FocusAreaIcon
                  icon={area.icon}
                  iconType={area.iconType}
                  color={area.color}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
  
                />
              </div>
              <h3 
                className="text-xs sm:text-sm md:text-base lg:text-xl font-bold uppercase mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 text-white sm:group-hover:text-primary transition-colors line-clamp-2"
              >
                {area.title}
              </h3>
              <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-relaxed flex-1 line-clamp-3 sm:line-clamp-3 md:line-clamp-4">
                {area.description}
              </p>
            </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
      
      {displayAreas.length === 0 && (
        <div className="text-center text-gray-400 text-sm sm:text-base py-8 sm:py-12">
          No focus areas available.
        </div>
      )}
    </div>
  );
};

export default FocusAreas;

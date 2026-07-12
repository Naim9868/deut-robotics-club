import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface FocusAreaData {
  _id: string;
  title: string;
  description: string;
  icon: string;
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
      description: 'Engineering high-precision autonomous vehicles that navigate complex paths with PID control.',
      icon: '🏎️',
      color: '#e63946',
      order: 0,
      isActive: true
    },
    {
      _id: '2',
      title: 'Fire Fighting',
      description: 'Smart robotics integrated with flame detection sensors and autonomous firefighting mechanisms.',
      icon: '🔥',
      color: '#e63946',
      order: 1,
      isActive: true
    },
    {
      _id: '3',
      title: 'Aerial Drones',
      description: 'Developing VTOL systems and autonomous flight path algorithms for surveillance and delivery.',
      icon: '🚁',
      color: '#e63946',
      order: 2,
      isActive: true
    },
    {
      _id: '4',
      title: 'Soccer Bots',
      description: 'Advanced real-time control systems for high-speed dynamic gameplay and strategic maneuvering.',
      icon: '⚽',
      color: '#e63946',
      order: 3,
      isActive: true
    }
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title  sm:text-left">
            Our Focus
          </h2>
          <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm lg:text-base max-w-xl mx-auto sm:mx-0 text-center sm:text-left uppercase tracking-[0.1em] sm:tracking-[0.2em]">
            We are actively developing and researching these core robotic systems to solve real-world problems.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {displayAreas.map((area, index) => (
          <ScrollReveal key={area._id || index} animation="up" delay={index * 100}>
            <div
              className="group shadow-amber-50 p-4 sm:p-5 md:p-6 lg:p-8 bg-card border border-white/5 rounded-xl hover:border-primary/70 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-[2px_2px_10px_rgba(230,57,73,0.15)] sm:hover:shadow-[4px_4px_15px_rgba(230,57,70,0.2)] h-full flex flex-col"
            >
              <div
                className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4 lg:mb-6 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 group-hover:rotate-6"
                style={{ color: area.color }}
              >
                <span className="w-10 h-10 bg-white rounded flex items-center justify-center text-sm italic flex-shrink-0">
                  {/* Use standard img to avoid Next.js Image type issues in this component */}
                  <img
                    src={area.icon}
                    alt={area.title}
                    width={60}
                    height={40}
                    className="object-contain"
                  />
                </span>
              </div>
              <h3
                className="text-xs sm:text-sm md:text-base lg:text-xl font-bold uppercase mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 text-white group-hover:text-primary transition-colors line-clamp-2"
                style={{ color: area.color ? undefined : undefined }}
              >
                {area.title}
              </h3>
              <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-relaxed flex-1 line-clamp-3 sm:line-clamp-3 md:line-clamp-4">
                {area.description}
              </p>
            </div>
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
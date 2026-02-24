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
        
        // Filter active focus areas and sort by order
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
      <div className="py-32 container mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 container mx-auto px-4">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // Use focus areas from API if available, otherwise use fallback data
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
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold uppercase mb-4 section-title">Our Focus</h2>
          <p className="text-gray-500 max-w-xl">We are actively developing and researching these core robotic systems to solve real-world problems.</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayAreas.map((area, index) => (
          <ScrollReveal key={area._id || index} animation="up" delay={index * 100}>
            <div 
              className="group p-8 bg-card border border-white/5 rounded-xl hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(230,57,70,0.15)]"
              style={{ 
                borderColor: area.color ? `${area.color}20` : undefined,
                boxShadow: area.color ? `0 0 30px ${area.color}10` : undefined
              }}
            >
              <div 
                className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 group-hover:rotate-6"
                style={{ color: area.color }}
              >
                {area.icon}
              </div>
              <h3 
                className="text-xl font-bold uppercase mb-4 text-white group-hover:text-primary transition-colors"
                style={{ color: area.color ? undefined : undefined }}
              >
                {area.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{area.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
      
      {/* Show message if no focus areas */}
      {displayAreas.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No focus areas available.
        </div>
      )}
    </div>
  );
};

export default FocusAreas;
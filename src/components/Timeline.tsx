import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface TimelineData {
  _id: string;
  year: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alt: string;
  };
  achievements?: string[];
  order: number;
  isActive: boolean;
}

const Timeline: React.FC = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch('/api/timeline');
        if (!response.ok) {
          throw new Error('Failed to fetch timeline data');
        }
        const data = await response.json();
        
        // Filter active items and sort by order
        const activeItems = Array.isArray(data) 
          ? data
              .filter((item: TimelineData) => item.isActive)
              .sort((a, b) => a.order - b.order)
          : [];
        
        setTimelineItems(activeItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <div className="py-32 bg-dark relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 bg-dark relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Use timeline items from API if available, otherwise use fallback data
  const displayItems = timelineItems.length > 0 ? timelineItems : [
    { 
      _id: '1',
      year: '2015', 
      title: 'Foundation', 
      description: 'A handful of visionaries started DRC with a single room and a dream.',
      order: 0,
      isActive: true
    },
    { 
      _id: '2',
      year: '2018', 
      title: 'National Level', 
      description: 'First major victory at a national robotics festival, winning Gold in LFR.',
      order: 1,
      isActive: true
    },
    { 
      _id: '3',
      year: '2021', 
      title: 'Drone Division', 
      description: 'Established the specialized aerial robotics wing for autonomous flight research.',
      order: 2,
      isActive: true
    },
    { 
      _id: '4',
      year: '2023', 
      title: 'Innovation Award', 
      description: 'Recognized as the most active engineering club in Bangladesh by DUET Authority.',
      order: 3,
      isActive: true
    },
    { 
      _id: '5',
      year: '2025', 
      title: 'The Future', 
      description: 'Pioneering AI-integrated robotics and sustainable hardware solutions.',
      order: 4,
      isActive: true
    }
  ];

  return (
    <div className="py-32 bg-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal animation="up">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title after:mx-auto">Our Journey</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">Milestones that defined our legacy</p>
          </div>
        </ScrollReveal>

        <div className="space-y-12 md:space-y-0">
          {displayItems.map((item, idx) => (
            <div key={item._id || idx} className={`flex flex-col md:flex-row items-center justify-center w-full mb-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-5/12 hidden md:block"></div>
              
              <ScrollReveal animation="blur" delay={idx * 100} className="z-20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dark border-2 border-primary text-primary font-black text-xs shrink-0 shadow-[0_0_15px_rgba(230,57,70,0.3)]">
                  {item.year}
                </div>
              </ScrollReveal>

              <ScrollReveal 
                animation={idx % 2 === 0 ? 'right' : 'left'} 
                delay={idx * 150} 
                className={`w-full md:w-5/12 p-8 bg-card border border-white/5 rounded-2xl md:mx-12 hover:border-primary/30 transition-all relative overflow-hidden ${idx % 2 === 0 ? 'text-left md:text-right' : 'text-left'}`}
              >
                {/* Background image with overlay */}
                {item.image?.url && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center z-0"
                      style={{ 
                        backgroundImage: `url(${item.image.url})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 z-0" />
                  </>
                )}
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white uppercase mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  
                  {/* Display achievements if available */}
                  {item.achievements && item.achievements.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {item.achievements.map((achievement, aidx) => (
                        <div key={aidx} className="flex items-start gap-2 text-xs text-primary/80">
                          <span className="text-primary mt-1">▶</span>
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
        
        {/* Show message if no timeline items */}
        {displayItems.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No timeline data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
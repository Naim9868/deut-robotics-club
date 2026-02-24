import React, { useState, useEffect } from 'react';

interface SponsorData {
  _id: string;
  name: string;
  logo: {
    url: string;
    alt?: string;
    publicId?: string;
  };
  website?: string;
  category: 'PLATINUM' | 'GOLD' | 'SILVER' | 'PARTNER';
  description?: string;
  order: number;
  isActive: boolean;
}

const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('/api/sponsors');
        if (!response.ok) {
          throw new Error('Failed to fetch sponsors data');
        }
        const data = await response.json();
        
        // Filter active sponsors and sort by category priority and order
        const activeSponsors = Array.isArray(data) 
          ? data
              .filter((item: SponsorData) => item.isActive)
              .sort((a, b) => {
                // Define category priority
                const categoryPriority = {
                  'PLATINUM': 1,
                  'GOLD': 2,
                  'SILVER': 3,
                  'PARTNER': 4
                };
                
                // First sort by category priority
                if (categoryPriority[a.category] !== categoryPriority[b.category]) {
                  return categoryPriority[a.category] - categoryPriority[b.category];
                }
                // Then by order
                return a.order - b.order;
              })
          : [];
        
        setSponsors(activeSponsors);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-dark overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 mb-12">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.8em] text-primary/100">Global Network Partners</p>
        </div>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 bg-dark overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 mb-12">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.8em] text-primary/100">Global Network Partners</p>
        </div>
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // Use sponsors from API if available, otherwise use fallback data
  const displaySponsors = sponsors.length > 0 
    ? sponsors.map(s => s.name) 
    : [
        "TECH-X", "GENESIS", "NEXUS ROBOTICS", "DUET ALUMNI", "ROBOMASTER",
        "CYBERDYNE", "BOSTON DYNAMICS", "INTEL", "NVIDIA", "TESLA"
      ];

  return (
    <div className="py-24 bg-dark overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 mb-12">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.8em] text-primary/100">Global Network Partners</p>
      </div>
      
      <div className="flex relative group">
        <div className="flex animate-marquee whitespace-nowrap">
          {displaySponsors.concat(displaySponsors).map((sponsor, idx) => (
            <div 
              key={idx} 
              className="mx-12 text-3xl md:text-5xl font-black italic text-white/90 hover:text-primary transition-all duration-500 cursor-default uppercase tracking-tighter"
            >
              {typeof sponsor === 'string' ? sponsor : sponsor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
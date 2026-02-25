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

// Define category type
type CategoryType = 'PLATINUM' | 'GOLD' | 'SILVER' | 'PARTNER';

// Category priority mapping - defined outside component to prevent recreation
const CATEGORY_PRIORITY: Record<CategoryType, number> = {
  'PLATINUM': 1,
  'GOLD': 2,
  'SILVER': 3,
  'PARTNER': 4
};

// Fallback sponsor names - defined outside component
const FALLBACK_SPONSORS = [
  "TECH-X", "GENESIS", "NEXUS ROBOTICS", "DUET ALUMNI", "ROBOMASTER",
  "CYBERDYNE", "BOSTON DYNAMICS", "INTEL", "NVIDIA", "TESLA"
];

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
                // Safely get priority values with type assertion
                const aPriority = CATEGORY_PRIORITY[a.category as CategoryType];
                const bPriority = CATEGORY_PRIORITY[b.category as CategoryType];
                
                // First sort by category priority
                if (aPriority !== bPriority) {
                  return aPriority - bPriority;
                }
                // Then by order
                return a.order - b.order;
              })
          : [];
        
        setSponsors(activeSponsors);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Use empty array - fallback will handle display
        setSponsors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []); // Empty dependency array - no dependencies needed

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
        <div className="text-center text-gray-500">
          {/* Show fallback even on error */}
          <div className="flex relative group">
            <div className="flex animate-marquee whitespace-nowrap">
              {FALLBACK_SPONSORS.concat(FALLBACK_SPONSORS).map((sponsor, idx) => (
                <div 
                  key={idx} 
                  className="mx-12 text-3xl md:text-5xl font-black italic text-white/90 hover:text-primary transition-all duration-500 cursor-default uppercase tracking-tighter"
                >
                  {sponsor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use sponsors from API if available, otherwise use fallback data
  const displaySponsors = sponsors.length > 0 
    ? sponsors.map(s => s.name) 
    : FALLBACK_SPONSORS;

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
              {sponsor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
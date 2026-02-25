import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

interface GalleryData {
  _id: string;
  title: string;
  description?: string;
  image: {
    url: string;
    alt?: string;
  };
  category?: string;
  date?: string;
  featured: boolean;
  order: number;
  isActive: boolean;
}

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe date formatter
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery?limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        const data = await response.json();
        
        // Filter active items, sort by order, and limit to 6 for homepage
        const activeItems = Array.isArray(data) 
          ? data
              .filter((item: GalleryData) => item.isActive)
              .sort((a, b) => a.order - b.order)
              .slice(0, 6)
          : [];
        
        setGalleryItems(activeItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
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

  // Use gallery items from API if available, otherwise use fallback data
  const displayItems = galleryItems.length > 0 ? galleryItems : [
    { 
      _id: '1',
      title: 'Midnight Lab Session', 
      image: { url: 'https://picsum.photos/seed/lab1/800/600', alt: 'Midnight Lab Session' },
      category: 'Lab',
      date: '2024-01-15',
      order: 0,
      isActive: true,
      featured: false
    },
    { 
      _id: '2',
      title: 'Techfest Champions', 
      image: { url: 'https://picsum.photos/seed/comp1/400/600', alt: 'Techfest Champions' },
      category: 'Events',
      date: '2024-02-20',
      order: 1,
      isActive: true,
      featured: false
    },
    { 
      _id: '3',
      title: 'Soldering Workshop', 
      image: { url: 'https://picsum.photos/seed/work1/400/400', alt: 'Soldering Workshop' },
      category: 'Workshops',
      date: '2024-03-10',
      order: 2,
      isActive: true,
      featured: false
    },
    { 
      _id: '4',
      title: 'Quadcopter Test Flight', 
      image: { url: 'https://picsum.photos/seed/drone2/800/400', alt: 'Quadcopter Test Flight' },
      category: 'Lab',
      date: '2024-04-05',
      order: 3,
      isActive: true,
      featured: false
    },
    { 
      _id: '5',
      title: 'Gold Medal Moments', 
      image: { url: 'https://picsum.photos/seed/award2/400/600', alt: 'Gold Medal Moments' },
      category: 'Events',
      date: '2024-05-12',
      order: 4,
      isActive: true,
      featured: false
    },
    { 
      _id: '6',
      title: 'PCB Design Flow', 
      image: { url: 'https://picsum.photos/seed/robo2/400/400', alt: 'PCB Design Flow' },
      category: 'Workshops',
      date: '2024-06-18',
      order: 5,
      isActive: true,
      featured: false
    }
  ].slice(0, 6);

  return (
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title after:mx-auto">Inside DRC</h2>
          <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">Capturing the essence of innovation</p>
        </div>
      </ScrollReveal>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {displayItems.map((item, idx) => (
          <ScrollReveal key={item._id || idx} animation="scale" delay={idx * 100} className="break-inside-avoid">
            <div className="relative group overflow-hidden rounded-xl bg-card">
              <img 
                src={item.image?.url} 
                alt={item.image?.alt || item.title} 
                className="w-full h-auto object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-6 pointer-events-none">
                <h4 className="text-white font-bold uppercase text-sm tracking-wider">{item.title}</h4>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">
                  {item.category || 'DUET Robotics Club'}
                </p>
                {item.date && (
                  <p className="text-gray-400 text-[8px] uppercase tracking-wider mt-1">
                    {formatDate(item.date)}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* See More Button */}
      <ScrollReveal animation="up">
        <div className="mt-16 flex justify-center">
          <Link href="/gallery">
            <button className="group relative px-10 py-4 bg-transparent border border-white/20 text-white font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all duration-300 hover:border-primary hover:text-primary">
              <span className="relative z-10">See More</span>
              <div className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </Link>
        </div>
      </ScrollReveal>

      {displayItems.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No gallery images found.
        </div>
      )}
    </div>
  );
};

export default Gallery;
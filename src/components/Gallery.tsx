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

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
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
    <div className="py-12 sm:py-16 md:py-20 lg:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">
            Inside DRC
          </h2>
          <p className="text-gray-500 uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">
            Capturing the essence of innovation
          </p>
        </div>
      </ScrollReveal>

      <div className="columns-2 sm:columns-2 md:columns-2 lg:columns-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
        {displayItems.map((item, idx) => (
          <ScrollReveal key={item._id || idx} animation="scale" delay={idx * 100} className="break-inside-avoid">
            <div className="relative group overflow-hidden rounded-lg sm:rounded-xl bg-card">
              <img 
                src={item.image?.url} 
                alt={item.image?.alt || item.title} 
                className="w-full h-auto object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-4 md:p-5 lg:p-6 pointer-events-none">
                <h4 className="text-white font-bold uppercase text-[10px] sm:text-xs md:text-sm tracking-wider line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-primary text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-0.5 sm:mt-1">
                  {item.category || 'DUET Robotics Club'}
                </p>
                {item.date && (
                  <p className="text-gray-400 text-[6px] sm:text-[7px] md:text-[8px] uppercase tracking-wider mt-0.5 sm:mt-1">
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
        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 flex justify-center">
          <Link href="/gallery">
            <button className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-transparent border border-white/20 text-white font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs md:text-sm overflow-hidden transition-all duration-300 hover:border-primary hover:text-primary">
              <span className="relative z-10">See More</span>
              <div className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </Link>
        </div>
      </ScrollReveal>

      {displayItems.length === 0 && (
        <div className="text-center text-gray-400 text-sm sm:text-base py-8 sm:py-12">
          No gallery images found.
        </div>
      )}
    </div>
  );
};

export default Gallery;
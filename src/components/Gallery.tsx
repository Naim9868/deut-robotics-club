import React, { useState, useEffect, useCallback } from 'react';
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
  videoUrl?: string;
  category?: string;
  date?: string;
  featured: boolean;
  order: number;
  isActive: boolean;
}

const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  const facebookMatch = url.match(/facebook\.com\/.*\/videos\/(\d+)/);
  if (facebookMatch) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
  return url;
};

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryData | null>(null);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());

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

  const openItem = useCallback((item: GalleryData) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeItem = useCallback(() => {
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  }, []);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedItem) {
        closeItem();
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [selectedItem, closeItem]);

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
              .filter((item: GalleryData) => item.isActive && item.featured)
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

  const displayItems: GalleryData[] = galleryItems.length > 0 ? galleryItems : [
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
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">
            Capturing the essence of innovation
          </p>
        </div>
      </ScrollReveal>

      <div className="columns-2 sm:columns-2 md:columns-2 lg:columns-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
        {displayItems.map((item, idx) => (
          <ScrollReveal key={item._id || idx} animation="scale" delay={idx * 100} className="break-inside-avoid">
            {item.videoUrl ? (
              <div className="relative group overflow-hidden rounded-lg sm:rounded-xl bg-card">
                {playingVideos.has(item._id) ? (
                  <iframe
                    src={getEmbedUrl(item.videoUrl)}
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={item.title}
                  />
                ) : (
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => setPlayingVideos(prev => new Set(prev).add(item._id))}
                  >
                    {item.image?.url ? (
                      <img 
                        src={item.image.url} 
                        alt={item.image?.alt || item.title} 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-muted flex items-center justify-center">
                        <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="relative group overflow-hidden rounded-lg sm:rounded-xl bg-card cursor-pointer"
                onClick={() => openItem(item)}
              >
                {item.image?.url ? (
                  <img 
                    src={item.image.url} 
                    alt={item.image?.alt || item.title} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-4 md:p-5 lg:p-6 pointer-events-none">
                  <h4 className="text-foreground font-bold uppercase text-[10px] sm:text-xs md:text-sm tracking-wider line-clamp-2">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-muted text-[8px] sm:text-[9px] md:text-[10px] line-clamp-2 mt-0.5 sm:mt-1">
                      {item.description}
                    </p>
                  )}
                  <p className="text-primary text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-0.5 sm:mt-1">
                    {item.category || 'DUET Robotics Club'}
                  </p>
                  {item.date && (
                    <p className="text-muted text-[6px] sm:text-[7px] md:text-[8px] uppercase tracking-wider mt-0.5 sm:mt-1">
                      {formatDate(item.date)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal animation="up">
        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 flex justify-center">
          <Link href="/gallery">
            <button className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-transparent border border-border text-foreground font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs md:text-sm overflow-hidden transition-all duration-300 hover:border-primary hover:text-primary">
              <span className="relative z-10">See More</span>
              <div className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </Link>
        </div>
      </ScrollReveal>

      {displayItems.length === 0 && (
        <div className="text-center text-muted text-sm sm:text-base py-8 sm:py-12">
          No gallery items found.
        </div>
      )}

      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={closeItem}
        >
          <button
            onClick={closeItem}
            className="absolute top-4 right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-200 border border-border/10"
            aria-label="Close"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative w-full max-w-5xl mx-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.videoUrl ? (
              <iframe
                src={getEmbedUrl(selectedItem.videoUrl)}
                className="w-full aspect-video rounded-lg sm:rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedItem.title}
              />
            ) : selectedItem.image?.url ? (
              <img
                src={selectedItem.image.url}
                alt={selectedItem.image?.alt || selectedItem.title}
                className="w-auto max-w-full max-h-[80vh] mx-auto object-contain rounded-lg sm:rounded-2xl"
              />
            ) : null}

            <div className="mt-4 text-center">
              <h2 className="text-lg sm:text-xl font-bold text-white">{selectedItem.title}</h2>
              {selectedItem.description && (
                <p className="text-muted text-sm mt-1">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

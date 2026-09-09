// app/gallery/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

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

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [categories, setCategories] = useState<string[]>(['ALL']);
  const [activeSection, setActiveSection] = useState('gallery');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        const data = await response.json();
        
        const activeItems = Array.isArray(data) 
          ? data
              .filter((item: GalleryData) => item.isActive)
              .sort((a: GalleryData, b: GalleryData) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
              })
          : [];
        
        setGalleryItems(activeItems);

        const uniqueCategories = ['ALL', ...new Set(activeItems.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredItems = useMemo(() => 
    activeCategory === 'ALL' 
      ? galleryItems 
      : galleryItems.filter(item => item.category === activeCategory),
    [galleryItems, activeCategory]
  );

  const openLightbox = useCallback((item: GalleryData) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

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

  const goToPrevious = useCallback(() => {
    if (!selectedImage || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex(item => item._id === selectedImage._id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setSelectedImage(filteredItems[prevIndex]);
  }, [selectedImage, filteredItems]);

  const goToNext = useCallback(() => {
    if (!selectedImage || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex(item => item._id === selectedImage._id);
    const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredItems[nextIndex]);
  }, [selectedImage, filteredItems]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeLightbox();
      }
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    window.addEventListener('keydown', handleArrowKeys);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [selectedImage, goToPrevious, goToNext, closeLightbox]);

  if (loading) {
    return (
      <>
        <Navbar activeSection={activeSection} />
        <div className="min-h-screen bg-background pt-32">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar activeSection={activeSection} />
        <div className="min-h-screen bg-background pt-32">
          <div className="text-center text-red-500 py-20">
            {error}
          </div>
        </div>
        <Footer />
      </>
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
      featured: true
    },
    { 
      _id: '2',
      title: 'Techfest Champions', 
      image: { url: 'https://picsum.photos/seed/comp1/400/600', alt: 'Techfest Champions' },
      category: 'Events',
      date: '2024-02-20',
      order: 1,
      isActive: true,
      featured: true
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
      featured: true
    },
    { 
      _id: '5',
      title: 'Gold Medal Moments', 
      image: { url: 'https://picsum.photos/seed/award2/400/600', alt: 'Gold Medal Moments' },
      category: 'Events',
      date: '2024-05-12',
      order: 4,
      isActive: true,
      featured: true
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
    },
    { 
      _id: '7',
      title: 'Team Meeting', 
      image: { url: 'https://picsum.photos/seed/team1/600/400', alt: 'Team Meeting' },
      category: 'Team',
      date: '2024-07-22',
      order: 6,
      isActive: true,
      featured: false
    },
    { 
      _id: '8',
      title: 'Robotics Competition', 
      image: { url: 'https://picsum.photos/seed/robo3/400/600', alt: 'Robotics Competition' },
      category: 'Competitions',
      date: '2024-08-30',
      order: 7,
      isActive: true,
      featured: true
    }
  ];

  return (
    <>
      <Navbar activeSection={activeSection} />
      <div className="min-h-screen bg-background pt-32 pb-24">
        {/* ─── Back to Home Button ────────────────────── */}
        <Link href="/" className="absolute top-18 left-4 sm:left-6 z-40 flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-md border border-border/10 rounded-lg text-muted hover:text-foreground hover:border-border/20 transition-all text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Home
        </Link>

        <div className="container mx-auto px-4 mt-10">
          {/* Header */}
          <ScrollReveal animation="up">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-black uppercase mb-4 section-title after:mx-auto">
                Gallery
              </h1>
              <p className="text-muted uppercase text-xs font-bold tracking-[0.3em]">
                Moments captured in time
              </p>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal animation="up" delay={100}>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-primary text-foreground'
                      : 'bg-transparent text-muted hover:text-foreground border border-border/10 hover:border-primary/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {filteredItems.map((item, idx) => (
              <ScrollReveal 
                key={item._id} 
                animation="scale" 
                delay={idx * 50}
              >
                <div 
                  onClick={() => openLightbox(item)}
                  className="group cursor-pointer relative aspect-square overflow-hidden bg-card rounded-xl sm:rounded-2xl border border-border/5 hover:border-primary/30 transition-colors duration-200"
                >
                  {item.videoUrl ? (
                    <div className="w-full h-full relative">
                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.image?.alt || item.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/90 flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : item.image?.url ? (
                    <img
                      src={item.image.url}
                      alt={item.image?.alt || item.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Category tag */}
                  {item.category && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary/90 text-white text-[6px] sm:text-[8px] font-black uppercase tracking-wider rounded-full shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  )}

                  {/* Featured indicator */}
                  {item.featured && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center text-muted py-20">
              <svg className="w-20 h-20 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No items found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-200 border border-border/10"
            aria-label="Close"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-200 border border-border/10"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-200 border border-border/10"
            aria-label="Next"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border/10">
            <span className="text-white text-xs sm:text-sm">
              {filteredItems.findIndex(item => item._id === selectedImage._id) + 1} / {filteredItems.length}
            </span>
          </div>

          {/* Main content - responsive layout */}
          <div 
            className="relative w-full max-w-7xl mx-auto flex flex-col max-h-[95vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image / Video */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0">
              {selectedImage.videoUrl ? (
                <iframe
                  src={getEmbedUrl(selectedImage.videoUrl)}
                  className="w-full max-h-[55vh] sm:max-h-[70vh] aspect-video rounded-lg sm:rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedImage.title}
                />
              ) : selectedImage.image?.url ? (
                <img
                  src={selectedImage.image.url}
                  alt={selectedImage.image?.alt || selectedImage.title}
                  className="max-h-[55vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-lg sm:rounded-2xl"
                />
              ) : null}
            </div>

            {/* Description below image on mobile, overlay on desktop */}
            <div className="sm:hidden px-4 pb-4 flex-shrink-0">
              <div className="bg-card rounded-xl p-4 border border-border/10">
                <h2 className="text-lg font-bold text-foreground mb-1">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-muted text-sm mb-2">{selectedImage.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs">
                  {selectedImage.category && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-[10px] font-bold">
                      {selectedImage.category}
                    </span>
                  )}
                  {selectedImage.date && (
                    <span className="text-muted text-[10px]">
                      {new Date(selectedImage.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop: overlay on image */}
            <div className="hidden sm:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pointer-events-none">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h2>
              {selectedImage.description && (
                <p className="text-muted mb-3">{selectedImage.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm">
                {selectedImage.category && (
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">
                    {selectedImage.category}
                  </span>
                )}
                {selectedImage.date && (
                  <span className="text-muted">
                    {new Date(selectedImage.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

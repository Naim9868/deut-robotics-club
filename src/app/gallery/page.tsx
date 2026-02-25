// app/gallery/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [activeSection, setActiveSection] = useState('gallery'); // Add this

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        const data = await response.json();
        
        // Filter active items and sort by order
        const activeItems = Array.isArray(data) 
          ? data
              .filter((item: GalleryData) => item.isActive)
              .sort((a, b) => a.order - b.order)
          : [];
        
        setGalleryItems(activeItems);

        // Extract unique categories
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

  // Memoized filtered items
  const filteredItems = useMemo(() => 
    activeCategory === 'ALL' 
      ? galleryItems 
      : galleryItems.filter(item => item.category === activeCategory),
    [galleryItems, activeCategory]
  );

  // Optimized lightbox handlers
  const openLightbox = useCallback((item: GalleryData) => {
    console.log('Opening lightbox with item:', item); // Debug log
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    console.log('Closing lightbox'); // Debug log
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

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

  // Handle escape key press
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
        <Navbar activeSection={activeSection} /> {/* Fixed: added activeSection prop */}
        <div className="min-h-screen bg-dark pt-32">
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
        <Navbar activeSection={activeSection} /> {/* Fixed: added activeSection prop */}
        <div className="min-h-screen bg-dark pt-32">
          <div className="text-center text-red-500 py-20">
            {error}
          </div>
        </div>
        <Footer />
      </>
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
      <Navbar activeSection={activeSection} /> {/* Fixed: added activeSection prop */}
      <div className="min-h-screen bg-dark pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <ScrollReveal animation="up">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 section-title after:mx-auto">
                Gallery
              </h1>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">
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
                  className={`px-6 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-gray-500 hover:text-white border border-white/10 hover:border-primary/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, idx) => (
              <ScrollReveal 
                key={item._id} 
                animation="scale" 
                delay={idx * 50}
              >
                <div 
                  onClick={() => openLightbox(item)}
                  className="group cursor-pointer relative aspect-square overflow-hidden bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-primary/30 transition-colors duration-200"
                >
                  <img
                    src={item.image?.url}
                    alt={item.image?.alt || item.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
                      {item.date && (
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category tag */}
                  {item.category && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-primary/90 text-white text-[8px] font-black uppercase tracking-wider rounded-full shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  )}

                  {/* Featured indicator */}
                  {item.featured && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 text-yellow-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
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
            <div className="text-center text-gray-400 py-20">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No images found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-200 border border-white/10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-200 border border-white/10"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-200 border border-white/10"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <span className="text-white text-sm">
              {filteredItems.findIndex(item => item._id === selectedImage._id) + 1} / {filteredItems.length}
            </span>
          </div>

          {/* Main image container */}
          <div 
            className="relative max-w-7xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10">
              <img
                src={selectedImage.image?.url}
                alt={selectedImage.image?.alt || selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Image info bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-gray-300 mb-3">{selectedImage.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  {selectedImage.category && (
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">
                      {selectedImage.category}
                    </span>
                  )}
                  {selectedImage.date && (
                    <span className="text-gray-400">
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
        </div>
      )}

      <Footer />
    </>
  );
}
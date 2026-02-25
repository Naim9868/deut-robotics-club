import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  text: string;
  avatar: {
    url: string;
    alt?: string;
    publicId?: string;
  };
  rating: number;
  featured: boolean;
  order: number;
  isActive: boolean;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null); // Fixed: Added | null and initialized with null

  // Fallback testimonials
  const fallbackTestimonials: TestimonialData[] = [
    {
      _id: '1',
      name: 'Rafiqul Islam',
      role: 'Alumni, Robotics Engineer at TechCo',
      text: 'Joining DRC was the turning point of my undergraduate life. The hands-on experience with real robots is unmatched.',
      avatar: { url: 'https://ui-avatars.com/api/?name=Rafiqul+Islam&background=1e1e1e&color=e63946&size=200' },
      rating: 5,
      featured: true,
      order: 0,
      isActive: true
    },
    {
      _id: '2',
      name: 'Sumaiya Akhter',
      role: 'Lead Researcher, AI Lab',
      text: 'The community here is incredible. You\'re not just learning robotics; you\'re building lifelong connections with innovators.',
      avatar: { url: 'https://ui-avatars.com/api/?name=Sumaiya+Akhter&background=1e1e1e&color=e63946&size=200' },
      rating: 5,
      featured: true,
      order: 1,
      isActive: true
    },
    {
      _id: '3',
      name: 'Anwar Hossain',
      role: 'National Techfest Winner 2024',
      text: 'From simple line followers to complex drones, DRC gave me the confidence to compete on international stages.',
      avatar: { url: 'https://ui-avatars.com/api/?name=Anwar+Hossain&background=1e1e1e&color=e63946&size=200' },
      rating: 5,
      featured: false,
      order: 2,
      isActive: true
    },
    {
      _id: '4',
      name: 'Fatema Begum',
      role: 'Software Engineer, Google',
      text: 'DRC provided me with the foundation I needed to excel in my career. The projects and mentorship were invaluable.',
      avatar: { url: 'https://ui-avatars.com/api/?name=Fatema+Begum&background=1e1e1e&color=e63946&size=200' },
      rating: 5,
      featured: true,
      order: 3,
      isActive: true
    },
    {
      _id: '5',
      name: 'Tanvir Ahmed',
      role: 'PhD Candidate, MIT',
      text: 'The research culture at DRC is exceptional. It prepared me for graduate studies at top universities.',
      avatar: { url: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=1e1e1e&color=e63946&size=200' },
      rating: 5,
      featured: false,
      order: 4,
      isActive: true
    }
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials data');
        }
        const data = await response.json();
        
        // Filter active testimonials and sort by featured and order
        const activeTestimonials = Array.isArray(data) && data.length > 0
          ? data
              .filter((item: TestimonialData) => item.isActive)
              .sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return a.order - b.order;
              })
          : fallbackTestimonials;
        
        setTestimonials(activeTestimonials);
        // Set active index to middle of array (or 2 if less than 5)
        setActiveIndex(Math.min(2, Math.floor(activeTestimonials.length / 2)));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Use fallback on error
        setTestimonials(fallbackTestimonials);
        setActiveIndex(Math.min(2, Math.floor(fallbackTestimonials.length / 2)));
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextCard = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevCard = () => {
    if (testimonials.length === 0) return;
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToCard = (index: number) => {
    setActiveIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (testimonials.length > 0 && isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextCard();
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  // Calculate positions for 3D effect
  const getCardPosition = (index: number) => {
    const total = testimonials.length;
    if (total === 0) return { translateX: 0, translateZ: 0, scale: 0, opacity: 0 };
    
    const relativeIndex = (index - activeIndex + total) % total;

    if (relativeIndex === 0)
      return { translateX: 0, translateZ: 0, scale: 1.1, opacity: 1 };
    if (relativeIndex === 1 || relativeIndex === total - 1) {
      const isRight = relativeIndex === 1;
      return {
        translateX: isRight ? 300 : -300,
        translateZ: -50,
        scale: 0.85,
        opacity: 0.6,
      };
    }
    if (relativeIndex === 2 || relativeIndex === total - 2) {
      const isRight = relativeIndex === 2;
      return {
        translateX: isRight ? 500 : -500,
        translateZ: -100,
        scale: 0.7,
        opacity: 0.3,
      };
    }

    return { translateX: 0, translateZ: -150, scale: 0.5, opacity: 0 };
  };

  // Render star rating
  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-32 bg-[#0d0d0d]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-0 bg-[#0d0d0d] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-40"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 section-title after:mx-auto tracking-tighter">
            Testimonials
          </h2>
          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.5em] mt-4">
            What our members say
          </p>
        </motion.div>

        {/* Slider Container */}
        {testimonials.length > 0 && (
          <div
            className="relative w-full h-[450px] md:h-[500px] mb-0 group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            style={{ perspective: "1000px" }}
          >
            {/* Navigation Arrows */}
            <button
              onClick={prevCard}
              className="absolute left-0 sm:left-4 md:left-8 top-1/4 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full md:bg-white/10 backdrop-blur-sm md:border md:border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 focus:outline-none"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextCard}
              className="absolute right-0 sm:right-4 md:right-8 top-1/4 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full md:bg-white/10 md:backdrop-blur-sm md:border md:border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 focus:outline-none"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Cards Track */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {testimonials.map((testimonial, index) => {
                  const position = getCardPosition(index);

                  return (
                    <div
                      key={testimonial._id}
                      className="absolute w-[300px] md:w-[350px] left-1/2 top-0 -ml-[150px] md:-ml-[175px]"
                      style={{
                        transform: `translateX(${position.translateX}px) translateZ(${position.translateZ}px) scale(${position.scale})`,
                        opacity: position.opacity,
                        zIndex: testimonials.length - Math.abs(index - activeIndex),
                        transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease",
                        backfaceVisibility: "visible",
                      }}
                      onClick={() => goToCard(index)}
                    >
                      <div className="relative p-8 bg-card border border-white/5 rounded-2xl hover:border-primary/30 transition-all duration-300 group shadow-2xl cursor-pointer">
                        <div className="absolute top-0 right-8 -translate-y-1/2 text-8xl text-primary/70 font-serif italic group-hover:text-primary/90 transition-colors">“</div>
                        
                        {/* Rating stars */}
                        {renderStars(testimonial.rating)}
                        
                        <p className="text-gray-300 text-[10px] italic mb-6 relative z-10 leading-relaxed line-clamp-12">
                          {testimonial.text}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          {/* Avatar */}
                          {testimonial.avatar?.url && !testimonial.avatar.url.includes('ui-avatars') ? (
                            <img 
                              src={testimonial.avatar.url} 
                              alt={testimonial.avatar.alt || testimonial.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
                              {testimonial.name.charAt(0)}
                            </div>
                          )}
                          
                          <div>
                            <h4 className="text-white font-bold uppercase text-xs">{testimonial.name}</h4>
                            <p className="text-gray-500 text-[8px] uppercase font-bold tracking-widest">{testimonial.role}</p>
                          </div>
                        </div>
                        
                        {/* Featured badge */}
                        {testimonial.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-primary/20 text-primary text-[6px] font-black uppercase tracking-wider rounded-full border border-primary/30">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty state */}
        {testimonials.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No testimonials available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
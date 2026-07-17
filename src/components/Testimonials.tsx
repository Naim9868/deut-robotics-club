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
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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
        setActiveIndex(Math.min(2, Math.floor(activeTestimonials.length / 2)));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
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

  useEffect(() => {
    if (testimonials.length > 0 && isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextCard();
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  const getCardPosition = (index: number) => {
    const total = testimonials.length;
    if (total === 0) return { translateX: 0, translateZ: 0, scale: 0, opacity: 0 };
    
    const relativeIndex = (index - activeIndex + total) % total;

    if (relativeIndex === 0) {
      return { translateX: 0, translateZ: 0, scale: 1.1, opacity: 1 };
    }
    if (relativeIndex === 1 || relativeIndex === total - 1) {
      const isRight = relativeIndex === 1;
      return {
        translateX: isRight ? 200 : -200,
        translateZ: -50,
        scale: 0.8,
        opacity: 0.6,
      };
    }
    if (relativeIndex === 2 || relativeIndex === total - 2) {
      const isRight = relativeIndex === 2;
      return {
        translateX: isRight ? 380 : -380,
        translateZ: -100,
        scale: 0.6,
        opacity: 0.3,
      };
    }

    return { translateX: 0, translateZ: -150, scale: 0.4, opacity: 0 };
  };

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex space-x-0.5 sm:space-x-1 mb-2 sm:mb-3 md:mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${i < rating ? 'text-yellow-500' : 'text-muted'}`}
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
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-muted/10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-32"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto tracking-tighter">
            Testimonials
          </h2>
          <p className="text-muted uppercase text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] mt-2 sm:mt-3 md:mt-4">
            What our members say
          </p>
        </motion.div>

        {testimonials.length > 0 && (
          <div
            className="relative w-full h-[380px] sm:h-[400px] md:h-[440px] lg:h-[480px] xl:h-[520px] mb-0 group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            style={{ perspective: "1000px" }}
          >
            {/* Left Arrow Button - Always Visible */}
            <button
              onClick={prevCard}
              className="absolute left-0 sm:left-2 md:left-4 lg:-left-6 xl:-left-10 top-[55%] -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-background hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none shadow-lg"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow Button - Always Visible */}
            <button
              onClick={nextCard}
              className="absolute right-0 sm:right-2 md:right-4 lg:-right-6 xl:-right-10 top-[55%] -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-background hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none shadow-lg"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

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
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={testimonial._id}
                      className={`absolute w-[280px] sm:w-[300px] md:w-[340px] lg:w-[400px] xl:w-[440px] left-1/2 top-0 -ml-[140px] sm:-ml-[150px] md:-ml-[170px] lg:-ml-[200px] xl:-ml-[220px] ${
                        isActive ? 'cursor-default' : 'cursor-pointer'
                      }`}
                      style={{
                        transform: `translateX(${position.translateX}px) translateZ(${position.translateZ}px) scale(${position.scale})`,
                        opacity: position.opacity,
                        zIndex: testimonials.length - Math.abs(index - activeIndex),
                        transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease",
                        backfaceVisibility: "visible",
                      }}
                      onClick={() => goToCard(index)}
                    >
                      <div className={`relative p-5 sm:p-6 md:p-7 lg:p-9 xl:p-10 bg-card border rounded-2xl transition-all duration-300 shadow-2xl ${
                        isActive 
                          ? 'border-primary/50 shadow-[0_0_40px_rgba(230,57,70,0.2)] lg:shadow-[0_0_60px_rgba(230,57,70,0.15)]' 
                          : 'border-border hover:border-primary/30'
                      }`}>
                        <div className={`absolute top-3 sm:top-4 md:top-5 right-5 sm:right-6 md:right-7 lg:right-9 xl:right-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary/70 font-serif italic ${
                          isActive ? 'text-primary/90' : 'group-hover:text-primary/90'
                        } transition-colors`}>
                          "
                        </div>
                        
                        <div className="relative z-10">
                          {testimonial.featured && (
                            <div className="mb-2 sm:mb-2.5 md:mb-3">
                              <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/20 text-primary text-[5px] sm:text-[6px] font-black uppercase tracking-wider rounded-full border border-primary/30">
                                Featured
                              </span>
                            </div>
                          )}
                          
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        <p className={`text-muted text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base italic mb-3 sm:mb-4 md:mb-5 lg:mb-6 relative z-10 leading-relaxed line-clamp-6 sm:line-clamp-8 md:line-clamp-10 lg:line-clamp-12 ${
                          isActive ? 'text-foreground' : ''
                        }`}>
                          {testimonial.text}
                        </p>
                        
                        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 relative z-10">
                          {testimonial.avatar?.url && !testimonial.avatar.url.includes('ui-avatars') ? (
                            <img 
                              src={testimonial.avatar.url} 
                              alt={testimonial.avatar.alt || testimonial.name}
                              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-primary/30 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs sm:text-sm md:text-base flex-shrink-0">
                              {testimonial.name.charAt(0)}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-foreground font-bold uppercase text-[10px] sm:text-[11px] md:text-xs lg:text-sm truncate">
                              {testimonial.name}
                            </h4>
                            <p className="text-muted text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase font-bold tracking-widest truncate">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5 sm:space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCard(index)}
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-6 sm:w-8 md:w-10 lg:w-12 bg-primary'
                      : 'w-1.5 sm:w-2 bg-foreground/30 hover:bg-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {testimonials.length === 0 && (
          <div className="text-center text-muted text-sm sm:text-base py-8 sm:py-12">
            No testimonials available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
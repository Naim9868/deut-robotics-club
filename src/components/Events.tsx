import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface EventData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: {
    day: string;
    month: string;
    year?: string;
    fullDate?: string;
  };
  location?: string;
  image: {
    url: string;
    alt?: string;
    publicId?: string;
  };
  registrationLink?: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events data');
        }
        const data = await response.json();
        
        // Filter active events, sort by order and featured
        const activeEvents = Array.isArray(data) 
          ? data
              .filter((event: EventData) => event.isActive)
              .sort((a, b) => {
                // First sort by featured (featured first)
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                // Then by order
                return a.order - b.order;
              })
              // .slice(0, 3) // Limit to 3 events for homepage
          : [];
        
        setEvents(activeEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

  // Use events from API if available, otherwise use fallback data
  const displayEvents = events.length > 0 ? events : [
    {
      _id: '1',
      title: 'DUET Techfest 2025',
      slug: 'duet-techfest-2025',
      description: 'The biggest national-level technology festival on campus.',
      date: { day: '25', month: 'MAR', year: '2025' },
      image: { url: 'https://picsum.photos/seed/techfest2/800/400', alt: 'DUET Techfest 2025' },
      featured: true,
      isActive: true,
      order: 0
    },
    {
      _id: '2',
      title: 'Robo-Workshop 101',
      slug: 'robo-workshop-101',
      description: 'Introductory hands-on training for newly recruited members.',
      date: { day: '10', month: 'FEB', year: '2025' },
      image: { url: 'https://picsum.photos/seed/workshop2/800/400', alt: 'Robo-Workshop 101' },
      featured: false,
      isActive: true,
      order: 1
    },
    {
      _id: '3',
      title: 'Intra-Robo Carnival',
      slug: 'intra-robo-carnival',
      description: 'Annual competition showcase for internal club projects.',
      date: { day: '15', month: 'JAN', year: '2025' },
      image: { url: 'https://picsum.photos/seed/carnival2/800/400', alt: 'Intra-Robo Carnival' },
      featured: false,
      isActive: true,
      order: 2
    }
  ];

  return (
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 section-title tracking-tighter">Mission Updates</h2>
          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.5em] mt-4">Stay updated with our latest operational breakthroughs</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {displayEvents.map((event, idx) => (
          <ScrollReveal key={event._id || idx} animation="up" delay={idx * 150}>
            <div className="group bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-2xl relative">
              <div className="relative h-60 overflow-hidden">
                <div className="absolute top-6 right-6 z-10 bg-primary/90 backdrop-blur-md text-white px-4 py-2 min-w-[70px] text-center rounded shadow-2xl group-hover:scale-110 transition-transform">
                  <div className="text-2xl font-black leading-none">{event.date.day}</div>
                  <div className="text-[10px] font-black tracking-widest mt-1 opacity-80">{event.date.month}</div>
                </div>
                <img 
                  src={event.image?.url || event.image} 
                  alt={event.image?.alt || event.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80" />
              </div>
              <div className="p-10 relative">
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors uppercase leading-tight">{event.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">{event.description}</p>
                
                {/* Location badge if available */}
                {event.location && (
                  <div className="mb-4 text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                )}
                
                {/* Use registration link if available, otherwise just button */}
                {event.registrationLink ? (
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    <button className="group/btn relative px-8 py-3 overflow-hidden rounded border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:text-white">
                      <span className="relative z-10">Register Now</span>
                      <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </button>
                  </a>
                ) : (
                  <button className="group/btn relative px-8 py-3 overflow-hidden rounded border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:text-white">
                    <span className="relative z-10">Operational Details</span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      
      {/* Show message if no events */}
      {displayEvents.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No upcoming events at the moment.
        </div>
      )}
    </div>
  );
};

export default Events;
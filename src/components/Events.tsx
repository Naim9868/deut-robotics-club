import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { ArrowUpIcon, ArrowDownIcon, MapPinIcon, LinkIcon } from 'lucide-react';

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

interface EventsProps {
  events?: EventData[];
  onEdit?: (event: EventData) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  isAdmin?: boolean;
}

const Events: React.FC<EventsProps> = ({ 
  events: propEvents, 
  onEdit, 
  onDelete, 
  onMove,
  isAdmin = false 
}) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propEvents) {
      setEvents(propEvents);
      setLoading(false);
    } else {
      fetchEvents();
    }
  }, [propEvents]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events data');
      }
      const data = await response.json();
      
      const activeEvents = Array.isArray(data) 
        ? data
            .filter((event: EventData) => event.isActive)
            .sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return a.order - b.order;
            })
        : [];
      
      setEvents(activeEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const moveEvent = (id: string, direction: 'up' | 'down') => {
    if (onMove) {
      onMove(id, direction);
    }
  };

  const handleEdit = (event: EventData) => {
    if (onEdit) {
      onEdit(event);
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

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

  const displayEvents = events.length > 0 ? events : [
    {
      _id: '1',
      title: 'DUET Techfest 2025',
      slug: 'duet-techfest-2025',
      description: 'The biggest national-level technology festival on campus with workshops, competitions, and guest speakers from leading tech companies.',
      date: { day: '25', month: 'MAR', year: '2025' },
      location: 'DUET Campus',
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
      location: 'Robotics Lab',
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
      location: 'Auditorium',
      image: { url: 'https://picsum.photos/seed/carnival2/800/400', alt: 'Intra-Robo Carnival' },
      featured: false,
      isActive: true,
      order: 2
    },
    {
      _id: '4',
      title: 'AI Symposium 2025',
      slug: 'ai-symposium-2025',
      description: 'Exploring the future of artificial intelligence in robotics.',
      date: { day: '05', month: 'APR', year: '2025' },
      location: 'Conference Hall',
      image: { url: 'https://picsum.photos/seed/ai-symposium/800/400', alt: 'AI Symposium 2025' },
      featured: false,
      isActive: true,
      order: 3
    }
  ];

  // Separate featured/latest event and other events
  const featuredEvent = displayEvents.find(event => event.featured) || displayEvents[0];
  const otherEvents = displayEvents.filter(event => event._id !== featuredEvent?._id);

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title tracking-tighter text-center sm:text-left">
            Mission Updates
          </h2>
          <p className="text-gray-500 uppercase text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.5em] mt-2 sm:mt-3 md:mt-4 text-center sm:text-left">
            Stay updated with our latest operational breakthroughs
          </p>
        </div>
      </ScrollReveal>

      {/* Featured/Latest Event - Full Width */}
      {featuredEvent && (
        <ScrollReveal animation="up" delay={0}>
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(230,57,70,0.1)]">
              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => moveEvent(featuredEvent._id, 'up')}
                    className="p-1 bg-black/70 hover:bg-black rounded text-white"
                    title="Move Up"
                    disabled={displayEvents.indexOf(featuredEvent) === 0}
                  >
                    <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => moveEvent(featuredEvent._id, 'down')}
                    className="p-1 bg-black/70 hover:bg-black rounded text-white"
                    title="Move Down"
                  >
                    <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}

              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={() => handleEdit(featuredEvent)} 
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-600 text-white text-[8px] sm:text-xs rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(featuredEvent._id)} 
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-600 text-white text-[8px] sm:text-xs rounded hover:bg-red-700"
                  >
                    Del
                  </button>
                </div>
              )}

              {/* Featured Badge */}
              <div className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/90 text-white text-[7px] sm:text-xs rounded-full z-10">
                Featured
              </div>

              {/* Event Image */}
              {featuredEvent.image?.url && (
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
                  <img 
                    src={featuredEvent.image.url} 
                    alt={featuredEvent.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Event+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                </div>
              )}

              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
                  {/* Date Badge */}
                  <div className="bg-primary/20 text-primary px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-lg text-center flex-shrink-0">
                    <div className="text-xl sm:text-2xl md:text-3xl font-black leading-none">{featuredEvent.date?.day}</div>
                    <div className="text-[8px] sm:text-[9px] md:text-xs font-bold">{featuredEvent.date?.month}</div>
                    {featuredEvent.date?.year && (
                      <div className="text-[6px] sm:text-[7px] md:text-[10px] text-gray-400">{featuredEvent.date.year}</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-2xl lg:text-3xl leading-tight mb-1 sm:mb-2">
                      {featuredEvent.title}
                    </h3>
                    
                    {/* Location */}
                    {featuredEvent.location && (
                      <div className="flex items-center gap-0.5 sm:gap-1 text-gray-400 text-[8px] sm:text-[10px] md:text-xs mb-1 sm:mb-2">
                        <MapPinIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                        <span>{featuredEvent.location}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-relaxed mb-2 sm:mb-3">
                      {featuredEvent.description}
                    </p>

                    {/* Registration Link */}
                    {featuredEvent.registrationLink && (
                      <a 
                        href={featuredEvent.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 sm:gap-1 text-primary text-[8px] sm:text-[10px] md:text-xs hover:underline"
                      >
                        <LinkIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                        Register Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Other Events - 2 Columns */}
      {otherEvents.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {otherEvents.map((event, index) => (
            <ScrollReveal key={event._id} animation="up" delay={(index + 1) * 100}>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(230,57,70,0.1)] h-full flex flex-col">
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => moveEvent(event._id, 'up')}
                      className="p-1 bg-black/70 hover:bg-black rounded text-white"
                      title="Move Up"
                    >
                      <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => moveEvent(event._id, 'down')}
                      className="p-1 bg-black/70 hover:bg-black rounded text-white"
                      title="Move Down"
                    >
                      <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => handleEdit(event)} 
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-600 text-white text-[8px] sm:text-xs rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)} 
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-600 text-white text-[8px] sm:text-xs rounded hover:bg-red-700"
                    >
                      Del
                    </button>
                  </div>
                )}

                {/* Featured Badge - Only if featured */}
                {event.featured && (
                  <div className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/90 text-white text-[7px] sm:text-xs rounded-full z-10">
                    Featured
                  </div>
                )}

                {/* Event Image */}
                {event.image?.url && (
                  <div className="relative h-24 sm:h-32 md:h-36 lg:h-40 overflow-hidden flex-shrink-0">
                    <img 
                      src={event.image.url} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Event+Image';
                      }}
                    />
                  </div>
                )}

                <div className="p-2.5 sm:p-3 md:p-4 flex flex-col flex-1">
                  <div className="flex items-start gap-1.5 sm:gap-2">
                    {/* Date Badge */}
                    <div className="bg-primary/20 text-primary px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-lg text-center flex-shrink-0">
                      <div className="text-sm sm:text-base md:text-lg font-black leading-none">{event.date?.day}</div>
                      <div className="text-[6px] sm:text-[7px] md:text-xs font-bold">{event.date?.month}</div>
                      {event.date?.year && (
                        <div className="text-[5px] sm:text-[6px] md:text-[10px] text-gray-400">{event.date.year}</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-0.5 sm:gap-1 text-gray-400 text-[8px] sm:text-[10px] md:text-xs mt-1 sm:mt-2">
                      <MapPinIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-400 text-[8px] sm:text-[10px] md:text-xs line-clamp-2 sm:line-clamp-2 md:line-clamp-3 mt-1 sm:mt-2 flex-1">
                    {event.description}
                  </p>

                  {/* Registration Link */}
                  {event.registrationLink && (
                    <a 
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 sm:gap-1 text-primary text-[7px] sm:text-[9px] md:text-xs hover:underline mt-1 sm:mt-2"
                    >
                      <LinkIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                      Register Now
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
      
      {displayEvents.length === 0 && (
        <div className="text-center text-gray-400 text-sm sm:text-base py-8 sm:py-12">
          No upcoming events at the moment.
        </div>
      )}
    </div>
  );
};

export default Events;
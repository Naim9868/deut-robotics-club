
import React from 'react';
import ScrollReveal from './ScrollReveal';

const Events: React.FC = () => {
  const events = [
    {
      date: { day: '25', month: 'MAR' },
      title: 'DUET Techfest 2025',
      desc: 'The biggest national-level technology festival on campus.',
      image: 'https://picsum.photos/seed/techfest2/800/400'
    },
    {
      date: { day: '10', month: 'FEB' },
      title: 'Robo-Workshop 101',
      desc: 'Introductory hands-on training for newly recruited members.',
      image: 'https://picsum.photos/seed/workshop2/800/400'
    },
    {
      date: { day: '15', month: 'JAN' },
      title: 'Intra-Robo Carnival',
      desc: 'Annual competition showcase for internal club projects.',
      image: 'https://picsum.photos/seed/carnival2/800/400'
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {events.map((event, idx) => (
          <ScrollReveal key={idx} animation="up" delay={idx * 150}>
            <div className="group bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-2xl relative">
              <div className="relative h-60 overflow-hidden">
                <div className="absolute top-6 right-6 z-10 bg-primary/90 backdrop-blur-md text-white px-4 py-2 min-w-[70px] text-center rounded shadow-2xl group-hover:scale-110 transition-transform">
                  <div className="text-2xl font-black leading-none">{event.date.day}</div>
                  <div className="text-[10px] font-black tracking-widest mt-1 opacity-80">{event.date.month}</div>
                </div>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80" />
              </div>
              <div className="p-10 relative">
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors uppercase leading-tight">{event.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">{event.desc}</p>
                <button className="group/btn relative px-8 py-3 overflow-hidden rounded border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:text-white">
                  <span className="relative z-10">Operational Details</span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default Events;

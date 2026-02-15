
import React from 'react';
import ScrollReveal from './ScrollReveal';

const FocusAreas: React.FC = () => {
  const areas = [
    {
      title: 'Line Follower',
      description: 'Engineering high-precision autonomous vehicles that navigate complex paths with PID control.',
      icon: '🏎️'
    },
    {
      title: 'Fire Fighting',
      description: 'Smart robotics integrated with flame detection sensors and autonomous firefighting mechanisms.',
      icon: '🔥'
    },
    {
      title: 'Aerial Drones',
      description: 'Developing VTOL systems and autonomous flight path algorithms for surveillance and delivery.',
      icon: '🚁'
    },
    {
      title: 'Soccer Bots',
      description: 'Advanced real-time control systems for high-speed dynamic gameplay and strategic maneuvering.',
      icon: '⚽'
    }
  ];

  return (
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold uppercase mb-4 section-title">Our Focus</h2>
          <p className="text-gray-500 max-w-xl">We are actively developing and researching these core robotic systems to solve real-world problems.</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {areas.map((area, index) => (
          <ScrollReveal key={index} animation="up" delay={index * 100}>
            <div 
              className="group p-8 bg-card border border-white/5 rounded-xl hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(230,57,70,0.15)]"
            >
              <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 group-hover:rotate-6">
                {area.icon}
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 text-white group-hover:text-primary transition-colors">{area.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{area.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default FocusAreas;

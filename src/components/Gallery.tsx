
import React from 'react';
import ScrollReveal from './ScrollReveal';

const Gallery: React.FC = () => {
  const images = [
    { src: 'https://picsum.photos/seed/lab1/800/600', title: 'Midnight Lab Session' },
    { src: 'https://picsum.photos/seed/comp1/400/600', title: 'Techfest Champions' },
    { src: 'https://picsum.photos/seed/work1/400/400', title: 'Soldering Workshop' },
    { src: 'https://picsum.photos/seed/drone2/800/400', title: 'Quadcopter Test Flight' },
    { src: 'https://picsum.photos/seed/award2/400/600', title: 'Gold Medal Moments' },
    { src: 'https://picsum.photos/seed/robo2/400/400', title: 'PCB Design Flow' }
  ];

  return (
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title after:mx-auto">Inside DRC</h2>
          <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">Capturing the essence of innovation</p>
        </div>
      </ScrollReveal>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, idx) => (
          <ScrollReveal key={idx} animation="scale" delay={idx * 100} className="break-inside-avoid">
            <div className="relative group overflow-hidden rounded-xl bg-card">
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-auto object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-6 pointer-events-none">
                <h4 className="text-white font-bold uppercase text-sm tracking-wider">{img.title}</h4>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">DUET Robotics Club</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

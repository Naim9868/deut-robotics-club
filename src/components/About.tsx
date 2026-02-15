
import React from 'react';
import ScrollReveal from './ScrollReveal';

const About: React.FC = () => {
  return (
    <div className="py-24 container mx-auto px-4 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal animation="left" className="order-2 lg:order-1">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase mb-8 relative inline-block section-title">
            About Us
          </h2>
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
            <p>
              The <strong className="text-white">DUET Robotics Club (DRC)</strong> is the premier student-led organization at 
              Dhaka University of Engineering & Technology, dedicated to fostering an ecosystem of 
              robotics, automation, and AI.
            </p>
            <p>
              Founded with the vision to make DUET a hub for technological excellence, DRC provides 
              students with a platform to transform theoretical knowledge into functional prototypes. 
              We believe in learning by doing.
            </p>
            <p>
              From building autonomous line followers to competing in international aerial robotics 
              competitions, our members are constantly pushing the boundaries of what's possible 
              in the Bangladeshi tech landscape.
            </p>
            <div className="pt-6">
              <button className="px-8 py-3 border border-white/20 text-white font-bold uppercase rounded hover:bg-white hover:text-dark transition-all transform hover:scale-105 active:scale-95">
                Learn More
              </button>
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal animation="right" className="order-1 lg:order-2 relative">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full animate-pulse" />
          <img 
            src="https://picsum.photos/seed/duet-about/800/600" 
            alt="Robotics Workshop" 
            className="rounded-xl shadow-2xl border border-white/10 w-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
          />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default About;

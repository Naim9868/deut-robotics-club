
import React from 'react';

const Sponsors: React.FC = () => {
  const logos = [
    "TECH-X", "GENESIS", "NEXUS ROBOTICS", "DUET ALUMNI", "ROBOMASTER",
    "CYBERDYNE", "BOSTON DYNAMICS", "INTEL", "NVIDIA", "TESLA"
  ];

  return (
    <div className="py-24 bg-dark overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 mb-12">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.8em] text-primary/100">Global Network Partners</p>
      </div>
      
      <div className="flex relative group">
        <div className="flex animate-marquee whitespace-nowrap">
          {logos.concat(logos).map((logo, idx) => (
            <div key={idx} className="mx-12 text-3xl md:text-5xl font-black italic text-white/90 hover:text-primary transition-all duration-500 cursor-default uppercase tracking-tighter">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;

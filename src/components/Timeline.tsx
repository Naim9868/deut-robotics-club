
import React from 'react';
import ScrollReveal from './ScrollReveal';

const Timeline: React.FC = () => {
  const milestones = [
    { year: '2015', title: 'Foundation', desc: 'A handful of visionaries started DRC with a single room and a dream.' },
    { year: '2018', title: 'National Level', desc: 'First major victory at a national robotics festival, winning Gold in LFR.' },
    { year: '2021', title: 'Drone Division', desc: 'Established the specialized aerial robotics wing for autonomous flight research.' },
    { year: '2023', title: 'Innovation Award', desc: 'Recognized as the most active engineering club in Bangladesh by DUET Authority.' },
    { year: '2025', title: 'The Future', desc: 'Pioneering AI-integrated robotics and sustainable hardware solutions.' }
  ];

  return (
    <div className="py-32 bg-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal animation="up">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title after:mx-auto">Our Journey</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">Milestones that defined our legacy</p>
          </div>
        </ScrollReveal>

        <div className="space-y-12 md:space-y-0">
          {milestones.map((m, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center justify-center w-full mb-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-5/12 hidden md:block"></div>
              
              <ScrollReveal animation="blur" delay={idx * 100} className="z-20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dark border-2 border-primary text-primary font-black text-xs shrink-0 shadow-[0_0_15px_rgba(230,57,70,0.3)]">
                  {m.year}
                </div>
              </ScrollReveal>

              <ScrollReveal 
                animation={idx % 2 === 0 ? 'right' : 'left'} 
                delay={idx * 150} 
                className={`w-full md:w-5/12 p-8 bg-card border border-white/5 rounded-2xl md:mx-12 hover:border-primary/30 transition-all ${idx % 2 === 0 ? 'text-left md:text-right' : 'text-left'}`}
              >
                <h3 className="text-xl font-black text-white uppercase mb-2 group-hover:text-primary transition-colors">{m.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;

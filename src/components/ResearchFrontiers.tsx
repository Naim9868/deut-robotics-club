
import React from 'react';
import ScrollReveal from './ScrollReveal';

const ResearchFrontiers: React.FC = () => {
  const frontiers = [
    { title: 'SLAM Navigation', tech: 'LIDAR / ROS', desc: 'Real-time environmental mapping and localization for multi-terrain rovers.' },
    { title: 'Swarm Intelligence', tech: 'P2P Mesh / AI', desc: 'Coordinated robotic swarms performing complex distributed tasks.' },
    { title: 'Haptic Feedback', tech: 'Sensor Fusion', desc: 'Tactile remote-sensing for surgical and delicate disposal robotics.' },
    { title: 'Edge Computing', tech: 'NVIDIA Jetson', desc: 'On-device neural network processing for ultra-low latency response.' }
  ];

  return (
    <div className="py-32 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal animation="up">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title">Research Frontiers</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.4em]">Pushing the limits of traditional engineering</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {frontiers.map((f, i) => (
            <ScrollReveal key={i} animation="up" delay={i * 100}>
              <div className="group relative p-8 h-80 glass hover:bg-primary/5 transition-all duration-500 border-l-2 border-l-white/10 hover:border-l-primary">
                <div className="absolute top-4 right-4 text-white/5 text-6xl font-black group-hover:text-primary/10 transition-colors">0{i+1}</div>
                <div className="relative z-10">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest block mb-4">{f.tech}</span>
                  <h3 className="text-xl font-bold uppercase text-white mb-6 group-hover:translate-x-2 transition-transform">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {f.desc}
                  </p>
                </div>
                <div className="absolute bottom-8 right-8 w-10 h-[1px] bg-white/20 group-hover:w-20 group-hover:bg-primary transition-all"></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchFrontiers;


import React from 'react';
import ScrollReveal from './ScrollReveal';

const TechStack: React.FC = () => {
  const stacks = [
    {
      category: 'Programming',
      items: [
        { name: 'C++', use: 'Embedded Systems & Real-time Control', icon: '⚡' },
        { name: 'Python', use: 'AI, Computer Vision & Data Science', icon: '🐍' },
        { name: 'JavaScript', use: 'Web Interfaces & Dashboarding', icon: '🌐' }
      ]
    },
    {
      category: 'Hardware',
      items: [
        { name: 'Arduino', use: 'Prototyping & Sensor Integration', icon: '🔌' },
        { name: 'STM32', use: 'High-Performance Flight Control', icon: '⚙️' },
        { name: 'ESP32', use: 'IoT & Wireless Communications', icon: '📶' }
      ]
    },
    {
      category: 'Design & Research',
      items: [
        { name: 'LaTeX', use: 'Scientific Publications & Documentation', icon: '📄' },
        { name: 'SolidWorks', use: '3D Mechanical Modeling & Simulation', icon: '🏗️' },
        { name: 'ROS', use: 'Robot Operating System Framework', icon: '🤖' }
      ]
    },
    {
      category: 'AI & Vision',
      items: [
        { name: 'TensorFlow', use: 'Deep Learning Model Training', icon: '🧠' },
        { name: 'OpenCV', use: 'Image Processing & Robot Vision', icon: '👁️' },
        { name: 'PyTorch', use: 'Advanced Neural Network Architectures', icon: '🔥' }
      ]
    }
  ];

  return (
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title">Tech Stack</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">The technologies driving our innovations</p>
          </div>
          <div className="hidden md:block h-[2px] bg-primary flex-1 mx-12 mb-4 opacity-20"></div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {stacks.map((cat, idx) => (
          <ScrollReveal 
            key={idx} 
            animation="up" 
            delay={idx * 150}
            className="bg-card border border-white/5 p-8 rounded-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-8 border-l-4 border-primary pl-4">{cat.category}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {cat.items.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group/item p-4 rounded-xl hover:bg-white/5 transition-all cursor-default">
                  <div className="text-3xl mb-4 grayscale group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-black text-sm uppercase mb-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-tight group-hover/item:text-gray-300 transition-colors">{item.use}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default TechStack;

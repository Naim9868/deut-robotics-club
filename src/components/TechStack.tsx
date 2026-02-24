import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface TechItem {
  name: string;
  use: string;
  icon: string;
  proficiency?: number;
  order?: number;
}

interface TechStackData {
  _id: string;
  category: string;
  items: TechItem[];
  order: number;
  isActive: boolean;
}

const TechStack: React.FC = () => {
  const [techStacks, setTechStacks] = useState<TechStackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const response = await fetch('/api/tech-stack');
        if (!response.ok) {
          throw new Error('Failed to fetch tech stack data');
        }
        const data = await response.json();
        
        // Filter active tech stacks and sort by order
        const activeStacks = Array.isArray(data) 
          ? data
              .filter((item: TechStackData) => item.isActive)
              .sort((a, b) => a.order - b.order)
          : [];
        
        setTechStacks(activeStacks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTechStack();
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

  // Use tech stacks from API if available, otherwise use fallback data
  const displayStacks = techStacks.length > 0 ? techStacks : [
    {
      _id: '1',
      category: 'Programming',
      items: [
        { name: 'C++', use: 'Embedded Systems & Real-time Control', icon: '⚡' },
        { name: 'Python', use: 'AI, Computer Vision & Data Science', icon: '🐍' },
        { name: 'JavaScript', use: 'Web Interfaces & Dashboarding', icon: '🌐' }
      ],
      order: 0,
      isActive: true
    },
    {
      _id: '2',
      category: 'Hardware',
      items: [
        { name: 'Arduino', use: 'Prototyping & Sensor Integration', icon: '🔌' },
        { name: 'STM32', use: 'High-Performance Flight Control', icon: '⚙️' },
        { name: 'ESP32', use: 'IoT & Wireless Communications', icon: '📶' }
      ],
      order: 1,
      isActive: true
    },
    {
      _id: '3',
      category: 'Design & Research',
      items: [
        { name: 'LaTeX', use: 'Scientific Publications & Documentation', icon: '📄' },
        { name: 'SolidWorks', use: '3D Mechanical Modeling & Simulation', icon: '🏗️' },
        { name: 'ROS', use: 'Robot Operating System Framework', icon: '🤖' }
      ],
      order: 2,
      isActive: true
    },
    {
      _id: '4',
      category: 'AI & Vision',
      items: [
        { name: 'TensorFlow', use: 'Deep Learning Model Training', icon: '🧠' },
        { name: 'OpenCV', use: 'Image Processing & Robot Vision', icon: '👁️' },
        { name: 'PyTorch', use: 'Advanced Neural Network Architectures', icon: '🔥' }
      ],
      order: 3,
      isActive: true
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
        {displayStacks.map((stack, idx) => (
          <ScrollReveal 
            key={stack._id || idx} 
            animation="up" 
            delay={idx * 150}
            className="bg-card border border-white/5 p-8 rounded-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-8 border-l-4 border-primary pl-4">{stack.category}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stack.items.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group/item p-4 rounded-xl hover:bg-white/5 transition-all cursor-default">
                  <div className="text-3xl mb-4 grayscale group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-black text-sm uppercase mb-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-tight group-hover/item:text-gray-300 transition-colors">{item.use}</p>
                  
                  {/* Optional proficiency indicator (if needed) */}
                  {item.proficiency && (
                    <div className="w-full mt-2">
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${item.proficiency}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </div>
      
      {/* Show message if no tech stacks */}
      {displayStacks.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No tech stack data available.
        </div>
      )}
    </div>
  );
};

export default TechStack;
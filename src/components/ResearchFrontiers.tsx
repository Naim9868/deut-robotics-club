import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface ResearchData {
  _id: string;
  title: string;
  technology: string;
  description: string;
  icon?: string;
  category?: string;
  researchers?: string[];
  publications?: string[];
  status: 'ONGOING' | 'COMPLETED' | 'PROPOSED';
  order: number;
  isActive: boolean;
}

const ResearchFrontiers: React.FC = () => {
  const [researchItems, setResearchItems] = useState<ResearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research');
        if (!response.ok) {
          throw new Error('Failed to fetch research data');
        }
        const data = await response.json();
        
        // Filter active research items and sort by order
        const activeItems = Array.isArray(data) 
          ? data
              .filter((item: ResearchData) => item.isActive)
              .sort((a, b) => a.order - b.order)
          : [];
        
        setResearchItems(activeItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ONGOING': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'COMPLETED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PROPOSED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="py-32 bg-[#050505] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 bg-[#050505] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Use research items from API if available, otherwise use fallback data
  const displayItems = researchItems.length > 0 ? researchItems : [
    { 
      _id: '1',
      title: 'SLAM Navigation', 
      technology: 'LIDAR / ROS', 
      description: 'Real-time environmental mapping and localization for multi-terrain rovers.',
      status: 'ONGOING',
      order: 0,
      isActive: true
    },
    { 
      _id: '2',
      title: 'Swarm Intelligence', 
      technology: 'P2P Mesh / AI', 
      description: 'Coordinated robotic swarms performing complex distributed tasks.',
      status: 'ONGOING',
      order: 1,
      isActive: true
    },
    { 
      _id: '3',
      title: 'Haptic Feedback', 
      technology: 'Sensor Fusion', 
      description: 'Tactile remote-sensing for surgical and delicate disposal robotics.',
      status: 'ONGOING',
      order: 2,
      isActive: true
    },
    { 
      _id: '4',
      title: 'Edge Computing', 
      technology: 'NVIDIA Jetson', 
      description: 'On-device neural network processing for ultra-low latency response.',
      status: 'ONGOING',
      order: 3,
      isActive: true
    }
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
          {displayItems.map((item, i) => (
            <ScrollReveal key={item._id || i} animation="up" delay={i * 100}>
              <div className="group relative p-8 h-80 glass hover:bg-primary/5 transition-all duration-500 border-l-2 border-l-white/10 hover:border-l-primary">
                <div className="absolute top-4 right-4 text-white/5 text-6xl font-black group-hover:text-primary/10 transition-colors">0{i+1}</div>
                
                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="relative z-10 mt-8">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest block mb-4">{item.technology}</span>
                  <h3 className="text-xl font-bold uppercase text-white mb-6 group-hover:translate-x-2 transition-transform">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                  
                  {/* Researchers (if available) */}
                  {item.researchers && item.researchers.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[8px] text-gray-600 uppercase tracking-wider mb-1">Researchers</p>
                      <p className="text-[10px] text-gray-400">{item.researchers.join(' • ')}</p>
                    </div>
                  )}
                  
                  {/* Publications (if available) */}
                  {item.publications && item.publications.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[8px] text-gray-600 uppercase tracking-wider mb-1">Publications</p>
                      <p className="text-[8px] text-primary/70">{item.publications.length} paper{item.publications.length > 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-8 right-8 w-10 h-[1px] bg-white/20 group-hover:w-20 group-hover:bg-primary transition-all"></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        {/* Show message if no research items */}
        {displayItems.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No research frontiers available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchFrontiers;
import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface ProjectData {
  _id: string;
  id: string;
  slug?: string;
  title: string;
  tag: string;
  category: string;
  status: string;
  latency: string;
  description?: string;
  image: {
    url: string;
    alt: string;
    publicId?: string;
  };
  technologies?: string[];
  team?: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  order: number;
  isActive: boolean;
  statusColor?: string;
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [randomValues, setRandomValues] = useState<{[key: string]: {x: number, y: number}}>({});

  const categories = ['ALL', 'COMBAT', 'AI', 'AERO', 'AUTO'];

  const fallbackProjects: ProjectData[] = [
    {
      _id: 'fallback-1',
      id: 'DRC_A1',
      title: 'DESTRON V3',
      tag: 'COMBAT CLASS',
      status: 'ACTIVE',
      latency: '0.02ms',
      category: 'COMBAT',
      image: { url: 'https://images.unsplash.com/photo-1544006659-f0b21884cb1d?q=80&w=1000', alt: 'DESTRON V3' },
      featured: false,
      order: 0,
      isActive: true
    },
    {
      _id: 'fallback-2',
      id: 'DRC_N2',
      title: 'SPIDER-BOT MK.II',
      tag: 'NEURAL MESH',
      status: 'TESTING',
      latency: '0.15ms',
      category: 'AI',
      image: { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000', alt: 'SPIDER-BOT MK.II' },
      featured: false,
      order: 1,
      isActive: true
    },
    {
      _id: 'fallback-3',
      id: 'DRC_I3',
      title: '6-AXIS HYDRA',
      tag: 'INDUSTRIAL',
      status: 'ACTIVE',
      latency: '0.01ms',
      category: 'AUTO',
      image: { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000', alt: '6-AXIS HYDRA' },
      featured: false,
      order: 2,
      isActive: true
    },
    {
      _id: 'fallback-4',
      id: 'DRC_E4',
      title: 'EAGLE EYE DRONE',
      tag: 'AEROSPACE',
      status: 'ACTIVE',
      latency: '0.05ms',
      category: 'AERO',
      image: { url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000', alt: 'EAGLE EYE DRONE' },
      featured: false,
      order: 3,
      isActive: true
    },
    {
      _id: 'fallback-5',
      id: 'DRC_M5',
      title: 'MAZE RUNNER V.O',
      tag: 'AUTONOMOUS',
      status: 'MAINTENANCE',
      latency: '0.22ms',
      category: 'AUTO',
      image: { url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=1000', alt: 'MAZE RUNNER V.O' },
      featured: false,
      order: 4,
      isActive: true
    },
    {
      _id: 'fallback-6',
      id: 'DRC_X6',
      title: 'VOID_WALKER',
      tag: 'EXPERIMENTAL',
      status: 'UNKNOWN',
      latency: 'N/A',
      category: 'AI',
      image: { url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000', alt: 'VOID_WALKER' },
      featured: false,
      order: 5,
      isActive: true
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const activeProjects = data
            .filter((p: ProjectData) => p.isActive)
            .sort((a, b) => a.order - b.order);
          
          setProjects(activeProjects);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const values: {[key: string]: {x: number, y: number}} = {};
      projects.forEach(p => {
        values[p.id] = {
          x: Math.floor(Math.random() * 999),
          y: Math.floor(Math.random() * 999)
        };
      });
      setRandomValues(values);
    }
  }, [projects]);

  const filteredProjects = activeFilter === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#050505] overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* HUD Top Bar - Hidden on mobile, visible on tablet+ */}
        {/* <div className="hidden md:flex justify-between items-center mb-4 sm:mb-5 md:mb-6 opacity-40">
           <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-[9px] font-black tracking-[0.3em] text-cyan-400 uppercase">VAULT_ACCESS_LEVEL: ALPHA</span>
           </div>
           <div className="flex items-center space-x-6 text-[9px] font-black tracking-[0.2em] text-cyan-400 uppercase">
              <div className="flex items-center">
                <span className="mr-2">⚡ UPTIME: STABLE</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📡 LINK: ESTABLISHED</span>
              </div>
           </div>
        </div> */}

        {/* Vault Header UI */}
        <ScrollReveal animation="up">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-10 md:mb-12 lg:mb-16 space-y-6 lg:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white flex items-center flex-wrap">
                ACTIVE
                <span className="mx-2 sm:mx-3 md:mx-4 w-3 h-6 sm:w-4 sm:h-8 md:w-6 md:h-12 bg-primary inline-block"></span>
                <span className="text-primary">PROJECTS</span>
              </h2>
            </div>

            {/* Futuristic Filter Tabs - Scrollable on mobile */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 border text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                    activeFilter === cat 
                      ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(230,57,70,0.4)]' 
                      : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Prototypes Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
          {filteredProjects.map((p, idx) => (
            <ScrollReveal key={p.id} animation="scale" delay={idx * 100}>
              <a href={`/projects/${p.slug || p.id}`} className="block">
              <div className="group relative border border-white/5 bg-black overflow-hidden aspect-[4/3] md:aspect-square lg:aspect-[4/3] cursor-crosshair">
                {/* Background Image */}
                <img 
                  src={p.image?.url} 
                  alt={p.image?.alt || p.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-all duration-1000"
                />
                
                {/* HUD Overlays */}
                <div className="absolute inset-0 p-3 sm:p-4 md:p-5 lg:p-8 flex flex-col justify-between z-10">
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div className="bg-primary/10 border border-primary/30 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 flex items-center space-x-1 sm:space-x-2">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 border border-primary/50 rotate-45 flex items-center justify-center">
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-primary"></div>
                      </div>
                      <span className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-black text-primary tracking-widest uppercase truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px]">
                        {p.tag}
                      </span>
                    </div>
                    {/* Corner Bracket */}
                    <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-t border-r border-white/20 group-hover:border-primary/50 transition-colors"></div>
                  </div>

                  {/* Middle Section: Title */}
                  <div className="relative">
                    {/* Decorative Scan Line - Hidden on very small screens */}
                    <div className="hidden sm:block absolute -left-8 -right-8 h-[1px] bg-cyan-400/20 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 border border-cyan-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100"></div>

                    <h3 className="text-xs sm:text-sm md:text-xl lg:text-3xl xl:text-5xl font-black text-white mb-0.5 sm:mb-1 md:mb-2 tracking-tighter group-hover:text-primary transition-colors uppercase line-clamp-2">
                      {p.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
                        p.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 
                        p.status === 'TESTING' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 
                        p.status === 'MAINTENANCE' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 
                        'bg-gray-500'
                      }`} />
                      <span className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] font-bold text-gray-400 tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase truncate">
                        PROT_STABLE: <span className={
                          p.status === 'ACTIVE' ? 'text-green-500' : 
                          p.status === 'TESTING' ? 'text-yellow-500' : 
                          p.status === 'MAINTENANCE' ? 'text-blue-500' : 
                          'text-gray-400'
                        }>{p.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Section: Metadata */}
                  <div className="flex justify-between items-end border-t border-white/10 pt-2 sm:pt-3 md:pt-4 lg:pt-6">
                    <div className="flex space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
                      <div>
                        <p className="text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] font-bold text-gray-600 uppercase mb-0.5 tracking-widest">ID_Key</p>
                        <p className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[11px] font-black text-white tracking-widest truncate max-w-[40px] sm:max-w-[60px] md:max-w-[80px]">
                          {p.id}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] font-bold text-gray-600 uppercase mb-0.5 tracking-widest">Latency</p>
                        <p className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[11px] font-black text-white tracking-widest">{p.latency}</p>
                      </div>
                    </div>
                    
                    {/* Interaction Icon - Smaller on mobile */}
                    <button className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 transform group-hover:-translate-y-1">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Corner Brackets Decorations */}
                <div className="absolute top-0 left-0 w-4 sm:w-5 md:w-6 lg:w-8 h-4 sm:h-5 md:h-6 lg:h-8 border-t border-l border-white/0 group-hover:border-primary/50 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 sm:group-hover:translate-x-3 md:group-hover:translate-x-4 group-hover:translate-y-2 sm:group-hover:translate-y-3 md:group-hover:translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-4 sm:w-5 md:w-6 lg:w-8 h-4 sm:h-5 md:h-6 lg:h-8 border-b border-r border-white/0 group-hover:border-primary/50 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 sm:group-hover:-translate-x-3 md:group-hover:-translate-x-4 group-hover:-translate-y-2 sm:group-hover:-translate-y-3 md:group-hover:-translate-y-4"></div>

                {/* Scan Line Animation - Hidden on mobile */}
                <div className="hidden md:block absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-primary animate-[scanLine_2.5s_linear_infinite]" />
                </div>

                {/* Visual Glitch/Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-20 transition-opacity duration-300 mix-blend-overlay"></div>
                
                {/* Active Selection Indicator - Hidden on mobile */}
                <div className="hidden sm:block absolute top-1/2 right-1/2 w-3 h-3 md:w-4 md:h-4 border border-primary/30 rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-[15] transition-all duration-1000 pointer-events-none"></div>
                
                {/* Random HUD elements - Hidden on mobile */}
                <div className="hidden lg:block absolute bottom-24 right-8 text-[8px] font-mono text-cyan-400/30 group-hover:text-cyan-400/80 transition-colors uppercase tracking-widest opacity-0 group-hover:opacity-100">
                  {randomValues[p.id] ? (
                    <>LNK_POS: {randomValues[p.id].x}, {randomValues[p.id].y}</>
                  ) : (
                    <>LNK_POS: ---, ---</>
                  )}
                </div>
              </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Footer Link */}
        <ScrollReveal animation="up">
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 flex items-center justify-center">
            <div className="h-[1px] bg-white/5 flex-1 hidden sm:block"></div>
            <a href="#" className="mx-4 sm:mx-6 md:mx-8 text-[8px] sm:text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.5em] hover:text-primary transition-colors flex items-center group">
              Access Full Database 
              <span className="ml-2 sm:ml-3 md:ml-4 transform group-hover:translate-x-2 transition-transform">{'>>>'}</span>
            </a>
            <div className="h-[1px] bg-white/5 flex-1 hidden sm:block"></div>
          </div>
        </ScrollReveal>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default Projects;
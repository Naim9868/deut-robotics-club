import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [randomValues, setRandomValues] = useState<{[key: string]: {x: number, y: number}}>({});

  const categories = ['ALL', 'COMBAT', 'AI', 'AERO', 'AUTO'];

  const projects = [
    {
      id: 'DRC_A1',
      title: 'DESTRON V3',
      tag: 'COMBAT CLASS',
      status: 'ACTIVE',
      latency: '0.02ms',
      category: 'COMBAT',
      image: 'https://images.unsplash.com/photo-1544006659-f0b21884cb1d?q=80&w=1000'
    },
    {
      id: 'DRC_N2',
      title: 'SPIDER-BOT MK.II',
      tag: 'NEURAL MESH',
      status: 'TESTING',
      latency: '0.15ms',
      category: 'AI',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000'
    },
    {
      id: 'DRC_I3',
      title: '6-AXIS HYDRA',
      tag: 'INDUSTRIAL',
      status: 'ACTIVE',
      latency: '0.01ms',
      category: 'AUTO',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000'
    },
    {
      id: 'DRC_E4',
      title: 'EAGLE EYE DRONE',
      tag: 'AEROSPACE',
      status: 'ACTIVE',
      latency: '0.05ms',
      category: 'AERO',
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000'
    },
    {
      id: 'DRC_M5',
      title: 'MAZE RUNNER V.O',
      tag: 'AUTONOMOUS',
      status: 'MAINTENANCE',
      latency: '0.22ms',
      category: 'AUTO',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=1000'
    },
    {
      id: 'DRC_X6',
      title: 'VOID_WALKER',
      tag: 'EXPERIMENTAL',
      status: 'UNKNOWN',
      latency: 'N/A',
      category: 'AI',
      image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000'
    }
  ];

  // Generate stable random values on the client only
  useEffect(() => {
    const values: {[key: string]: {x: number, y: number}} = {};
    projects.forEach(p => {
      values[p.id] = {
        x: Math.floor(Math.random() * 999),
        y: Math.floor(Math.random() * 999)
      };
    });
      setRandomValues(values);
  }, []);

  const filteredProjects = activeFilter === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="py-32 bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* HUD Top Bar */}
        <div className="flex justify-between items-center mb-6 opacity-40">
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
        </div>

        {/* Vault Header UI */}
        <ScrollReveal animation="up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-8 md:space-y-0">
            <div>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white flex items-center">
                ACTIVE<span className="mx-2 md:mx-4 w-4 h-8 md:w-6 md:h-12 bg-primary inline-block"></span><span className="text-primary">PROTOTYPES</span>
              </h2>
            </div>

            {/* Futuristic Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-6 py-2 border text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${
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

        {/* Prototypes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p, idx) => (
            <ScrollReveal key={p.id} animation="scale" delay={idx * 100}>
              <div className="group relative border border-white/5 bg-black overflow-hidden aspect-[4/3] md:aspect-square lg:aspect-[4/3] cursor-crosshair">
                {/* Background Image */}
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                
                {/* HUD Overlays */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div className="bg-primary/10 border border-primary/30 px-3 py-1 flex items-center space-x-2">
                      <div className="w-2 h-2 border border-primary/50 rotate-45 flex items-center justify-center">
                        <div className="w-1 h-1 bg-primary"></div>
                      </div>
                      <span className="text-[9px] font-black text-primary tracking-widest uppercase">{p.tag}</span>
                    </div>
                    {/* Corner Bracket */}
                    <div className="w-4 h-4 border-t border-r border-white/20 group-hover:border-primary/50 transition-colors"></div>
                  </div>

                  {/* Middle Section: Title */}
                  <div className="relative">
                    {/* Decorative Scan Line in Title */}
                    <div className="absolute -left-8 -right-8 h-[1px] bg-cyan-400/20 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 border border-cyan-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100"></div>

                    <h3 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:text-primary transition-colors uppercase">
                      {p.title}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        p.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 
                        p.status === 'TESTING' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-gray-500'
                      }`} />
                      <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                        PROT_STABLE: <span className={p.status === 'ACTIVE' ? 'text-green-500' : 'text-gray-400'}>{p.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Section: Metadata */}
                  <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div className="flex space-x-8">
                      <div>
                        <p className="text-[8px] font-bold text-gray-600 uppercase mb-1 tracking-widest">ID_Key</p>
                        <p className="text-[11px] font-black text-white tracking-widest">{p.id}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-gray-600 uppercase mb-1 tracking-widest">Latency</p>
                        <p className="text-[11px] font-black text-white tracking-widest">{p.latency}</p>
                      </div>
                    </div>
                    
                    {/* Interaction Icon */}
                    <button className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 transform group-hover:-translate-y-1">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Corner Brackets Decorations */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/0 group-hover:border-primary/50 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 group-hover:translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/0 group-hover:border-primary/50 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 group-hover:-translate-y-4"></div>

                {/* Scan Line Animation */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-primary animate-[scanLine_2.5s_linear_infinite]" />
                </div>

                {/* Visual Glitch/Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-20 transition-opacity duration-300 mix-blend-overlay"></div>
                
                {/* Active Selection Indicator */}
                <div className="absolute top-1/2 right-1/2 w-4 h-4 border border-primary/30 rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-[15] transition-all duration-1000 pointer-events-none"></div>
                
                {/* Random HUD elements - Now using stable values from state */}
                <div className="absolute bottom-24 right-8 text-[8px] font-mono text-cyan-400/30 group-hover:text-cyan-400/80 transition-colors uppercase tracking-widest opacity-0 group-hover:opacity-100">
                  {randomValues[p.id] ? (
                    <>LNK_POS: {randomValues[p.id].x}, {randomValues[p.id].y}</>
                  ) : (
                    <>LNK_POS: ---, ---</>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Footer Link */}
        <ScrollReveal animation="up">
          <div className="mt-12 flex items-center justify-center">
            <div className="h-[1px] bg-white/5 flex-1"></div>
            <a href="#" className="mx-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] hover:text-primary transition-colors flex items-center group">
              Access Full Database 
              <span className="ml-4 transform group-hover:translate-x-2 transition-transform">{'>>>'}</span>
            </a>
            <div className="h-[1px] bg-white/5 flex-1"></div>
          </div>
        </ScrollReveal>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
};

export default Projects;
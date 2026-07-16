import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

interface ResearchData {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  researchArea?: string;
  category?: string;
  researchType?: string;
  status: string;
  researchers?: { fullName: string; role?: string }[];
  publications?: { title: string }[];
  order?: number;
}

const ResearchFrontiers: React.FC = () => {
  const [researchItems, setResearchItems] = useState<ResearchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research?limit=100');
        if (!response.ok) throw new Error('Failed to fetch research data');
        const data = await response.json();
        const items = Array.isArray(data) ? data : (data.research || []);
        const activeItems = items
          .filter((item: ResearchData) => !['archived', 'completed'].includes(item.status))
          .sort((a: ResearchData, b: ResearchData) => (a.order || 0) - (b.order || 0));
        setResearchItems(activeItems);
      } catch {
        setResearchItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'completed': case 'published': case 'accepted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'proposed': case 'literature_review': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'experimentation': case 'paper_writing': case 'submitted': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#050505] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-16 md:py-20 lg:py-32 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="up">
          <div className="mb-8 sm:mb-10 md:mb-14 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title sm:text-left">
              Research Frontiers
            </h2>
            <p className="text-gray-500 uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.4em] sm:text-left">
              Pushing the limits of traditional engineering
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {researchItems.map((item, i) => (
            <ScrollReveal key={item._id || i} animation="up" delay={i * 100}>
              <Link href={`/research/${item.slug}`}>
                <div className="group relative shadow-amber-50 p-2 sm:p-5 md:p-6 lg:p-8 h-auto min-h-[280px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] glass hover:bg-primary/5 transition-all duration-500 border-l-2 border-l-primary/50 sm:border-l-white/10 hover:border-l-primary rounded-xl hover:shadow-[4px_4px_15px_rgba(230,57,70,0.05)] hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer">
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-primary/20 sm:text-white/8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black group-hover:text-primary/30 transition-colors">
                    0{i + 1}
                  </div>

                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(item.status)}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="relative z-10 mt-6 sm:mt-7 md:mt-8">
                    <span className="text-primary text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest block mb-2 sm:mb-3 md:mb-4 line-clamp-1">
                      {item.researchArea || item.category || 'Research'}
                    </span>
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6 group-hover:translate-x-2 transition-transform line-clamp-2 sm:line-clamp-2 md:line-clamp-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-3 sm:line-clamp-3 md:line-clamp-4">
                      {item.shortDescription || ''}
                    </p>

                    {item.researchers && item.researchers.length > 0 && (
                      <div className="mt-3 sm:mt-4">
                        <p className="text-[7px] sm:text-[8px] text-gray-300 uppercase tracking-wider mb-0.5 sm:mb-1">Researchers</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-400 line-clamp-2">
                          {item.researchers.map(r => r.fullName).join(' • ')}
                        </p>
                      </div>
                    )}

                    {item.publications && item.publications.length > 0 && (
                      <div className="mt-2 sm:mt-2.5">
                        <p className="text-[7px] sm:text-[8px] text-gray-300 uppercase tracking-wider mb-0.5 sm:mb-1">Publications</p>
                        <p className="text-[8px] sm:text-[8px] text-primary/90">{item.publications.length} paper{item.publications.length > 1 ? 's' : ''}</p>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-8 sm:bottom-5 md:bottom-6 lg:bottom-8 right-4 sm:right-5 md:right-6 lg:right-8 w-6 sm:w-7 md:w-8 lg:w-10 h-[1px] bg-white/20 group-hover:w-12 sm:group-hover:w-14 md:group-hover:w-16 lg:group-hover:w-20 group-hover:bg-primary transition-all" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 text-center">
          <ScrollReveal animation="up">
            <Link href="/research">
              <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 border border-white/100 text-white font-black uppercase tracking-widest text-[10px] sm:text-[11px] rounded hover:bg-white hover:text-dark transition-all transform hover:scale-105 active:scale-95">
                Explore All Research
              </button>
            </Link>
          </ScrollReveal>
        </div>

        {researchItems.length === 0 && (
          <div className="text-center text-gray-400 text-sm sm:text-base py-8 sm:py-12">
            No research frontiers available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchFrontiers;

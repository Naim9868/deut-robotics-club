'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

interface ResearchItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  abstract?: string;
  researchArea?: string;
  category?: string;
  status: string;
  researchType?: string;
  researchLevel?: string;
  difficulty?: string;
  coverImage?: { url: string; alt?: string };
  researchers?: { fullName: string; role?: string }[];
  technologies?: { name: string }[];
  publications?: { title: string }[];
  homepage?: { featured: boolean; displayOrder: number };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  proposed: 'bg-yellow-500/15 text-yellow-400',
  literature_review: 'bg-blue-500/15 text-blue-400',
  ongoing: 'bg-green-500/15 text-green-400',
  experimentation: 'bg-purple-500/15 text-purple-400',
  paper_writing: 'bg-orange-500/15 text-orange-400',
  submitted: 'bg-cyan-500/15 text-cyan-400',
  accepted: 'bg-emerald-500/15 text-emerald-400',
  published: 'bg-red-500/15 text-red-400',
  completed: 'bg-green-500/15 text-green-400',
  archived: 'bg-gray-500/15 text-gray-400',
};

const AREA_ICONS: Record<string, string> = {
  'Robotics': '🤖',
  'Artificial Intelligence': '🧠',
  'Machine Learning': '📊',
  'Computer Vision': '👁️',
  'IoT': '📡',
  'Embedded Systems': '🔧',
  'Automation': '⚙️',
  'Drone': '🛩️',
  'Biomedical': '🏥',
  'Control Systems': '🎛️',
  'Power Electronics': '⚡',
  'Mechanical Design': '🔨',
  'Other': '🔬',
};

export default function ResearchPage() {
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('research');

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const res = await fetch('/api/research?limit=100');
      const data = await res.json();
      setResearch(data.research || []);
    } catch {
      console.error('Failed to fetch research');
    } finally {
      setLoading(false);
    }
  };

  const areas = ['all', ...new Set(research.map(r => r.researchArea).filter((a): a is string => Boolean(a)))];
  const filtered = filter === 'all' ? research : research.filter(r => r.researchArea === filter);

  if (loading) {
    return (
      <>
        <Navbar activeSection={activeSection} />
        <div className="min-h-screen bg-background pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar activeSection={activeSection} />
      <div className="min-h-screen bg-card pt-24 pb-20">
        {/* Header */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="up">
              <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground text-sm mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">Research</h1>
              <p className="text-muted uppercase text-xs font-bold tracking-[0.3em]">
                Pushing the boundaries of knowledge
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Filters */}
        {areas.length > 1 && (
          <section className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setFilter(area)}
                    className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${
                      filter === area
                        ? 'bg-primary text-foreground'
                        : 'bg-background/5 text-muted hover:text-foreground'
                    }`}
                  >
                    {area === 'all' ? 'All Areas' : area}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Research Grid */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <ScrollReveal key={item._id} animation="up" delay={i * 80}>
                  <Link href={`/research/${item.slug}`}>
                    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Cover Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.coverImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=1e1e1e&color=e63946&size=400&bold=true&length=2`}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${STATUS_COLORS[item.status] || STATUS_COLORS.ongoing}`}>
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {item.homepage?.featured && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 bg-primary/90 text-foreground text-[10px] font-black rounded-full">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{AREA_ICONS[item.researchArea || 'Other'] || '🔬'}</span>
                          <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                            {item.researchArea || 'Research'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                          {item.shortDescription || item.abstract || ''}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-muted">
                          {item.researchers && item.researchers.length > 0 && (
                            <span>{item.researchers.length} researcher{item.researchers.length > 1 ? 's' : ''}</span>
                          )}
                          {item.publications && item.publications.length > 0 && (
                            <span>{item.publications.length} publication{item.publications.length > 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <span className="text-5xl">🔬</span>
                <p className="text-muted mt-4">No research entries found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

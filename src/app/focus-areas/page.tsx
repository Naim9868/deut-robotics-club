'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import FocusAreaIcon from '@/components/FocusAreaIcon';

interface FocusAreaData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon: string;
  iconType?: 'lucide' | 'image';
  color: string;
  category: string;
  researchLevel?: string;
  statistics?: { totalProjects: number; totalResearch: number; totalMembers: number; totalAwards: number };
  order: number;
  isActive: boolean;
  coverImage?: { url: string; alt?: string };
}

export default function FocusAreasPage() {
  const [focusAreas, setFocusAreas] = useState<FocusAreaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('focus-areas');

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  const fetchFocusAreas = async () => {
    try {
      const res = await fetch('/api/focus-areas');
      if (res.ok) {
        const data = await res.json();
        const areas = Array.isArray(data) ? data : [];
        setFocusAreas(
          areas
            .filter((item: FocusAreaData) => item.isActive)
            .sort((a: FocusAreaData, b: FocusAreaData) => a.order - b.order)
        );
      }
    } catch {
      console.error('Failed to load focus areas');
    } finally {
      setLoading(false);
    }
  };

  const displayAreas = focusAreas.length > 0 ? focusAreas : [
    {
      _id: '1', title: 'Line Follower', slug: 'line-follower',
      description: 'Engineering high-precision autonomous vehicles that navigate complex paths with PID control.',
      shortDescription: 'Autonomous path navigation with PID control',
      icon: 'Bot', iconType: 'lucide' as const, color: '#e63946',
      category: 'Robotics', order: 0, isActive: true,
      statistics: { totalProjects: 12, totalResearch: 5, totalMembers: 20, totalAwards: 3 },
    },
    {
      _id: '2', title: 'Fire Fighting', slug: 'fire-fighting',
      description: 'Smart robotics integrated with flame detection sensors and autonomous firefighting mechanisms.',
      shortDescription: 'Flame detection and autonomous firefighting',
      icon: 'Flame', iconType: 'lucide' as const, color: '#e63946',
      category: 'Robotics', order: 1, isActive: true,
      statistics: { totalProjects: 8, totalResearch: 3, totalMembers: 15, totalAwards: 2 },
    },
    {
      _id: '3', title: 'Aerial Drones', slug: 'aerial-drones',
      description: 'Developing VTOL systems and autonomous flight path algorithms for surveillance and delivery.',
      shortDescription: 'VTOL systems and autonomous flight algorithms',
      icon: 'Plane', iconType: 'lucide' as const, color: '#e63946',
      category: 'Drone', order: 2, isActive: true,
      statistics: { totalProjects: 10, totalResearch: 7, totalMembers: 18, totalAwards: 4 },
    },
    {
      _id: '4', title: 'Soccer Bots', slug: 'soccer-bots',
      description: 'Advanced real-time control systems for high-speed dynamic gameplay and strategic maneuvering.',
      shortDescription: 'Real-time control for dynamic gameplay',
      icon: 'Gamepad2', iconType: 'lucide' as const, color: '#e63946',
      category: 'Robotics', order: 3, isActive: true,
      statistics: { totalProjects: 6, totalResearch: 2, totalMembers: 25, totalAwards: 5 },
    },
  ];

  return (
    <>
      <Navbar activeSection={activeSection} />
      <div className="min-h-screen bg-card">

        {/* ─── Hero Section ─────────────────────────────── */}
        <section className="relative mt-8 h-[40vh] min-h-[300px] flex items-center justify-center">
           {/* ─── Back to Home Button ────────────────────── */}
        <Link href="/" className="absolute top-10 left-4 sm:left-6 z-40 flex items-center gap-2 px-3 py-2 text-muted hover:text-foreground hover:border-border/20 transition-all text-sm">
          <svg className="w-4 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="relative z-10 text-center px-4">
            <ScrollReveal animation="up">
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">Focus Areas</h1>
              <p className="text-muted text-sm md:text-base max-w-2xl mx-auto uppercase tracking-[0.15em]">
                We are actively developing and researching these core robotic systems to solve real-world problems.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Focus Areas Grid ─────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              </div>
            ) : displayAreas.length === 0 ? (
              <div className="text-center py-20 text-muted text-sm">No focus areas available.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayAreas.map((area, index) => (
                  <ScrollReveal key={area._id} animation="up" delay={index * 80}>
                    <Link href={`/focus-areas/${area.slug}`}>
                      <div className="group relative bg-card border border-border/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                        {area.coverImage?.url && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={area.coverImage.url}
                              alt={area.coverImage.alt || area.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />
                          </div>
                        )}

                        <div className={`p-6 flex flex-col flex-1 ${area.coverImage?.url ? '-mt-10 relative' : ''}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                              <FocusAreaIcon
                                icon={area.icon}
                                iconType={area.iconType}
                                color={area.color}
                                className="text-3xl"
                              />
                            </div>
                            <div>
                              <p className="text-muted text-[10px] font-bold tracking-widest uppercase">{area.category}</p>
                              <h3 className="text-foreground font-bold text-base group-hover:text-primary transition-colors">{area.title}</h3>
                            </div>
                          </div>

                          <p className="text-muted text-xs leading-relaxed flex-1 line-clamp-3">
                            {area.shortDescription || area.description}
                          </p>

                          {area.statistics && (
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/5 text-[10px] text-muted">
                              <span>{area.statistics.totalProjects} projects</span>
                              <span>{area.statistics.totalMembers} members</span>
                              {area.statistics.totalAwards > 0 && <span>{area.statistics.totalAwards} awards</span>}
                            </div>
                          )}

                          <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

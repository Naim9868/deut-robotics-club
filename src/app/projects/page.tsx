'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

interface ProjectData {
  _id: string;
  id: string;
  title: string;
  slug: string;
  tag: string;
  category: string;
  status: string;
  shortDescription?: string;
  coverImage?: { url: string; alt?: string };
  image?: { url: string; alt?: string };
  technologies?: { name: string; icon?: string; category?: string }[];
  team?: { fullName: string; isLeader?: boolean }[];
  homepage?: { featured: boolean; displayOrder: number };
  analytics?: { views: number; likes: number };
  createdAt: string;
}

const CATEGORIES = ['ALL', 'COMBAT', 'AI', 'AERO', 'AUTO', 'OTHER'];

const CATEGORY_COLORS: Record<string, string> = {
  COMBAT: 'from-red-500 to-rose-500',
  AI: 'from-blue-500 to-indigo-500',
  AERO: 'from-cyan-500 to-teal-500',
  AUTO: 'from-amber-500 to-orange-500',
  OTHER: 'from-purple-500 to-pink-500',
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-500/15 text-gray-400',
  submitted: 'bg-yellow-500/15 text-yellow-400',
  under_review: 'bg-blue-500/15 text-blue-400',
  approved: 'bg-green-500/15 text-green-400',
  ongoing: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-green-500/15 text-green-400',
  archived: 'bg-gray-500/15 text-gray-400',
  ACTIVE: 'bg-green-500/15 text-green-400',
  TESTING: 'bg-yellow-500/15 text-yellow-400',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?limit=100');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || data);
      }
    } catch {
      console.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              OUR <span className="text-red-500">PROJECTS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore the innovative projects built by DUET Robotics Club members
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded transition-all ${
                    activeCategory === cat
                      ? 'bg-white/10 text-white'
                      : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 w-64"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-xl h-80" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🚀</span>
              <p className="text-gray-400 text-lg font-medium">No projects found</p>
              <p className="text-gray-600 text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => (
                <ScrollReveal key={project._id} delay={idx * 0.1}>
                  <Link href={`/projects/${project.slug}`}>
                    <div className="group bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300 cursor-pointer h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.coverImage?.url || project.image?.url || '/images/project-placeholder.jpg'}
                          alt={project.coverImage?.alt || project.title}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                        {/* Category Badge */}
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold text-white bg-gradient-to-r ${CATEGORY_COLORS[project.category] || CATEGORY_COLORS.OTHER}`}>
                          {project.category}
                        </div>

                        {/* Status Badge */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold ${STATUS_STYLES[project.status] || STATUS_STYLES.approved}`}>
                          {project.status}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-red-500 text-[10px] font-bold tracking-widest mb-1">{project.tag}</p>
                        <h3 className="text-white font-black text-lg mb-1 group-hover:text-red-400 transition-colors">{project.title}</h3>
                        <p className="text-gray-500 text-xs font-mono mb-3">{project.id}</p>

                        {project.shortDescription && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{project.shortDescription}</p>
                        )}

                        {/* Tech stack */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.slice(0, 4).map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] rounded">
                                {tech.name}
                              </span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-[10px] rounded">
                                +{project.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Team */}
                        {project.team && project.team.length > 0 && (
                          <p className="text-gray-500 text-xs">
                            {project.team.length} member{project.team.length > 1 ? 's' : ''}
                          </p>
                        )}
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
  );
}

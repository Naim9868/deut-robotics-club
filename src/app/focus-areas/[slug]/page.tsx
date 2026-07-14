'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import FocusAreaIcon from '@/components/FocusAreaIcon';

// ─── Interfaces ───────────────────────────────────────────────

interface FocusAreaDetail {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  summary?: string;
  icon: string;
  iconType?: 'lucide' | 'image';
  color: string;
  coverImage?: { url: string; alt?: string };
  bannerImage?: { url: string; alt?: string };
  thumbnail?: { url: string; alt?: string };
  galleryImages?: { url: string; alt?: string }[];
  category: string;
  subCategory?: string;
  researchLevel?: string;
  vision?: string;
  mission?: string;
  objectives?: string[];
  technologies?: { name: string; icon?: string; category?: string }[];
  components?: { componentName: string; specification?: string; quantity?: number; inventoryReference?: string }[];
  applications?: string[];
  skillsRequired?: string[];
  learningResources?: { title: string; url: string; type: string; description?: string }[];
  faculty?: { facultyAdvisor?: string; mentors?: string[]; industryMentors?: string[] };
  statistics?: { totalProjects: number; totalResearch: number; totalMembers: number; totalAwards: number };
  analytics?: { views: number; followers: number };
  visibility?: string;
  createdAt: string;
}

interface RelatedFocusArea {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  iconType?: 'lucide' | 'image';
  color: string;
  category: string;
  shortDescription?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Robotics': 'from-red-500 to-rose-500',
  'Artificial Intelligence': 'from-blue-500 to-indigo-500',
  'Machine Learning': 'from-purple-500 to-pink-500',
  'Computer Vision': 'from-cyan-500 to-teal-500',
  'Embedded Systems': 'from-amber-500 to-orange-500',
  'IoT': 'from-green-500 to-emerald-500',
  'Drone': 'from-sky-500 to-blue-500',
  'Automation': 'from-yellow-500 to-amber-500',
  'Biomedical Robotics': 'from-rose-500 to-pink-500',
  'Control Systems': 'from-indigo-500 to-violet-500',
  'Power Electronics': 'from-orange-500 to-red-500',
  'Mechanical Design': 'from-slate-500 to-gray-500',
  'Other': 'from-gray-500 to-gray-600',
};

const RESOURCE_ICONS: Record<string, string> = {
  book: '📚',
  documentation: '📄',
  github: '💻',
  youtube: '🎬',
  research_paper: '📑',
  tutorial: '📝',
  course: '🎓',
};

// ─── Main Component ───────────────────────────────────────────

export default function FocusAreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [focusArea, setFocusArea] = useState<FocusAreaDetail | null>(null);
  const [related, setRelated] = useState<RelatedFocusArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchFocusArea();
  }, [slug]);

  const fetchFocusArea = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/focus-areas/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setFocusArea(data.focusArea);
        setRelated(data.related || []);
      }
    } catch {
      console.error('Failed to load focus area');
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading State ─────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  // ─── Not Found ─────────────────────────────────────────────

  if (!focusArea) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🔍</span>
        <h1 className="text-2xl font-black text-white">Focus Area Not Found</h1>
        <Link href="/" className="text-red-500 hover:underline text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  // ─── Computed Values ───────────────────────────────────────

  const allImages = [
    ...(focusArea.bannerImage?.url ? [focusArea.bannerImage] : []),
    ...(focusArea.coverImage?.url ? [focusArea.coverImage] : []),
    ...(focusArea.galleryImages || []),
  ].filter((img) => img.url);

  const categoryGradient = CATEGORY_COLORS[focusArea.category] || CATEGORY_COLORS['Other'];

  // ─── Share URLs ────────────────────────────────────────────

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${focusArea.title} on DUET Robotics Club`;

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ─── Hero Section ────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[400px]">
        {allImages[activeImage]?.url ? (
          <Image
            src={allImages[activeImage].url}
            alt={allImages[activeImage].alt || focusArea.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
              &larr; Back to Home
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${categoryGradient}`}>
                {focusArea.category}
              </span>
              {focusArea.researchLevel && (
                <span className="px-3 py-1 rounded text-xs font-bold bg-white/10 text-gray-300">
                  {focusArea.researchLevel}
                </span>
              )}
              {focusArea.subCategory && (
                <span className="px-3 py-1 rounded text-xs font-bold bg-white/5 text-gray-400">
                  {focusArea.subCategory}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-2">
              <FocusAreaIcon
                icon={focusArea.icon}
                iconType={focusArea.iconType}
                color={focusArea.color}
                className="text-5xl"
              />
              <h1 className="text-4xl md:text-5xl font-black text-white">{focusArea.title}</h1>
            </div>

            {focusArea.shortDescription && (
              <p className="text-gray-300 text-lg max-w-3xl">{focusArea.shortDescription}</p>
            )}
          </div>
        </div>
      </section>

      {/* ─── Content ─────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ─── Main Content ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Gallery */}
            {allImages.length > 1 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Gallery</h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                          activeImage === i ? 'border-red-500' : 'border-white/10'
                        }`}
                      >
                        <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Vision */}
            {focusArea.vision && (
              <ScrollReveal>
                <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 rounded-xl p-6">
                  <h2 className="text-xl font-black text-white mb-3">Vision</h2>
                  <p className="text-gray-300 leading-relaxed">{focusArea.vision}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Mission */}
            {focusArea.mission && (
              <ScrollReveal>
                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                  <h2 className="text-xl font-black text-white mb-3">Mission</h2>
                  <p className="text-gray-300 leading-relaxed">{focusArea.mission}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Full Description */}
            {focusArea.fullDescription && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">About This Focus Area</h2>
                  <div
                    className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: focusArea.fullDescription }}
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Summary */}
            {focusArea.summary && (
              <ScrollReveal>
                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                  <h2 className="text-xl font-black text-white mb-3">Summary</h2>
                  <p className="text-gray-300 leading-relaxed">{focusArea.summary}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Objectives */}
            {focusArea.objectives && focusArea.objectives.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Objectives</h2>
                  <div className="space-y-3">
                    {focusArea.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-lg p-4">
                        <span className="text-primary font-bold text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                        <p className="text-gray-300 text-sm">{obj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Technologies */}
            {focusArea.technologies && focusArea.technologies.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {focusArea.technologies.map((tech, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                        {tech.icon && <span className="text-lg">{tech.icon}</span>}
                        <span className="text-white text-sm font-medium">{tech.name}</span>
                        {tech.category && (
                          <span className="text-gray-500 text-xs">({tech.category})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Hardware & Components */}
            {focusArea.components && focusArea.components.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Hardware & Components</h2>
                  <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Component</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Specification</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {focusArea.components.map((comp, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-sm text-white">{comp.componentName}</td>
                            <td className="px-4 py-3 text-sm text-gray-400">{comp.specification || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-300">{comp.quantity || 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Applications */}
            {focusArea.applications && focusArea.applications.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Applications</h2>
                  <div className="flex flex-wrap gap-2">
                    {focusArea.applications.map((app, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Skills Required */}
            {focusArea.skillsRequired && focusArea.skillsRequired.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {focusArea.skillsRequired.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Learning Resources */}
            {focusArea.learningResources && focusArea.learningResources.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-white mb-4">Learning Resources</h2>
                  <div className="space-y-2">
                    {focusArea.learningResources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg p-4 hover:border-primary/30 transition-colors group"
                      >
                        <span className="text-2xl">{RESOURCE_ICONS[resource.type] || '📄'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium group-hover:text-primary transition-colors">{resource.title}</p>
                          {resource.description && (
                            <p className="text-gray-500 text-xs mt-0.5">{resource.description}</p>
                          )}
                        </div>
                        <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold uppercase text-gray-400">
                          {resource.type.replace('_', ' ')}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* ─── Sidebar ───────────────────────────────── */}
          <div className="space-y-6">

            {/* Faculty & Mentors */}
            {focusArea.faculty && (focusArea.faculty.facultyAdvisor || (focusArea.faculty.mentors && focusArea.faculty.mentors.length > 0) || (focusArea.faculty.industryMentors && focusArea.faculty.industryMentors.length > 0)) && (
              <ScrollReveal>
                <div className="bg-white/5 border border-white/5 rounded-xl p-5">
                  <h3 className="text-lg font-black text-white mb-3">Faculty & Mentors</h3>
                  <div className="space-y-3 text-sm">
                    {focusArea.faculty.facultyAdvisor && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Faculty Advisor</p>
                        <p className="text-white">{focusArea.faculty.facultyAdvisor}</p>
                      </div>
                    )}
                    {focusArea.faculty.mentors && focusArea.faculty.mentors.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Mentors</p>
                        <div className="space-y-1">
                          {focusArea.faculty.mentors.map((m, i) => (
                            <p key={i} className="text-gray-300">{m}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    {focusArea.faculty.industryMentors && focusArea.faculty.industryMentors.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Industry Mentors</p>
                        <div className="space-y-1">
                          {focusArea.faculty.industryMentors.map((m, i) => (
                            <p key={i} className="text-gray-300">{m}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Statistics */}
            {focusArea.statistics && (
              <ScrollReveal>
                <div className="bg-white/5 border border-white/5 rounded-xl p-5">
                  <h3 className="text-lg font-black text-white mb-3">Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Projects</span>
                      <span className="text-white">{focusArea.statistics.totalProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Research</span>
                      <span className="text-white">{focusArea.statistics.totalResearch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Members</span>
                      <span className="text-white">{focusArea.statistics.totalMembers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Awards</span>
                      <span className="text-white">{focusArea.statistics.totalAwards}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Views</span>
                        <span className="text-white">{focusArea.analytics?.views || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Followers</span>
                        <span className="text-white">{focusArea.analytics?.followers || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Share */}
            <ScrollReveal>
              <div className="bg-white/5 border border-white/5 rounded-xl p-5">
                <h3 className="text-lg font-black text-white mb-3">Share</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-[#1da1f2]/10 text-[#1da1f2] rounded-lg text-center text-sm font-medium hover:bg-[#1da1f2]/20 transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-[#4267B2]/10 text-[#4267B2] rounded-lg text-center text-sm font-medium hover:bg-[#4267B2]/20 transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(focusArea.title)}&summary=${encodeURIComponent(focusArea.shortDescription || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-[#0077B5]/10 text-[#0077B5] rounded-lg text-center text-sm font-medium hover:bg-[#0077B5]/20 transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Created Date */}
            <ScrollReveal>
              <div className="bg-white/5 border border-white/5 rounded-xl p-5">
                <h3 className="text-lg font-black text-white mb-3">Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="text-white">
                      {new Date(focusArea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="text-white">{focusArea.category}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Related Focus Areas ─────────────────────────── */}
      {related.length > 0 && (
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-6">Related Focus Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((ra) => (
                <Link key={ra._id} href={`/focus-areas/${ra.slug}`}>
                  <div className="group bg-[#111] border border-white/5 rounded-xl p-5 hover:border-red-500/30 transition-all">
                    <FocusAreaIcon
                      icon={ra.icon}
                      iconType={ra.iconType}
                      color={ra.color}
                      className="text-3xl mb-3 block"
                    />
                    <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{ra.category}</p>
                    <h3 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">{ra.title}</h3>
                    {ra.shortDescription && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{ra.shortDescription}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

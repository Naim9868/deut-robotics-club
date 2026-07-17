'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

interface ResearchDetail {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  abstract?: string;
  fullDescription?: string;
  summary?: string;
  keywords?: string[];
  researchCode?: string;
  coverImage?: { url: string; alt?: string };
  galleryImages?: { url: string; alt?: string }[];
  youtubePresentation?: string;
  researchPoster?: { url: string; alt?: string };
  researchArea?: string;
  category?: string;
  subCategory?: string;
  researchType?: string;
  researchLevel?: string;
  difficulty?: string;
  status: string;
  visibility?: string;
  researchers?: {
    fullName: string;
    designation?: string;
    department?: string;
    session?: string;
    studentId?: string;
    email?: string;
    profilePhoto?: { url: string };
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
    linkedin?: string;
    github?: string;
    role?: string;
  }[];
  faculty?: {
    name: string;
    role: string;
    department?: string;
    email?: string;
  }[];
  startDate?: string;
  expectedCompletion?: string;
  completedAt?: string;
  publishedAt?: string;
  technologies?: { name: string; icon?: string; category?: string }[];
  components?: { componentName: string; quantity?: number; specification?: string }[];
  datasets?: { datasetName: string; datasetSource?: string; datasetURL?: string }[];
  publications?: {
    title: string;
    authors?: string;
    journal?: string;
    conference?: string;
    year?: number;
    doi?: string;
    url?: string;
    type?: string;
  }[];
  funding?: { funded: boolean; fundingAgency?: string; grantNumber?: string; projectBudget?: string };
  awards?: { awardName: string; organizer?: string; year?: number }[];
  documentation?: {
    githubRepo?: string;
    gitlabRepo?: string;
    researchPaper?: string;
    presentation?: string;
    poster?: string;
    report?: string;
    dataset?: string;
    documentation?: string;
    liveDemo?: string;
    youtubePresentation?: string;
  };
  analytics?: { views: number; downloads: number; citations: number; bookmarks: number };
  createdAt: string;
}

interface RelatedResearch {
  _id: string;
  title: string;
  slug: string;
  researchArea?: string;
  coverImage?: { url: string };
  status: string;
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
  'Robotics': '🤖', 'Artificial Intelligence': '🧠', 'Machine Learning': '📊',
  'Computer Vision': '👁️', 'IoT': '📡', 'Embedded Systems': '🔧',
  'Automation': '⚙️', 'Drone': '🛩️', 'Biomedical': '🏥',
  'Control Systems': '🎛️', 'Power Electronics': '⚡', 'Mechanical Design': '🔨', 'Other': '🔬',
};

export default function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [research, setResearch] = useState<ResearchDetail | null>(null);
  const [related, setRelated] = useState<RelatedResearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeSection, setActiveSection] = useState('research');

  useEffect(() => {
    fetchResearch();
  }, [slug]);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/research/slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setResearch(data.research);
        setRelated(data.related || []);
      }
    } catch {
      console.error('Failed to load research');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar activeSection={activeSection} />
        <div className="min-h-screen bg-card pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!research) {
    return (
      <>
        <Navbar activeSection={activeSection} />
        <div className="min-h-screen bg-card flex flex-col items-center justify-center gap-4">
          <span className="text-5xl">🔍</span>
          <h1 className="text-2xl font-black text-foreground">Research Not Found</h1>
          <Link href="/research" className="text-primary hover:underline text-sm">
            Back to Research
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const allImages = [
    ...(research.coverImage?.url ? [research.coverImage] : []),
    ...(research.galleryImages || []),
  ].filter((img) => img.url);

  const docLinks = [
    { label: 'GitHub Repository', url: research.documentation?.githubRepo, icon: '💻' },
    { label: 'GitLab Repository', url: research.documentation?.gitlabRepo, icon: '🦊' },
    { label: 'Research Paper', url: research.documentation?.researchPaper, icon: '📑' },
    { label: 'Presentation', url: research.documentation?.presentation, icon: '📊' },
    { label: 'Poster', url: research.documentation?.poster, icon: '🖼️' },
    { label: 'Report', url: research.documentation?.report, icon: '📋' },
    { label: 'Documentation', url: research.documentation?.documentation, icon: '📄' },
    { label: 'Live Demo', url: research.documentation?.liveDemo, icon: '🌐' },
  ].filter((l) => l.url);

  const formatDate = (d?: string) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Navbar activeSection={activeSection} />
      <div className="min-h-screen bg-card">
        {/* ─── Hero Section ─────────────────────────────── */}
        <section className="relative h-screen">
          {allImages[activeImage]?.url && (
            <img
              src={allImages[activeImage].url}
              alt={allImages[activeImage].alt || research.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-card/20" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Link href="/research" className="text-muted hover:text-foreground text-sm mb-4 inline-block">
                &larr; Back to Research
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded text-xs font-bold bg-primary/20 text-primary">
                  {AREA_ICONS[research.researchArea || 'Other'] || '🔬'} {research.researchArea || 'Research'}
                </span>
                <span className={`px-3 py-1 rounded text-xs font-bold ${STATUS_COLORS[research.status] || STATUS_COLORS.ongoing}`}>
                  {research.status.replace(/_/g, ' ')}
                </span>
                {research.researchType && (
                  <span className="px-3 py-1 rounded text-xs font-bold bg-background/10 text-muted">
                    {research.researchType}
                  </span>
                )}
                {research.difficulty && (
                  <span className="px-3 py-1 rounded text-xs font-bold bg-background/5 text-muted">
                    {research.difficulty}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">{research.title}</h1>
              {research.shortDescription && (
                <p className="text-muted text-lg max-w-3xl">{research.shortDescription}</p>
              )}
            </div>
          </div>
        </section>

        {/* ─── Content ──────────────────────────────────── */}
        <section className="px-4 py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Abstract */}
              {research.abstract && (
                <ScrollReveal>
                  <div className="bg-background/5 border border-border rounded-xl p-6">
                    <h2 className="text-xl font-black text-foreground mb-3">Abstract</h2>
                    <p className="text-muted leading-relaxed italic">{research.abstract}</p>
                  </div>
                </ScrollReveal>
              )}

              {/* Gallery */}
              {allImages.length > 1 && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Gallery</h2>
                    <div className="rounded-xl overflow-hidden border border-border mb-3 bg-black flex items-center justify-center">
                      <img
                        src={allImages[activeImage].url}
                        alt={allImages[activeImage].alt || research.title}
                        className="w-full max-h-[500px] object-contain"
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                            activeImage === i ? 'border-primary' : 'border-border'
                          }`}
                        >
                          <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Full Description */}
              {research.fullDescription && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Full Description</h2>
                    <div className="text-muted leading-relaxed whitespace-pre-wrap">{research.fullDescription}</div>
                  </div>
                </ScrollReveal>
              )}

              {/* Summary */}
              {research.summary && (
                <ScrollReveal>
                  <div className="bg-background/5 border border-border rounded-xl p-6">
                    <h2 className="text-xl font-black text-foreground mb-3">Summary</h2>
                    <p className="text-muted leading-relaxed">{research.summary}</p>
                  </div>
                </ScrollReveal>
              )}

              {/* YouTube Presentation */}
              {research.youtubePresentation && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">YouTube Presentation</h2>
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <iframe
                        src={research.youtubePresentation.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Research Timeline */}
              {(research.startDate || research.expectedCompletion || research.completedAt || research.publishedAt) && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Timeline</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {research.startDate && (
                        <div className="bg-background/5 border border-border rounded-lg p-4">
                           <p className="text-muted text-xs uppercase tracking-wider mb-1">Start Date</p>
                           <p className="text-foreground text-sm font-medium">{formatDate(research.startDate)}</p>
                        </div>
                      )}
                      {research.expectedCompletion && (
                        <div className="bg-background/5 border border-border rounded-lg p-4">
                           <p className="text-muted text-xs uppercase tracking-wider mb-1">Expected</p>
                           <p className="text-foreground text-sm font-medium">{formatDate(research.expectedCompletion)}</p>
                        </div>
                      )}
                      {research.completedAt && (
                        <div className="bg-background/5 border border-border rounded-lg p-4">
                           <p className="text-muted text-xs uppercase tracking-wider mb-1">Completed</p>
                          <p className="text-green-400 text-sm font-medium">{formatDate(research.completedAt)}</p>
                        </div>
                      )}
                      {research.publishedAt && (
                        <div className="bg-background/5 border border-border rounded-lg p-4">
                           <p className="text-muted text-xs uppercase tracking-wider mb-1">Published</p>
                          <p className="text-primary text-sm font-medium">{formatDate(research.publishedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Technologies */}
              {research.technologies && research.technologies.length > 0 && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Technologies</h2>
                    <div className="flex flex-wrap gap-2">
                      {research.technologies.map((tech, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-background/5 border border-border rounded-lg">
                          {tech.icon && <span>{tech.icon}</span>}
                          <span className="text-foreground text-sm font-medium">{tech.name}</span>
                          {tech.category && <span className="text-muted text-xs">({tech.category})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Components Used */}
              {research.components && research.components.length > 0 && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Components Used</h2>
                    <div className="bg-background/5 border border-border rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-background/5">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-muted">Component</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-muted">Qty</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-muted">Specification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {research.components.map((comp, i) => (
                            <tr key={i}>
                              <td className="px-4 py-3 text-sm text-foreground">{comp.componentName}</td>
                              <td className="px-4 py-3 text-sm text-muted">{comp.quantity || 1}</td>
                              <td className="px-4 py-3 text-sm text-muted">{comp.specification || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Datasets */}
              {research.datasets && research.datasets.length > 0 && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Datasets</h2>
                    <div className="space-y-3">
                      {research.datasets.map((ds, i) => (
                        <div key={i} className="bg-background/5 border border-border rounded-lg p-4 flex items-center gap-4">
                          <span className="text-2xl">📦</span>
                          <div className="flex-1">
                            <p className="text-foreground text-sm font-medium">{ds.datasetName}</p>
                            {ds.datasetSource && <p className="text-muted text-xs">Source: {ds.datasetSource}</p>}
                          </div>
                          {ds.datasetURL && (
                            <a href={ds.datasetURL} target="_blank" rel="noopener noreferrer"
                              className="text-primary text-xs hover:underline">View Dataset</a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Publications */}
              {research.publications && research.publications.length > 0 && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Publications ({research.publications.length})</h2>
                    <div className="space-y-3">
                      {research.publications.map((pub, i) => (
                        <div key={i} className="bg-background/5 border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-foreground text-sm font-medium mb-1">{pub.title}</p>
                              {pub.authors && <p className="text-muted text-xs">{pub.authors}</p>}
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                                {pub.journal && <span>{pub.journal}</span>}
                                {pub.conference && <span>{pub.conference}</span>}
                                {pub.year && <span>{pub.year}</span>}
                                {pub.doi && (
                                  <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                                    className="text-primary hover:underline">DOI</a>
                                )}
                              </div>
                            </div>
                            {pub.type && (
                              <span className="px-2 py-0.5 bg-background/5 rounded text-[10px] text-muted whitespace-nowrap">
                                {pub.type.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Funding */}
              {research.funding?.funded && (
                <ScrollReveal>
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                    <h2 className="text-xl font-black text-foreground mb-3">💰 Funding</h2>
                    <div className="space-y-2 text-sm">
                      {research.funding.fundingAgency && (
                        <p className="text-muted"><span className="text-muted">Agency:</span> {research.funding.fundingAgency}</p>
                      )}
                      {research.funding.grantNumber && (
                        <p className="text-muted"><span className="text-muted">Grant:</span> {research.funding.grantNumber}</p>
                      )}
                      {research.funding.projectBudget && (
                        <p className="text-muted"><span className="text-muted">Budget:</span> {research.funding.projectBudget}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Awards */}
              {research.awards && research.awards.length > 0 && (
                <ScrollReveal>
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <h2 className="text-xl font-black text-foreground mb-3">🏆 Awards</h2>
                    <div className="space-y-3">
                      {research.awards.map((award, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-yellow-400 text-lg">🏅</span>
                          <div>
                            <p className="text-foreground text-sm font-medium">{award.awardName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted">
                              {award.organizer && <span>{award.organizer}</span>}
                              {award.year && <span>• {award.year}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Research Poster */}
              {research.researchPoster?.url && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Research Poster</h2>
                    <div className="rounded-xl overflow-hidden border border-border">
                      <img src={research.researchPoster.url} alt={research.researchPoster.alt || 'Research Poster'} className="w-full" />
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Keywords */}
              {research.keywords && research.keywords.length > 0 && (
                <ScrollReveal>
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-4">Keywords</h2>
                    <div className="flex flex-wrap gap-2">
                      {research.keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-background/5 border border-border rounded-full text-xs text-muted">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* ─── Sidebar ─────────────────────────────── */}
            <div className="space-y-6">

              {/* Quick Info */}
              <ScrollReveal>
                <div className="bg-background/5 border border-border rounded-xl p-5">
                  <h3 className="text-lg font-black text-foreground mb-3">Research Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Status</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_COLORS[research.status]}`}>
                        {research.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {research.researchArea && (
                      <div className="flex justify-between">
                        <span className="text-muted">Area</span>
                        <span className="text-foreground">{research.researchArea}</span>
                      </div>
                    )}
                    {research.category && (
                      <div className="flex justify-between">
                        <span className="text-muted">Category</span>
                        <span className="text-foreground">{research.category}</span>
                      </div>
                    )}
                    {research.researchLevel && (
                      <div className="flex justify-between">
                        <span className="text-muted">Level</span>
                        <span className="text-foreground">{research.researchLevel}</span>
                      </div>
                    )}
                    {research.difficulty && (
                      <div className="flex justify-between">
                        <span className="text-muted">Difficulty</span>
                        <span className="text-foreground">{research.difficulty}</span>
                      </div>
                    )}
                    {research.researchCode && (
                      <div className="flex justify-between">
                        <span className="text-muted">Code</span>
                        <span className="text-foreground font-mono">{research.researchCode}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted">Created</span>
                      <span className="text-foreground">{formatDate(research.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Documentation Links */}
              {docLinks.length > 0 && (
                <ScrollReveal>
                  <div className="bg-background/5 border border-border rounded-xl p-5">
                    <h3 className="text-lg font-black text-foreground mb-3">Documentation</h3>
                    <div className="space-y-2">
                      {docLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted hover:text-foreground text-sm transition-colors"
                        >
                          <span>{link.icon}</span>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Faculty */}
              {research.faculty && research.faculty.length > 0 && (
                <ScrollReveal>
                  <div className="bg-background/5 border border-border rounded-xl p-5">
                    <h3 className="text-lg font-black text-foreground mb-3">Faculty</h3>
                    <div className="space-y-3">
                      {research.faculty.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center text-foreground text-xs font-bold flex-shrink-0">
                            {f.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-foreground text-sm font-medium">{f.name}</p>
                            <p className="text-muted text-xs">{f.role}{f.department ? ` • ${f.department}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Research Team */}
              {research.researchers && research.researchers.length > 0 && (
                <ScrollReveal>
                  <div className="bg-background/5 border border-border rounded-xl p-5">
                    <h3 className="text-lg font-black text-foreground mb-3">Research Team ({research.researchers.length})</h3>
                    <div className="space-y-3">
                      {research.researchers.map((r, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center text-foreground text-xs font-bold flex-shrink-0 overflow-hidden">
                            {r.profilePhoto?.url ? (
                              <img src={r.profilePhoto.url} alt={r.fullName} className="w-full h-full object-cover" />
                            ) : (
                              r.fullName.charAt(0)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground text-sm font-medium truncate">{r.fullName}</p>
                            <p className="text-muted text-xs truncate">
                              {r.role || 'Researcher'}{r.department ? ` • ${r.department}` : ''}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {r.googleScholar && (
                              <a href={r.googleScholar} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground text-xs">GS</a>
                            )}
                            {r.researchGate && (
                              <a href={r.researchGate} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-green-400 text-xs">RG</a>
                            )}
                            {r.linkedin && (
                              <a href={r.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-blue-400 text-xs">in</a>
                            )}
                            {r.github && (
                              <a href={r.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground text-xs">GH</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Share */}
              <ScrollReveal>
                <div className="bg-background/5 border border-border rounded-xl p-5">
                  <h3 className="text-lg font-black text-foreground mb-3">Share</h3>
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(research.title)}&url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-3 py-2 bg-background/5 rounded-lg text-xs text-muted hover:bg-background/10 transition-colors"
                    >
                      Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${typeof window !== 'undefined' ? window.location.href : ''}&title=${encodeURIComponent(research.title)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-3 py-2 bg-background/5 rounded-lg text-xs text-muted hover:bg-background/10 transition-colors"
                    >
                      LinkedIn
                    </a>
                    <button
                      onClick={() => { navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : ''); }}
                      className="px-3 py-2 bg-background/5 rounded-lg text-xs text-muted hover:bg-background/10 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Stats */}
              {research.analytics && (
                <ScrollReveal>
                  <div className="bg-background/5 border border-border rounded-xl p-5">
                    <h3 className="text-lg font-black text-foreground mb-3">Analytics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Views</span>
                        <span className="text-foreground">{research.analytics.views || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Downloads</span>
                        <span className="text-foreground">{research.analytics.downloads || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Citations</span>
                        <span className="text-foreground">{research.analytics.citations || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Bookmarks</span>
                        <span className="text-foreground">{research.analytics.bookmarks || 0}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        {/* ─── Related Research ─────────────────────────── */}
        {related.length > 0 && (
          <section className="px-4 pb-20">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-black text-foreground mb-6">Related Research</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((item) => (
                  <Link key={item._id} href={`/research/${item.slug}`}>
                    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all">
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={item.coverImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=1e1e1e&color=e63946&size=200&bold=true&length=2`}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-primary text-[10px] font-bold tracking-widest">{item.researchArea || 'Research'}</p>
                        <h3 className="text-foreground font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[item.status] || STATUS_COLORS.ongoing}`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}

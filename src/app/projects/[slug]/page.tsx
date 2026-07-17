'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

interface ProjectDetail {
  _id: string;
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  summary?: string;
  tag: string;
  coverImage?: { url: string; alt?: string };
  galleryImages?: { url: string; alt?: string }[];
  image?: { url: string; alt?: string };
  youtubeVideo?: string;
  category: string;
  subCategory?: string;
  projectType?: string;
  difficulty?: string;
  status: string;
  team?: {
    fullName: string;
    designation?: string;
    department?: string;
    session?: string;
    studentId?: string;
    email?: string;
    phone?: string;
    profilePhoto?: { url: string };
    github?: string;
    linkedin?: string;
    roleInProject?: string;
    isLeader?: boolean;
  }[];
  faculty?: { advisor?: string; coAdvisor?: string; mentor?: string };
  technologies?: { name: string; icon?: string; category?: string }[];
  components?: { componentName: string; quantity?: number; specification?: string }[];
  documentation?: {
    github?: string;
    liveDemo?: string;
    documentation?: string;
    researchPaper?: string;
    presentation?: string;
    report?: string;
    youtubeVideo?: string;
  };
  competition?: {
    competitionName?: string;
    organizer?: string;
    award?: string;
    position?: string;
    certificate?: string;
  };
  analytics?: { views: number; likes: number };
  createdAt: string;
}

interface RelatedProject {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  category: string;
  coverImage?: { url: string };
  image?: { url: string };
}

const CATEGORY_COLORS: Record<string, string> = {
  COMBAT: 'from-red-500 to-rose-500',
  AI: 'from-blue-500 to-indigo-500',
  AERO: 'from-cyan-500 to-teal-500',
  AUTO: 'from-amber-500 to-orange-500',
  OTHER: 'from-purple-500 to-pink-500',
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-500/15 text-muted',
  submitted: 'bg-yellow-500/15 text-yellow-400',
  under_review: 'bg-blue-500/15 text-blue-400',
  approved: 'bg-green-500/15 text-green-400',
  ongoing: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-green-500/15 text-green-400',
  archived: 'bg-gray-500/15 text-muted',
};

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [related, setRelated] = useState<RelatedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setRelated(data.related || []);
      }
    } catch {
      console.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🔍</span>
        <h1 className="text-2xl font-black text-foreground">Project Not Found</h1>
        <Link href="/projects" className="text-red-500 hover:underline text-sm">
          Back to Projects
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(project.coverImage?.url ? [project.coverImage] : []),
    ...(project.image?.url && project.image.url !== project.coverImage?.url ? [project.image] : []),
    ...(project.galleryImages || []),
  ].filter((img) => img.url);

  const docLinks = [
    { label: 'GitHub', url: project.documentation?.github, icon: '💻' },
    { label: 'Live Demo', url: project.documentation?.liveDemo, icon: '🌐' },
    { label: 'Documentation', url: project.documentation?.documentation, icon: '📄' },
    { label: 'Research Paper', url: project.documentation?.researchPaper, icon: '📑' },
    { label: 'Presentation', url: project.documentation?.presentation, icon: '📊' },
    { label: 'Report', url: project.documentation?.report, icon: '📋' },
  ].filter((l) => l.url);

  return (
    <div className="min-h-screen bg-card">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src={allImages[activeImage]?.url || '/images/project-placeholder.jpg'}
          alt={allImages[activeImage]?.alt || project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/projects" className="text-muted hover:text-foreground text-sm mb-4 inline-block">
              &larr; Back to Projects
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${CATEGORY_COLORS[project.category] || CATEGORY_COLORS.OTHER}`}>
                {project.category}
              </span>
              <span className={`px-3 py-1 rounded text-xs font-bold ${STATUS_STYLES[project.status] || STATUS_STYLES.approved}`}>
                {project.status}
              </span>
              {project.projectType && (
                <span className="px-3 py-1 rounded text-xs font-bold bg-background/10 text-muted">
                  {project.projectType}
                </span>
              )}
              {project.difficulty && (
                <span className="px-3 py-1 rounded text-xs font-bold bg-background/5 text-muted">
                  {project.difficulty}
                </span>
              )}
            </div>

            <p className="text-red-500 text-xs font-bold tracking-widest mb-2">{project.tag}</p>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">{project.title}</h1>
            {project.shortDescription && (
              <p className="text-muted text-lg max-w-3xl">{project.shortDescription}</p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Gallery */}
            {allImages.length > 1 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-foreground mb-4">Gallery</h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                          activeImage === i ? 'border-red-500' : 'border-border'
                        }`}
                      >
                        <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Full Description */}
            {project.fullDescription && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-foreground mb-4">About This Project</h2>
                  <div className="text-muted leading-relaxed whitespace-pre-wrap">{project.fullDescription}</div>
                </div>
              </ScrollReveal>
            )}

            {/* Summary */}
            {project.summary && (
              <ScrollReveal>
                <div className="bg-background/5 border border-border rounded-xl p-6">
                  <h2 className="text-xl font-black text-foreground mb-3">Summary</h2>
                  <p className="text-muted leading-relaxed">{project.summary}</p>
                </div>
              </ScrollReveal>
            )}

            {/* YouTube Video */}
            {project.youtubeVideo && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-foreground mb-4">Video</h2>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={project.youtubeVideo.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-black text-foreground mb-4">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-background/5 border border-border rounded-lg">
                        <span className="text-foreground text-sm font-medium">{tech.name}</span>
                        {tech.category && (
                          <span className="text-muted text-xs">({tech.category})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Components */}
            {project.components && project.components.length > 0 && (
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
                        {project.components.map((comp, i) => (
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

            {/* Competition */}
            {project.competition?.competitionName && (
              <ScrollReveal>
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
                  <h2 className="text-xl font-black text-foreground mb-3">🏆 Competition</h2>
                  <div className="space-y-2">
                    <p className="text-foreground font-bold">{project.competition.competitionName}</p>
                    {project.competition.organizer && (
                      <p className="text-muted text-sm">Organized by: {project.competition.organizer}</p>
                    )}
                    {project.competition.award && (
                      <p className="text-yellow-400 text-sm font-bold">Award: {project.competition.award}</p>
                    )}
                    {project.competition.position && (
                      <p className="text-muted text-sm">Position: {project.competition.position}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick Links */}
            {docLinks.length > 0 && (
              <ScrollReveal>
                <div className="bg-background/5 border border-border rounded-xl p-5">
                  <h3 className="text-lg font-black text-foreground mb-3">Links</h3>
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
            {project.faculty && (project.faculty.advisor || project.faculty.coAdvisor || project.faculty.mentor) && (
              <ScrollReveal>
                <div className="bg-background/5 border border-border rounded-xl p-5">
                  <h3 className="text-lg font-black text-foreground mb-3">Faculty</h3>
                  <div className="space-y-2 text-sm">
                    {project.faculty.advisor && (
                      <p className="text-muted"><span className="text-muted">Advisor:</span> {project.faculty.advisor}</p>
                    )}
                    {project.faculty.coAdvisor && (
                      <p className="text-muted"><span className="text-muted">Co-Advisor:</span> {project.faculty.coAdvisor}</p>
                    )}
                    {project.faculty.mentor && (
                      <p className="text-muted"><span className="text-muted">Mentor:</span> {project.faculty.mentor}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Team */}
            {project.team && project.team.length > 0 && (
              <ScrollReveal>
                <div className="bg-background/5 border border-border rounded-xl p-5">
                  <h3 className="text-lg font-black text-foreground mb-3">Team ({project.team.length})</h3>
                  <div className="space-y-3">
                    {project.team.map((member, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center text-foreground text-xs font-bold flex-shrink-0">
                          {member.profilePhoto?.url ? (
                            <Image src={member.profilePhoto.url} alt={member.fullName} width={32} height={32} className="rounded-full object-cover" />
                          ) : (
                            member.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">
                            {member.fullName}
                            {member.isLeader && <span className="text-red-500 text-xs ml-1">(Leader)</span>}
                          </p>
                          {member.roleInProject && (
                            <p className="text-muted text-xs">{member.roleInProject}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Stats */}
            <ScrollReveal>
              <div className="bg-background/5 border border-border rounded-xl p-5">
                <h3 className="text-lg font-black text-foreground mb-3">Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Views</span>
                    <span className="text-foreground">{project.analytics?.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Likes</span>
                    <span className="text-foreground">{project.analytics?.likes || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Created</span>
                    <span className="text-foreground">
                      {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-foreground mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((rp) => (
                <Link key={rp._id} href={`/projects/${rp.slug}`}>
                  <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-red-500/30 transition-all">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={rp.coverImage?.url || rp.image?.url || '/images/project-placeholder.jpg'}
                        alt={rp.title}
                        fill
                        className="object-cover transition-all"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-red-500 text-[10px] font-bold tracking-widest">{rp.tag}</p>
                      <h3 className="text-foreground font-bold text-sm group-hover:text-red-400 transition-colors">{rp.title}</h3>
                    </div>
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

// ─── Types ────────────────────────────────────────────────────

interface CommitteeMember {
  _id?: string;
  fullName: string;
  slug: string;
  profilePhoto: { url: string; alt: string };
  designation: string;
  department: string;
  session: string;
  shortBio: string;
  socialLinks: { facebook: string; linkedin: string; github: string; portfolio: string; website: string };
  displayOrder: number;
  featured: boolean;
  isVisible: boolean;
}

interface Committee {
  _id: string;
  committeeYear: number;
  title: string;
  slug: string;
  description: string;
  isCurrent: boolean;
  members: CommitteeMember[];
}

// ─── Social Icon Renderer ─────────────────────────────────────

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  if (!url) return null;
  const icons: Record<string, React.ReactNode> = {
    linkedin: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    github: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    facebook: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-all text-muted hover:text-foreground"
      title={platform}>
      {icons[platform]}
    </a>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function ExecutiveCommitteePage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const res = await fetch('/api/executive-committees');
        const data = await res.json();
        setCommittees(data);
        // Set active year to the first (most recent) or current committee
        if (data.length > 0) {
          const current = data.find((c: Committee) => c.isCurrent);
          setActiveYear(current ? current.committeeYear : data[0].committeeYear);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchCommittees();
  }, []);

  const activeCommittee = committees.find(c => c.committeeYear === activeYear);
  const visibleMembers = activeCommittee?.members.filter(m => m.isVisible) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="up">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Executive <span className="text-primary">Committee</span>
            </h1>
            <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.3em] max-w-xl mx-auto">
              The leadership team driving DUET Robotics Club forward
            </p>
          </div>
        </ScrollReveal>

        {/* Year Tabs */}
        {committees.length > 0 && (
          <ScrollReveal animation="up" delay={100}>
            <div className="flex justify-center gap-2 flex-wrap mb-8">
              {committees.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setActiveYear(c.committeeYear)}
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    activeYear === c.committeeYear
                      ? 'bg-primary text-foreground'
                      : 'bg-white/5 text-muted hover:bg-background/10 hover:text-foreground'
                  }`}
                >
                  {c.committeeYear}
                  {c.isCurrent && (
                    <span className="ml-1.5 w-2 h-2 bg-green-400 rounded-full inline-block" />
                  )}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Committee Info */}
        {activeCommittee && (
          <ScrollReveal animation="up" delay={150}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase mb-2">
                {activeCommittee.title}
              </h2>
              {activeCommittee.description && (
                <p className="text-muted text-sm max-w-2xl mx-auto">{activeCommittee.description}</p>
              )}
              {activeCommittee.isCurrent && (
                <span className="inline-block mt-3 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold uppercase tracking-wider">
                  Current Committee
                </span>
              )}
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* Members Grid */}
      <section className="pb-20 sm:pb-24 container mx-auto px-4 sm:px-6 lg:px-8">
        {visibleMembers.length === 0 ? (
          <div className="text-center py-12 text-muted">
            No members found for this committee.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {visibleMembers
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((member, idx) => (
                <ScrollReveal key={member._id || idx} animation="scale" delay={idx * 50}>
                  <Link href={`/executive-committee/${member.slug}`}>
                    <div className="group relative overflow-hidden aspect-[3/4] bg-card border border-border rounded-xl sm:rounded-2xl hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                      {/* Profile Image */}
                      {member.profilePhoto?.url ? (
                        <img
                          src={member.profilePhoto.url}
                          alt={member.profilePhoto.alt || member.fullName}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-muted font-black">
                          {member.fullName.charAt(0)}
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                        <p className="text-primary text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] mb-1 truncate">
                          {member.designation}
                        </p>
                        <h3 className="text-xs sm:text-sm font-black text-foreground uppercase leading-tight line-clamp-2">
                          {member.fullName}
                        </h3>
                        {(member.department || member.session) && (
                          <p className="text-[7px] sm:text-[8px] text-muted uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {member.department}{member.session && ` · ${member.session}`}
                          </p>
                        )}
                      </div>

                      {/* Featured Badge */}
                      {member.featured && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500/90 text-black text-[8px] rounded font-bold">
                          Featured
                        </div>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

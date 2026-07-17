'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

// ─── Types ────────────────────────────────────────────────────

interface CommitteeMember {
  _id?: string;
  fullName: string;
  slug: string;
  profilePhoto: { url: string; alt: string };
  coverPhoto: { url: string; alt: string };
  designation: string;
  department: string;
  session: string;
  studentId: string;
  shortBio: string;
  fullBiography: string;
  email: string;
  phone: string;
  socialLinks: { facebook: string; linkedin: string; github: string; portfolio: string; website: string };
  responsibilities: string[];
  achievements: string[];
  messageFromMember: string;
  featured: boolean;
}

interface Committee {
  _id: string;
  committeeYear: number;
  title: string;
  slug: string;
}

interface MemberResponse {
  committee: Committee;
  member: CommitteeMember;
}

// ─── Social Link Component ────────────────────────────────────

function SocialLink({ platform, url }: { platform: string; url: string }) {
  if (!url) return null;
  const labels: Record<string, string> = {
    facebook: 'Facebook', linkedin: 'LinkedIn', github: 'GitHub',
    portfolio: 'Portfolio', website: 'Website',
  };
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2.5 bg-background/5 rounded-lg hover:bg-primary/20 transition-colors text-muted hover:text-foreground text-sm">
      <span className="font-medium">{labels[platform] || platform}</span>
      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function MemberDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<MemberResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/executive-committees/member/${slug}`);
        if (!res.ok) throw new Error('Member not found');
        const result = await res.json();
        setData(result);
      } catch {
        setError('Member not found');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted text-lg text-center">{error || 'Member not found'}</p>
        <Link href="/executive-committee" className="text-primary hover:underline">
          &larr; Back to Executive Committee
        </Link>
      </div>
    );
  }

  const { committee, member } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Back Button - Fixed Position */}
      <Link 
        href="/executive-committee" 
        className="fixed top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 z-50 group flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-card/90 backdrop-blur-xl border border-border/50 rounded-full text-muted hover:text-primary hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:scale-105"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider hidden sm:inline">Home</span>
        <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider sm:hidden">←</span>
      </Link>

      {/* Cover Photo */}
      <div className="relative h-48 xs:h-56 sm:h-64 md:h-80 lg:h-96 xl:h-[400px]">
        {member.coverPhoto?.url ? (
          <img 
            src={member.coverPhoto.url} 
            alt={member.coverPhoto.alt || member.fullName}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-20 xs:-mt-24 sm:-mt-28 md:-mt-32 lg:-mt-36 xl:-mt-40 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal animation="up">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              {/* Profile Photo */}
              <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-2xl overflow-hidden border-4 border-background shadow-2xl flex-shrink-0">
                {member.profilePhoto?.url ? (
                  <img 
                    src={member.profilePhoto.url} 
                    alt={member.profilePhoto.alt || member.fullName}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-input-bg flex items-center justify-center text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-muted font-black">
                    {member.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Link 
                    href="/executive-committee" 
                    className="text-muted hover:text-primary text-[10px] xs:text-xs sm:text-sm transition-colors"
                  >
                    {committee.committeeYear}
                  </Link>
                  <span className="text-muted text-[10px] xs:text-xs sm:text-sm">·</span>
                  <span className="text-primary text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">
                    {member.designation}
                  </span>
                </div>
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground uppercase tracking-tight break-words">
                  {member.fullName}
                </h1>
                {(member.department || member.session) && (
                  <p className="text-muted text-[10px] xs:text-xs sm:text-sm md:text-base mt-1 sm:mt-2 break-words">
                    {member.department}
                    {member.department && member.session && ' · '}
                    {member.session}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pb-16 sm:pb-20">
            {/* Left: Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
              {/* Bio */}
              {member.fullBiography && (
                <ScrollReveal animation="up" delay={100}>
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 min-w-0">
                    <h2 className="text-base sm:text-lg md:text-xl font-black text-foreground uppercase tracking-wider mb-3 sm:mb-4">
                      About
                    </h2>
                    <div 
                      className="prose prose-invert prose-sm sm:prose-base max-w-none text-foreground/80 leading-relaxed min-w-0 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: member.fullBiography }} 
                    />
                  </div>
                </ScrollReveal>
              )}

              {!member.fullBiography && member.shortBio && (
                <ScrollReveal animation="up" delay={100}>
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
                    <h2 className="text-base sm:text-lg md:text-xl font-black text-foreground uppercase tracking-wider mb-3 sm:mb-4">
                      About
                    </h2>
                    <p className="text-foreground/80 leading-relaxed text-sm sm:text-base break-words">
                      {member.shortBio}
                    </p>
                  </div>
                </ScrollReveal>
              )}

              {/* Responsibilities */}
              {member.responsibilities.length > 0 && (
                <ScrollReveal animation="up" delay={150}>
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
                    <h2 className="text-base sm:text-lg md:text-xl font-black text-foreground uppercase tracking-wider mb-3 sm:mb-4">
                      Responsibilities
                    </h2>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {member.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3 text-muted text-xs sm:text-sm">
                          <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">&#9654;</span>
                          <span className="break-words">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              {/* Achievements */}
              {member.achievements.length > 0 && (
                <ScrollReveal animation="up" delay={200}>
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
                    <h2 className="text-base sm:text-lg md:text-xl font-black text-foreground uppercase tracking-wider mb-3 sm:mb-4">
                      Achievements
                    </h2>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {member.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3 text-muted text-xs sm:text-sm">
                          <span className="text-yellow-500 mt-0.5 sm:mt-1 flex-shrink-0">&#9733;</span>
                          <span className="break-words">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              {/* Message */}
              {member.messageFromMember && (
                <ScrollReveal animation="up" delay={250}>
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
                    <h2 className="text-base sm:text-lg md:text-xl font-black text-foreground uppercase tracking-wider mb-3 sm:mb-4">
                      Message
                    </h2>
                    <blockquote className="border-l-2 border-primary pl-3 sm:pl-4 text-muted italic leading-relaxed text-sm sm:text-base break-words">
                      &ldquo;{member.messageFromMember}&rdquo;
                    </blockquote>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Info */}
              <ScrollReveal animation="up" delay={100}>
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
                    Info
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                    {member.department && (
                      <div className="break-words">
                        <p className="text-muted text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider">Department</p>
                        <p className="text-muted break-words">{member.department}</p>
                      </div>
                    )}
                    {member.session && (
                      <div>
                        <p className="text-muted text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider">Session</p>
                        <p className="text-muted">{member.session}</p>
                      </div>
                    )}
                    {member.studentId && (
                      <div>
                        <p className="text-muted text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider">Student ID</p>
                        <p className="text-muted break-words">{member.studentId}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider">Committee</p>
                      <p className="text-muted break-words">{committee.title}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact */}
              {(member.email || member.phone) && (
                <ScrollReveal animation="up" delay={150}>
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3">
                    <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
                      Contact
                    </h3>
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`} 
                        className="flex items-center gap-2 text-muted hover:text-primary text-xs sm:text-sm transition-colors break-all"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="break-all">{member.email}</span>
                      </a>
                    )}
                    {member.phone && (
                      <a 
                        href={`tel:${member.phone}`} 
                        className="flex items-center gap-2 text-muted hover:text-primary text-xs sm:text-sm transition-colors"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{member.phone}</span>
                      </a>
                    )}
                  </div>
                </ScrollReveal>
              )}

              {/* Social Links */}
              <ScrollReveal animation="up" delay={200}>
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3">
                  <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
                    Connect
                  </h3>
                  <div className="space-y-2">
                    {(['linkedin', 'github', 'facebook', 'portfolio', 'website'] as const).map(platform => (
                      <SocialLink key={platform} platform={platform} url={member.socialLinks?.[platform] || ''} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Back Link */}
              <ScrollReveal animation="up" delay={250}>
                <Link href="/executive-committee"
                  className="block text-center px-4 py-2.5 sm:py-3 bg-background/5 rounded-lg text-muted hover:text-foreground hover:bg-background/10 transition-all text-xs sm:text-sm font-medium">
                  &larr; All Committees
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
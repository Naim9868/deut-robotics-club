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
      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-lg hover:bg-primary/20 transition-colors text-gray-300 hover:text-white text-sm">
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
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">{error || 'Member not found'}</p>
        <Link href="/executive-committee" className="text-primary hover:underline">
          &larr; Back to Executive Committee
        </Link>
      </div>
    );
  }

  const { committee, member } = data;

  return (
    <div className="min-h-screen bg-dark">
      {/* Cover Photo */}
      <div className="relative h-64 sm:h-80 md:h-96">
        {member.coverPhoto?.url ? (
          <img src={member.coverPhoto.url} alt={member.coverPhoto.alt || member.fullName}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ScrollReveal animation="up">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
              {/* Profile Photo */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-dark shadow-2xl flex-shrink-0">
                {member.profilePhoto?.url ? (
                  <img src={member.profilePhoto.url} alt={member.profilePhoto.alt || member.fullName}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#121212] flex items-center justify-center text-4xl text-gray-600 font-black">
                    {member.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link href="/executive-committee" className="text-gray-500 hover:text-primary text-xs transition-colors">
                    {committee.committeeYear}
                  </Link>
                  <span className="text-gray-600">·</span>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">{member.designation}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  {member.fullName}
                </h1>
                {(member.department || member.session) && (
                  <p className="text-gray-500 text-sm mt-2">
                    {member.department}{member.session && ` · ${member.session}`}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* Left: Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              {member.fullBiography && (
                <ScrollReveal animation="up" delay={100}>
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4">About</h2>
                    <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: member.fullBiography }} />
                  </div>
                </ScrollReveal>
              )}

              {!member.fullBiography && member.shortBio && (
                <ScrollReveal animation="up" delay={100}>
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4">About</h2>
                    <p className="text-gray-400 leading-relaxed">{member.shortBio}</p>
                  </div>
                </ScrollReveal>
              )}

              {/* Responsibilities */}
              {member.responsibilities.length > 0 && (
                <ScrollReveal animation="up" delay={150}>
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4">Responsibilities</h2>
                    <ul className="space-y-2">
                      {member.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                          <span className="text-primary mt-1">&#9654;</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              {/* Achievements */}
              {member.achievements.length > 0 && (
                <ScrollReveal animation="up" delay={200}>
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4">Achievements</h2>
                    <ul className="space-y-2">
                      {member.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                          <span className="text-yellow-500 mt-1">&#9733;</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              {/* Message */}
              {member.messageFromMember && (
                <ScrollReveal animation="up" delay={250}>
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4">Message</h2>
                    <blockquote className="border-l-2 border-primary pl-4 text-gray-400 italic leading-relaxed">
                      {member.messageFromMember}
                    </blockquote>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <ScrollReveal animation="up" delay={100}>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Info</h3>
                  <div className="space-y-3 text-sm">
                    {member.department && (
                      <div>
                        <p className="text-gray-600 text-xs uppercase">Department</p>
                        <p className="text-gray-300">{member.department}</p>
                      </div>
                    )}
                    {member.session && (
                      <div>
                        <p className="text-gray-600 text-xs uppercase">Session</p>
                        <p className="text-gray-300">{member.session}</p>
                      </div>
                    )}
                    {member.studentId && (
                      <div>
                        <p className="text-gray-600 text-xs uppercase">Student ID</p>
                        <p className="text-gray-300">{member.studentId}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 text-xs uppercase">Committee</p>
                      <p className="text-gray-300">{committee.title}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact */}
              {(member.email || member.phone) && (
                <ScrollReveal animation="up" delay={150}>
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-3">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Contact</h3>
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {member.phone}
                      </a>
                    )}
                  </div>
                </ScrollReveal>
              )}

              {/* Social Links */}
              <ScrollReveal animation="up" delay={200}>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Connect</h3>
                  {(['linkedin', 'github', 'facebook', 'portfolio', 'website'] as const).map(platform => (
                    <SocialLink key={platform} platform={platform} url={member.socialLinks?.[platform] || ''} />
                  ))}
                </div>
              </ScrollReveal>

              {/* Back Link */}
              <ScrollReveal animation="up" delay={250}>
                <Link href="/executive-committee"
                  className="block text-center px-4 py-3 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
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

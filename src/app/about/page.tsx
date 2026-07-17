'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { LUCIDE_ICON_MAP } from '@/components/FocusAreaIcon';

function RenderIcon({ icon, className = '' }: { icon?: string; className?: string }) {
  if (!icon) return null;
  const LucideComponent = LUCIDE_ICON_MAP[icon];
  if (LucideComponent) {
    return <LucideComponent className={className} />;
  }
  return <span className={className}>{icon}</span>;
}

function toYouTubeEmbed(url: string): string {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getYouTubeThumbnail(url: string): string {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

interface AboutData {
  hero?: { bannerImage?: { url: string; alt?: string }; title?: string; subtitle?: string; ctaButton?: { text?: string; link?: string } };
  introduction?: { shortIntro?: string; longDescription?: string };
  story?: { content?: string; image?: { url: string; alt?: string } };
  mission?: { content?: string; image?: { url: string; alt?: string } };
  vision?: { content?: string; image?: { url: string; alt?: string } };
  coreValues?: { items?: Array<{ title?: string; description?: string; icon?: string; image?: { url: string; alt?: string } }> };
  objectives?: { items?: Array<{ title?: string; description?: string; icon?: string }> };
  journeyTimeline?: { items?: Array<{ year?: string; title?: string; description?: string; image?: { url: string; alt?: string } }> };
  achievements?: { items?: Array<{ title?: string; description?: string; year?: string; image?: { url: string; alt?: string } }> };
  statistics?: { items?: Array<{ label?: string; value?: string; icon?: string }> };
  whyJoin?: { items?: Array<{ title?: string; description?: string; icon?: string }> };
  facultyAdvisors?: { items?: Array<{ name?: string; designation?: string; department?: string; message?: string; image?: { url: string; alt?: string } }> };
  facilities?: { items?: Array<{ name?: string; description?: string; image?: { url: string; alt?: string } }> };
  laboratories?: { items?: Array<{ name?: string; description?: string; image?: { url: string; alt?: string }; equipment?: string[] }> };
  sponsorsPartners?: { items?: Array<{ name?: string; website?: string; tier?: string; image?: { url: string; alt?: string } }> };
  gallery?: { items?: Array<{ url?: string; alt?: string; caption?: string; type?: string }> };
  promotionalVideo?: { title?: string; videoUrl?: string; description?: string; thumbnailUrl?: string };
  faqs?: { items?: Array<{ question?: string; answer?: string }> };
  callToAction?: { title?: string; description?: string; buttonText?: string; buttonLink?: string; image?: { url: string; alt?: string } };
}

function CountUp({ end, duration = 2000 }: { end: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const match = end.match(/(\d+)(.*)/);
  const target = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.3 }
    );
    const el = elementRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  return <div ref={elementRef} className="inline-block">{count}{suffix}</div>;
}

function AccordionItem({ question, answer, isOpen, onToggle }: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div className="border border-border/5 rounded-xl bg-card overflow-hidden hover:border-border/10 transition-all duration-300">
      <button onClick={onToggle}
        className="w-full flex items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 lg:p-6 text-left hover:bg-background/5 transition-colors active:bg-background/10"
        aria-expanded={isOpen}>
        <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-foreground flex-1 pr-2 sm:pr-4">{question}</span>
        <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 transition-transform duration-300 mt-0.5 sm:mt-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 pt-0 sm:pt-0">
          <p className="text-muted text-[11px] sm:text-xs md:text-sm leading-relaxed border-t border-border/5 pt-3 sm:pt-4">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function HeroSection({ data }: { data: AboutData['hero'] }) {
  if (!data) return null;
  return (
    <ScrollReveal animation="up">
      <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {data.bannerImage?.url ? (
          <div className="absolute inset-0 z-0">
            <img src={data.bannerImage.url} alt={data.bannerImage.alt || data.title || 'About DRC'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        )}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase mb-4 sm:mb-6 md:mb-8 leading-tight">
            {data.title || 'About Us'}
          </h1>
          {data.subtitle && (
            <p className="text-muted text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">{data.subtitle}</p>
          )}
          {data.ctaButton?.text && (
            <a href={data.ctaButton.link || '#'} className="inline-block">
              <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 bg-primary text-foreground font-black uppercase tracking-[0.15em] text-xs sm:text-sm rounded hover:bg-primary/80 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(230,57,70,0.3)]">
                {data.ctaButton.text}
              </button>
            </a>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

function IntroductionSection({ data }: { data: AboutData['introduction'] }) {
  if (!data) return null;
  return (
    <ScrollReveal animation="up">
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {data.shortIntro && (
          <p className="text-lg sm:text-xl md:text-2xl text-muted leading-relaxed text-center mb-8 sm:mb-10 md:mb-12 font-medium">{data.shortIntro}</p>
        )}
        {data.longDescription && (
          <div className="prose prose-invert prose-lg max-w-none text-muted leading-relaxed text-sm sm:text-base md:text-lg [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a:hover]:text-primary/80"
            dangerouslySetInnerHTML={{ __html: data.longDescription }} />
        )}
      </div>
    </ScrollReveal>
  );
}

function ContentSection({ data, title }: { data: AboutData['story'] | AboutData['mission'] | AboutData['vision']; title: string }) {
  if (!data) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
        <ScrollReveal animation="left">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-4 sm:mb-6 md:mb-8">{title}</h2>
            {data.content && (
              <div className="prose prose-invert prose-lg text-muted leading-relaxed text-sm sm:text-base md:text-lg [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a:hover]:text-primary/80"
                dangerouslySetInnerHTML={{ __html: data.content }} />
            )}
          </div>
        </ScrollReveal>
        {data.image?.url && (
          <ScrollReveal animation="right">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10" />
              <img src={data.image.url} alt={data.image.alt || title}
                className="rounded-xl shadow-2xl border border-border/10 w-full object-cover transition-all duration-700 hover:scale-[1.02]"
                style={{ aspectRatio: '4/3' }} loading="lazy" />
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

function CoreValuesSection({ data }: { data: AboutData['coreValues'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 bg-card">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Core Values</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">The principles that guide us</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {data.items.map((item, idx) => (
          <ScrollReveal key={idx} animation="up" delay={idx * 100}>
            <div className="p-6 sm:p-8 bg-card border border-border/5 rounded-2xl hover:border-primary/30 transition-all duration-300 group text-center h-full">
              <RenderIcon icon={item.icon} className="text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-foreground text-sm sm:text-base md:text-lg font-black uppercase tracking-wider mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">{item.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function ObjectivesSection({ data }: { data: AboutData['objectives'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Our Objectives</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">What we strive to achieve</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {data.items.map((item, idx) => (
          <ScrollReveal key={idx} animation="up" delay={idx * 100}>
              <div className="flex gap-4 sm:gap-5 p-5 sm:p-6 bg-card border border-border/5 rounded-xl hover:border-primary/30 transition-all duration-300 group h-full">
              <RenderIcon icon={item.icon} className="text-2xl sm:text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-500" />
              <div>
                <h3 className="text-foreground text-xs sm:text-sm md:text-base font-black uppercase tracking-wider mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-muted text-[11px] sm:text-xs md:text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function JourneyTimelineSection({ data }: { data: AboutData['journeyTimeline'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="up">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Our Journey</h2>
            <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Milestones that defined our legacy</p>
          </div>
        </ScrollReveal>
        <div className="hidden md:block space-y-12">
          {data.items.map((item, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center justify-center w-full mb-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-5/12 hidden md:block" />
              <ScrollReveal animation="blur" delay={idx * 100} className="z-20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary text-primary font-black text-xs shrink-0 shadow-[0_0_15px_rgba(230,57,70,0.3)]">{item.year}</div>
              </ScrollReveal>
              <ScrollReveal animation={idx % 2 === 0 ? 'right' : 'left'} delay={idx * 150}
                className={`w-full md:w-5/12 p-6 sm:p-8 bg-card border border-border/5 rounded-2xl md:mx-12 hover:border-primary/30 transition-all ${idx % 2 === 0 ? 'text-left md:text-right' : 'text-left'}`}>
                <h3 className="text-lg sm:text-xl font-black text-foreground uppercase mb-2">{item.title}</h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">{item.description}</p>
              </ScrollReveal>
            </div>
          ))}
        </div>
        <div className="block md:hidden space-y-6">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <div className={`flex items-center gap-3 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <ScrollReveal animation="blur" delay={idx * 100} className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-primary text-primary font-black text-[10px] shrink-0 shadow-[0_0_15px_rgba(230,57,70,0.3)]">{item.year}</div>
                </ScrollReveal>
                <ScrollReveal animation={idx % 2 === 0 ? 'right' : 'left'} delay={idx * 100}>
                  <h3 className={`text-sm font-black text-foreground uppercase ${idx % 2 === 0 ? 'text-left' : 'text-right'} flex-1`}>{item.title}</h3>
                </ScrollReveal>
              </div>
              <ScrollReveal animation="up" delay={idx * 150}>
                <div className="p-4 bg-card border border-border/5 rounded-xl hover:border-primary/30 transition-all">
                  <p className="text-muted text-xs leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AchievementsSection({ data }: { data: AboutData['achievements'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 bg-card">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Achievements</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Milestones of excellence</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {data.items.map((item, idx) => (
          <ScrollReveal key={idx} animation="scale" delay={idx * 100}>
            <div className="p-6 sm:p-8 bg-card border border-border/5 rounded-2xl hover:border-primary/30 transition-all duration-300 group text-center h-full">
              {item.year && (
                <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4">{item.year}</div>
              )}
              <h3 className="text-foreground text-sm sm:text-base md:text-lg font-black uppercase tracking-wider mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">{item.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function StatisticsSection({ data }: { data: AboutData['statistics'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-primary -skew-y-2 sm:-skew-y-3 origin-top-left -z-10 shadow-[0_0_60px_rgba(230,57,70,0.2)] sm:shadow-[0_0_100px_rgba(230,57,70,0.3)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 justify-items-center">
          {data.items.map((stat, idx) => (
            <ScrollReveal key={idx} animation="scale" delay={idx * 150}>
              <div className="text-center group w-full">
                <RenderIcon icon={stat.icon} className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500" />
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl tabular-nums">
                  <CountUp end={stat.value || '0'} />
                </div>
                <div className="text-foreground/80 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.3em] text-[8px] sm:text-[10px] md:text-xs lg:text-sm">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhyJoinSection({ data }: { data: AboutData['whyJoin'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 bg-card">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Why Join DRC</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Reasons to become part of our community</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {data.items.map((item, idx) => (
          <ScrollReveal key={idx} animation="up" delay={idx * 100}>
            <div className="p-6 sm:p-8 bg-card border border-border/5 rounded-2xl hover:border-primary/30 transition-all duration-300 group text-center h-full">
              <RenderIcon icon={item.icon} className="text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-foreground text-sm sm:text-base md:text-lg font-black uppercase tracking-wider mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">{item.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function FacultyAdvisorsSection({ data }: { data: AboutData['facultyAdvisors'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Faculty Advisors</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Guiding our vision</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {data.items.map((advisor, idx) => (
          <ScrollReveal key={idx} animation="up" delay={idx * 100}>
            <div className="p-6 sm:p-8 bg-card border border-border/5 rounded-2xl hover:border-primary/30 transition-all duration-300 text-center h-full">
              {advisor.image?.url ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden border-2 border-primary/30">
                  <img src={advisor.image.url} alt={advisor.image.alt || advisor.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-primary text-2xl sm:text-3xl font-black">{advisor.name?.charAt(0) || '?'}</span>
                </div>
              )}
              <h3 className="text-foreground text-sm sm:text-base md:text-lg font-black uppercase tracking-wider mb-1">{advisor.name}</h3>
              {advisor.designation && <p className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">{advisor.designation}</p>}
              {advisor.department && <p className="text-muted text-[9px] sm:text-[10px] uppercase tracking-wider mb-3 sm:mb-4">{advisor.department}</p>}
              {advisor.message && <p className="text-muted text-xs sm:text-sm leading-relaxed italic">&ldquo;{advisor.message}&rdquo;</p>}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function FacilitiesSection({ data }: { data: AboutData['facilities'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 bg-card">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Facilities</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Spaces built for innovation</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {data.items.map((item, idx) => (
          <ScrollReveal key={idx} animation="up" delay={idx * 100}>
            <div className="bg-card border border-border/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group h-full">
              {item.image?.url && (
                <div className="aspect-video overflow-hidden">
                  <img src={item.image.url} alt={item.image.alt || item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" loading="lazy" />
                </div>
              )}
              <div className="p-5 sm:p-6">
                <h3 className="text-foreground text-sm sm:text-base md:text-lg font-black uppercase tracking-wider mb-2">{item.name}</h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function LaboratoriesSection({ data }: { data: AboutData['laboratories'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Laboratories</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Where ideas come to life</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {data.items.map((lab, idx) => (
          <ScrollReveal key={idx} animation="up" delay={idx * 100}>
            <div className="bg-card border border-border/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group h-full">
              {lab.image?.url && (
                <div className="aspect-video overflow-hidden">
                  <img src={lab.image.url} alt={lab.image.alt || lab.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" loading="lazy" />
                </div>
              )}
              <div className="p-5 sm:p-6">
                <h3 className="text-foreground text-sm sm:text-base md:text-lg font-black uppercase tracking-wider mb-2">{lab.name}</h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{lab.description}</p>
                {lab.equipment && lab.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {lab.equipment.map((eq, eidx) => (
                      <span key={eidx} className="inline-block px-2 py-0.5 sm:py-1 bg-primary/10 border border-primary/20 text-primary text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-full">{eq}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function SponsorsPartnersSection({ data }: { data: AboutData['sponsorsPartners'] }) {
  if (!data?.items?.length) return null;
  const tierColors: Record<string, string> = {
    platinum: 'bg-background/10 text-foreground border-border/30',
    gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    silver: 'bg-gray-400/10 text-muted border-gray-400/30',
    bronze: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    partner: 'bg-primary/10 text-primary border-primary/30',
  };
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 bg-card">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Sponsors & Partners</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Organizations that fuel our growth</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
        {data.items.map((sponsor, idx) => (
          <ScrollReveal key={idx} animation="scale" delay={idx * 80}>
            <div className="group">
              {sponsor.website ? (
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="block">
                  <SponsorCardInner sponsor={sponsor} tierColors={tierColors} />
                </a>
              ) : (
                <SponsorCardInner sponsor={sponsor} tierColors={tierColors} />
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function SponsorCardInner({ sponsor, tierColors }: {
  sponsor: NonNullable<NonNullable<AboutData['sponsorsPartners']>['items']>[number]; tierColors: Record<string, string>;
}) {
  return (
    <div className="p-4 sm:p-5 bg-card border border-border/5 rounded-xl hover:border-primary/30 transition-all duration-300 text-center h-full flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px]">
      {sponsor.image?.url ? (
        <img src={sponsor.image.url} alt={sponsor.image.alt || sponsor.name} className="max-h-10 sm:max-h-12 w-auto object-contain mb-2 sm:mb-3 transition-all duration-300" />
      ) : (
        <p className="text-foreground text-xs sm:text-sm font-black uppercase tracking-wider mb-2 sm:mb-3">{sponsor.name}</p>
      )}
      {sponsor.tier && (
        <span className={`inline-block px-2 py-0.5 text-[7px] sm:text-[8px] font-black uppercase tracking-wider rounded-full border ${tierColors[sponsor.tier] || tierColors.partner}`}>{sponsor.tier}</span>
      )}
    </div>
  );
}

function GallerySection({ data }: { data: AboutData['gallery'] }) {
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">Gallery</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Capturing our moments</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {data.items.map((item, idx) => (
          <ScrollReveal key={idx} animation="scale" delay={idx * 100}>
            <div className="relative group overflow-hidden rounded-lg sm:rounded-xl bg-card">
              {item.type === 'video' && item.url ? (
                <div className="aspect-video">
                  <iframe src={toYouTubeEmbed(item.url || '')} className="w-full h-full" allowFullScreen title={item.alt || item.caption || 'Video'} loading="lazy" />
                </div>
              ) : (
                <img src={item.url} alt={item.alt || item.caption || 'Gallery image'}
                  className="w-full h-auto object-cover hover:scale-105 transition-all duration-700" loading="lazy" />
              )}
              {item.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-4 pointer-events-none">
                  <p className="text-white font-bold uppercase text-[10px] sm:text-xs tracking-wider line-clamp-2">{item.caption}</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function PromotionalVideoSection({ data }: { data: AboutData['promotionalVideo'] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  if (!data?.videoUrl) return null;
  const thumbnailUrl = data.thumbnailUrl || getYouTubeThumbnail(data.videoUrl);
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 bg-card">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">{data.title || 'Watch Our Story'}</h2>
          {data.description && <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] max-w-2xl mx-auto">{data.description}</p>}
        </div>
      </ScrollReveal>
      <ScrollReveal animation="scale">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/10 shadow-2xl bg-black">
            {isPlaying ? (
              <iframe src={`${toYouTubeEmbed(data.videoUrl)}?autoplay=1`} className="absolute inset-0 w-full h-full" allowFullScreen title={data.title || 'Promotional Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            ) : (
              <>
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt={data.title || 'Video Thumbnail'} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 text-primary/50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
                <button onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-300 group cursor-pointer"
                  aria-label="Play video">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(230,57,70,0.4)] group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

function FAQsSection({ data }: { data: AboutData['faqs'] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!data?.items?.length) return null;
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <ScrollReveal animation="up">
        <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">FAQs</h2>
          <p className="text-muted uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em]">Frequently asked questions</p>
        </div>
      </ScrollReveal>
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        {data.items.map((faq, idx) => (
          <AccordionItem key={idx} question={faq.question || ''} answer={faq.answer || ''}
            isOpen={openIndex === idx} onToggle={() => setOpenIndex(openIndex === idx ? null : idx)} />
        ))}
      </div>
    </div>
  );
}

function CallToActionSection({ data }: { data: AboutData['callToAction'] }) {
  if (!data) return null;
  return (
    <div className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
      {data.image?.url ? (
        <div className="absolute inset-0 z-0">
          <img src={data.image.url} alt={data.image.alt || ''} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/60" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-primary/5" />
      )}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <ScrollReveal animation="up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-4 sm:mb-6 md:mb-8 leading-tight">{data.title || 'Ready to Join?'}</h2>
          {data.description && <p className="text-muted text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 max-w-xl mx-auto">{data.description}</p>}
          {data.buttonText && (
            <a href={data.buttonLink || '/register'} className="inline-block">
              <button className="px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-primary text-foreground font-black uppercase tracking-[0.15em] text-xs sm:text-sm rounded hover:bg-primary/80 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(230,57,70,0.3)]">
                {data.buttonText}
              </button>
            </a>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}

const SECTION_ORDER = [
  'hero', 'introduction', 'story', 'mission', 'vision',
  'coreValues', 'objectives', 'journeyTimeline', 'achievements',
  'statistics', 'whyJoin', 'facultyAdvisors', 'facilities',
  'laboratories', 'sponsorsPartners', 'gallery', 'promotionalVideo',
  'faqs', 'callToAction',
] as const;

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about');
        if (!res.ok) throw new Error('Failed to fetch about data');
        setData(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar activeSection="" />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar activeSection="" />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center px-4">
            <p className="text-red-500 text-sm sm:text-base mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-foreground text-sm rounded hover:bg-primary/80 transition-colors">Retry</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const enabledSections = data ? (SECTION_ORDER.filter((key) => data[key as keyof AboutData]) as Array<keyof AboutData>) : [];

  if (enabledSections.length === 0 && data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar activeSection="" />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-muted text-sm sm:text-base">No content available at the moment.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <a href="/" className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-md border border-border/10 rounded-full text-muted hover:text-foreground hover:bg-background/10 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Home
      </a>
      <Navbar activeSection="" />
      <main>
        {data?.hero && <section id="about-hero"><HeroSection data={data.hero} /></section>}
        {data?.introduction && <section id="about-introduction" className="bg-card"><IntroductionSection data={data.introduction} /></section>}
        {data?.story && <section id="about-story"><ContentSection data={data.story} title="Our Story" /></section>}
        {data?.mission && <section id="about-mission" className="bg-card"><ContentSection data={data.mission} title="Mission" /></section>}
        {data?.vision && <section id="about-vision"><ContentSection data={data.vision} title="Vision" /></section>}
        {data?.coreValues && <section id="about-core-values"><CoreValuesSection data={data.coreValues} /></section>}
        {data?.objectives && <section id="about-objectives" className="bg-card"><ObjectivesSection data={data.objectives} /></section>}
        {data?.journeyTimeline && <section id="about-journey"><JourneyTimelineSection data={data.journeyTimeline} /></section>}
        {data?.achievements && <section id="about-achievements"><AchievementsSection data={data.achievements} /></section>}
        {data?.statistics && <section id="about-statistics"><StatisticsSection data={data.statistics} /></section>}
        {data?.whyJoin && <section id="about-why-join"><WhyJoinSection data={data.whyJoin} /></section>}
        {data?.facultyAdvisors && <section id="about-advisors" className="bg-card"><FacultyAdvisorsSection data={data.facultyAdvisors} /></section>}
        {data?.facilities && <section id="about-facilities"><FacilitiesSection data={data.facilities} /></section>}
        {data?.laboratories && <section id="about-laboratories" className="bg-card"><LaboratoriesSection data={data.laboratories} /></section>}
        {data?.sponsorsPartners && <section id="about-sponsors"><SponsorsPartnersSection data={data.sponsorsPartners} /></section>}
        {data?.gallery && <section id="about-gallery" className="bg-card"><GallerySection data={data.gallery} /></section>}
        {data?.promotionalVideo && <section id="about-video"><PromotionalVideoSection data={data.promotionalVideo} /></section>}
        {data?.faqs && <section id="about-faqs" className="bg-card"><FAQsSection data={data.faqs} /></section>}
        {data?.callToAction && <section id="about-cta"><CallToActionSection data={data.callToAction} /></section>}
      </main>
      <Footer />
    </div>
  );
}

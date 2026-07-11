// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TechStack from '@/components/TechStack';
import FocusAreas from '@/components/FocusAreas';
import Blog from '@/components/Blog';
import Projects from '@/components/Projects';
import Gallery from '@/components/Gallery';
import Stats from '@/components/Stats';
import Timeline from '@/components/Timeline';
import Committee from '@/components/Committee';
import Testimonials from '@/components/Testimonials';
import Sponsors from '@/components/Sponsors';
import FAQ from '@/components/FAQ';
import Events from '@/components/Events';
import Footer from '@/components/Footer';
import ResearchFrontiers from '@/components/ResearchFrontiers';

const DEFAULT_VISIBILITY: Record<string, boolean> = {
  hero: true,
  about: true,
  events: true,
  stats: true,
  focusAreas: true,
  research: true,
  blog: true,
  projects: true,
  gallery: true,
  timeline: true,
  committee: true,
  testimonials: true,
  faq: true,
  sponsors: true,
  footer: true,
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [visibility, setVisibility] = useState<Record<string, boolean>>(DEFAULT_VISIBILITY);

  useEffect(() => {
    fetch('/api/section-visibility')
      .then((res) => res.json())
      .then((data) => {
        if (data.sections) {
          const map: Record<string, boolean> = { ...DEFAULT_VISIBILITY };
          Object.entries(data.sections).forEach(([key, value]) => {
            map[key] = value as boolean;
          });
          setVisibility(map);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'tech', 'blog', 'projects', 'gallery', 'committee', 'events', 'faq', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-white bg-dark text-white overflow-x-hidden">
      <Navbar activeSection={activeSection} />
      
      <main>
        {visibility.hero && (
          <section id="home">
            <Hero />
          </section>
        )}
        
        {visibility.about && (
          <section id="about" className="bg-[#0a0a0a]">
            <About />
          </section>
        )}

        {visibility.events && (
          <section id="events" className="bg-[#080808]">
            <Events />
          </section>
        )}

        {visibility.stats && <Stats />}

        {visibility.focusAreas && (
          <section id="focus">
            <FocusAreas />
          </section>
        )}

        {visibility.research && <ResearchFrontiers />}

        {visibility.blog && <Blog />}
        
        {visibility.projects && (
          <section id="projects" className="bg-[#0a0a0a]">
            <Projects />
          </section>
        )}

        {visibility.gallery && (
          <section id="gallery" className="bg-[#0d0d0d]">
            <Gallery />
          </section>
        )}

        {visibility.timeline && <Timeline />}

        {visibility.committee && (
          <section id="committee" className="bg-[#0a0a0a]">
            <Committee />
          </section>
        )}

        {visibility.testimonials && <Testimonials />}

        {visibility.faq && (
          <section id="faq" className="bg-[#0a0a0a]">
            <FAQ />
          </section>
        )}

        {visibility.sponsors && <Sponsors />}
      </main>

      {visibility.footer && (
        <footer id="contact">
          <Footer />
        </footer>
      )}
    </div>
  );
}

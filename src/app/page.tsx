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
// import AIChat from '@/components/AIChat';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Anchors used for navigation highlighting
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
        {/* 1. HOME SECTION */}
        <section id="home">
          <Hero />
        </section>
        
        {/* 2. ABOUT SECTION */}
        <section id="about" className="bg-[#0a0a0a]">
          <About />
        </section>

        {/* 3. IMPACT STATS (Supplementary to About) */}
        <Stats />

        {/* 4. FOCUS AREAS */}
        <section id="focus">
          <FocusAreas />
        </section>

        {/* 5. TECH SECTION */}
        <section id="tech" className="bg-[#080808]">
          <TechStack />
        </section>

        {/* 6. BLOG SECTION */}
        <Blog />
        
        {/* 7. PROJECTS SECTION */}
        <section id="projects" className="bg-[#0a0a0a]">
          <Projects />
        </section>

        {/* 8. GALLERY SECTION */}
        <section id="gallery" className="bg-[#0d0d0d]">
          <Gallery />
        </section>

        {/* 9. EVENTS SECTION */}
        <section id="events" className="bg-[#080808]">
          <Events />
        </section>

        {/* 10. HISTORY/TIMELINE */}
        <Timeline />

        {/* 11. TEAM SECTION (Committee) */}
        <section id="committee" className="bg-[#0a0a0a]">
          <Committee />
        </section>

        {/* 12. TESTIMONIALS (Social Proof) */}
        <Testimonials />

        {/* 13. FAQ SECTION */}
        <section id="faq" className="bg-[#0a0a0a]">
          <FAQ />
        </section>

        {/* 14. SPONSORS/PARTNERS */}
        <Sponsors />
      </main>

      {/* 15. FOOTER & CONTACT */}
      <footer id="contact">
        <Footer />
      </footer>

      {/* FLOATING AI ASSISTANT */}
      {/* <AIChat /> */}
    </div>
  );
}
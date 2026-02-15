
import React, { useState } from 'react';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Tech', href: '#tech', id: 'tech' },
    { name: 'Blog', href: '#blog', id: 'blog' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Team', href: '#committee', id: 'committee' },
    { name: 'FAQ', href: '#faq', id: 'faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#home" className="text-2xl font-black tracking-tighter text-white group flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded flex items-center justify-center text-sm italic">D</span>
              <span>DUET <span className="text-primary group-hover:text-white transition-colors">ROBOTICS</span></span>
            </a>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                    activeSection === link.id ? 'text-primary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="px-6 py-2.5 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-sm hover:shadow-[0_0_25px_rgba(230,57,70,0.5)] transition-all transform hover:scale-105 active:scale-95"
              >
                Join Now
              </a>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-dark border-b border-white/10 px-4 pb-6 pt-2`}>
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-4 text-sm font-black uppercase tracking-widest border-b border-white/5 last:border-0 ${
               activeSection === link.id ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

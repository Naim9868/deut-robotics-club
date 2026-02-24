import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', id: 'home', isPage: true },
    { name: 'About', href: '#about', id: 'about', isPage: false },
    { name: 'Tech', href: '#tech', id: 'tech', isPage: false },
    { name: 'Blog', href: '/blog', id: 'blog', isPage: true },
    { name: 'Projects', href: '#projects', id: 'projects', isPage: false },
    { name: 'Gallery', href: '/gallery', id: 'gallery', isPage: true },
    { name: 'Team', href: '#committee', id: 'committee', isPage: false },
    { name: 'FAQ', href: '#faq', id: 'faq', isPage: false },
  ];

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (link.isPage) {
      // For page navigation (Blog, Gallery, Home)
      router.push(link.href);
    } else {
      // For hash/anchor links
      if (pathname === '/') {
        // If we're on the home page, scroll to the section
        const element = document.getElementById(link.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL hash without page reload
          window.history.pushState(null, '', link.href);
        }
      } else {
        // If we're on another page, first navigate to home then scroll
        router.push(`/${link.href}`);
      }
    }
  };

  // Handle initial hash on page load
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
              className="text-2xl font-black tracking-tighter text-white group flex items-center gap-2 cursor-pointer"
            >
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
                  onClick={(e) => handleNavigation(e, link)}
                  className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    activeSection === link.id ? 'text-primary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  if (pathname === '/') {
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      window.history.pushState(null, '', '#contact');
                    }
                  } else {
                    router.push('/#contact');
                  }
                }}
                className="px-6 py-2.5 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-sm hover:shadow-[0_0_25px_rgba(230,57,70,0.5)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
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
            onClick={(e) => handleNavigation(e, link)}
            className={`block py-4 text-sm font-black uppercase tracking-widest border-b border-white/5 last:border-0 cursor-pointer ${
               activeSection === link.id ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {link.name}
          </a>
        ))}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            if (pathname === '/') {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', '#contact');
              }
            } else {
              router.push('/#contact');
            }
          }}
          className="block py-4 text-sm font-black uppercase tracking-widest text-primary border-t border-white/5 mt-4 pt-4"
        >
          Join Now
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const waveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
      router.push(link.href);
    } else {
      if (pathname === '/') {
        const element = document.getElementById(link.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', link.href);
        }
      } else {
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

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Natural wave animation every 5 seconds
  useEffect(() => {
    const startWaveAnimation = () => {
      setIsWaving(true);
      setTimeout(() => {
        setIsWaving(false);
      }, 3000); // Match the wave animation duration
    };

    // Start first wave after initial load
    const initialDelay = setTimeout(() => {
      startWaveAnimation();
    }, 1200);

    // Set up recurring wave every 5 seconds
    waveTimeoutRef.current = setInterval(() => {
      startWaveAnimation();
    }, 5000);

    return () => {
      clearTimeout(initialDelay);
      if (waveTimeoutRef.current) {
        clearInterval(waveTimeoutRef.current);
      }
    };
  }, []);

  // Split text into individual characters with spaces preserved
  const brandText = "DUET ROBOTICS Club";
  const characters = brandText.split('');

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
              <span className="w-10 h-10 bg-white rounded flex items-center justify-center text-sm italic flex-shrink-0">
                <Image
                  src="/favicon.ico"
                  alt="Site Logo"
                  width={40}
                  height={20}
                  priority
                />
              </span>
              
              {/* Animated Brand Name with Natural Wave Effect */}
              <span className="relative inline-block">
                <span 
                  className={`
                    inline-flex flex-wrap items-center
                    transition-all duration-1000 ease-out
                    ${isInitialLoad ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}
                  `}
                >
                  {characters.map((char, index) => {
                    // Skip spaces but render them
                    if (char === ' ') {
                      return (
                        <span 
                          key={index} 
                          className="inline-block"
                          style={{ width: '0.25em' }}
                        >
                          &nbsp;
                        </span>
                      );
                    }

                    // Check if character is part of "ROBOTICS"
                    const isRobotics = index >= 5 && index <= 12;
                    
                    return (
                      <span
                        key={index}
                        className={`
                          inline-block transition-all duration-300
                          ${isWaving ? 'animate-wave' : ''}
                          ${isRobotics ? 'text-primary group-hover:text-white transition-colors' : 'text-white'}
                          ${isRobotics && isWaving ? 'wave-glow' : ''}
                        `}
                        style={{
                          display: 'inline-block',
                          animationDelay: isWaving ? `${index * 0.06}s` : '0s',
                          animationDuration: isWaving ? '2.8s' : '0s',
                          transformOrigin: 'center bottom',
                          willChange: 'transform',
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              </span>
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
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/register');
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
          href="/register"
          onClick={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            router.push('/register');
          }}
          className="block py-4 text-sm font-black uppercase tracking-widest text-primary border-t border-white/5 mt-4 pt-4"
        >
          Join Now
        </a>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          10% {
            transform: translateY(-10px) rotate(-2deg) scale(1.05);
          }
          20% {
            transform: translateY(-4px) rotate(1deg) scale(1.02);
          }
          30% {
            transform: translateY(-14px) rotate(-1.5deg) scale(1.08);
          }
          40% {
            transform: translateY(-6px) rotate(1.5deg) scale(1.03);
          }
          50% {
            transform: translateY(-12px) rotate(-1deg) scale(1.06);
          }
          60% {
            transform: translateY(-3px) rotate(0.5deg) scale(1.01);
          }
          70% {
            transform: translateY(-8px) rotate(-0.5deg) scale(1.04);
          }
          80% {
            transform: translateY(-2px) rotate(0.3deg) scale(1.01);
          }
          90% {
            transform: translateY(-5px) rotate(-0.2deg) scale(1.02);
          }
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
        }

        .animate-wave {
          animation: wave 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          display: inline-block;
        }

        .wave-glow {
          color: #ff4900 !important;
          text-shadow: 
            0 0 20px rgba(250, 129, 0, 0.3),
            0 0 40px rgba(250, 129, 0, 0.2),
            0 0 60px rgba(250, 129, 0, 0.1);
          animation: wave-glow 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes wave-glow {
          0%, 100% {
            text-shadow: 0 0 0px rgba(6, 182, 212, 0);
          }
          15% {
            text-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
          }
          30% {
            text-shadow: 0 0 40px rgba(6, 182, 212, 0.4);
          }
          45% {
            text-shadow: 0 0 60px rgba(6, 182, 212, 0.5);
          }
          60% {
            text-shadow: 0 0 40px rgba(6, 182, 212, 0.4);
          }
          75% {
            text-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
          }
          100% {
            text-shadow: 0 0 0px rgba(6, 182, 212, 0);
          }
        }

        /* Staggered animation delays applied inline via style */
        .animate-wave:nth-child(1) { animation-delay: 0.06s; }
        .animate-wave:nth-child(2) { animation-delay: 0.12s; }
        .animate-wave:nth-child(3) { animation-delay: 0.18s; }
        .animate-wave:nth-child(4) { animation-delay: 0.24s; }
        .animate-wave:nth-child(5) { animation-delay: 0.30s; }
        .animate-wave:nth-child(6) { animation-delay: 0.36s; }
        .animate-wave:nth-child(7) { animation-delay: 0.42s; }
        .animate-wave:nth-child(8) { animation-delay: 0.48s; }
        .animate-wave:nth-child(9) { animation-delay: 0.54s; }
        .animate-wave:nth-child(10) { animation-delay: 0.60s; }
        .animate-wave:nth-child(11) { animation-delay: 0.66s; }
        .animate-wave:nth-child(12) { animation-delay: 0.72s; }
        .animate-wave:nth-child(13) { animation-delay: 0.78s; }
        .animate-wave:nth-child(14) { animation-delay: 0.84s; }
        .animate-wave:nth-child(15) { animation-delay: 0.90s; }
        .animate-wave:nth-child(16) { animation-delay: 0.96s; }
        .animate-wave:nth-child(17) { animation-delay: 1.02s; }
        .animate-wave:nth-child(18) { animation-delay: 1.08s; }

        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-wave, .wave-glow {
            animation: none !important;
          }
          .transition-all {
            transition-duration: 0.01ms !important;
          }
        }

        /* Mobile optimization */
        @media (max-width: 640px) {
          .animate-wave {
            animation-duration: 2.2s;
          }
          .wave-glow {
            animation-duration: 2.2s;
          }
        }

        /* Tablet optimization */
        @media (min-width: 641px) and (max-width: 1024px) {
          .animate-wave {
            animation-duration: 2.5s;
          }
          .wave-glow {
            animation-duration: 2.5s;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
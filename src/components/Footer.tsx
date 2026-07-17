import React from 'react';
import ContactForm from './ContactForm';

const Footer: React.FC = () => {
  return (
    <div className="bg-muted/10 border-t border-border pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-6 sm:pb-8 md:pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-20">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-4 sm:mb-6 md:mb-8 leading-tight">
              Let's build the <br />
              <span className="text-primary italic">Future Together!</span>
            </h2>
            <div className="text-muted space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base">
              <p className="font-bold text-foreground">DUET Robotics Club</p>
              <p>Dhaka University of Engineering & Technology<br />Gazipur-1707, Bangladesh</p>
              <p>Email: <span className="text-primary">drc@duet.ac.bd</span></p>
            </div>
            
            <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4 mt-6 sm:mt-8">
              {['FB', 'LN', 'TW', 'YT'].map(social => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-border flex items-center justify-center text-[8px] sm:text-[9px] md:text-[10px] font-bold text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h4 className="text-foreground text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 md:mb-8">
                Navigation
              </h4>
              <ul className="space-y-2.5 sm:space-y-3 md:space-y-4 text-xs sm:text-sm text-muted uppercase font-semibold">
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#projects" className="hover:text-primary transition-colors">Our Projects</a></li>
                <li><a href="#events" className="hover:text-primary transition-colors">Events</a></li>
                <li><a href="#committee" className="hover:text-primary transition-colors">Committee</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 md:mb-8">
                Resources
              </h4>
              <ul className="space-y-2.5 sm:space-y-3 md:space-y-4 text-xs sm:text-sm text-muted uppercase font-semibold">
                <li><a href="blog" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Components</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Join Club</a></li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-foreground text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 md:mb-8 text-center md:text-left">
              Send Message
            </h4>
            <ContactForm />
          </div>
        </div>

        <div className="border-t border-border pt-6 sm:pt-8 md:pt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center text-[8px] sm:text-[9px] md:text-[10px] text-muted font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          <div className="text-center md:text-left order-2 md:order-1">
            Design & Developed by{' '}
            <a 
              href="https://www.pervezhasan.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-foreground transition-colors"
            >
              Pervez Hasan
            </a>
          </div>
          <div className="text-center text-muted order-1 md:order-2">
            © 2026 DUET Robotics Club.
            <span className="hidden sm:inline"> All Rights Reserved.</span>
          </div>
          <div className="text-center md:text-right order-3">
            Collaborated with{' '}
            <span className="text-primary">
              <a 
                href="https://naimulislamportfolio.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-foreground transition-colors"
              >
                Naimul Islam
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

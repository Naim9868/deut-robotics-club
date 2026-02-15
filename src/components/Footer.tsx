
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="bg-[#080808] border-t border-white/5 pt-24 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-8 leading-tight">
              Let's build the <br />
              <span className="text-primary italic">Future Together!</span>
            </h2>
            <div className="text-gray-500 space-y-4">
              <p className="font-bold text-white">DUET Robotics Club</p>
              <p>Dhaka University of Engineering & Technology<br />Gazipur-1707, Bangladesh</p>
              <p>Email: <span className="text-primary">drc@duet.ac.bd</span></p>
            </div>
            
            <div className="flex space-x-4 mt-8">
              {['FB', 'LN', 'TW', 'YT'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm text-gray-500 uppercase font-semibold">
                <li><a href="#about" className="hover:text-primary">About Us</a></li>
                <li><a href="#projects" className="hover:text-primary">Our Projects</a></li>
                <li><a href="#events" className="hover:text-primary">Events</a></li>
                <li><a href="#committee" className="hover:text-primary">Committee</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Resources</h4>
              <ul className="space-y-4 text-sm text-gray-500 uppercase font-semibold">
                <li><a href="#blog" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary">Components</a></li>
                <li><a href="#" className="hover:text-primary">Join Club</a></li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Send Message</h4>
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-[#121212] border border-white/10 p-4 rounded text-sm text-white focus:outline-none focus:border-primary transition-all"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-[#121212] border border-white/10 p-4 rounded text-sm text-white focus:outline-none focus:border-primary transition-all"
              />
              <textarea 
                rows={3} 
                placeholder="Message" 
                className="w-full bg-[#121212] border border-white/10 p-4 rounded text-sm text-white focus:outline-none focus:border-primary transition-all"
              />
              <button 
                type="button" 
                className="w-full py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded hover:bg-white hover:text-dark transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          <div className="text-center md:text-left">
            Design & Developed by <a href="https://www.pervezhasan.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors">Pervez Hasan</a>
          </div>
          <div className="text-center text-gray-400">
            © 2026 DUET Robotics Club. All Rights Reserved.
          </div>
          <div className="text-center md:text-right">
            Collaborated with <span className="text-primary">Naim Khan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

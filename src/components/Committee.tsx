
import React from 'react';
import ScrollReveal from './ScrollReveal';

const Committee: React.FC = () => {
  const members = [
    { name: 'Dr. Md. Nasir Uddin', role: 'President', img: 'https://i.pravatar.cc/300?img=11' },
    { name: 'S.M. Shafiul Alam', role: 'General Secretary', img: 'https://i.pravatar.cc/300?img=12' },
    { name: 'Farhan Tanvir', role: 'Vice President', img: 'https://i.pravatar.cc/300?img=13' },
    { name: 'Raisa Islam', role: 'Treasurer', img: 'https://i.pravatar.cc/300?img=44' },
    { name: 'Abdullah Al Mamun', role: 'Event Coordinator', img: 'https://i.pravatar.cc/300?img=59' },
    { name: 'Zarin Tasnim', role: 'Tech Lead', img: 'https://i.pravatar.cc/300?img=22' },
    { name: 'Hasan Mahmud', role: 'PR Manager', img: 'https://i.pravatar.cc/300?img=33' },
    { name: 'Sadia Afrin', role: 'Research Lead', img: 'https://i.pravatar.cc/300?img=10' },
  ];

  return (
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 section-title after:mx-auto tracking-tighter">Command Center</h2>
          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.6em] mt-4">The architect minds driving DUET's robotics legacy</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {members.map((m, idx) => (
          <ScrollReveal key={idx} animation="scale" delay={idx * 100} className="group">
            <div className="relative overflow-hidden aspect-[4/5] bg-[#0a0a0a] border border-white/5 rounded-2xl group-hover:border-primary/50 transition-all duration-700 shadow-2xl group-hover:shadow-primary/10">
              {/* Profile Image with subtle zoom */}
              <img 
                src={m.img} 
                alt={m.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
              
              {/* Info Area */}
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2">{m.role}</p>
                <h3 className="text-2xl font-black text-white uppercase leading-none mb-6">{m.name}</h3>
                
                <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                    <span className="text-[10px] font-bold">LN</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                    <span className="text-[10px] font-bold">GH</span>
                  </a>
                </div>
              </div>

              {/* Decorative Scan Lines */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default Committee;

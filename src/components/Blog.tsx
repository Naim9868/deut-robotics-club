
import React from 'react';
import ScrollReveal from './ScrollReveal';

const Blog: React.FC = () => {
  const posts = [
    {
      title: 'The Rise of SLAM in Local Robotics',
      category: 'Research',
      date: 'Oct 12, 2025',
      excerpt: 'How our team is implementing Simultaneous Localization and Mapping on low-cost hardware for autonomous navigation.',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000'
    },
    {
      title: 'Optimizing PID for High-Speed LFR',
      category: 'Tutorial',
      date: 'Sept 28, 2025',
      excerpt: 'A deep dive into the tuning parameters that helped our robots achieve record-breaking speeds at the last Techfest.',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1000'
    },
    {
      title: 'Getting Started with ROS 2 Humble',
      category: 'Technical',
      date: 'Sept 05, 2025',
      excerpt: 'Transitioning from ROS 1 to ROS 2: Why our club is migrating its core flight stack to the latest LTS version.',
      image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000'
    },
    {
      title: 'Designing Custom PCBs for Drones',
      category: 'Hardware',
      date: 'Aug 20, 2025',
      excerpt: 'Our workflow for designing, prototyping, and assembling power distribution boards for the Quadcop H-1 project.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000'
    }
  ];

  return (
    <div id="blog" className="py-32 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal animation="up">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title">Latest Blog</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.4em]">Insights, research, and technical breakthroughs</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, i) => (
            <ScrollReveal key={i} animation="up" delay={i * 100}>
              <div className="group flex flex-col h-full bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">{post.date}</span>
                  <h3 className="text-xl font-bold uppercase text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <a href="#" className="inline-flex items-center text-primary text-[10px] font-black uppercase tracking-[0.2em] group/link">
                    Read Full Post 
                    <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <ScrollReveal animation="up">
            <button className="px-10 py-4 border border-white/100 text-white font-black uppercase tracking-widest text-[11px] rounded hover:bg-white hover:text-dark transition-all transform hover:scale-105 active:scale-95">
              Explore All Articles
            </button>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Blog;

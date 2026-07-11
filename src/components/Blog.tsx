
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import toast from 'react-hot-toast';

const Blog: React.FC = () => {

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      const sortedPosts = Array.isArray(data) 
        ? [...data].sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];
      setPosts(sortedPosts.filter((p: any) => p.isActive).slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch posts');
      toast.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 sm:py-24 lg:py-32 text-center">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="blog" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="up">
          <div className="mb-8 sm:mb-10 md:mb-14 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title sm:text-left">
              Latest Blog
            </h2>
            <p className="text-gray-500 uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.4em] text-center sm:text-left">
              Insights, research, and technical breakthroughs
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {posts.map((post, i) => (
            <ScrollReveal key={i} animation="up" delay={i * 100}>
              <div className="group flex flex-col h-full bg-card border border-white/5 rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(230,57,70,0.1)] hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="relative h-32 sm:h-40 md:h-44 lg:h-48 overflow-hidden">
                  {post.image?.url && (
                    <img 
                      src={post.image.url} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                    />
                  )}
                  
                  <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
                    <span className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-primary text-white text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 md:p-5 lg:p-8 flex flex-col flex-1">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 sm:mb-2 md:mb-3 line-clamp-1">
                    <span>• </span>
                    {new Date(post.publishedAt || post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  
                  <h3 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold uppercase text-white mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 group-hover:text-primary transition-colors leading-tight line-clamp-2 sm:line-clamp-2 md:line-clamp-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-relaxed mb-3 sm:mb-4 md:mb-5 lg:mb-6 flex-1 line-clamp-3 sm:line-clamp-3 md:line-clamp-4">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    target="_blank" 
                    className="inline-flex items-center text-primary text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] group/link mt-auto"
                  >
                    Read Full Post 
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ml-1 sm:ml-1.5 md:ml-2 transform group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 text-center">
          <ScrollReveal animation="up">
            <Link href='/blog'>
              <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 border border-white/100 text-white font-black uppercase tracking-widest text-[10px] sm:text-[11px] rounded hover:bg-white hover:text-dark transition-all transform hover:scale-105 active:scale-95">
                Explore All Articles
              </button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Blog;



{/* <ScrollReveal animation="up">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 section-title">Latest Blog</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.4em]">Insights, research, and technical breakthroughs</p>
          </div>
        </ScrollReveal> */}
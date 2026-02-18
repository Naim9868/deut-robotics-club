'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/slug/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  // Get avatar URL
  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e1e1e&color=e63946&size=96&bold=true&length=2`;
  };

  if (loading) {
    return (
      <>
        <Navbar activeSection={activeSection} />
        <div className="min-h-screen bg-dark pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar activeSection={activeSection} />
        <div className="min-h-screen bg-dark pt-32 text-center">
          <h1 className="text-4xl text-white mb-4">Post not found</h1>
          <Link href="/#blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Get the correct image URL
  const imageUrl = post.image?.url || post.coverImage || '';

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar activeSection={activeSection} />
      
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/#blog" 
              className="inline-flex items-center gap-2 text-primary text-sm mb-8 hover:underline group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> 
              Back to Blog
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                {post.category}
              </span>
              <span>•</span>
              <span>
                {new Date(post.publishedAt || post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              {post.readTime && (
                <>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Author Section */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-[#1e1e1e]">
                <img 
                  src={post.authorImage || getAvatarUrl(post.author)}
                  alt={post.author}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAvatarUrl(post.author);
                  }}
                />
              </div>
              <div>
                <p className="text-lg font-medium text-white">By {post.author}</p>
                {post.authorTitle && (
                  <p className="text-sm text-gray-400">{post.authorTitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-white/5 bg-[#1a1a1a]">
              <img 
                src={imageUrl} 
                alt={post.image?.alt || post.title} 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-64 flex items-center justify-center text-gray-500">Image not available</div>';
                  }
                }}
              />
            </div>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors rounded-full text-xs text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content - HTML preview */}
          <div 
            className="prose prose-invert prose-lg max-w-none
              [&_h1]:text-4xl [&_h1]:font-black [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
              [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
              [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-gray-300
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-gray-300
              [&_li]:mb-1
              [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_blockquote]:my-4
              [&_code]:bg-[#2a2a2a] [&_code]:text-primary [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
              [&_pre]:bg-[#2a2a2a] [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-white/10 [&_pre]:my-4
              [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0
              [&_img]:rounded-lg [&_img]:border [&_img]:border-white/10 [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto
              [&_hr]:border-white/10 [&_hr]:my-8
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
              [&_th]:bg-white/5 [&_th]:p-2 [&_th]:text-left [&_th]:font-bold
              [&_td]:p-2 [&_td]:border [&_td]:border-white/10
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
}
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Hero', href: '/admin/hero', icon: '🖼️' },
  { name: 'About', href: '/admin/about', icon: '📝' },
  { name: 'Stats', href: '/admin/stats', icon: '📈' },
  { name: 'Focus Areas', href: '/admin/focus-areas', icon: '🎯' },
  { name: 'Tech Stack', href: '/admin/tech-stack', icon: '⚙️' },
  { name: 'Blog', href: '/admin/blog', icon: '📰' },
  { name: 'Projects', href: '/admin/projects', icon: '🚀' },
  { name: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
  { name: 'Events', href: '/admin/events', icon: '📅' },
  { name: 'Timeline', href: '/admin/timeline', icon: '⏳' },
  { name: 'Committee', href: '/admin/committee', icon: '👥' },
  { name: 'Testimonials', href: '/admin/testimonials', icon: '💬' },
  { name: 'Sponsors', href: '/admin/sponsors', icon: '🤝' },
  { name: 'FAQ', href: '/admin/faq', icon: '❓' },
  { name: 'Research', href: '/admin/research', icon: '🔬' },
  { name: 'Footer', href: '/admin/footer', icon: '🔻' },
  { name: 'Navbar', href: '/admin/navbar', icon: '🧭' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/admin/login');
      }
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-black text-white">
          DRC <span className="text-primary">ADMIN</span>
        </h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
          Control Panel
        </p>
      </div>

      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 text-sm transition-all ${
              pathname === item.href
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <span>🚪</span>
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
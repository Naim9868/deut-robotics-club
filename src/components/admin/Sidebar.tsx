'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Sections', href: '/admin/sections', icon: '👁️' },
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

const memberItems = [
  { name: 'Registration Apps', href: '/admin/registration', icon: '📋' },
  { name: 'Members', href: '/admin/members', icon: '👥' },
  { name: 'Payment Verification', href: '/admin/payments', icon: '💳' },
  { name: 'Membership Settings', href: '/admin/membership-settings', icon: '⚙️' },
];

const communicationItems = [
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: '✉️' },
];

function UnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/admin/contact?action=unread-count');
        if (res.ok) {
          const data = await res.json();
          setCount(data.count || 0);
        }
      } catch {
        // Silently fail
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-primary text-white rounded-full">
      {count > 99 ? '99+' : count}
    </span>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

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

  const navContent = (
    <>
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-black text-white">
          DRC <span className="text-primary">ADMIN</span>
        </h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
          Control Panel
        </p>
      </div>

      <nav className="p-4 mb-4 overflow-y-auto flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg mb-1 text-sm transition-all ${
              pathname === item.href
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="px-4 mb-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
            Member Management
          </p>
          {memberItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg mb-1 text-sm transition-all ${
                pathname === item.href
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="px-4 mb-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
            Communication
          </p>
          {communicationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-2 rounded-lg mb-1 text-sm transition-all ${
                pathname === item.href
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <UnreadBadge />
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/5 p-0">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-3 px-4 py-3 w-full text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <span>🚪</span>
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0a0a0a] border-r border-white/5 h-screen fixed left-0 top-0 flex-col overflow-hidden z-50">
        {navContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col overflow-hidden transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}

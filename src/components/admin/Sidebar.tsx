'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { useSidebar } from './SidebarContext';

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
  { name: 'Executive Committee', href: '/admin/executive-committee', icon: '🏛️' },
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

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-sm text-muted hover:bg-background/5 hover:text-foreground transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <span>☀️</span>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <span>🌙</span>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}

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
        // Silently fail — badge is non-critical
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isOpen, close } = useSidebar();

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-black text-foreground">
          DRC <span className="text-primary">ADMIN</span>
        </h1>
        <p className="text-[10px] text-muted uppercase tracking-wider mt-1">
          Control Panel
        </p>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto mb-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg mb-1 text-sm transition-all ${
              pathname === item.href
                ? 'bg-primary text-foreground'
                : 'text-muted hover:bg-background/5 hover:text-foreground'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}

        <div className="mt-4 pt-4 border-t border-border">
          <p className="px-4 mb-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
            Member Management
          </p>
          {memberItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg mb-1 text-sm transition-all ${
                pathname === item.href
                  ? 'bg-primary text-foreground'
                  : 'text-muted hover:bg-background/5 hover:text-foreground'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="px-4 mb-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
            Communication
          </p>
          {communicationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-2 rounded-lg mb-1 text-sm transition-all ${
                pathname === item.href
                  ? 'bg-primary text-foreground'
                  : 'text-muted hover:bg-background/5 hover:text-foreground'
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

      <div className="border-t border-border p-4 space-y-1">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-sm text-muted hover:bg-background/5 hover:text-foreground transition-all"
        >
          <span>🚪</span>
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-card border-r border-border h-screen fixed left-0 top-0 overflow-y-auto z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 text-muted hover:text-foreground rounded-lg hover:bg-background/10 transition-colors z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}

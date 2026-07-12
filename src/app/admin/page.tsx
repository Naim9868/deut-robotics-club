'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DashboardStats {
  total: number;
  active: number;
  lastUpdated: string;
}

interface SectionStats {
  [key: string]: DashboardStats;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SectionStats>({}); // Initialize as empty object
  const [loading, setLoading] = useState(true);

  const sections = [
    { name: 'Hero', icon: '🖼️', href: '/admin/hero', color: 'from-blue-500 to-cyan-500' },
    { name: 'About', icon: '📝', href: '/admin/about', color: 'from-purple-500 to-pink-500' },
    { name: 'Stats', icon: '📈', href: '/admin/stats', color: 'from-green-500 to-emerald-500' },
    { name: 'Blog', icon: '📰', href: '/admin/blog', color: 'from-yellow-500 to-orange-500' },
    { name: 'Projects', icon: '🚀', href: '/admin/projects', color: 'from-red-500 to-rose-500' },
    { name: 'Gallery', icon: '🖼️', href: '/admin/gallery', color: 'from-indigo-500 to-purple-500' },
    { name: 'Events', icon: '📅', href: '/admin/events', color: 'from-pink-500 to-rose-500' },
    { name: 'Committee', icon: '👥', href: '/admin/committee', color: 'from-cyan-500 to-blue-500' },
    { name: 'FAQ', icon: '❓', href: '/admin/faq', color: 'from-orange-500 to-red-500' },
  ];

  const [contactStats, setContactStats] = useState<{ total: number; unread: number; today: number; thisWeek: number } | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch section stats
      const promises = sections.map(async (section) => {
        try {
          const res = await fetch(`/api/${section.name.toLowerCase().replace(' ', '-')}`);
          if (res.ok) {
            const data = await res.json();
            return {
              [section.name]: {
                total: data.length,
                active: data.filter((item: any) => item.isActive !== false).length,
                lastUpdated: data[0]?.updatedAt || 'Never',
              },
            };
          }
        } catch (error) {
          console.error(`Failed to fetch ${section.name}:`, error);
        }
        return null;
      });

      const results = await Promise.all(promises);
      const statsData = results
        .filter(result => result !== null)
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      
      setStats(statsData);

      // Fetch contact message stats
      try {
        const res = await fetch('/api/admin/contact?action=stats');
        if (res.ok) {
          const data = await res.json();
          setContactStats(data);
        }
      } catch {
        // Non-critical
      }
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">Dashboard</h1>
        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">
          Welcome back to the control panel
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">{section.icon}</span>
                {!loading && stats[section.name] && (
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {stats[section.name].active} active
                  </span>
                )}
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {section.name}
              </h3>
              
              {!loading && stats[section.name] && (
                <p className="text-xs sm:text-sm text-gray-400">
                  Total: {stats[section.name].total} items
                </p>
              )}
            </div>

            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-primary">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Contact Messages Stats Card */}
      <div className="mt-2">
        <h2 className="text-xs sm:text-sm font-black text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Communication</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/admin/contact-messages"
            className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-primary/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <span className="text-xl sm:text-2xl">✉️</span>
              <p className="text-xl sm:text-2xl font-black text-white mt-2">{contactStats?.total ?? '—'}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Total Messages</p>
            </div>
          </Link>

          <Link
            href="/admin/contact-messages?status=unread"
            className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-blue-500/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <span className="text-xl sm:text-2xl">📬</span>
              <p className="text-xl sm:text-2xl font-black text-blue-400 mt-2">{contactStats?.unread ?? '—'}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Unread</p>
            </div>
          </Link>

          <Link
            href="/admin/contact-messages"
            className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-green-500/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <span className="text-xl sm:text-2xl">📅</span>
              <p className="text-xl sm:text-2xl font-black text-green-400 mt-2">{contactStats?.today ?? '—'}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Today</p>
            </div>
          </Link>

          <Link
            href="/admin/contact-messages"
            className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-purple-500/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <span className="text-xl sm:text-2xl">📊</span>
              <p className="text-xl sm:text-2xl font-black text-purple-400 mt-2">{contactStats?.thisWeek ?? '—'}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">This Week</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
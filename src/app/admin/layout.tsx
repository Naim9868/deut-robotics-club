'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/admin/SidebarContext';
import { Toaster } from 'react-hot-toast';

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toggle } = useSidebar();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify');
        const data = await res.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [pathname, router, isLoginPage]);

  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <Sidebar />
      
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a] border-b border-white/5 flex items-center px-4 z-30">
        <button
          onClick={toggle}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="ml-3 text-lg font-black text-white">
          DRC <span className="text-primary">ADMIN</span>
        </h1>
      </div>

      <main className="pt-14 lg:pt-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}

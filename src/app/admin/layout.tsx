'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
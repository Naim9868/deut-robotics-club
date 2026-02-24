'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful');
        router.push('/admin');
        router.refresh();
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl font-black text-white">D</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-white">DUET ROBOTICS</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Admin Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="admin@drc.duet.ac.bd"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-black uppercase tracking-wider rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span className="relative z-10">Access Panel</span>
              )}
              <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
            </button>
          </form>

          {/* First time setup notice */}
          <div className="mt-6 p-4 bg-[#121212] border border-white/5 rounded-lg">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider text-center">
              ⚡ First time? Check .env file for default credentials
            </p>
            <p className="text-[8px] text-gray-700 text-center mt-2">
              Default: admin@drc.duet.ac.bd / ChangeThisPassword123
            </p>
          </div>

          {/* System Status */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[8px] text-gray-600 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span>System Online</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div>DRC v1.0</div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[8px] text-gray-700 uppercase tracking-wider mt-8">
          © 2026 DUET Robotics Club. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
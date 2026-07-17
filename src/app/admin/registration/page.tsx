'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

interface RegistrationApplication {
  _id: string;
  applicationId: string;
  personal: { fullName: string; gender: string; profilePhoto: { url: string } };
  university: { studentId: string; department: string; session: string; semester: string };
  contact: { email: string; phone: string };
  status: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-500/15 text-muted border border-gray-500/20',
  submitted: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  pending_payment: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  pending_verification: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  approved: 'bg-green-500/15 text-green-400 border border-green-500/20',
  rejected: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

const STATUS_OPTIONS = ['all', 'submitted', 'pending_payment', 'pending_verification', 'approved', 'rejected'] as const;

export default function RegistrationAppsPage() {
  const [applications, setApplications] = useState<RegistrationApplication[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState({ total: 0, submitted: 0, pendingVerification: 0, approved: 0, rejected: 0, today: 0 });

  const fetchApplications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/admin/registration?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/registration?action=stats');
      if (res.ok) setStats(await res.json());
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => {
    fetchApplications(1);
    fetchStats();
  }, [fetchApplications, fetchStats]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground">Registration Applications</h1>
        <p className="text-muted text-sm mt-1">{pagination.total} total applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Submitted', value: stats.submitted, color: 'text-blue-400' },
          { label: 'Pending Verify', value: stats.pendingVerification, color: 'text-orange-400' },
          { label: 'Approved', value: stats.approved, color: 'text-green-400' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
          { label: 'Today', value: stats.today, color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Status' : s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="createdAt-desc">Newest first</option>
            <option value="createdAt-asc">Oldest first</option>
            <option value="personal.fullName-asc">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-background/5 rounded w-1/4" />
                  <div className="h-3 bg-background/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl mb-4 block">📋</span>
            <p className="text-muted font-medium">No applications found</p>
            <p className="text-muted text-sm mt-1">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Applications will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background/5">
                <tr>
                  {[
                    { key: 'applicationId', label: 'ID' },
                    { key: 'personal.fullName', label: 'Name' },
                    { key: 'university.department', label: 'Department' },
                    { key: 'status', label: 'Status' },
                    { key: 'createdAt', label: 'Date' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="px-4 py-3 text-left text-xs font-black text-muted uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    >
                      {col.label}
                      {sortBy === col.key && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-black text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-background/5 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-primary">{app.applicationId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {app.personal?.profilePhoto?.url ? (
                          <img
                            src={app.personal.profilePhoto.url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center text-xs text-muted">
                            {app.personal?.fullName?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-foreground">{app.personal?.fullName}</p>
                          <p className="text-xs text-muted">{app.contact?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{app.university?.department}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[app.status] || STATUS_STYLES.draft}`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(app.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/registration/${app._id}`}
                        className="px-3 py-1.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} applications)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchApplications(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs font-bold text-muted bg-background/5 rounded hover:bg-background/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchApplications(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-xs font-bold text-muted bg-background/5 rounded hover:bg-background/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

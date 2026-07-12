'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

interface Member {
  _id: string;
  membershipId: string;
  personal: { fullName: string; gender: string; profilePhoto: { url: string } };
  university: { studentId: string; department: string; session: string };
  contact: { email: string; phone: string };
  membershipStatus: string;
  membershipType: string;
  joinedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  active: 'bg-green-500/15 text-green-400 border border-green-500/20',
  suspended: 'bg-red-500/15 text-red-400 border border-red-500/20',
  expired: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
  alumni: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
};

const STATUS_OPTIONS = ['all', 'active', 'suspended', 'expired', 'alumni', 'pending'] as const;
const TYPE_OPTIONS = ['all', 'regular', 'executive', 'honorary'] as const;

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, expired: 0, alumni: 0, thisMonth: 0 });

  // Status change
  const [statusDialog, setStatusDialog] = useState<{ isOpen: boolean; memberId: string; action: string }>({
    isOpen: false, memberId: '', action: '',
  });
  const [statusReason, setStatusReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMembers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        search,
        membershipStatus: statusFilter,
        membershipType: typeFilter,
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/admin/members?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMembers(data.members);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, sortBy, sortOrder]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/members?action=stats');
      if (res.ok) setStats(await res.json());
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => {
    fetchMembers(1);
    fetchStats();
  }, [fetchMembers, fetchStats]);

  const handleStatusChange = async () => {
    if (!statusDialog.memberId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${statusDialog.memberId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusDialog.action, reason: statusReason }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Member ${statusDialog.action}`);
      setStatusDialog({ isOpen: false, memberId: '', action: '' });
      setStatusReason('');
      fetchMembers(pagination.page);
      fetchStats();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

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
        <h1 className="text-3xl font-black text-white">Members</h1>
        <p className="text-gray-500 text-sm mt-1">{pagination.total} total members</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Active', value: stats.active, color: 'text-green-400' },
          { label: 'Suspended', value: stats.suspended, color: 'text-red-400' },
          { label: 'Expired', value: stats.expired, color: 'text-gray-400' },
          { label: 'Alumni', value: stats.alumni, color: 'text-purple-400' },
          { label: 'This Month', value: stats.thisMonth, color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, ID, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-1/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-gray-400 font-medium">No members found</p>
            <p className="text-gray-600 text-sm mt-1">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Members will appear here after approval'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  {[
                    { key: 'membershipId', label: 'Member ID' },
                    { key: 'personal.fullName', label: 'Name' },
                    { key: 'university.department', label: 'Department' },
                    { key: 'membershipStatus', label: 'Status' },
                    { key: 'membershipType', label: 'Type' },
                    { key: 'joinedAt', label: 'Joined' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    >
                      {col.label}
                      {sortBy === col.key && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-primary">{member.membershipId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {member.personal?.profilePhoto?.url ? (
                          <img src={member.personal.profilePhoto.url} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-400">
                            {member.personal?.fullName?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-white">{member.personal?.fullName}</p>
                          <p className="text-xs text-gray-500">{member.contact?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{member.university?.department}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[member.membershipStatus] || ''}`}>
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 capitalize">{member.membershipType}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(member.joinedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/members/${member._id}`}
                          className="px-2 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                        >
                          View
                        </Link>
                        {member.membershipStatus === 'active' && (
                          <button
                            onClick={() => setStatusDialog({ isOpen: true, memberId: member._id, action: 'suspended' })}
                            className="px-2 py-1 text-[10px] font-bold bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                        {member.membershipStatus === 'suspended' && (
                          <button
                            onClick={() => setStatusDialog({ isOpen: true, memberId: member._id, action: 'active' })}
                            className="px-2 py-1 text-[10px] font-bold bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} members)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchMembers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchMembers(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Change Dialog */}
      <ConfirmationDialog
        isOpen={statusDialog.isOpen}
        onClose={() => {
          setStatusDialog({ isOpen: false, memberId: '', action: '' });
          setStatusReason('');
        }}
        onConfirm={handleStatusChange}
        title={`${statusDialog.action === 'suspended' ? 'Suspend' : 'Activate'} Member`}
        message={`Are you sure you want to ${statusDialog.action} this member?`}
        confirmLabel={statusDialog.action === 'suspended' ? 'Suspend' : 'Activate'}
        isLoading={actionLoading}
        variant={statusDialog.action === 'suspended' ? 'danger' : 'info'}
      />
    </div>
  );
}

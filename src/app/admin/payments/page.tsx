'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

interface PaymentRecord {
  _id: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  senderNumber: string;
  method: string;
  transactionId: string;
  amount: number;
  screenshot: { url: string; type: string };
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
  submitted: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  pending_payment: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  pending_verification: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  approved: 'bg-green-500/15 text-green-400 border border-green-500/20',
  rejected: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Pending',
  pending_payment: 'Pending',
  pending_verification: 'Pending',
  approved: 'Verified',
  rejected: 'Rejected',
};

const FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // Reject dialog
  const [rejectDialog, setRejectDialog] = useState<{ isOpen: boolean; applicationId: string }>({
    isOpen: false, applicationId: '',
  });
  const [rejectReason, setRejectReason] = useState('');

  const fetchPayments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/payments?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setPayments(data.payments);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPayments(1);
  }, [fetchPayments]);

  const handleVerify = async (applicationId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, action: 'verify' }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Payment verified & member created');
      fetchPayments(pagination.page);
    } catch {
      toast.error('Failed to verify payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.applicationId || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: rejectDialog.applicationId,
          action: 'reject',
          reason: rejectReason,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Payment rejected');
      setRejectDialog({ isOpen: false, applicationId: '' });
      setRejectReason('');
      fetchPayments(pagination.page);
    } catch {
      toast.error('Failed to reject payment');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const pendingCount = payments.filter((p) =>
    ['submitted', 'pending_payment', 'pending_verification'].includes(p.status)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Payment Verification</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pagination.total} total applications · {pendingCount} pending
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              statusFilter === opt.value
                ? 'bg-white/10 text-white'
                : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
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
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl mb-4 block">💳</span>
            <p className="text-gray-400 font-medium">No payments found</p>
            <p className="text-gray-600 text-sm mt-1">Payment records will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => {
                  const isPending = ['submitted', 'pending_payment', 'pending_verification'].includes(payment.status);
                  return (
                    <tr key={payment._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-white">{payment.name}</p>
                          <p className="text-xs text-gray-500">{payment.senderNumber}</p>
                          <p className="text-xs text-gray-600">{payment.applicationId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{payment.method}</td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-300">{payment.transactionId}</td>
                      <td className="px-4 py-3 text-sm text-white font-bold">৳{payment.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[payment.status] || STATUS_STYLES.submitted}`}>
                          {STATUS_LABELS[payment.status] || payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(payment.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {payment.screenshot?.url && (
                            <a
                              href={payment.screenshot.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 text-[10px] font-bold bg-gray-500/10 text-gray-400 rounded hover:bg-gray-500/20 transition-colors"
                            >
                              Screenshot
                            </a>
                          )}
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleVerify(payment._id)}
                                disabled={actionLoading}
                                className="px-2 py-1 text-[10px] font-bold bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors disabled:opacity-50"
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => setRejectDialog({ isOpen: true, applicationId: payment._id })}
                                disabled={actionLoading}
                                className="px-2 py-1 text-[10px] font-bold bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchPayments(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() => fetchPayments(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <ConfirmationDialog
        isOpen={rejectDialog.isOpen}
        onClose={() => {
          setRejectDialog({ isOpen: false, applicationId: '' });
          setRejectReason('');
        }}
        onConfirm={handleReject}
        title="Reject Payment"
        message="Please provide a reason for rejecting this payment."
        confirmLabel="Reject Payment"
        isLoading={actionLoading}
        variant="danger"
      />
    </div>
  );
}

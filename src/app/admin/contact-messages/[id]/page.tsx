'use client';

/**
 * ContactMessageDetailPage
 * Admin page for viewing a single contact message.
 * Auto-marks as read on load. Shows full message, metadata, and reply history.
 */

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import ContactReplyModal from '@/components/admin/ContactReplyModal';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  reply: string;
  repliedBy: string | null;
  repliedAt: Date | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  unread: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  read: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
  replied: 'bg-green-500/15 text-green-400 border border-green-500/20',
  archived: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
};

export default function ContactMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(`/api/admin/contact/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setMessage(data);
      } catch {
        toast.error('Message not found');
        router.push('/admin/contact-messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [id, router]);

  const handleArchive = async () => {
    try {
      const res = await fetch(`/api/admin/contact/${id}/archive`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Archived');
      setMessage((prev) => (prev ? { ...prev, status: 'archived' } : null));
    } catch {
      toast.error('Failed to archive');
    }
  };

  const handleMarkAsRead = async () => {
    try {
      const res = await fetch(`/api/admin/contact/${id}/read`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Marked as read');
      setMessage((prev) => (prev ? { ...prev, status: 'read' } : null));
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Deleted successfully');
      router.push('/admin/contact-messages');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-4 bg-white/5 rounded w-1/2" />
          <div className="h-64 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/contact-messages"
            className="text-xs text-gray-500 hover:text-primary transition-colors mb-2 inline-block"
          >
            ← Back to Messages
          </Link>
          <h1 className="text-2xl font-black text-white">{message.subject}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[message.status]}`}>
              {message.status}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(message.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {message.status === 'unread' && (
            <button
              onClick={handleMarkAsRead}
              className="px-3 py-1.5 text-xs font-bold bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 transition-colors"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={() => setReplyModal(true)}
            className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reply
          </button>
          {message.status !== 'archived' && (
            <button
              onClick={handleArchive}
              className="px-3 py-1.5 text-xs font-bold bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors"
            >
              Archive
            </button>
          )}
          <button
            onClick={() => setDeleteDialog(true)}
            className="px-3 py-1.5 text-xs font-bold bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
              Message
            </h3>
            <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </div>
          </div>

          {/* Reply (if exists) */}
          {message.reply && (
            <div className="bg-[#0a0a0a] border border-green-500/10 rounded-2xl p-6">
              <h3 className="text-xs font-black text-green-400 uppercase tracking-wider mb-4">
                Reply
              </h3>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed mb-4">
                {message.reply}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>By: {message.repliedBy}</span>
                <span>At: {message.repliedAt ? formatDate(message.repliedAt) : 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Sender Info */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
              Sender Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-600 uppercase">Name</p>
                <p className="text-sm text-white font-medium">{message.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase">Email</p>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-primary hover:text-white transition-colors"
                >
                  {message.email}
                </a>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
              Metadata
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-600 uppercase">IP Address</p>
                <p className="text-sm text-gray-300 font-mono">{message.ipAddress || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase">User Agent</p>
                <p className="text-xs text-gray-500 break-all">{message.userAgent || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase">Received</p>
                <p className="text-sm text-gray-300">{formatDate(message.createdAt)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase">Last Updated</p>
                <p className="text-sm text-gray-300">{formatDate(message.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={actionLoading}
        variant="danger"
      />

      {/* Reply Modal */}
      <ContactReplyModal
        isOpen={replyModal}
        onClose={() => setReplyModal(false)}
        message={{ _id: message._id, name: message.name, email: message.email, subject: message.subject }}
        onReplySent={() => {
          // Re-fetch message to show the reply
          fetch(`/api/admin/contact/${id}`)
            .then((r) => r.json())
            .then((data) => setMessage(data));
        }}
      />
    </div>
  );
}

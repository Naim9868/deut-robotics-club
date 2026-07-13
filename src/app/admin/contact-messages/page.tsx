'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

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
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SiteSettings {
  adminName: string;
  adminEmail: string;
  replySubjectTemplate: string;
  replyBodyTemplate: string;
}

const STATUS_STYLES: Record<string, string> = {
  unread: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  read: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
  replied: 'bg-green-500/15 text-green-400 border border-green-500/20',
  archived: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
};

const STATUS_OPTIONS = ['all', 'unread', 'read', 'replied', 'archived'] as const;

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Settings
  const [settings, setSettings] = useState<SiteSettings>({ adminName: 'Admin', adminEmail: 'admin@drc.duet.ac.bd', replySubjectTemplate: 'Re: {subject}', replyBodyTemplate: 'Hi {name},\n\n' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [adminNameInput, setAdminNameInput] = useState('Admin');
  const [adminEmailInput, setAdminEmailInput] = useState('admin@drc.duet.ac.bd');
  const [subjectTemplateInput, setSubjectTemplateInput] = useState('Re: {subject}');
  const [bodyTemplateInput, setBodyTemplateInput] = useState('Hi {name},\n\n');

  // Modals
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ─── Settings ──────────────────────────────────────────

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setAdminNameInput(data.adminName || 'Admin');
        setAdminEmailInput(data.adminEmail || 'admin@drc.duet.ac.bd');
        setSubjectTemplateInput(data.replySubjectTemplate || 'Re: {subject}');
        setBodyTemplateInput(data.replyBodyTemplate || 'Hi {name},\n\n');
      }
    } catch {
      // Silently fail — settings are non-critical
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async () => {
    if (!adminNameInput.trim()) {
      toast.error('Admin name is required');
      return;
    }
    if (!adminEmailInput.trim()) {
      toast.error('Admin email is required');
      return;
    }

    setSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName: adminNameInput.trim(),
          adminEmail: adminEmailInput.trim(),
          replySubjectTemplate: subjectTemplateInput.trim(),
          replyBodyTemplate: bodyTemplateInput.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSettings(data.data);
      toast.success('Settings saved');
      setSettingsOpen(false);
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  // ─── Gmail Reply ───────────────────────────────────────

  const handleGmailReply = async (msg: ContactMessage) => {
    const applyTemplate = (template: string) =>
      template
        .replace(/\\n/g, '\n')
        .replace(/{name}/g, msg.name)
        .replace(/{email}/g, msg.email)
        .replace(/{subject}/g, msg.subject)
        .replace(/{message}/g, msg.message);

    const subject = applyTemplate(settings.replySubjectTemplate || 'Re: {subject}');
    const body = applyTemplate(settings.replyBodyTemplate || 'Hi {name},\n\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Save reply placeholder to database
    try {
      await fetch(`/api/admin/contact/${msg._id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply: `[Reply sent via Gmail by ${settings.adminName}]`,
          repliedBy: settings.adminName,
        }),
      });
    } catch {
      // Non-critical — Gmail will still open
    }

    window.open(gmailUrl, '_blank');
    fetchMessages(pagination.page);
  };

  // ─── Messages ──────────────────────────────────────────

  const fetchMessages = useCallback(async (page = 1) => {
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

      const res = await fetch(`/api/admin/contact?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setMessages(data.messages);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchMessages(1);
    setSelectedIds(new Set());
  }, [fetchMessages]);

  // ─── Quick Actions ──────────────────────────────────────

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contact/${id}/read`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Marked as read');
      fetchMessages(pagination.page);
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contact/${id}/archive`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Archived');
      fetchMessages(pagination.page);
    } catch {
      toast.error('Failed to archive');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/contact/${deleteDialog.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Deleted successfully');
      setDeleteDialog({ isOpen: false, id: null });
      fetchMessages(pagination.page);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Bulk Actions ──────────────────────────────────────

  const handleSelectAll = () => {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m._id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkStatus = async (status: 'read' | 'archived') => {
    if (selectedIds.size === 0) return;
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-status', ids: Array.from(selectedIds), status }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`${selectedIds.size} message(s) marked as ${status}`);
      setSelectedIds(new Set());
      fetchMessages(pagination.page);
    } catch {
      toast.error('Bulk action failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-delete', ids: Array.from(selectedIds) }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`${selectedIds.size} message(s) deleted`);
      setSelectedIds(new Set());
      setBulkDeleteDialog(false);
      fetchMessages(pagination.page);
    } catch {
      toast.error('Bulk delete failed');
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pagination.total} total messages
          </p>
        </div>
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Reply Settings
        </button>
      </div>

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Reply Settings</h3>
          <p className="text-xs text-gray-500 mb-4">
            Configure your Gmail reply template. Use placeholders: <code className="text-primary">{'{name}'}</code> <code className="text-primary">{'{email}'}</code> <code className="text-primary">{'{subject}'}</code> <code className="text-primary">{'{message}'}</code>
          </p>

          {/* Admin Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={adminNameInput}
                onChange={(e) => setAdminNameInput(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Your Email
              </label>
              <input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="e.g. admin@example.com"
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Template Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Subject Template
              </label>
              <input
                type="text"
                value={subjectTemplateInput}
                onChange={(e) => setSubjectTemplateInput(e.target.value)}
                placeholder="Re: {subject}"
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Body Template
              </label>
              <textarea
                value={bodyTemplateInput}
                onChange={(e) => setBodyTemplateInput(e.target.value)}
                rows={4}
                placeholder="Hi {name},&#10;&#10;"
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setSettingsOpen(false);
                setAdminNameInput(settings.adminName);
                setAdminEmailInput(settings.adminEmail);
                setSubjectTemplateInput(settings.replySubjectTemplate);
                setBodyTemplateInput(settings.replyBodyTemplate);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={settingsLoading}
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {settingsLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, subject, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
            />
          </div>

          {/* Status filter */}
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

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="createdAt-desc">Newest first</option>
            <option value="createdAt-asc">Oldest first</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="email-asc">Email A-Z</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-gray-400">{selectedIds.size} selected</span>
            <button
              onClick={() => handleBulkStatus('read')}
              className="px-3 py-1.5 text-xs font-bold bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
            >
              Mark as Read
            </button>
            <button
              onClick={() => handleBulkStatus('archived')}
              className="px-3 py-1.5 text-xs font-bold bg-yellow-500/10 text-yellow-400 rounded hover:bg-yellow-500/20 transition-colors"
            >
              Archive
            </button>
            <button
              onClick={() => setBulkDeleteDialog(true)}
              className="px-3 py-1.5 text-xs font-bold bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          /* Loading Skeletons */
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="w-4 h-4 bg-white/5 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-1/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-gray-400 font-medium">No messages found</p>
            <p className="text-gray-600 text-sm mt-1">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Messages from the contact form will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === messages.length && messages.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-white/20 bg-[#121212] accent-primary"
                    />
                  </th>
                  {[
                    { key: 'name', label: 'From' },
                    { key: 'subject', label: 'Subject' },
                    { key: 'status', label: 'Status' },
                    { key: 'createdAt', label: 'Date' },
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
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`hover:bg-white/5 transition-colors ${
                      msg.status === 'unread' ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(msg._id)}
                        onChange={() => handleToggleSelect(msg._id)}
                        className="rounded border-white/20 bg-[#121212] accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`text-sm ${msg.status === 'unread' ? 'font-bold text-white' : 'text-gray-300'}`}>
                          {msg.name}
                        </p>
                        <p className="text-xs text-gray-500">{msg.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-sm ${msg.status === 'unread' ? 'font-semibold text-white' : 'text-gray-300'} truncate max-w-[200px]`}>
                        {msg.subject}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[msg.status]}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(msg.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <Link
                          href={`/admin/contact-messages/${msg._id}`}
                          className="px-2 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                        >
                          View
                        </Link>
                        {msg.status === 'unread' && (
                          <button
                            onClick={() => handleMarkAsRead(msg._id)}
                            className="px-2 py-1 text-[10px] font-bold bg-gray-500/10 text-gray-400 rounded hover:bg-gray-500/20 transition-colors"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={() => handleGmailReply(msg)}
                          className="px-2 py-1 text-[10px] font-bold bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors"
                        >
                          Reply
                        </button>
                        {msg.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(msg._id)}
                            className="px-2 py-1 text-[10px] font-bold bg-yellow-500/10 text-yellow-400 rounded hover:bg-yellow-500/20 transition-colors"
                          >
                            Archive
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setDeleteDialog({ isOpen: true, id: msg._id })
                          }
                          className="px-2 py-1 text-[10px] font-bold bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
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
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} messages)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchMessages(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchMessages(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={actionLoading}
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={bulkDeleteDialog}
        onClose={() => setBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Messages"
        message={`Are you sure you want to delete ${selectedIds.size} message(s)? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.size} message(s)`}
        isLoading={actionLoading}
        variant="danger"
      />
    </div>
  );
}

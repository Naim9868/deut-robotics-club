'use client';

/**
 * ContactReplyModal
 * Modal for composing and sending a reply to a contact message.
 * Stores the reply locally; email sending is architected to be pluggable later.
 */

import { useState } from 'react';
import toast from 'react-hot-toast';

interface ContactReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    _id: string;
    name: string;
    email: string;
    subject: string;
  };
  onReplySent: () => void;
}

export default function ContactReplyModal({
  isOpen,
  onClose,
  message,
  onReplySent,
}: ContactReplyModalProps) {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim()) {
      toast.error('Reply text cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/contact/${message._id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply: replyText.trim(),
          repliedBy: 'Admin', // Could be extracted from auth context
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send reply');
      }

      toast.success('Reply sent successfully');
      setReplyText('');
      onClose();
      onReplySent();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to send reply';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReplyText('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Reply to Message</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-white text-xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Original message context */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-500 mb-1">
            Replying to <span className="text-white font-medium">{message.name}</span>
            {' '}(<span className="text-primary">{message.email}</span>)
          </p>
          <p className="text-xs text-gray-500">
            Subject: <span className="text-gray-300">{message.subject}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
            Your Reply
          </label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={6}
            placeholder="Type your reply here..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-600"
            disabled={isSubmitting}
          />

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !replyText.trim()}
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

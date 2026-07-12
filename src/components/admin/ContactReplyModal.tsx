'use client';

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
    createdAt?: string | number | Date;
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
  const [isMinimized, setIsMinimized] = useState(false);

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
          repliedBy: 'Admin',
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
      setIsMinimized(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[320px]">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full bg-[#1a1a2e] border border-white/10 rounded-t-lg px-4 py-3 flex items-center justify-between hover:bg-[#1e1e32] transition-colors shadow-2xl"
        >
          <span className="text-sm font-bold text-white truncate">
            Replay: {message.subject}
          </span>
          <div className="flex items-center gap-2">
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="text-gray-400 hover:text-white text-sm"
            >
              ✕
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[480px] sm:max-w-[calc(100vw-48px)]">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-t-xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#16162a] border-b border-white/5 rounded-t-xl cursor-move">
          <h3 className="text-sm font-bold text-white">
            Replay: {message.subject}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Minimize"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* To Field */}
        <div className="flex items-center px-4 py-2 border-b border-white/5">
          <span className="text-xs text-gray-500 w-12">To</span>
          <div className="flex items-center gap-2 flex-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/15 text-primary text-xs font-medium rounded-full border border-primary/20">
              {message.name} &lt;{message.email}&gt;
            </span>
          </div>
        </div>

        {/* Subject Field */}
        <div className="flex items-center px-4 py-2 border-b border-white/5">
          <span className="text-xs text-gray-500 w-12">Subject</span>
          <span className="text-sm text-gray-300">Re: {message.subject}</span>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4">
            {/* Original message quote */}
            <div className="mb-4 pl-3 border-l-2 border-gray-600/50">
              <p className="text-[11px] text-gray-500">
                On {new Date(message.createdAt ?? Date.now()).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}, {message.name} &lt;{message.email}&gt; wrote:
              </p>
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-transparent text-sm text-white focus:outline-none resize-none placeholder:text-gray-600 min-h-[200px]"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#16162a] border-t border-white/5 rounded-b-xl">
            <button
              type="submit"
              disabled={isSubmitting || !replyText.trim()}
              className="px-5 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-red-400 transition-colors p-1.5 hover:bg-white/5 rounded"
              title="Discard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

interface ApplicationData {
  _id: string;
  applicationId: string;
  personal: {
    fullName: string;
    profilePhoto: { url: string; publicId: string; type: string };
    gender: string;
    dateOfBirth: string;
    bloodGroup: string;
  };
  university: {
    studentId: string;
    registrationNumber: string;
    department: string;
    session: string;
    semester: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsappNumber: string;
    emergencyContact: string;
    address: string;
  };
  payment: {
    method: string;
    transactionId: string;
    senderNumber: string;
    amount: number;
    screenshot: { url: string; publicId: string; type: string };
  };
  additional: {
    skills: string[];
    interests: string[];
    previousExperience: string;
    motivation: string;
  };
  status: string;
  membershipId: string;
  adminNotes: { note: string; addedBy: string; addedAt: string }[];
  reviewedBy: string;
  reviewedAt: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
  submitted: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  pending_payment: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  pending_verification: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  approved: 'bg-green-500/15 text-green-400 border border-green-500/20',
  rejected: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

export default function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [app, setApp] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Note form
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Admin');

  // Reject dialog
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchApp = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/registration/${id}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setApp(data);
    } catch {
      toast.error('Failed to load application');
      router.push('/admin/registration');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  const handleStatusUpdate = async (status: string, reason?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/registration/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Application ${status}`);
      fetchApp();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
      setRejectDialog(false);
      setRejectReason('');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error('Note is required');
      return;
    }
    try {
      const res = await fetch(`/api/admin/registration/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText, addedBy: noteAuthor }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Note added');
      setNoteText('');
      fetchApp();
    } catch {
      toast.error('Failed to add note');
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-96 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/registration')}
            className="text-gray-500 hover:text-white text-sm mb-2 flex items-center gap-1"
          >
            ← Back to Applications
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white">{app.applicationId}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[app.status]}`}>
              {app.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Submitted {formatDate(app.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {app.status === 'submitted' && (
            <>
              <button
                onClick={() => handleStatusUpdate('pending_verification')}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors disabled:opacity-50"
              >
                Mark Pending Verify
              </button>
              <button
                onClick={() => handleStatusUpdate('approved')}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
              >
                Approve
              </button>
            </>
          )}
          {app.status === 'pending_verification' && (
            <button
              onClick={() => handleStatusUpdate('approved')}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
          )}
          {!['approved', 'rejected'].includes(app.status) && (
            <button
              onClick={() => setRejectDialog(true)}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {app.membershipId && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-green-400 text-sm font-bold">Membership ID: {app.membershipId}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-black text-white mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Full Name</label>
            <p className="text-white text-sm mt-1">{app.personal.fullName}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Gender</label>
            <p className="text-white text-sm mt-1 capitalize">{app.personal.gender}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Date of Birth</label>
            <p className="text-white text-sm mt-1">{app.personal.dateOfBirth}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Blood Group</label>
            <p className="text-white text-sm mt-1">{app.personal.bloodGroup || 'N/A'}</p>
          </div>
          {app.personal.profilePhoto?.url && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Profile Photo</label>
              <img
                src={app.personal.profilePhoto.url}
                alt={app.personal.fullName}
                className="w-20 h-20 rounded-full object-cover mt-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* University Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-black text-white mb-4">University Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Student ID</label>
            <p className="text-white text-sm mt-1 font-mono">{app.university.studentId}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Registration Number</label>
            <p className="text-white text-sm mt-1">{app.university.registrationNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Department</label>
            <p className="text-white text-sm mt-1">{app.university.department}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Session</label>
            <p className="text-white text-sm mt-1">{app.university.session}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Semester</label>
            <p className="text-white text-sm mt-1">{app.university.semester}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-black text-white mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Email</label>
            <p className="text-white text-sm mt-1">{app.contact.email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Phone</label>
            <p className="text-white text-sm mt-1">{app.contact.phone}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">WhatsApp</label>
            <p className="text-white text-sm mt-1">{app.contact.whatsappNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Emergency Contact</label>
            <p className="text-white text-sm mt-1">{app.contact.emergencyContact}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 uppercase">Address</label>
            <p className="text-white text-sm mt-1">{app.contact.address}</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-black text-white mb-4">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Method</label>
            <p className="text-white text-sm mt-1">{app.payment.method}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Transaction ID</label>
            <p className="text-white text-sm mt-1 font-mono">{app.payment.transactionId}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Sender Number</label>
            <p className="text-white text-sm mt-1">{app.payment.senderNumber}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Amount</label>
            <p className="text-white text-sm mt-1">৳{app.payment.amount}</p>
          </div>
          {app.payment.screenshot?.url && (
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 uppercase">Payment Screenshot</label>
              <a href={app.payment.screenshot.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={app.payment.screenshot.url}
                  alt="Payment screenshot"
                  className="mt-2 max-w-xs rounded-lg border border-white/10 hover:border-primary transition-colors"
                />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-black text-white mb-4">Additional Information</h2>
        <div className="space-y-4">
          {app.additional.skills.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Skills</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {app.additional.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {app.additional.interests.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Interests</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {app.additional.interests.map((interest, i) => (
                  <span key={i} className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          {app.additional.previousExperience && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Previous Experience</label>
              <p className="text-white text-sm mt-1 whitespace-pre-wrap">{app.additional.previousExperience}</p>
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 uppercase">Motivation</label>
            <p className="text-white text-sm mt-1 whitespace-pre-wrap">{app.additional.motivation}</p>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-black text-white mb-4">Admin Notes</h2>

        {/* Add note form */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={noteAuthor}
            onChange={(e) => setNoteAuthor(e.target.value)}
            placeholder="Author"
            className="w-32 bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
          />
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <button
            onClick={handleAddNote}
            className="px-4 py-2 text-sm font-bold bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Notes list */}
        {app.adminNotes.length === 0 ? (
          <p className="text-gray-600 text-sm">No notes yet</p>
        ) : (
          <div className="space-y-2">
            {app.adminNotes.map((n, i) => (
              <div key={i} className="p-3 bg-[#121212] border border-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-primary">{n.addedBy}</span>
                  <span className="text-xs text-gray-600">{formatDate(n.addedAt)}</span>
                </div>
                <p className="text-sm text-gray-300">{n.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <ConfirmationDialog
        isOpen={rejectDialog}
        onClose={() => {
          setRejectDialog(false);
          setRejectReason('');
        }}
        onConfirm={() => handleStatusUpdate('rejected', rejectReason)}
        title="Reject Application"
        message="Are you sure you want to reject this application? Please provide a reason."
        confirmLabel="Reject"
        isLoading={actionLoading}
        variant="danger"
      />
    </div>
  );
}

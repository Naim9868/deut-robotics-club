'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface MemberData {
  _id: string;
  membershipId: string;
  registrationApplication: {
    _id: string;
    applicationId: string;
    status: string;
  };
  personal: {
    fullName: string;
    profilePhoto: { url: string; type: string };
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
  additional: {
    skills: string[];
    interests: string[];
    previousExperience: string;
    motivation: string;
  };
  membershipStatus: string;
  membershipType: string;
  joinedAt: string;
  expiresAt: string;
  suspendedAt: string;
  suspendedReason: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  active: 'bg-green-500/15 text-green-400 border border-green-500/20',
  suspended: 'bg-red-500/15 text-red-400 border border-red-500/20',
  expired: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
  alumni: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
};

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<MemberData>>({});

  const fetchMember = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/members/${id}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMember(data);
    } catch {
      toast.error('Failed to load member');
      router.push('/admin/members');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Member updated');
      setEditing(false);
      fetchMember();
    } catch {
      toast.error('Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

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

  if (!member) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/members')}
            className="text-gray-500 hover:text-white text-sm mb-2 flex items-center gap-1"
          >
            ← Back to Members
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{member.membershipId}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[member.membershipStatus]}`}>
              {member.membershipStatus}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {member.personal.fullName} · Joined {formatDate(member.joinedAt)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {!editing ? (
            <button
              onClick={() => {
                setEditing(true);
                setEditData({ personal: member.personal, university: member.university, contact: member.contact });
              }}
              className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
            >
              Edit Member
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm font-bold text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Membership Info */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-black text-white mb-4">Membership Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Membership ID</label>
            <p className="text-primary text-sm mt-1 font-mono font-bold">{member.membershipId}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Type</label>
            <p className="text-white text-sm mt-1 capitalize">{member.membershipType}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Joined</label>
            <p className="text-white text-sm mt-1">{formatDate(member.joinedAt)}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Expires</label>
            <p className="text-white text-sm mt-1">{formatDate(member.expiresAt)}</p>
          </div>
          {member.suspendedAt && (
            <>
              <div>
                <label className="text-xs text-gray-500 uppercase">Suspended At</label>
                <p className="text-red-400 text-sm mt-1">{formatDate(member.suspendedAt)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Suspension Reason</label>
                <p className="text-red-400 text-sm mt-1">{member.suspendedReason || 'N/A'}</p>
              </div>
            </>
          )}
          {member.registrationApplication && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Application ID</label>
              <p className="text-white text-sm mt-1 font-mono">{(member.registrationApplication as any).applicationId}</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-black text-white mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Full Name</label>
            <p className="text-white text-sm mt-1">{member.personal.fullName}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Gender</label>
            <p className="text-white text-sm mt-1 capitalize">{member.personal.gender}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Date of Birth</label>
            <p className="text-white text-sm mt-1">{member.personal.dateOfBirth}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Blood Group</label>
            <p className="text-white text-sm mt-1">{member.personal.bloodGroup || 'N/A'}</p>
          </div>
          {member.personal.profilePhoto?.url && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Profile Photo</label>
              <img src={member.personal.profilePhoto.url} alt="" className="w-20 h-20 rounded-full object-cover mt-2" />
            </div>
          )}
        </div>
      </div>

      {/* University Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-black text-white mb-4">University Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Student ID</label>
            <p className="text-white text-sm mt-1 font-mono">{member.university.studentId}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Registration Number</label>
            <p className="text-white text-sm mt-1">{member.university.registrationNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Department</label>
            <p className="text-white text-sm mt-1">{member.university.department}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Session</label>
            <p className="text-white text-sm mt-1">{member.university.session}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Semester</label>
            <p className="text-white text-sm mt-1">{member.university.semester}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-black text-white mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Email</label>
            <p className="text-white text-sm mt-1">{member.contact.email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Phone</label>
            <p className="text-white text-sm mt-1">{member.contact.phone}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">WhatsApp</label>
            <p className="text-white text-sm mt-1">{member.contact.whatsappNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Emergency Contact</label>
            <p className="text-white text-sm mt-1">{member.contact.emergencyContact}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 uppercase">Address</label>
            <p className="text-white text-sm mt-1">{member.contact.address}</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-black text-white mb-4">Skills & Interests</h2>
        <div className="space-y-4">
          {member.additional.skills.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Skills</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {member.additional.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {member.additional.interests.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Interests</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {member.additional.interests.map((interest, i) => (
                  <span key={i} className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

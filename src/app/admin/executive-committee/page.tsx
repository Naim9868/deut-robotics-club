'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

// ─── Constants ────────────────────────────────────────────────

const DESIGNATIONS = [
  'President',
  'Vice President',
  'General Secretary',
  'Joint Secretary',
  'Treasurer',
  'Organizing Secretary',
  'Technical Secretary',
  'Research Secretary',
  'Publication Secretary',
  'Media & Communication Secretary',
  'Executive Member',
  'Faculty Advisor',
  'Advisor',
];

const inputClass = 'w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary';
const labelClass = 'block text-xs font-black text-muted uppercase mb-2';
const smallInputClass = 'w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary';

// ─── Interfaces ───────────────────────────────────────────────

interface CommitteeMember {
  _id?: string;
  fullName: string;
  slug: string;
  profilePhoto: { url: string; alt: string; publicId: string };
  coverPhoto: { url: string; alt: string; publicId: string };
  designation: string;
  department: string;
  session: string;
  studentId: string;
  shortBio: string;
  fullBiography: string;
  email: string;
  phone: string;
  socialLinks: { facebook: string; linkedin: string; github: string; portfolio: string; website: string };
  responsibilities: string[];
  achievements: string[];
  messageFromMember: string;
  displayOrder: number;
  featured: boolean;
  isVisible: boolean;
}

interface Committee {
  _id: string;
  committeeYear: number;
  title: string;
  slug: string;
  description: string;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
  members: CommitteeMember[];
  memberCount: number;
}

interface CommitteeForm {
  committeeYear: number;
  title: string;
  description: string;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
}

interface MemberForm {
  fullName: string;
  designation: string;
  department: string;
  session: string;
  studentId: string;
  email: string;
  phone: string;
  shortBio: string;
  fullBiography: string;
  messageFromMember: string;
  responsibilities: string;
  achievements: string;
  displayOrder: number;
  featured: boolean;
  isVisible: boolean;
}

// ─── Default Empty Member ─────────────────────────────────────

const emptyMember: CommitteeMember = {
  fullName: '',
  slug: '',
  profilePhoto: { url: '', alt: '', publicId: '' },
  coverPhoto: { url: '', alt: '', publicId: '' },
  designation: '',
  department: '',
  session: '',
  studentId: '',
  shortBio: '',
  fullBiography: '',
  email: '',
  phone: '',
  socialLinks: { facebook: '', linkedin: '', github: '', portfolio: '', website: '' },
  responsibilities: [],
  achievements: [],
  messageFromMember: '',
  displayOrder: 0,
  featured: false,
  isVisible: true,
};

// ─── Main Component ───────────────────────────────────────────

export default function ExecutiveCommitteePage() {
  // ── State ────────────────────────────────────────────────
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'committee-form' | 'member-list' | 'member-form'>('list');
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [currentCommittee, setCurrentCommittee] = useState<Committee | null>(null);
  const [workingMembers, setWorkingMembers] = useState<CommitteeMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({ facebook: '', linkedin: '', github: '', portfolio: '', website: '' });

  const { register: regCommittee, handleSubmit: handleSubmitCommittee, reset: resetCommittee, watch: watchCommittee } = useForm<CommitteeForm>({
    defaultValues: { committeeYear: new Date().getFullYear(), title: '', description: '', isCurrent: false, isPublished: false, displayOrder: 0 },
  });

  const { register: regMember, handleSubmit: handleSubmitMember, reset: resetMember, watch: watchMember, setValue: setMemberValue } = useForm<MemberForm>({
    defaultValues: { fullName: '', designation: '', department: '', session: '', studentId: '', email: '', phone: '', shortBio: '', fullBiography: '', messageFromMember: '', responsibilities: '', achievements: '', displayOrder: 0, featured: false, isVisible: true },
  });

  // ── Fetch ────────────────────────────────────────────────
  const fetchCommittees = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/executive-committees?limit=100');
      const data = await res.json();
      setCommittees(data.committees || []);
    } catch {
      toast.error('Failed to fetch committees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCommittees(); }, [fetchCommittees]);

  // ── Committee CRUD ───────────────────────────────────────

  const onCreateCommittee = () => {
    setEditingCommitteeId(null);
    resetCommittee({ committeeYear: new Date().getFullYear(), title: '', description: '', isCurrent: false, isPublished: false, displayOrder: 0 });
    setView('committee-form');
  };

  const onEditCommittee = (c: Committee) => {
    setEditingCommitteeId(c._id);
    resetCommittee({ committeeYear: c.committeeYear, title: c.title, description: c.description, isCurrent: c.isCurrent, isPublished: c.isPublished, displayOrder: c.displayOrder });
    setView('committee-form');
  };

  const onSubmitCommittee = async (data: CommitteeForm) => {
    setSaving(true);
    try {
      const payload = { ...data, title: data.title || `Executive Committee ${data.committeeYear}` };
      const url = editingCommitteeId ? `/api/admin/executive-committees/${editingCommitteeId}` : '/api/admin/executive-committees';
      const method = editingCommitteeId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editingCommitteeId ? 'Committee updated' : 'Committee created');
        await fetchCommittees();
        setView('list');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save committee');
    } finally {
      setSaving(false);
    }
  };

  const onDeleteCommittee = async (id: string) => {
    if (!confirm('Delete this committee and all its members?')) return;
    try {
      const res = await fetch(`/api/admin/executive-committees/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Deleted'); await fetchCommittees(); }
      else { toast.error('Failed to delete'); }
    } catch { toast.error('Failed to delete'); }
  };

  const onTogglePublish = async (c: Committee) => {
    try {
      const res = await fetch(`/api/admin/executive-committees/${c._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !c.isPublished }),
      });
      if (res.ok) { toast.success(c.isPublished ? 'Unpublished' : 'Published'); await fetchCommittees(); }
    } catch { toast.error('Failed'); }
  };

  const onSetCurrent = async (c: Committee) => {
    try {
      const payload = { isCurrent: true, committeeYear: c.committeeYear };
      const res = await fetch(`/api/admin/executive-committees/${c._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { toast.success(`Set as current for ${c.committeeYear}`); await fetchCommittees(); }
    } catch { toast.error('Failed'); }
  };

  // ── Member Management ────────────────────────────────────

  const onManageMembers = (c: Committee) => {
    setCurrentCommittee(c);
    setWorkingMembers([...c.members.map(m => ({ ...m }))]);
    setView('member-list');
  };

  const onAddMember = () => {
    setEditingMemberIndex(null);
    resetMember({ fullName: '', designation: '', department: '', session: '', studentId: '', email: '', phone: '', shortBio: '', fullBiography: '', messageFromMember: '', responsibilities: '', achievements: '', displayOrder: workingMembers.length, featured: false, isVisible: true });
    setProfilePhotoUrl('');
    setCoverPhotoUrl('');
    setSocialLinks({ facebook: '', linkedin: '', github: '', portfolio: '', website: '' });
    setView('member-form');
  };

  const onEditMember = (index: number) => {
    const m = workingMembers[index];
    setEditingMemberIndex(index);
    resetMember({
      fullName: m.fullName,
      designation: m.designation,
      department: m.department,
      session: m.session,
      studentId: m.studentId,
      email: m.email,
      phone: m.phone,
      shortBio: m.shortBio,
      fullBiography: m.fullBiography,
      messageFromMember: m.messageFromMember,
      responsibilities: m.responsibilities.join('\n'),
      achievements: m.achievements.join('\n'),
      displayOrder: m.displayOrder,
      featured: m.featured,
      isVisible: m.isVisible,
    });
    setProfilePhotoUrl(m.profilePhoto?.url || '');
    setCoverPhotoUrl(m.coverPhoto?.url || '');
    setSocialLinks(m.socialLinks || { facebook: '', linkedin: '', github: '', portfolio: '', website: '' });
    setView('member-form');
  };

  const onSubmitMember = (data: MemberForm) => {
    const member: CommitteeMember = {
      fullName: data.fullName,
      slug: data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      profilePhoto: { url: profilePhotoUrl, alt: data.fullName, publicId: '' },
      coverPhoto: { url: coverPhotoUrl, alt: data.fullName, publicId: '' },
      designation: data.designation,
      department: data.department,
      session: data.session,
      studentId: data.studentId,
      shortBio: data.shortBio,
      fullBiography: data.fullBiography,
      email: data.email,
      phone: data.phone,
      socialLinks,
      responsibilities: data.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
      achievements: data.achievements.split('\n').map(s => s.trim()).filter(Boolean),
      messageFromMember: data.messageFromMember,
      displayOrder: data.displayOrder,
      featured: data.featured,
      isVisible: data.isVisible,
    };

    const updated = [...workingMembers];
    if (editingMemberIndex !== null) {
      updated[editingMemberIndex] = { ...member, _id: workingMembers[editingMemberIndex]._id };
    } else {
      updated.push(member);
    }
    setWorkingMembers(updated);
    setView('member-list');
    toast.success(editingMemberIndex !== null ? 'Member updated' : 'Member added');
  };

  const onRemoveMember = (index: number) => {
    if (!confirm('Remove this member?')) return;
    setWorkingMembers(workingMembers.filter((_, i) => i !== index));
    toast.success('Member removed');
  };

  const onSaveMembers = async () => {
    if (!currentCommittee) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/executive-committees/${currentCommittee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: workingMembers }),
      });
      if (res.ok) {
        toast.success('Members saved');
        await fetchCommittees();
        setView('list');
      } else {
        toast.error('Failed to save members');
      }
    } catch {
      toast.error('Failed to save members');
    } finally {
      setSaving(false);
    }
  };

  // ── Move Member ──────────────────────────────────────────

  const moveMember = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workingMembers.length) return;
    const updated = [...workingMembers];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setWorkingMembers(updated);
  };

  // ── Render ───────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground">Executive Committee</h1>
            <p className="text-muted text-sm mt-1">Manage year-based executive committees and their members</p>
          </div>
          <button onClick={onCreateCommittee} className="px-6 py-3 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors font-bold">
            + New Committee
          </button>
        </div>

        {committees.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted">No committees yet. Create your first committee year above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((c) => (
              <div key={c._id} className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-foreground font-black text-2xl">{c.committeeYear}</h3>
                      <p className="text-muted text-sm mt-1">{c.title}</p>
                    </div>
                    <div className="flex gap-1">
                      {c.isCurrent && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold">Current</span>
                      )}
                      {c.isPublished && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-bold">Published</span>
                      )}
                    </div>
                  </div>

                  {c.description && (
                    <p className="text-muted text-xs line-clamp-2 mb-3">{c.description}</p>
                  )}

                  <p className="text-muted text-xs mb-4">{c.members.length} members</p>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => onManageMembers(c)} className="px-3 py-1.5 bg-primary/20 text-primary text-xs rounded-lg hover:bg-primary/30 transition-colors font-bold">
                      Members
                    </button>
                    <button onClick={() => onEditCommittee(c)} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 transition-colors font-bold">
                      Edit
                    </button>
                    <button onClick={() => onTogglePublish(c)} className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors ${c.isPublished ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                      {c.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    {!c.isCurrent && (
                      <button onClick={() => onSetCurrent(c)} className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs rounded-lg hover:bg-purple-500/30 transition-colors font-bold">
                        Set Current
                      </button>
                    )}
                    <button onClick={() => onDeleteCommittee(c._id)} className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 transition-colors font-bold">
                      Del
                    </button>
                  </div>

                  {/* Member Preview */}
                  {c.members.length > 0 && (
                    <div className="flex -space-x-2 mt-4">
                      {c.members.filter(m => m.isVisible).slice(0, 6).map((m, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-input-bg border-2 border-card overflow-hidden" title={m.fullName}>
                          {m.profilePhoto?.url ? (
                            <img src={m.profilePhoto.url} alt={m.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted font-bold">
                              {m.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                      {c.members.filter(m => m.isVisible).length > 6 && (
                        <div className="w-8 h-8 rounded-full bg-input-bg border-2 border-card flex items-center justify-center text-xs text-muted font-bold">
                          +{c.members.filter(m => m.isVisible).length - 6}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── COMMITTEE FORM VIEW ──────────────────────────────────
  if (view === 'committee-form') {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="text-muted hover:text-foreground transition-colors">&larr; Back</button>
          <h1 className="text-3xl font-black text-foreground">{editingCommitteeId ? 'Edit Committee' : 'New Committee'}</h1>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmitCommittee(onSubmitCommittee)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Committee Year <span className="text-red-500">*</span></label>
                <input type="number" {...regCommittee('committeeYear', { required: true, min: 2000, max: 2100 })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Display Order</label>
                <input type="number" {...regCommittee('displayOrder')} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Title</label>
              <input {...regCommittee('title')} placeholder={`Executive Committee ${watchCommittee('committeeYear')}`} className={inputClass} />
              <p className="text-xs text-muted mt-1">Leave blank to auto-generate from year</p>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea {...regCommittee('description')} rows={3} className={inputClass} placeholder="Brief description of this committee..." />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...regCommittee('isPublished')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-muted">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...regCommittee('isCurrent')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-muted">Current Committee</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors font-bold disabled:opacity-50">
                {saving ? 'Saving...' : editingCommitteeId ? 'Update Committee' : 'Create Committee'}
              </button>
              <button type="button" onClick={() => setView('list')} className="px-6 py-3 border border-border text-muted rounded-lg hover:bg-background/5 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── MEMBER LIST VIEW ─────────────────────────────────────
  if (view === 'member-list' && currentCommittee) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="text-muted hover:text-foreground transition-colors">&larr;</button>
            <div>
              <h1 className="text-3xl font-black text-foreground">Members — {currentCommittee.committeeYear}</h1>
              <p className="text-muted text-sm">{workingMembers.length} members</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onAddMember} className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-sm font-bold">
              + Add Member
            </button>
            <button onClick={onSaveMembers} disabled={saving} className="px-4 py-2 bg-green-600 text-foreground rounded-lg hover:bg-green-700 transition-colors text-sm font-bold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>

        {workingMembers.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted">No members yet. Add your first member above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workingMembers.map((m, index) => (
              <div key={m._id || index} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all group">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-input-bg overflow-hidden flex-shrink-0">
                  {m.profilePhoto?.url ? (
                    <img src={m.profilePhoto.url} alt={m.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted font-bold">{m.fullName.charAt(0)}</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground font-bold truncate">{m.fullName}</h3>
                    {m.featured && <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded font-bold">Featured</span>}
                    {!m.isVisible && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded font-bold">Hidden</span>}
                  </div>
                  <p className="text-primary text-xs font-bold">{m.designation || 'No designation'}</p>
                  <div className="flex items-center gap-3 text-muted text-xs mt-0.5">
                    {m.department && <span>{m.department}</span>}
                    {m.session && <span>· {m.session}</span>}
                  </div>
                </div>

                {/* Order Controls */}
                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button onClick={() => moveMember(index, 'up')} className="p-1 text-muted hover:text-foreground text-xs" title="Move up">▲</button>
                  )}
                  {index < workingMembers.length - 1 && (
                    <button onClick={() => moveMember(index, 'down')} className="p-1 text-muted hover:text-foreground text-xs" title="Move down">▼</button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditMember(index)} className="px-2 py-1 bg-blue-600 text-foreground text-xs rounded hover:bg-blue-700">Edit</button>
                  <button onClick={() => onRemoveMember(index)} className="px-2 py-1 bg-red-600 text-foreground text-xs rounded hover:bg-red-700">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── MEMBER FORM VIEW ─────────────────────────────────────
  if (view === 'member-form') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('member-list')} className="text-muted hover:text-foreground transition-colors">&larr;</button>
          <h1 className="text-3xl font-black text-foreground">{editingMemberIndex !== null ? 'Edit Member' : 'Add Member'}</h1>
        </div>

        <form onSubmit={handleSubmitMember(onSubmitMember)} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <input {...regMember('fullName', { required: 'Name is required' })} className={inputClass} placeholder="John Doe" />
              </div>
              <div>
                <label className={labelClass}>Designation</label>
                <select {...regMember('designation')} className={inputClass}>
                  <option value="">Select designation</option>
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="custom">Custom (type below)</option>
                </select>
                {watchMember('designation') === 'custom' && (
                  <input {...regMember('designation')} className={`${inputClass} mt-2`} placeholder="Enter custom designation" />
                )}
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input {...regMember('department')} className={inputClass} placeholder="Computer Science" />
              </div>
              <div>
                <label className={labelClass}>Session</label>
                <input {...regMember('session')} className={inputClass} placeholder="2024-25" />
              </div>
              <div>
                <label className={labelClass}>Student ID</label>
                <input {...regMember('studentId')} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Display Order</label>
                <input type="number" {...regMember('displayOrder')} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...regMember('featured')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-muted">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...regMember('isVisible')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-muted">Visible on Public Site</span>
              </label>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Profile Photo</label>
                <ImageUpload onUpload={(url) => setProfilePhotoUrl(url)} folder="executive-committee/profile" />
                {profilePhotoUrl && <img src={profilePhotoUrl} alt="Profile" className="mt-2 w-20 h-20 rounded-full object-cover" />}
              </div>
              <div>
                <label className={labelClass}>Cover Photo</label>
                <ImageUpload onUpload={(url) => setCoverPhotoUrl(url)} folder="executive-committee/cover" />
                {coverPhotoUrl && <img src={coverPhotoUrl} alt="Cover" className="mt-2 w-full h-24 rounded-lg object-cover" />}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" {...regMember('email')} className={inputClass} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input {...regMember('phone')} className={inputClass} placeholder="+880..." />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['facebook', 'linkedin', 'github', 'portfolio', 'website'] as const).map(platform => (
                <div key={platform}>
                  <label className={labelClass}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                  <input value={socialLinks[platform]} onChange={(e) => setSocialLinks({ ...socialLinks, [platform]: e.target.value })} className={inputClass} placeholder={`https://${platform}.com/...`} />
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Biography</h2>
            <div>
              <label className={labelClass}>Short Bio</label>
              <textarea {...regMember('shortBio')} rows={2} className={inputClass} placeholder="Brief bio (max 500 chars)" maxLength={500} />
            </div>
            <div>
              <label className={labelClass}>Full Biography</label>
              <RichTextEditor value={watchMember('fullBiography')} onChange={(val) => setMemberValue('fullBiography', val)} />
            </div>
            <div>
              <label className={labelClass}>Message from Member</label>
              <textarea {...regMember('messageFromMember')} rows={3} className={inputClass} placeholder="Personal message or quote..." />
            </div>
          </div>

          {/* Responsibilities & Achievements */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Responsibilities & Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Responsibilities (one per line)</label>
                <textarea {...regMember('responsibilities')} rows={5} className={inputClass} placeholder="Lead weekly meetings&#10;Coordinate with faculty&#11;Organize events" />
              </div>
              <div>
                <label className={labelClass}>Achievements (one per line)</label>
                <textarea {...regMember('achievements')} rows={5} className={inputClass} placeholder="Won national robotics competition&#10;Published 3 research papers" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-3 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors font-bold">
              {editingMemberIndex !== null ? 'Update Member' : 'Add Member'}
            </button>
            <button type="button" onClick={() => setView('member-list')} className="px-6 py-3 border border-border text-muted rounded-lg hover:bg-background/5 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}

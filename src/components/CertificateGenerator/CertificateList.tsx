'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CertificateData } from './CertificateGenerator';

const TYPE_BADGES: Record<string, string> = {
  membership: 'bg-blue-500/10 text-blue-400',
  participation: 'bg-green-500/10 text-green-400',
  achievement: 'bg-yellow-500/10 text-yellow-400',
  appreciation: 'bg-purple-500/10 text-purple-400',
  completion: 'bg-cyan-500/10 text-cyan-400',
};

interface CertificateListProps {
  onEdit: (cert: CertificateData) => void;
  refreshKey?: number;
}

export default function CertificateList({ onEdit, refreshKey }: CertificateListProps) {
  const [certs, setCerts] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCerts();
  }, [refreshKey]);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCerts(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Certificate deleted');
        fetchCerts();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-white/5 rounded-lg" />
        ))}
      </div>
    );
  }

  if (certs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">📜</p>
        <p className="text-muted font-medium">No certificates found</p>
        <p className="text-muted text-sm mt-1">Create your first certificate in the Create tab.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-background/5">
          <tr>
            <th className="px-6 py-4 text-left text-xs text-muted">Cert No.</th>
            <th className="px-6 py-4 text-left text-xs text-muted">Recipient</th>
            <th className="px-6 py-4 text-left text-xs text-muted">Type</th>
            <th className="px-6 py-4 text-left text-xs text-muted">Student ID</th>
            <th className="px-6 py-4 text-left text-xs text-muted">Session</th>
            <th className="px-6 py-4 text-left text-xs text-muted">Date Issued</th>
            <th className="px-6 py-4 text-right text-xs text-muted">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {certs.map((cert) => (
            <tr key={cert._id} className="hover:bg-background/5 transition-colors">
              <td className="px-6 py-4 text-foreground font-medium text-sm">{cert.certNumber}</td>
              <td className="px-6 py-4 text-foreground text-sm">{cert.recipientName}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${TYPE_BADGES[cert.certType] || 'bg-white/10 text-muted'}`}>
                  {cert.certType}
                </span>
              </td>
              <td className="px-6 py-4 text-muted text-sm">{cert.studentId || '—'}</td>
              <td className="px-6 py-4 text-muted text-sm">{cert.session || '—'}</td>
              <td className="px-6 py-4 text-muted text-sm">
                {cert.dateIssued ? new Date(cert.dateIssued).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button
                  onClick={() => onEdit(cert)}
                  className="px-2 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cert._id!)}
                  className="px-2 py-1 text-[10px] font-bold bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

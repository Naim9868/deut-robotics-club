'use client';

import { useState } from 'react';
import CertificateGenerator, { CertificateData } from '@/components/CertificateGenerator/CertificateGenerator';
import CertificateList from '@/components/CertificateGenerator/CertificateList';

export default function AdminCertificatesPage() {
  const [tab, setTab] = useState<'create' | 'manage'>('create');
  const [editData, setEditData] = useState<CertificateData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEdit(cert: CertificateData) {
    setEditData(cert);
    setTab('create');
  }

  function handleSaved() {
    setEditData(null);
    setRefreshKey((k) => k + 1);
  }

  function handleCreateNew() {
    setEditData(null);
    setTab('create');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-black text-foreground">Certificates</h1>
        <div className="flex bg-card border border-border rounded-lg overflow-hidden text-sm">
          <button
            onClick={handleCreateNew}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === 'create'
                ? 'bg-primary text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => { setEditData(null); setTab('manage'); }}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === 'manage'
                ? 'bg-primary text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Manage
          </button>
        </div>
      </div>

      {tab === 'create' ? (
        <CertificateGenerator editData={editData} onSaved={handleSaved} />
      ) : (
        <CertificateList onEdit={handleEdit} refreshKey={refreshKey} />
      )}
    </div>
  );
}

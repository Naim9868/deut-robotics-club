'use client';

import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import { Space_Grotesk, Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import toast from 'react-hot-toast';
import styles from './CertificateGenerator.module.css';

const LOGO_DRC = '/certificates/drc-logo.png';
const LOGO_DUET = '/certificates/duet-logo.png';

function svgToPngDataUrl(svgString: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 128, 128);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
  });
}

const SEAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="29" fill="none" stroke="#F97336" stroke-width="2"/>
  <circle cx="32" cy="32" r="23" fill="none" stroke="#12110F" stroke-width="1" stroke-dasharray="2 3"/>
  <text x="32" y="29" text-anchor="middle" font-family="monospace" font-size="9" fill="#12110F" font-weight="500">DRC</text>
  <text x="32" y="40" text-anchor="middle" font-family="monospace" font-size="6" fill="#110f0b">VERIFIED</text>
</svg>`;

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'] });
const fraunces = Fraunces({ subsets: ['latin'], style: ['italic'], weight: ['500', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'] });

type CertType = 'Membership' | 'Participation' | 'Achievement' | 'Appreciation' | 'Completion';

export interface CertificateData {
  _id?: string;
  certType: string;
  recipientName: string;
  studentId: string;
  session: string;
  roleEvent: string;
  citation: string;
  certNumber: string;
  dateIssued: string;
  presidentName: string;
  directorName: string;
}

const TYPE_COPY: Record<CertType, { sub: string; sentence: (role: string, session: string) => string }> = {
  Membership: {
    sub: 'of Membership',
    sentence: (role, session) =>
      `in recognition of dedicated service and valuable contribution as <b>${role}</b> of DUET Robotics Club during the <b>${session}</b> session.`,
  },
  Participation: {
    sub: 'of Participation',
    sentence: (role, session) =>
      `for active participation in <b>${role}</b>, organized by DUET Robotics Club during the <b>${session}</b> session.`,
  },
  Achievement: {
    sub: 'of Achievement',
    sentence: (role) => `for outstanding achievement in <b>${role}</b>, presented by DUET Robotics Club.`,
  },
  Appreciation: {
    sub: 'of Appreciation',
    sentence: (role) => `in appreciation of valuable contribution to <b>${role}</b>, DUET Robotics Club.`,
  },
  Completion: {
    sub: 'of Completion',
    sentence: (role, session) =>
      `for successfully completing <b>${role}</b>, conducted by DUET Robotics Club during the <b>${session}</b> session.`,
  },
};

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface CertificateGeneratorProps {
  editData?: CertificateData | null;
  onSaved?: (cert: CertificateData) => void;
}

export default function CertificateGenerator({ editData, onSaved }: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [sealSrc, setSealSrc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    svgToPngDataUrl(SEAL_SVG).then(setSealSrc);
  }, []);

  const [certType, setCertType] = useState<CertType>('Membership');
  const [recipientName, setRecipientName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [session, setSession] = useState('');
  const [roleEvent, setRoleEvent] = useState('');
  const [citation, setCitation] = useState('');
  const [certNo, setCertNo] = useState('');
  const [dateIssued, setDateIssued] = useState(() => new Date().toISOString().slice(0, 10));
  const [presidentName, setPresidentName] = useState('');
  const [directorName, setDirectorName] = useState('');

  useEffect(() => {
    if (editData) {
      const type = (editData.certType.charAt(0).toUpperCase() + editData.certType.slice(1)) as CertType;
      setCertType(type);
      setRecipientName(editData.recipientName || '');
      setStudentId(editData.studentId || '');
      setSession(editData.session || '');
      setRoleEvent(editData.roleEvent || '');
      setCitation(editData.citation || '');
      setCertNo(editData.certNumber || '');
      setDateIssued(editData.dateIssued ? editData.dateIssued.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setPresidentName(editData.presidentName || '');
      setDirectorName(editData.directorName || '');
    }
  }, [editData]);

  function regenerateCitation(type: CertType = certType) {
    setCitation(TYPE_COPY[type].sentence(roleEvent || 'Member', session || '2024–25'));
  }

  function handleTypeChange(type: CertType) {
    setCertType(type);
    setCitation(TYPE_COPY[type].sentence(roleEvent || 'Member', session || '2024–25'));
  }

  async function saveCertificate(): Promise<CertificateData | null> {
    const payload = {
      certType: certType.toLowerCase(),
      recipientName,
      studentId,
      session,
      roleEvent,
      citation,
      certNumber: certNo || undefined,
      dateIssued,
      presidentName,
      directorName,
    };

    const url = editData?._id ? `/api/certificates/${editData._id}` : '/api/certificates';
    const method = editData?._id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save certificate');
    }

    return res.json();
  }

  async function handleDownloadPng() {
    if (!certRef.current) return;

    setSaving(true);
    try {
      const saved = await saveCertificate();
      if (saved) {
        if (saved.certNumber && !certNo) {
          setCertNo(saved.certNumber);
        }
        toast.success(editData ? 'Certificate updated & downloaded' : 'Certificate saved & downloaded');
        onSaved?.(saved);
      }

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certRef.current, { scale: 3, backgroundColor: '#FAF7F1' });
      const link = document.createElement('a');
      link.download = `${saved?.certNumber || certNo || 'certificate'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save certificate');
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const dateStr = formatDate(dateIssued);

  return (
    <div className={`${styles.wrap} ${inter.className}`}>
      {/* ============ CONTROL PANEL ============ */}
      <div className={styles.panel}>
        <h2 className={spaceGrotesk.className}>
          {editData ? 'Edit Certificate' : 'DUET Robotics Club'}
        </h2>
        <p className={styles.panelSub}>
          {editData
            ? 'Editing existing certificate. Changes will be saved on download.'
            : 'Fill in the details below — the preview updates live. Downloading saves to database automatically.'}
        </p>

        <div className={styles.field}>
          <label>Certificate type</label>
          <select
            className={styles.select}
            value={certType}
            onChange={(e) => handleTypeChange(e.target.value as CertType)}
          >
            {Object.keys(TYPE_COPY).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Recipient name</label>
          <input
            className={styles.input}
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Full name"
          />
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Student ID</label>
            <input className={styles.input} value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 1804001" />
          </div>
          <div className={styles.field}>
            <label>Session</label>
            <input className={styles.input} value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. 2024–25" />
          </div>
        </div>

        <div className={styles.field}>
          <label>Role / event name</label>
          <input
            className={styles.input}
            value={roleEvent}
            onChange={(e) => setRoleEvent(e.target.value)}
            placeholder="e.g. Vice-President, or event name"
          />
        </div>

        <div className={styles.field}>
          <label>Citation text</label>
          <textarea className={styles.textarea} value={citation} onChange={(e) => setCitation(e.target.value)} />
          <div className={styles.hint}>Edit freely, or change the fields above and hit Regenerate. Supports &lt;b&gt; tags for bold.</div>
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnGen} ${spaceGrotesk.className}`} onClick={() => regenerateCitation()}>
          ↻ Regenerate citation
        </button>

        <div className={styles.dividerLine} />

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Certificate no. (auto-generated if blank)</label>
            <input className={styles.input} value={certNo} onChange={(e) => setCertNo(e.target.value)} placeholder="Leave blank for auto" />
          </div>
          <div className={styles.field}>
            <label>Date issued</label>
            <input className={styles.input} type="date" value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} />
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>President name</label>
            <input className={styles.input} value={presidentName} onChange={(e) => setPresidentName(e.target.value)} placeholder="leave blank for wet signature" />
          </div>
          <div className={styles.field}>
            <label>Director name</label>
            <input className={styles.input} value={directorName} onChange={(e) => setDirectorName(e.target.value)} placeholder="leave blank for wet signature" />
          </div>
        </div>

        <div className={styles.dividerLine} />
        <button type="button" className={`${styles.btn} ${styles.btnPng} ${spaceGrotesk.className}`} onClick={handleDownloadPng} disabled={saving}>
          {saving ? 'Saving...' : editData ? '⬆ Update & Download PNG' : '⬇ Download as PNG'}
        </button>
        <button type="button" className={`${styles.btn} ${styles.btnPrint} ${spaceGrotesk.className}`} onClick={handlePrint}>
          🖨 Print / Save as PDF
        </button>
      </div>

      {/* ============ PREVIEW STAGE ============ */}
      <div className={styles.stage}>
        <div className={styles.cert} ref={certRef}>
          <div className={`${styles.rulerbar} ${styles.rulerbarTop}`}><div className={styles.ticks} /></div>
          <div className={styles.rail} />
          <div className={`${styles.railLabel} ${plexMono.className}`}>DUET ROBOTICS CLUB · EST-2014. GAZIPUR</div>
          <div className={styles.watermark}>
            <NextImage src={LOGO_DUET} alt="" width={420} height={420} unoptimized />
          </div>

          <div className={styles.content}>
            <div className={styles.hdr}>
              <div className={`${styles.certMeta} ${plexMono.className}`}>
                Certificate No. <b>{certNo || '—'}</b><br />
                Issued <b>{dateStr}</b>
              </div>
              <div className={styles.logoBox}>
                <NextImage src={LOGO_DRC} alt="DUET Robotics Club" width={140} height={103} unoptimized />
              </div>
            </div>

            <div className={styles.titleBlock}>
              <div className={styles.kicker}>DUET Robotics Club</div>
              <div className={`${styles.bigTitle} ${spaceGrotesk.className}`}>CERTIFICATE</div>
              <div className={`${styles.subTitle} ${spaceGrotesk.className}`}>{TYPE_COPY[certType].sub}</div>
              <div className={styles.titleRule} />
            </div>

            <div className={styles.presentedTo}>is proudly presented to</div>
            <div className={styles.nameWrap}>
              <div className={`${styles.recipientNameDisplay} ${fraunces.className}`}>{recipientName || 'Recipient Name'}</div>
              <div className={styles.nameRule} />
              {studentId && (
                <div className={`${styles.studentIdLine} ${plexMono.className}`}>STUDENT ID · {studentId}</div>
              )}
            </div>

            <div className={styles.citationWrap}>
              <div className={styles.citation} dangerouslySetInnerHTML={{ __html: citation }} />
            </div>

            <div className={styles.dataStrip}>
              <div className={styles.dataCell}>
                <div className={`${styles.dataLbl} ${plexMono.className}`}>Certificate No.</div>
                <div className={`${styles.dataVal} ${plexMono.className}`}>{certNo || '—'}</div>
              </div>
              <div className={styles.dataCell}>
                <div className={`${styles.dataLbl} ${plexMono.className}`}>Session</div>
                <div className={`${styles.dataVal} ${plexMono.className}`}>{session || '—'}</div>
              </div>
              <div className={styles.dataCell}>
                <div className={`${styles.dataLbl} ${plexMono.className}`}>Date Issued</div>
                <div className={`${styles.dataVal} ${plexMono.className}`}>{dateStr}</div>
              </div>
            </div>

            <div className={styles.sigRow}>
              <div className={styles.sig}>
                <div className={styles.sigline} />
                <div className={`${styles.signame} ${fraunces.className}`}>{presidentName}</div>
                <div className={styles.sigrole}>President</div>
                <div className={`${styles.sigorg} ${plexMono.className}`}>DUET Robotics Club</div>
              </div>
              {sealSrc && <img className={styles.seal} src={sealSrc} alt="DRC Verified Seal" />}
              <div className={styles.sig}>
                <div className={styles.sigline} />
                <div className={`${styles.signame} ${fraunces.className}`}>{directorName}</div>
                <div className={styles.sigrole}>Director, Students&apos; Welfare</div>
                <div className={`${styles.sigorg} ${plexMono.className}`}>DUET, Gazipur</div>
              </div>
            </div>
          </div>

          <div className={`${styles.rulerbar} ${styles.rulerbarBottom}`}><div className={styles.ticks} /></div>
        </div>
      </div>
    </div>
  );
}

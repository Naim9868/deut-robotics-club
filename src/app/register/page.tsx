'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

interface RegistrationSettings {
  registrationOpen: boolean;
  registrationFee: number;
  paymentMethods: { name: string; details: string }[];
  instructions: string;
}

interface FormData {
  personal: {
    fullName: string;
    profilePhotoUrl: string;
    profilePhotoType: 'cloudinary' | 'link';
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
    screenshotUrl: string;
    screenshotType: 'cloudinary' | 'link';
  };
  additional: {
    skills: string[];
    interests: string[];
    previousExperience: string;
    motivation: string;
  };
}

const INITIAL_FORM: FormData = {
  personal: { fullName: '', profilePhotoUrl: '', profilePhotoType: 'cloudinary', gender: '', dateOfBirth: '', bloodGroup: '' },
  university: { studentId: '', registrationNumber: '', department: '', session: '', semester: '' },
  contact: { email: '', phone: '', whatsappNumber: '', emergencyContact: '', address: '' },
  payment: { method: '', transactionId: '', senderNumber: '', amount: 0, screenshotUrl: '', screenshotType: 'cloudinary' },
  additional: { skills: [], interests: [], previousExperience: '', motivation: '' },
};

const STEPS = ['Personal', 'University', 'Contact', 'Payment', 'Additional', 'Review'];

const SKILL_OPTIONS = ['Arduino', 'Raspberry Pi', 'Python', 'C/C++', 'JavaScript', '3D Modeling', 'PCB Design', 'Mechanical Design', 'AI/ML', 'Web Development', 'Mobile Development', 'IoT'];
const INTEREST_OPTIONS = ['Robotics', 'AI', 'IoT', 'Embedded Systems', 'Computer Vision', 'NLP', 'Drone Tech', 'Automation', 'Hardware', 'Software', 'Research', 'Competition'];

export default function RegisterPage() {
  const [settings, setSettings] = useState<RegistrationSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'link'>('upload');
  const [screenshotInputMode, setScreenshotInputMode] = useState<'upload' | 'link'>('upload');
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/registration');
        if (res.ok) setSettings(await res.json());
      } catch { /* fail silently */ }
      finally { setSettingsLoading(false); }
    };
    fetchSettings();
  }, []);

  const updateForm = (section: keyof FormData, field: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, unknown>), [field]: value },
    }));
  };

  const uploadFile = async (file: File, folder: string): Promise<{ url: string; publicId: string } | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } catch {
      toast.error('File upload failed');
      return null;
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhotoFile(file);
    setUploading(true);
    const result = await uploadFile(file, 'drc/registration/photos');
    if (result) {
      updateForm('personal', 'profilePhotoUrl', result.url);
      updateForm('personal', 'profilePhotoType', 'cloudinary');
      toast.success('Photo uploaded');
    }
    setUploading(false);
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    setUploading(true);
    const result = await uploadFile(file, 'drc/registration/payments');
    if (result) {
      updateForm('payment', 'screenshotUrl', result.url);
      updateForm('payment', 'screenshotType', 'cloudinary');
      toast.success('Screenshot uploaded');
    }
    setUploading(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !form.additional.skills.includes(skill)) {
      updateForm('additional', 'skills', [...form.additional.skills, skill]);
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    updateForm('additional', 'skills', form.additional.skills.filter((s) => s !== skill));
  };

  const addInterest = (interest: string) => {
    if (interest && !form.additional.interests.includes(interest)) {
      updateForm('additional', 'interests', [...form.additional.interests, interest]);
    }
    setNewInterest('');
  };

  const removeInterest = (interest: string) => {
    updateForm('additional', 'interests', form.additional.interests.filter((i) => i !== interest));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        personal: {
          fullName: form.personal.fullName,
          profilePhoto: {
            url: form.personal.profilePhotoUrl || '',
            type: form.personal.profilePhotoType,
          },
          gender: form.personal.gender,
          dateOfBirth: form.personal.dateOfBirth,
          bloodGroup: form.personal.bloodGroup,
        },
        university: form.university,
        contact: form.contact,
        payment: {
          method: form.payment.method,
          transactionId: form.payment.transactionId,
          senderNumber: form.payment.senderNumber,
          amount: form.payment.amount,
          screenshot: {
            url: form.payment.screenshotUrl || '',
            type: form.payment.screenshotType,
          },
        },
        additional: form.additional,
      };

      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        // Build detailed error message from fieldErrors or details
        const fieldErrors = data.fieldErrors || data.details || {};
        const fieldCount = Object.keys(fieldErrors).length;
        if (fieldCount > 0) {
          const fieldList = Object.entries(fieldErrors)
            .map(([field, msg]) => `${field.split('.').pop()}: ${msg}`)
            .join('\n');
          toast.error(`${data.error || 'Validation failed'} (${fieldCount} field${fieldCount > 1 ? 's' : ''}):\n${fieldList}`, { duration: 6000 });
        } else {
          toast.error(data.error || data.message || 'Submission failed');
        }
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
      toast.success('Registration submitted successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!form.personal.fullName.trim()) { toast.error('Full name is required'); return false; }
        if (!form.personal.gender) { toast.error('Gender is required'); return false; }
        if (!form.personal.dateOfBirth) { toast.error('Date of birth is required'); return false; }
        return true;
      case 1:
        if (!form.university.studentId.trim()) { toast.error('Student ID is required'); return false; }
        if (!form.university.department.trim()) { toast.error('Department is required'); return false; }
        if (!form.university.session.trim()) { toast.error('Session is required'); return false; }
        if (!form.university.semester.trim()) { toast.error('Semester is required'); return false; }
        return true;
      case 2:
        if (!form.contact.email.trim()) { toast.error('Email is required'); return false; }
        if (!form.contact.phone.trim()) { toast.error('Phone is required'); return false; }
        if (!form.contact.emergencyContact.trim()) { toast.error('Emergency contact is required'); return false; }
        if (!form.contact.address.trim()) { toast.error('Address is required'); return false; }
        return true;
      case 3:
        if (!form.payment.method) { toast.error('Payment method is required'); return false; }
        if (!form.payment.transactionId.trim()) { toast.error('Transaction ID is required'); return false; }
        if (!form.payment.senderNumber.trim()) { toast.error('Sender number is required'); return false; }
        return true;
      case 4:
        if (!form.additional.motivation.trim()) { toast.error('Motivation is required'); return false; }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // ─── Loading State ──────────────────────────────────────
  if (settingsLoading) {
    return (
      <>
        <Navbar activeSection="" />
        <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── Registration Closed ────────────────────────────────
  if (!settings?.registrationOpen) {
    return (
      <>
        <Navbar activeSection="" />
        <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔒</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Registration Closed</h1>
            <p className="text-gray-400 mb-6">
              Member registration is currently closed. Please check back later or follow our social media for updates.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── Submitted State ────────────────────────────────────
  if (submitted) {
    return (
      <>
        <Navbar activeSection="" />
        <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Application Submitted!</h1>
            <p className="text-gray-400 mb-6">
              Your registration application has been submitted successfully. Our team will review your application and verify your payment. You will be notified once your application is approved.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── Registration Form ──────────────────────────────────
  const inputClass = "w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600";
  const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <>
      <Navbar activeSection="" />
      <div className="min-h-screen bg-[#050505] pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2">Join DRC</h1>
            <p className="text-gray-400">DUET Robotics Club Member Registration</p>
            {settings.registrationFee > 0 && (
              <p className="text-primary text-sm mt-2 font-bold">Registration Fee: ৳{settings.registrationFee}</p>
            )}
          </div>

          {/* Instructions */}
          {settings.instructions && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-400 whitespace-pre-wrap">{settings.instructions}</p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-xs font-medium hidden md:inline ${index === currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {step}
                </span>
                {index < STEPS.length - 1 && <div className="w-8 h-px bg-white/10 mx-2" />}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 md:p-8">
            {/* Step 0: Personal */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white mb-4">Personal Information</h2>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" value={form.personal.fullName} onChange={(e) => updateForm('personal', 'fullName', e.target.value)} className={inputClass} placeholder="Enter your full name" />
                </div>
                <div>
                  <label className={labelClass}>Profile Photo</label>
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => setPhotoInputMode('upload')} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${photoInputMode === 'upload' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>Upload</button>
                    <button type="button" onClick={() => setPhotoInputMode('link')} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${photoInputMode === 'link' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>Google Drive Link</button>
                  </div>
                  {photoInputMode === 'upload' ? (
                    <input key="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className={inputClass} />
                  ) : (
                    <input key="photo-link" type="url" value={form.personal.profilePhotoUrl} onChange={(e) => { updateForm('personal', 'profilePhotoUrl', e.target.value); updateForm('personal', 'profilePhotoType', 'link'); }} className={inputClass} placeholder="Paste Google Drive link" />
                  )}
                  {form.personal.profilePhotoUrl && <img src={form.personal.profilePhotoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2" />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select value={form.personal.gender} onChange={(e) => updateForm('personal', 'gender', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input type="date" value={form.personal.dateOfBirth} onChange={(e) => updateForm('personal', 'dateOfBirth', e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Blood Group</label>
                  <select value={form.personal.bloodGroup} onChange={(e) => updateForm('personal', 'bloodGroup', e.target.value)} className={inputClass}>
                    <option value="">Select (Optional)</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 1: University */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white mb-4">University Information</h2>
                <div>
                  <label className={labelClass}>Student ID *</label>
                  <input type="text" value={form.university.studentId} onChange={(e) => updateForm('university', 'studentId', e.target.value)} className={inputClass} placeholder="Your student ID" />
                </div>
                <div>
                  <label className={labelClass}>Registration Number</label>
                  <input type="text" value={form.university.registrationNumber} onChange={(e) => updateForm('university', 'registrationNumber', e.target.value)} className={inputClass} placeholder="Optional" />
                </div>
                <div>
                  <label className={labelClass}>Department *</label>
                  <input type="text" value={form.university.department} onChange={(e) => updateForm('university', 'department', e.target.value)} className={inputClass} placeholder="e.g., CSE, EEE, ME" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Session *</label>
                    <input type="text" value={form.university.session} onChange={(e) => updateForm('university', 'session', e.target.value)} className={inputClass} placeholder="e.g., 2022-23" />
                  </div>
                  <div>
                    <label className={labelClass}>Semester *</label>
                    <input type="text" value={form.university.semester} onChange={(e) => updateForm('university', 'semester', e.target.value)} className={inputClass} placeholder="e.g., 4th" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white mb-4">Contact Information</h2>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.contact.email} onChange={(e) => updateForm('contact', 'email', e.target.value)} className={inputClass} placeholder="your@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input type="tel" value={form.contact.phone} onChange={(e) => updateForm('contact', 'phone', e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp</label>
                    <input type="tel" value={form.contact.whatsappNumber} onChange={(e) => updateForm('contact', 'whatsappNumber', e.target.value)} className={inputClass} placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Emergency Contact *</label>
                  <input type="text" value={form.contact.emergencyContact} onChange={(e) => updateForm('contact', 'emergencyContact', e.target.value)} className={inputClass} placeholder="Name & Phone" />
                </div>
                <div>
                  <label className={labelClass}>Address *</label>
                  <textarea value={form.contact.address} onChange={(e) => updateForm('contact', 'address', e.target.value)} rows={3} className={inputClass} placeholder="Your full address" />
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white mb-4">Payment Information</h2>
                <p className="text-sm text-gray-400 mb-2">Registration Fee: <span className="text-primary font-bold">৳{settings.registrationFee}</span></p>
                <div>
                  <label className={labelClass}>Payment Method *</label>
                  <select value={form.payment.method} onChange={(e) => {
                    updateForm('payment', 'method', e.target.value);
                    const method = settings.paymentMethods.find((m) => m.name === e.target.value);
                    if (method) updateForm('payment', 'amount', settings.registrationFee);
                  }} className={inputClass}>
                    <option value="">Select method</option>
                    {settings.paymentMethods.map((m) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  {form.payment.method && (
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.paymentMethods.find((m) => m.name === form.payment.method)?.details}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Transaction ID *</label>
                  <input type="text" value={form.payment.transactionId} onChange={(e) => updateForm('payment', 'transactionId', e.target.value)} className={inputClass} placeholder="Transaction ID from payment" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Sender Number *</label>
                    <input type="tel" value={form.payment.senderNumber} onChange={(e) => updateForm('payment', 'senderNumber', e.target.value)} className={inputClass} placeholder="Number used for payment" />
                  </div>
                  <div>
                    <label className={labelClass}>Amount (BDT)</label>
                    <input type="number" value={form.payment.amount} onChange={(e) => updateForm('payment', 'amount', Number(e.target.value))} className={inputClass} min={0} readOnly />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Payment Screenshot</label>
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => setScreenshotInputMode('upload')} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${screenshotInputMode === 'upload' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>Upload</button>
                    <button type="button" onClick={() => setScreenshotInputMode('link')} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${screenshotInputMode === 'link' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>Link</button>
                  </div>
                  {screenshotInputMode === 'upload' ? (
                    <input key="screenshot-upload" type="file" accept="image/*" onChange={handleScreenshotUpload} className={inputClass} />
                  ) : (
                    <input key="screenshot-link" type="url" value={form.payment.screenshotUrl} onChange={(e) => { updateForm('payment', 'screenshotUrl', e.target.value); updateForm('payment', 'screenshotType', 'link'); }} className={inputClass} placeholder="Paste screenshot link" />
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Additional */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white mb-4">Additional Information</h2>
                <div>
                  <label className={labelClass}>Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => form.additional.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                          form.additional.skills.includes(skill)
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className={inputClass} placeholder="Add custom skill" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))} />
                    <button type="button" onClick={() => addSkill(newSkill)} className="px-4 py-2 text-sm font-bold bg-white/5 text-gray-400 rounded-lg hover:bg-white/10">Add</button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Interests</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => form.additional.interests.includes(interest) ? removeInterest(interest) : addInterest(interest)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                          form.additional.interests.includes(interest)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} className={inputClass} placeholder="Add custom interest" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(newInterest))} />
                    <button type="button" onClick={() => addInterest(newInterest)} className="px-4 py-2 text-sm font-bold bg-white/5 text-gray-400 rounded-lg hover:bg-white/10">Add</button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Previous Robotics Experience</label>
                  <textarea value={form.additional.previousExperience} onChange={(e) => updateForm('additional', 'previousExperience', e.target.value)} rows={3} className={inputClass} placeholder="Describe any previous experience..." />
                </div>
                <div>
                  <label className={labelClass}>Motivation for Joining *</label>
                  <textarea value={form.additional.motivation} onChange={(e) => updateForm('additional', 'motivation', e.target.value)} rows={4} className={inputClass} placeholder="Why do you want to join DRC?" />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-white mb-4">Review Your Application</h2>

                <ReviewSection title="Personal Information">
                  <ReviewItem label="Name" value={form.personal.fullName} />
                  <ReviewItem label="Gender" value={form.personal.gender} />
                  <ReviewItem label="DOB" value={form.personal.dateOfBirth} />
                  <ReviewItem label="Blood Group" value={form.personal.bloodGroup || 'N/A'} />
                </ReviewSection>

                <ReviewSection title="University Information">
                  <ReviewItem label="Student ID" value={form.university.studentId} />
                  <ReviewItem label="Department" value={form.university.department} />
                  <ReviewItem label="Session" value={form.university.session} />
                  <ReviewItem label="Semester" value={form.university.semester} />
                </ReviewSection>

                <ReviewSection title="Contact Information">
                  <ReviewItem label="Email" value={form.contact.email} />
                  <ReviewItem label="Phone" value={form.contact.phone} />
                  <ReviewItem label="WhatsApp" value={form.contact.whatsappNumber || 'N/A'} />
                  <ReviewItem label="Emergency" value={form.contact.emergencyContact} />
                  <ReviewItem label="Address" value={form.contact.address} />
                </ReviewSection>

                <ReviewSection title="Payment Information">
                  <ReviewItem label="Method" value={form.payment.method} />
                  <ReviewItem label="Transaction ID" value={form.payment.transactionId} />
                  <ReviewItem label="Sender" value={form.payment.senderNumber} />
                  <ReviewItem label="Amount" value={`৳${form.payment.amount}`} />
                </ReviewSection>

                <ReviewSection title="Additional Information">
                  <ReviewItem label="Skills" value={form.additional.skills.join(', ') || 'None'} />
                  <ReviewItem label="Interests" value={form.additional.interests.join(', ') || 'None'} />
                  <ReviewItem label="Experience" value={form.additional.previousExperience || 'None'} />
                  <ReviewItem label="Motivation" value={form.additional.motivation} />
                </ReviewSection>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-2.5 text-sm font-bold text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || uploading}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#121212] border border-white/5 rounded-lg p-4">
      <h3 className="text-sm font-black text-primary uppercase tracking-wider mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-500 uppercase">{label}</span>
      <p className="text-sm text-white mt-0.5">{value || '—'}</p>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface PaymentMethod {
  name: string;
  enabled: boolean;
  details: string;
}

interface MembershipSettings {
  _id: string;
  registrationOpen: boolean;
  registrationFee: number;
  paymentMethods: PaymentMethod[];
  registrationInstructions: string;
  maxMembers: number;
  membershipDurationMonths: number;
}

export default function MembershipSettingsPage() {
  const [settings, setSettings] = useState<MembershipSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [registrationInstructions, setRegistrationInstructions] = useState('');
  const [maxMembers, setMaxMembers] = useState(100);
  const [membershipDurationMonths, setMembershipDurationMonths] = useState(12);

  // New payment method form
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodDetails, setNewMethodDetails] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/membership-settings');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSettings(data);
      setRegistrationOpen(data.registrationOpen);
      setRegistrationFee(data.registrationFee);
      setPaymentMethods(data.paymentMethods || []);
      setRegistrationInstructions(data.registrationInstructions || '');
      setMaxMembers(data.maxMembers);
      setMembershipDurationMonths(data.membershipDurationMonths);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/membership-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationOpen,
          registrationFee,
          paymentMethods,
          registrationInstructions,
          maxMembers,
          membershipDurationMonths,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSettings(data.data);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addPaymentMethod = () => {
    if (!newMethodName.trim()) {
      toast.error('Payment method name is required');
      return;
    }
    setPaymentMethods([
      ...paymentMethods,
      { name: newMethodName.trim(), enabled: true, details: newMethodDetails.trim() },
    ]);
    setNewMethodName('');
    setNewMethodDetails('');
  };

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const togglePaymentMethod = (index: number) => {
    const updated = [...paymentMethods];
    updated[index].enabled = !updated[index].enabled;
    setPaymentMethods(updated);
  };

  const updatePaymentMethodDetails = (index: number, details: string) => {
    const updated = [...paymentMethods];
    updated[index].details = details;
    setPaymentMethods(updated);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-background/5 rounded w-1/3" />
          <div className="h-64 bg-background/5 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">Membership Settings</h1>
          <p className="text-muted text-sm mt-1">
            Configure registration and membership parameters
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-sm font-bold text-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Registration Toggle */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-foreground">Registration Status</h2>
            <p className="text-muted text-sm mt-1">
              Open or close member registration
            </p>
          </div>
          <button
            onClick={() => setRegistrationOpen(!registrationOpen)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              registrationOpen ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                registrationOpen ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
          registrationOpen
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          Registration is currently {registrationOpen ? 'OPEN' : 'CLOSED'}
        </div>
      </div>

      {/* Registration Fee & Limits */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-black text-foreground mb-4">Fee & Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              Registration Fee (BDT)
            </label>
            <input
              type="number"
              value={registrationFee}
              onChange={(e) => setRegistrationFee(Number(e.target.value))}
              min={0}
              className="w-full bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              Maximum Members
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              min={1}
              className="w-full bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              Membership Duration (Months)
            </label>
            <input
              type="number"
              value={membershipDurationMonths}
              onChange={(e) => setMembershipDurationMonths(Number(e.target.value))}
              min={1}
              className="w-full bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-black text-foreground mb-4">Payment Methods</h2>

        {/* Existing methods */}
        <div className="space-y-3 mb-4">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-input-bg border border-border rounded-lg"
            >
              <button
                onClick={() => togglePaymentMethod(index)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  method.enabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    method.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${method.enabled ? 'text-foreground' : 'text-muted'}`}>
                  {method.name}
                </p>
                <input
                  type="text"
                  value={method.details}
                  onChange={(e) => updatePaymentMethodDetails(index, e.target.value)}
                  placeholder="Payment details (e.g., account number)"
                  className="w-full bg-transparent border-none text-xs text-muted focus:outline-none mt-1 placeholder:text-muted"
                />
              </div>
              <button
                onClick={() => removePaymentMethod(index)}
                className="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add new method */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newMethodName}
            onChange={(e) => setNewMethodName(e.target.value)}
            placeholder="Method name (e.g., bKash)"
            className="flex-1 bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted"
          />
          <input
            type="text"
            value={newMethodDetails}
            onChange={(e) => setNewMethodDetails(e.target.value)}
            placeholder="Details (optional)"
            className="flex-1 bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted"
          />
          <button
            onClick={addPaymentMethod}
            className="px-4 py-2.5 text-sm font-bold text-foreground bg-primary/20 border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Registration Instructions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-black text-foreground mb-4">Registration Instructions</h2>
        <p className="text-xs text-muted mb-3">
          These instructions will be displayed to users on the registration page.
        </p>
        <textarea
          value={registrationInstructions}
          onChange={(e) => setRegistrationInstructions(e.target.value)}
          rows={6}
          placeholder="Enter registration instructions..."
          className="w-full bg-input-bg border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted resize-none"
        />
      </div>
    </div>
  );
}

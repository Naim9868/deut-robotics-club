'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface FAQForm {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm<FAQForm>({
    defaultValues: {
      question: '',
      answer: '',
      category: 'General',
      order: 0,
      isActive: true
    }
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faq');
      const data = await res.json();
      setFaqs(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FAQForm) => {
    try {
      const res = await fetch(`/api/faq${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        reset();
        setEditingId(null);
        fetchFaqs();
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq._id);
    reset(faq);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchFaqs();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">FAQ</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} FAQ</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input {...register('question')} placeholder="Question" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('category')} placeholder="Category" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
          </div>

          <textarea {...register('answer')} placeholder="Answer" rows={4} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-6 py-2 border border-white/10 text-gray-400 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={faq._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="flex-1 text-left">
                <h3 className="text-white font-bold">{faq.question}</h3>
                <p className="text-primary text-xs mt-1">{faq.category}</p>
              </button>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(faq)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => handleDelete(faq._id)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
            {openIndex === idx && (
              <div className="px-6 pb-6 pt-2 border-t border-white/5">
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
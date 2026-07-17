'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message cannot exceed 5000 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to send message');
      }

      toast.success('Message sent successfully! We\'ll get back to you soon.', {
        id: 'contact-form-success',
      });
      reset();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errMsg, { id: 'contact-form-error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div>
        <input
          type="text"
          placeholder="Name"
          {...register('name')}
          className="w-full bg-input-bg border border-border p-3 sm:p-4 rounded text-sm text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full bg-input-bg border border-border p-3 sm:p-4 rounded text-sm text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Subject"
          {...register('subject')}
          className="w-full bg-input-bg border border-border p-3 sm:p-4 rounded text-sm text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted"
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="mt-1 text-[10px] text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <textarea
          rows={3}
          placeholder="Message"
          {...register('message')}
          className="w-full bg-input-bg border border-border p-3 sm:p-4 rounded text-sm text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted resize-none"
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-[10px] text-red-500">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 sm:py-4 bg-primary text-white font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs rounded hover:bg-foreground hover:text-background transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

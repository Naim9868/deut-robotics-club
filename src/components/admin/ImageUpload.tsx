'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  defaultValue?: string;
}

export default function ImageUpload({ onUpload, onRemove, defaultValue }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultValue || '');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload', formData);
      const url = res.data.url;
      setPreview(url);
      onUpload(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-50% h-48 object-cover rounded-lg border border-white/10"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors">
              Change
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-[#121212]">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-gray-600">PNG, JPG, GIF up to 5MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
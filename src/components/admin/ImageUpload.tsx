'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (url: string, publicId?: string) => void;
  onRemove?: () => void;
  defaultValue?: string;
  folder?: string;  // Add folder prop
}

export default function ImageUpload({ 
  onUpload, 
  onRemove, 
  defaultValue, 
  folder = 'drc'  // Default folder
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultValue);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);  // Use folder prop

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onUpload(data.url, data.publicId);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (onRemove) {
      await onRemove();
      setPreview(undefined);
    }
  };

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          )}
        </div>
      )}
      
      <label className="relative cursor-pointer inline-block">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-all">
          {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
        </div>
      </label>
    </div>
  );
}
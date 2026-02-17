'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface BlogForm {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  image: { url: string; alt: string };
  readTime: number;
  tags: string[];
  featured: boolean;
  isActive: boolean;
}

export default function BlogFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogForm>({
    defaultValues: {
      featured: false,
      isActive: true,
      tags: [],
    }
  });

  const [loading, setLoading] = useState(!isNew);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [isNew]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${id}`);
      const data = await res.json();
      
      Object.keys(data).forEach(key => {
        if (key === 'image') {
          setValue('image', data.image);
        } else if (key === 'tags') {
          setTags(data.tags);
        } else if (key === 'content') {
          setContent(data.content);
        } else {
          setValue(key as any, data[key]);
        }
      });
    } catch (error) {
      toast.error('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BlogForm) => {
    try {
      data.content = content;
      data.tags = tags;

      const res = await fetch(`/api/blog${!isNew ? `/${id}` : ''}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(isNew ? 'Post created' : 'Post updated');
        router.push('/admin/blog');
      } else {
        toast.error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">
          {isNew ? 'Create New Post' : 'Edit Post'}
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-wider">
          {isNew ? 'Add a new blog post' : 'Update existing post'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Slug *
            </label>
            <input
              {...register('slug', { required: 'Slug is required' })}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              placeholder="my-awesome-post"
            />
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: true })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="Research">Research</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Technical">Technical</option>
                <option value="Hardware">Hardware</option>
                <option value="News">News</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Author *
              </label>
              <input
                {...register('author', { required: true })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Read Time (minutes)
            </label>
            <input
              type="number"
              {...register('readTime')}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
              Featured Image
            </label>
            <ImageUpload
              onUpload={(url) => setValue('image', { url, alt: watch('title') })}
              defaultValue={watch('image')?.url}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Excerpt *
            </label>
            <textarea
              {...register('excerpt', { required: true })}
              rows={3}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Content *
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your blog post..."
            />
          </div>

          {/* Status Toggles */}
          <div className="flex items-center space-x-8 pt-4 border-t border-white/5">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-4 h-4 rounded border-white/10 bg-[#121212] text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-300">Featured Post</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 rounded border-white/10 bg-[#121212] text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-3 border border-white/10 text-gray-400 font-black uppercase tracking-wider rounded-lg hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white font-black uppercase tracking-wider rounded-lg hover:bg-primary/80 transition-all"
          >
            {isNew ? 'Create Post' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
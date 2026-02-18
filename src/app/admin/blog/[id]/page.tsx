'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import axios from 'axios';

interface BlogForm {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  authorTitle: string;
  date: string;
  publishedAt: string;
  image: { 
    url: string; 
    alt: string;
    publicId?: string;
  };
  coverImage: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  isActive: boolean;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
  order: number;
}

export default function BlogFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  const contentSavedRef = useRef(true);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BlogForm>({
    defaultValues: {
      title: '',
      slug: '',
      category: 'Robotics',
      excerpt: '',
      content: '',
      author: '',
      authorImage: '',
      authorTitle: 'Member',
      date: new Date().toISOString().split('T')[0],
      publishedAt: new Date().toISOString().split('T')[0],
      image: { url: '', alt: '', publicId: '' },
      coverImage: '',
      readTime: 5,
      tags: [],
      featured: false,
      isActive: true,
      isPublished: true,
      metaTitle: '',
      metaDescription: '',
      order: 0
    }
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Featured Image states
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentImagePublicId, setCurrentImagePublicId] = useState('');
  const [useFeaturedImageLink, setUseFeaturedImageLink] = useState(false);
  
  // Author Image states
  const [currentAuthorImageUrl, setCurrentAuthorImageUrl] = useState('');
  const [currentAuthorImagePublicId, setCurrentAuthorImagePublicId] = useState('');
  const [useAuthorImageLink, setUseAuthorImageLink] = useState(false);

  // Helper to generate avatar from name (NO 404 ERRORS)
  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1e1e1e&color=e63946&size=100&bold=true&length=2`;
  };

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    } else {
      // Set default author image for new posts
      const defaultAvatar = getAvatarUrl('User');
      setValue('authorImage', defaultAvatar);
      setCurrentAuthorImageUrl(defaultAvatar);
    }
  }, [isNew]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${id}`);
      const data = await res.json();
      
      // Format dates for input fields
      if (data.date) {
        data.date = new Date(data.date).toISOString().split('T')[0];
      }
      if (data.publishedAt) {
        data.publishedAt = new Date(data.publishedAt).toISOString().split('T')[0];
      }
      
      // Set form values
      reset(data);
      setContent(data.content || '');
      setTags(data.tags || []);
      
      // Set featured image
      setCurrentImageUrl(data.image?.url || data.coverImage || '');
      setCurrentImagePublicId(data.image?.publicId || '');
      if (data.image?.url && !data.image?.publicId) {
        setUseFeaturedImageLink(true);
      }
      
      // Set author image - if none, generate from author name
      if (data.authorImage) {
        setCurrentAuthorImageUrl(data.authorImage);
        if (data.authorImage.includes('cloudinary')) {
          const publicId = extractPublicIdFromUrl(data.authorImage);
          setCurrentAuthorImagePublicId(publicId || '');
        } else if (!data.authorImage.includes('ui-avatars.com')) {
          setUseAuthorImageLink(true);
        }
      } else {
        // Generate avatar from author name
        const avatarUrl = getAvatarUrl(data.author || 'User');
        setValue('authorImage', avatarUrl);
        setCurrentAuthorImageUrl(avatarUrl);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract publicId from Cloudinary URL
  const extractPublicIdFromUrl = (url: string) => {
    try {
      const urlParts = url.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      return publicIdWithExtension.split('.')[0];
    } catch {
      return '';
    }
  };

  // Featured Image Handlers
  const handleImageUpload = async (url: string, publicId?: string) => {
    setValue('image', { 
      url, 
      alt: watch('title') || 'Blog post image',
      publicId 
    });
    setValue('coverImage', url);
    setCurrentImageUrl(url);
    setCurrentImagePublicId(publicId || '');
    setUseFeaturedImageLink(false);
  };

  const handleImageRemove = async () => {
    if (!currentImageUrl) return;
    
    try {
      if (currentImagePublicId) {
        await axios.delete('/api/upload', {
          data: { publicId: currentImagePublicId }
        });
      }
      
      setValue('image', { url: '', alt: '', publicId: '' });
      setValue('coverImage', '');
      setCurrentImageUrl('');
      setCurrentImagePublicId('');
      
      toast.success('Featured image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove featured image');
    }
  };

  const handleFeaturedImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('image', { 
      url, 
      alt: watch('title') || 'Blog post image',
      publicId: '' 
    });
    setValue('coverImage', url);
    setCurrentImageUrl(url);
    setCurrentImagePublicId('');
  };

  // Author Image Handlers
  const handleAuthorImageUpload = async (url: string, publicId?: string) => {
    setValue('authorImage', url);
    setCurrentAuthorImageUrl(url);
    setCurrentAuthorImagePublicId(publicId || '');
    setUseAuthorImageLink(false);
    toast.success('Author image uploaded');
  };

  const handleAuthorImageRemove = async () => {
    if (!currentAuthorImageUrl || currentAuthorImageUrl.includes('ui-avatars.com')) return;
    
    try {
      if (currentAuthorImagePublicId) {
        await axios.delete('/api/upload', {
          data: { publicId: currentAuthorImagePublicId }
        });
      }
      
      // Generate new avatar based on author name
      const authorName = watch('author') || 'User';
      const avatarUrl = getAvatarUrl(authorName);
      
      setValue('authorImage', avatarUrl);
      setCurrentAuthorImageUrl(avatarUrl);
      setCurrentAuthorImagePublicId('');
      
      toast.success('Author image reset to default');
    } catch (error) {
      console.error('Error removing author image:', error);
      toast.error('Failed to remove author image');
    }
  };

  const handleAuthorImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('authorImage', url);
    setCurrentAuthorImageUrl(url);
    setCurrentAuthorImagePublicId('');
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

  // Auto-generate slug from title
  const generateSlug = () => {
    const title = watch('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  };


  // Update the content state setter
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    contentSavedRef.current = false;
  }, []);


  const onSubmit = async (data: BlogForm) => {
    setSaving(true);
    try {
      // Ensure author image is set
      if (!data.authorImage || data.authorImage === '') {
        data.authorImage = getAvatarUrl(data.author || 'User');
      }

      // CRITICAL: Check if content exists
      if (!content || content.trim() === '' || content === '<p></p>') {
        toast.error('Please add content to your blog post');
        setSaving(false);
        return;
      }

      
      const postData = {
        ...data,
        content,
        tags,
        image: {
          url: currentImageUrl,
          alt: data.title,
          publicId: currentImagePublicId || undefined
        },
        coverImage: currentImageUrl,
        date: data.date ? new Date(data.date) : new Date(),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.excerpt?.substring(0, 160),
      };

      const res = await fetch(`/api/blog${!isNew ? `/${id}` : ''}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(isNew ? 'Post created successfully' : 'Post updated successfully');
        // router.push('/admin/blog');
        router.refresh();
      } else {
        console.error('Server error:', responseData);
        toast.error(responseData.error || responseData.message || 'Failed to save');

        // Show validation details if available
        if (responseData.details) {
          Object.keys(responseData.details).forEach(key => {
            toast.error(`${key}: ${responseData.details[key]}`);
          });
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  // Add warning when leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!contentSavedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            {isNew ? 'Create New Post' : 'Edit Post'}
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            {isNew ? 'Add a new blog post' : `Editing: ${watch('title') || id}`}
          </p>
        </div>
        
        {!isNew && watch('slug') && (
          <a
            href={`/blog/${watch('slug')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
          >
            <span>🔍</span> Preview
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>📝</span> Basic Information
          </h2>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                {...register('title', { required: 'Title is required' })}
                className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Enter post title"
                onBlur={generateSlug}
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                Generate Slug
              </button>
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">/blog/</span>
              <input
                {...register('slug', { required: 'Slug is required' })}
                className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="my-awesome-post"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="Robotics">Robotics</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Achievements">Achievements</option>
                <option value="Tutorials">Tutorials</option>
                <option value="Events">Events</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                {...register('readTime')}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Author Information - NO 404 ERRORS */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>👤</span> Author Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('author', { required: 'Author name is required' })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="John Doe"
                onChange={(e) => {
                  // Auto-generate avatar when name changes and no custom image
                  if (!currentAuthorImageUrl.includes('cloudinary') && !useAuthorImageLink) {
                    const avatarUrl = getAvatarUrl(e.target.value);
                    setValue('authorImage', avatarUrl);
                    setCurrentAuthorImageUrl(avatarUrl);
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Author Title
              </label>
              <input
                {...register('authorTitle')}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Lead Developer"
              />
            </div>
          </div>

          {/* Author Image Section - NO 404s */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Author Image
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUseAuthorImageLink(!useAuthorImageLink)}
                  className="text-xs text-primary hover:underline"
                >
                  {useAuthorImageLink ? 'Use Avatar Generator' : 'Use Image Link'}
                </button>
              </div>
            </div>

            {useAuthorImageLink ? (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/author-image.jpg"
                  onChange={handleAuthorImageLinkChange}
                  value={currentAuthorImageUrl.includes('ui-avatars.com') ? '' : currentAuthorImageUrl}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the author image
                </p>
              </div>
            ) : (
              <div>
                <ImageUpload
                  onUpload={handleAuthorImageUpload}
                  onRemove={handleAuthorImageRemove}
                  defaultValue={!currentAuthorImageUrl.includes('ui-avatars.com') ? currentAuthorImageUrl : ''}
                  folder="authors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image or use the auto-generated avatar
                </p>
              </div>
            )}

            {/* Author Image Preview - ALWAYS WORKS */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-[#121212] rounded-lg">
              <img 
                src={currentAuthorImageUrl || getAvatarUrl(watch('author') || 'User')}
                alt="Author preview" 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to generated avatar on any error
                  (e.target as HTMLImageElement).src = getAvatarUrl(watch('author') || 'User');
                }}
              />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Current author image</p>
                <p className="text-xs text-gray-600 truncate">
                  {currentAuthorImageUrl.includes('ui-avatars.com') ? 'Auto-generated avatar' : 'Custom image'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>🖼️</span> Featured Image
          </h2>

          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Image Source
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUseFeaturedImageLink(!useFeaturedImageLink)}
                className="text-xs text-primary hover:underline"
              >
                {useFeaturedImageLink ? 'Use Upload' : 'Use Image Link'}
              </button>
            </div>
          </div>

          {useFeaturedImageLink ? (
            <div>
              <input
                type="url"
                placeholder="https://example.com/featured-image.jpg"
                onChange={handleFeaturedImageLinkChange}
                value={currentImageUrl}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL for the featured image
              </p>
              
              {currentImageUrl && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <img 
                    src={currentImageUrl} 
                    alt="Featured preview" 
                    className="w-full h-48 object-cover rounded-lg border border-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="mt-2 px-3 py-1 bg-red-500/20 text-red-500 rounded text-xs hover:bg-red-500/30 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <ImageUpload
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
                defaultValue={currentImageUrl}
                folder="blog"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload an image
              </p>
            </div>
          )}
          
          {currentImageUrl && (
            <div className="mt-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Image Alt Text
              </label>
              <input
                {...register('image.alt')}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Describe the image"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>📄</span> Content
          </h2>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('excerpt', { required: 'Excerpt is required' })}
              rows={3}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              placeholder="Brief summary of the post..."
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {watch('excerpt')?.length || 0}/500
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={content}
              onChange={handleContentChange}  // Use the new handler
              placeholder="Write your blog post content here..."
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
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-xs group"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SEO & Metadata */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>🔍</span> SEO & Metadata
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Meta Title
              </label>
              <input
                {...register('metaTitle')}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="SEO title"
                maxLength={60}
              />
              <p className="mt-1 text-xs text-gray-500">
                {watch('metaTitle')?.length || 0}/60
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Order
              </label>
              <input
                type="number"
                {...register('order')}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Meta Description
            </label>
            <textarea
              {...register('metaDescription')}
              rows={2}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              placeholder="SEO description"
              maxLength={160}
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {watch('metaDescription')?.length || 0}/160
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>📅</span> Dates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Publish Date
              </label>
              <input
                type="date"
                {...register('publishedAt')}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Original Date
              </label>
              <input
                type="date"
                {...register('date')}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>⚙️</span> Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-4 h-4 rounded border-white/10 bg-[#121212] text-primary"
              />
              <div>
                <span className="text-sm text-gray-300 font-medium">Featured Post</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 rounded border-white/10 bg-[#121212] text-primary"
              />
              <div>
                <span className="text-sm text-gray-300 font-medium">Active</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isPublished')}
                className="w-4 h-4 rounded border-white/10 bg-[#121212] text-primary"
              />
              <div>
                <span className="text-sm text-gray-300 font-medium">Published</span>
              </div>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 sticky bottom-8 bg-dark/80 backdrop-blur-lg p-4 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-3 border border-white/10 text-gray-400 font-black uppercase tracking-wider rounded-lg hover:bg-white/5 transition-all"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary text-white font-black uppercase tracking-wider rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Saving...
              </span>
            ) : (
              isNew ? 'Create Post' : 'Update Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
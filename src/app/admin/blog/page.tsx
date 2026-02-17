'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import toast from 'react-hot-toast';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'image', 
      label: 'Image',
      render: (value: any) => value?.url && (
        <img src={value.url} alt="Thumb" className="w-12 h-12 object-cover rounded" />
      )
    },
    { key: 'category', label: 'Category' },
    { 
      key: 'date', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Blog Posts</h1>
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            Manage your blog content
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-6 py-3 bg-primary text-white font-black uppercase tracking-wider rounded-lg hover:bg-primary/80 transition-all"
        >
          Add New Post
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        basePath="blog"
        onDelete={fetchPosts}
      />
    </div>
  );
}
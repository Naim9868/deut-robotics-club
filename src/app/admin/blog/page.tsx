// admin/blog/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BlogAdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchPosts();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Blog Posts</h1>
        <Link href="/admin/blog/new" className="px-6 py-3 bg-primary text-white rounded-lg">
          + New Post
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Image</th>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Title</th>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Category</th>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Date</th>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Status</th>
              <th className="px-6 py-4 text-right text-xs text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  {post.image?.url && (
                    <img src={post.image.url} alt={post.title} className="w-16 h-12 object-cover rounded" />
                  )}
                </td>
                <td className="px-6 py-4 text-white font-medium">{post.title}</td>
                <td className="px-6 py-4 text-gray-400">{post.category}</td>
                <td className="px-6 py-4 text-gray-400">{new Date(post.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${post.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {post.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="text-blue-500 text-sm hover:underline">View</Link>
                  <Link href={`/admin/blog/${post._id}`} className="text-yellow-500 text-sm hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(post._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
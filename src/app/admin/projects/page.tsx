'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { CodeBracketIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface ProjectForm {
  id: string;
  title: string;
  tag: string;
  category: 'COMBAT' | 'AI' | 'AERO' | 'AUTO';
  status: 'ACTIVE' | 'TESTING' | 'MAINTENANCE' | 'UNKNOWN';
  latency: string;
  description: string;
  image: { url: string; alt: string; publicId?: string };
  technologies: string[];
  team: string[];
  github: string;
  demo: string;
  featured: boolean;
  order: number;
  isActive: boolean;
}

const categoryColors = {
  COMBAT: 'text-red-500 border-red-500',
  AI: 'text-blue-500 border-blue-500',
  AERO: 'text-purple-500 border-purple-500',
  AUTO: 'text-green-500 border-green-500'
};

const statusColors = {
  ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
  TESTING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  MAINTENANCE: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  UNKNOWN: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [useImageLink, setUseImageLink] = useState(false);
  
  // Simple state for arrays instead of useFieldArray
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [teamInput, setTeamInput] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProjectForm>({
    defaultValues: {
      id: '',
      title: '',
      tag: '',
      category: 'COMBAT',
      status: 'ACTIVE',
      latency: '0.00ms',
      description: '',
      technologies: [],
      team: [],
      github: '',
      demo: '',
      featured: false,
      order: 0,
      isActive: true
    }
  });

  // Helper to generate placeholder image
  const getProjectImage = (title: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title || 'Project')}&background=1e1e1e&color=e63946&size=200&bold=true&length=2`;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const generateId = () => {
    const title = watch('title');
    if (title) {
      const prefix = 'DRC_';
      const words = title.split(' ');
      let letters = '';
      if (words.length >= 2) {
        letters = words[0][0] + words[1][0];
      } else {
        letters = title.substring(0, 2);
      }
      const num = Math.floor(Math.random() * 900 + 100);
      setValue('id', `${prefix}${letters.toUpperCase()}${num}`);
    }
  };

  const handleImageUpload = (url: string, publicId?: string) => {
    setValue('image', { 
      url, 
      alt: watch('title') || 'Project image',
      publicId 
    });
    setCurrentImageUrl(url);
    setUseImageLink(false);
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('image', { 
      url, 
      alt: watch('title') || 'Project image'
    });
    setCurrentImageUrl(url);
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      const newTechs = [...technologies, techInput.trim()];
      setTechnologies(newTechs);
      setValue('technologies', newTechs);
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    const newTechs = technologies.filter((_, i) => i !== index);
    setTechnologies(newTechs);
    setValue('technologies', newTechs);
  };

  const addTeamMember = () => {
    if (teamInput.trim()) {
      const newTeam = [...team, teamInput.trim()];
      setTeam(newTeam);
      setValue('team', newTeam);
      setTeamInput('');
    }
  };

  const removeTeamMember = (index: number) => {
    const newTeam = team.filter((_, i) => i !== index);
    setTeam(newTeam);
    setValue('team', newTeam);
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      // Validate required fields
      if (!data.id || !data.title || !data.tag || !data.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Ensure image is set
      if (!data.image?.url) {
        data.image = {
          url: getProjectImage(data.title),
          alt: data.title
        };
      }

      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(editingId ? 'Project updated' : 'Project created');
        reset();
        setTechnologies([]);
        setTeam([]);
        setEditingId(null);
        setCurrentImageUrl('');
        setUseImageLink(false);
        fetchProjects();
      } else {
        console.error('Server error:', responseData);
        
        if (responseData.details) {
          Object.keys(responseData.details).forEach(key => {
            toast.error(`${key}: ${responseData.details[key]}`);
          });
        } else {
          toast.error(responseData.error || 'Failed to save');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save');
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setCurrentImageUrl(project.image?.url || '');
    setTechnologies(project.technologies || []);
    setTeam(project.team || []);
    reset({
      ...project,
      technologies: project.technologies || [],
      team: project.team || []
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        toast.success('Project deleted');
        fetchProjects();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Reorder projects
  const moveProject = async (id: string, direction: 'up' | 'down') => {
    const index = projects.findIndex(p => p._id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === projects.length - 1)
    ) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[index + (direction === 'up' ? -1 : 1)];
    newProjects[index + (direction === 'up' ? -1 : 1)] = temp;

    // Update order values
    const updates = newProjects.map((item, idx) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: idx } }
      }
    }));

    try {
      await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      
      setProjects(newProjects);
      toast.success('Order updated');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Projects</h1>
        <p className="text-gray-500 text-sm">{projects.length} projects</p>
      </div>

      {/* Form */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('title', { required: 'Title is required' })} 
                onBlur={generateId}
                placeholder="Project Title" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Project ID <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input 
                  {...register('id', { required: 'Project ID is required' })} 
                  placeholder="DRC_XX123" 
                  className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                />
                <button
                  type="button"
                  onClick={generateId}
                  className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 text-sm"
                >
                  Generate
                </button>
              </div>
              {errors.id && (
                <p className="mt-1 text-xs text-red-500">{errors.id.message}</p>
              )}
            </div>
          </div>

          {/* Tag and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Tag <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('tag', { required: 'Tag is required' })} 
                placeholder="COMBAT CLASS" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              {errors.tag && (
                <p className="mt-1 text-xs text-red-500">{errors.tag.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select 
                {...register('category', { required: 'Category is required' })} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="COMBAT">⚔️ COMBAT</option>
                <option value="AI">🤖 AI</option>
                <option value="AERO">🚁 AERO</option>
                <option value="AUTO">🚗 AUTO</option>
              </select>
            </div>
          </div>

          {/* Status and Latency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Status
              </label>
              <select 
                {...register('status')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="ACTIVE">✅ ACTIVE</option>
                <option value="TESTING">🧪 TESTING</option>
                <option value="MAINTENANCE">🔧 MAINTENANCE</option>
                <option value="UNKNOWN">❓ UNKNOWN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Latency
              </label>
              <input 
                {...register('latency')} 
                placeholder="0.00ms" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Description
            </label>
            <textarea 
              {...register('description')} 
              placeholder="Project description..." 
              rows={3} 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" 
            />
          </div>

          {/* Image Upload with Toggle */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-gray-400 uppercase">
                Project Image
              </label>
              <button
                type="button"
                onClick={() => setUseImageLink(!useImageLink)}
                className="text-xs text-primary hover:underline"
              >
                {useImageLink ? 'Use Upload' : 'Use Image Link'}
              </button>
            </div>

            {useImageLink ? (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  onChange={handleImageLinkChange}
                  value={currentImageUrl}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the project image
                </p>
              </div>
            ) : (
              <div>
                <ImageUpload
                  onUpload={handleImageUpload}
                  defaultValue={currentImageUrl}
                  folder="projects"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image or toggle to use an external link
                </p>
              </div>
            )}
          </div>

          {/* Technologies - FIXED */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="Add technology (e.g., Python, ROS)" 
                className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" 
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-xs group"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Team Members - FIXED */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Team Members
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={teamInput}
                onChange={(e) => setTeamInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
                placeholder="Add team member name" 
                className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" 
              />
              <button
                type="button"
                onClick={addTeamMember}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {team.map((member, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-xs group"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                GitHub URL
              </label>
              <input 
                {...register('github')} 
                placeholder="https://github.com/..." 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Demo URL
              </label>
              <input 
                {...register('demo')} 
                placeholder="https://demo.com/..." 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          {/* Order and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Display Order
              </label>
              <input 
                type="number"
                {...register('order')} 
                placeholder="0" 
                min="0"
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-300">Featured Project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              {editingId ? 'Update Project' : 'Create Project'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  reset(); 
                  setTechnologies([]);
                  setTeam([]);
                  setCurrentImageUrl('');
                  setUseImageLink(false);
                }} 
                className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div 
            key={project._id} 
            className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative"
          >
            {/* Order Controls */}
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {index > 0 && (
                <button
                  onClick={() => moveProject(project._id, 'up')}
                  className="p-1 bg-black/70 hover:bg-black rounded text-white"
                  title="Move Up"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
              )}
              {index < projects.length - 1 && (
                <button
                  onClick={() => moveProject(project._id, 'down')}
                  className="p-1 bg-black/70 hover:bg-black rounded text-white"
                  title="Move Down"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Edit/Delete Controls */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => handleEdit(project)} 
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(project._id)} 
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Del
              </button>
            </div>

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white text-xs rounded-full">
                Featured
              </div>
            )}

            {/* Inactive Overlay */}
            {!project.isActive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <span className="px-2 py-1 bg-red-600/90 text-white text-xs rounded-full">
                  Inactive
                </span>
              </div>
            )}

            <div className="flex p-4 gap-4">
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0 bg-[#121212] rounded-lg overflow-hidden">
                <img 
                  src={project.image?.url || getProjectImage(project.title)} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getProjectImage(project.title);
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-lg font-bold text-white truncate">{project.title}</h3>
                    <p className="text-xs text-gray-500">{project.id}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-2">{project.tag}</p>

                {/* Status Badge */}
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${statusColors[project.status as keyof typeof statusColors]}`}>
                  {project.status}
                </span>

                {/* Category Badge */}
                <span className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium border ${categoryColors[project.category as keyof typeof categoryColors]}`}>
                  {project.category}
                </span>

                {/* Latency */}
                {project.latency && project.latency !== '0.00ms' && (
                  <p className="text-xs text-gray-500 mt-2">Latency: {project.latency}</p>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <CodeBracketIcon className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-gray-500 truncate">
                      {project.technologies.join(' • ')}
                    </p>
                  </div>
                )}

                {/* Team */}
                {project.team && project.team.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <UserGroupIcon className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-gray-500 truncate">
                      {project.team.join(' • ')}
                    </p>
                  </div>
                )}

                {/* Links */}
                {(project.github || project.demo) && (
                  <div className="flex gap-3 mt-2">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary text-xs transition-colors">
                        GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary text-xs transition-colors">
                        Demo
                      </a>
                    )}
                  </div>
                )}

                {/* Order Display */}
                <p className="text-xs text-gray-600 mt-2">Order: {project.order}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <p className="text-gray-500">No projects yet. Add your first project above.</p>
        </div>
      )}
    </div>
  );
}
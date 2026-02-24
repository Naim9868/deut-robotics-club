import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface CommitteeData {
  _id: string;
  name: string;
  role: string;
  department?: string;
  session?: string;
  email?: string;
  image: {
    url: string;
    alt?: string;
    publicId?: string;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
  order: number;
  isActive: boolean;
  isExecutive: boolean;
}

const Committee: React.FC = () => {
  const [members, setMembers] = useState<CommitteeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const response = await fetch('/api/committee');
        if (!response.ok) {
          throw new Error('Failed to fetch committee data');
        }
        const data = await response.json();
        
        // Filter active members and sort by order (executives first, then by order)
        const activeMembers = Array.isArray(data) 
          ? data
              .filter((member: CommitteeData) => member.isActive)
              .sort((a, b) => {
                // First sort by executive status (executives first)
                if (a.isExecutive && !b.isExecutive) return -1;
                if (!a.isExecutive && b.isExecutive) return 1;
                // Then by order
                return a.order - b.order;
              })
          : [];
        
        setMembers(activeMembers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCommittee();
  }, []);

  if (loading) {
    return (
      <div className="py-32 container mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 container mx-auto px-4">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // Use members from API if available, otherwise use fallback data
  const displayMembers = members.length > 0 ? members : [
    { 
      _id: '1',
      name: 'Dr. Md. Nasir Uddin', 
      role: 'President',
      image: { url: 'https://i.pravatar.cc/300?img=11', alt: 'Dr. Md. Nasir Uddin' },
      order: 0,
      isActive: true,
      isExecutive: true
    },
    { 
      _id: '2',
      name: 'S.M. Shafiul Alam', 
      role: 'General Secretary',
      image: { url: 'https://i.pravatar.cc/300?img=12', alt: 'S.M. Shafiul Alam' },
      order: 1,
      isActive: true,
      isExecutive: true
    },
    { 
      _id: '3',
      name: 'Farhan Tanvir', 
      role: 'Vice President',
      image: { url: 'https://i.pravatar.cc/300?img=13', alt: 'Farhan Tanvir' },
      order: 2,
      isActive: true,
      isExecutive: true
    },
    { 
      _id: '4',
      name: 'Raisa Islam', 
      role: 'Treasurer',
      image: { url: 'https://i.pravatar.cc/300?img=44', alt: 'Raisa Islam' },
      order: 3,
      isActive: true,
      isExecutive: true
    },
    { 
      _id: '5',
      name: 'Abdullah Al Mamun', 
      role: 'Event Coordinator',
      image: { url: 'https://i.pravatar.cc/300?img=59', alt: 'Abdullah Al Mamun' },
      order: 4,
      isActive: true,
      isExecutive: false
    },
    { 
      _id: '6',
      name: 'Zarin Tasnim', 
      role: 'Tech Lead',
      image: { url: 'https://i.pravatar.cc/300?img=22', alt: 'Zarin Tasnim' },
      order: 5,
      isActive: true,
      isExecutive: false
    },
    { 
      _id: '7',
      name: 'Hasan Mahmud', 
      role: 'PR Manager',
      image: { url: 'https://i.pravatar.cc/300?img=33', alt: 'Hasan Mahmud' },
      order: 6,
      isActive: true,
      isExecutive: false
    },
    { 
      _id: '8',
      name: 'Sadia Afrin', 
      role: 'Research Lead',
      image: { url: 'https://i.pravatar.cc/300?img=10', alt: 'Sadia Afrin' },
      order: 7,
      isActive: true,
      isExecutive: false
    }
  ];

  // Function to render social icon based on platform
  const renderSocialIcon = (platform: string, url?: string) => {
    if (!url) return null;
    
    const getIcon = () => {
      switch(platform) {
        case 'linkedin':
          return (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          );
        case 'github':
          return (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          );
        case 'facebook':
          return (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z"/>
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-all"
        title={platform}
      >
        {getIcon()}
      </a>
    );
  };

  return (
    <div className="py-32 container mx-auto px-4">
      <ScrollReveal animation="up">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 section-title after:mx-auto tracking-tighter">Command Center</h2>
          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.6em] mt-4">The architect minds driving DUET's robotics legacy</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {displayMembers.map((member, idx) => (
          <ScrollReveal key={member._id || idx} animation="scale" delay={idx * 100} className="group">
            <div className="relative overflow-hidden aspect-[4/5] bg-[#0a0a0a] border border-white/5 rounded-2xl group-hover:border-primary/50 transition-all duration-700 shadow-2xl group-hover:shadow-primary/10">
              {/* Profile Image with subtle zoom */}
              <img 
                src={member.image?.url} 
                alt={member.image?.alt || member.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
              
              {/* Info Area */}
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2">{member.role}</p>
                <h3 className="text-2xl font-black text-white uppercase leading-none mb-6">{member.name}</h3>
                
                {/* Social Links */}
                <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {member.socialLinks?.linkedin && renderSocialIcon('linkedin', member.socialLinks.linkedin)}
                  {member.socialLinks?.github && renderSocialIcon('github', member.socialLinks.github)}
                  {member.socialLinks?.facebook && renderSocialIcon('facebook', member.socialLinks.facebook)}
                  
                  {/* Show email icon if email exists */}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`} 
                      className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-all"
                      title="Email"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </a>
                  )}
                </div>
                
                {/* Department/Session info (optional) */}
                {(member.department || member.session) && (
                  <p className="text-[8px] text-gray-500 uppercase tracking-wider mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.department && `${member.department}`}
                    {member.session && ` · ${member.session}`}
                  </p>
                )}
              </div>

              {/* Decorative Scan Lines */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      
      {/* Show message if no members */}
      {displayMembers.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No committee members found.
        </div>
      )}
    </div>
  );
};

export default Committee;
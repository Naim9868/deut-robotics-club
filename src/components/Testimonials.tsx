
import React from 'react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      text: "Joining DRC was the turning point of my undergraduate life. The hands-on experience with real robots is unmatched.",
      author: "Rafiqul Islam",
      role: "Alumni, Robotics Engineer at TechCo"
    },
    {
      text: "The community here is incredible. You're not just learning robotics; you're building lifelong connections with innovators.",
      author: "Sumaiya Akhter",
      role: "Lead Researcher, AI Lab"
    },
    {
      text: "From simple line followers to complex drones, DRC gave me the confidence to compete on international stages.",
      author: "Anwar Hossain",
      role: "National Techfest Winner 2024"
    }
  ];

  return (
    <div className="py-32 bg-[#0d0d0d]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {reviews.map((r, i) => (
            <div key={i} className="relative p-10 bg-card border border-white/5 rounded-2xl">
              <div className="absolute top-0 right-10 -translate-y-1/2 text-8xl text-primary/70 font-serif italic">“</div>
              <p className="text-gray-300 text-lg italic mb-8 relative z-10 leading-relaxed">
                {r.text}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
                  {r.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase text-sm">{r.author}</h4>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

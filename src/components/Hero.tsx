
import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const images = [
    'https://drc.duetbd.org/wp-content/uploads/2020/02/DRC-techfest.jpg',
    'https://media.licdn.com/dms/image/v2/D5622AQF6f76CDIlH-g/feedshare-shrink_800/B56ZZxkuf8GUAg-/0/1745662177924?e=1772064000&v=beta&t=odVGNYcbLBXMtXdQ3JKP8LjZW4_Q6LZWDPocqBxV47Q',
    'https://www.ewubd.edu/storage/app/public/news/image/1703661271news-single.jpg',
    'https://drc.duetbd.org/wp-content/uploads/2020/02/Mars-Rover-DRC.jpg',
    'https://drc.duetbd.org/wp-content/uploads/2020/02/DRC-Suvo-vai.jpg',
    'https://drc.duetbd.org/wp-content/uploads/2020/02/DRC-India.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-dark">
      {/* Dynamic Image Slider */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out transform ${
              index === currentIndex 
                ? 'opacity-100 translate-x-0 scale-100' 
                : index < currentIndex 
                ? 'opacity-0 -translate-x-full scale-110' 
                : 'opacity-0 translate-x-full scale-110'
            }`}
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.75), rgba(5,5,5,0.2), rgba(5,5,5,0.9)), url('${img}')`,
              zIndex: index === currentIndex ? 1 : 0
            }}
          />
        ))}
      </div>

      {/* Simplified Overlay Grid */}
      <div className="absolute inset-0 z-[2] opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #e63946 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-tight mb-8 text-white select-none whitespace-nowrap overflow-hidden">
          <span className="inline-block animate-[fadeInUp_1s_ease-out_forwards]">
            Empowering Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary text-glow drop-shadow-2xl">Innovators</span> Through Robotics
          </span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-100 mb-12 font-medium tracking-wide leading-relaxed animate-[fadeIn_2s_ease-out_forwards] drop-shadow-lg">
          Transforming robotics at <span className="text-white font-bold border-b-2 border-primary/50">Dhaka University of Engineering & Technology</span>. 
          The future is autonomous, and we are building it.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-[fadeIn_2.5s_ease-out_forwards]">
          <a 
            href="#contact" 
            className="group relative px-12 py-5 bg-primary overflow-hidden text-white font-black uppercase tracking-[0.2em] text-[12px] transition-all rounded-sm hover:scale-105 active:scale-95 shadow-2xl"
          >
            <span className="relative z-10 group-hover:text-dark transition-colors duration-300">Join the Mission</span>
            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </a>
          
          <a 
            href="#projects" 
            className="group relative px-12 py-5 border-2 border-white/20 text-white font-black uppercase tracking-[0.2em] text-[12px] hover:border-primary transition-all overflow-hidden rounded-sm bg-black/30 backdrop-blur-md shadow-2xl"
          >
            <span className="relative z-10">Explore Projects</span>
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        </div>
      </div>

      {/* Visual Navigation Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {images.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-16 bg-primary' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;

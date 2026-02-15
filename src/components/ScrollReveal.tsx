
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'up' | 'left' | 'right' | 'blur' | 'scale';
  delay?: number;
  className?: string;
  threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  animation = 'up', 
  delay = 0, 
  className = '',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [threshold]);

  const animationClasses = {
    up: 'translate-y-12 opacity-0',
    left: '-translate-x-12 opacity-0',
    right: 'translate-x-12 opacity-0',
    blur: 'blur-lg opacity-0',
    scale: 'scale-90 opacity-0'
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${className} ${
        isVisible 
          ? 'translate-y-0 translate-x-0 scale-100 opacity-100 blur-0' 
          : animationClasses[animation]
      }`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;


import React, { useState, useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

const CountUp: React.FC<{ end: string, duration?: number }> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Extract number and suffix (e.g., "15+" -> 15 and "+")
  const match = end.match(/(\d+)(.*)/);
  const target = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const nextCount = Math.floor(easedProgress * target);
      setCount(nextCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  return (
    <div ref={elementRef} className="inline-block">
      {count}{suffix}
    </div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    { label: 'Awards Won', value: '15+' },
    { label: 'Active Members', value: '500+' },
    { label: 'Core Projects', value: '45+' },
    { label: 'International Events', value: '12+' }
  ];

  return (
    <div className="relative py-32 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-primary -skew-y-3 origin-top-left -z-10 shadow-[0_0_100px_rgba(230,57,70,0.3)]"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} animation="scale" delay={idx * 150}>
              <div className="text-center group">
                <div className="text-5xl md:text-8xl font-black text-white mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl tabular-nums">
                  <CountUp end={stat.value} />
                </div>
                <div className="text-white/80 uppercase font-black tracking-[0.3em] text-xs md:text-sm">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;

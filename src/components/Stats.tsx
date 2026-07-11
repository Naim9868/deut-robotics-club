import React, { useState, useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

interface StatData {
  label: string;
  value: string;
  suffix: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

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
      { threshold: 0.3 }
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
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats data');
        }
        const data = await response.json();
        
        const activeStats = Array.isArray(data) 
          ? data.filter((stat: StatData) => stat.isActive).sort((a, b) => a.order - b.order)
          : [];
        
        setStats(activeStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary -skew-y-2 sm:-skew-y-3 origin-top-left -z-10 shadow-[0_0_60px_rgba(230,57,70,0.2)] sm:shadow-[0_0_100px_rgba(230,57,70,0.3)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[100px] sm:min-h-[120px] md:min-h-[150px]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary -skew-y-2 sm:-skew-y-3 origin-top-left -z-10 shadow-[0_0_60px_rgba(230,57,70,0.2)] sm:shadow-[0_0_100px_rgba(230,57,70,0.3)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500 text-sm sm:text-base">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const displayStats = stats.length > 0 ? stats : [
    { label: 'Awards Won', value: '15+', suffix: '+' },
    { label: 'Active Members', value: '500+', suffix: '+' },
    { label: 'Core Projects', value: '45+', suffix: '+' },
    { label: 'International Events', value: '12+', suffix: '+' }
  ];

  return (
    <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-primary -skew-y-2 sm:-skew-y-3 origin-top-left -z-10 shadow-[0_0_60px_rgba(230,57,70,0.2)] sm:shadow-[0_0_100px_rgba(230,57,70,0.3)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 justify-items-center">
          {displayStats.map((stat, idx) => (
            <ScrollReveal key={idx} animation="scale" delay={idx * 150}>
              <div className="text-center group w-full">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl tabular-nums">
                  <CountUp end={stat.value} /> <span className="text-white">{stat.suffix}</span>
                </div>
                <div className="text-white/80 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.3em] text-[8px] sm:text-[10px] md:text-xs lg:text-sm">
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
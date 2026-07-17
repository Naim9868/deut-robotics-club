import React, { useState, useEffect } from 'react';

interface FAQData {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq');
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ data');
        }
        const data = await response.json();
        
        const activeFAQs = Array.isArray(data) 
          ? data
              .filter((item: FAQData) => item.isActive)
              .sort((a, b) => a.order - b.order)
          : [];
        
        setFaqs(activeFAQs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center text-red-500 text-sm sm:text-base">
          {error}
        </div>
      </div>
    );
  }

  const displayFAQs = faqs.length > 0 ? faqs : [
    {
      _id: '1',
      question: "How do I join the DUET Robotics Club?",
      answer: "Recruitment sessions are held twice a year, usually at the beginning of each semester. Keep an eye on our Facebook page and official notice boards for the registration link.",
      category: "General",
      order: 0,
      isActive: true
    },
    {
      _id: '2',
      question: "Do I need prior robotics knowledge to join?",
      answer: "Absolutely not! We welcome enthusiasts from all backgrounds. Our 'Robo-Workshop 101' series is specifically designed to teach beginners the basics from scratch.",
      category: "General",
      order: 1,
      isActive: true
    },
    {
      _id: '3',
      question: "What technical tools do members have access to?",
      answer: "Members have access to our specialized lab which includes 3D printers, laser cutters, oscilloscope, soldering stations, and a vast library of microcontrollers (Arduino, STM32, ESP32).",
      category: "Facilities",
      order: 2,
      isActive: true
    },
    {
      _id: '4',
      question: "Can I use the club's equipment for personal projects?",
      answer: "Personal projects are encouraged as long as they align with the club's learning objectives and you follow the safety protocols. You must get approval from the lab manager first.",
      category: "Facilities",
      order: 3,
      isActive: true
    }
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-2 sm:mb-3 md:mb-4 section-title after:mx-auto">
          Questions?
        </h2>
        <p className="text-muted uppercase text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mt-2 sm:mt-3 md:mt-4">
          Everything you need to know about joining DRC
        </p>
      </div>

      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        {displayFAQs.map((faq, idx) => (
          <div 
            key={faq._id || idx} 
            className="border border-border rounded-xl bg-card overflow-hidden hover:border-border transition-all duration-300"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 lg:p-6 text-left hover:bg-primary/5 transition-colors active:bg-primary/10"
              aria-expanded={openIndex === idx}
            >
              <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-foreground flex-1 pr-2 sm:pr-4">
                {faq.question}
              </span>
              <svg 
                className={`w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 transition-transform duration-300 mt-0.5 sm:mt-0 ${openIndex === idx ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-3 sm:p-4 md:p-5 lg:p-6 pt-0 sm:pt-0">
                <p className="text-muted text-[11px] sm:text-xs md:text-sm leading-relaxed border-t border-border pt-3 sm:pt-4">
                  {faq.answer}
                </p>
                
                {faq.category && faq.category !== 'General' && (
                  <div className="mt-2.5 sm:mt-3">
                    <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider rounded-full border border-primary/30">
                      {faq.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {displayFAQs.length === 0 && (
        <div className="text-center text-muted text-sm sm:text-base py-8 sm:py-12">
          No FAQs available at the moment.
        </div>
      )}
    </div>
  );
};

export default FAQ;

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
        
        // Filter active FAQs and sort by order
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
      <div className="py-32 container mx-auto px-4 max-w-4xl">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 container mx-auto px-4 max-w-4xl">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // Use FAQs from API if available, otherwise use fallback data
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
    <div className="py-32 container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black uppercase mb-4 section-title after:mx-auto">Questions?</h2>
        <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">Everything you need to know about joining DRC</p>
      </div>

      <div className="space-y-4">
        {displayFAQs.map((faq, idx) => (
          <div key={faq._id || idx} className="border border-white/5 rounded-xl bg-card overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-white">{faq.question}</span>
              <svg 
                className={`w-5 h-5 text-primary transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100 p-6 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                {faq.answer}
              </p>
              
              {/* Optional category badge */}
              {faq.category && faq.category !== 'General' && (
                <div className="mt-3">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-wider rounded-full border border-primary/30">
                    {faq.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Show message if no FAQs */}
      {displayFAQs.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No FAQs available at the moment.
        </div>
      )}
    </div>
  );
};

export default FAQ;
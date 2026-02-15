
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I join the DUET Robotics Club?",
      a: "Recruitment sessions are held twice a year, usually at the beginning of each semester. Keep an eye on our Facebook page and official notice boards for the registration link."
    },
    {
      q: "Do I need prior robotics knowledge to join?",
      a: "Absolutely not! We welcome enthusiasts from all backgrounds. Our 'Robo-Workshop 101' series is specifically designed to teach beginners the basics from scratch."
    },
    {
      q: "What technical tools do members have access to?",
      a: "Members have access to our specialized lab which includes 3D printers, laser cutters, oscilloscope, soldering stations, and a vast library of microcontrollers (Arduino, STM32, ESP32)."
    },
    {
      q: "Can I use the club's equipment for personal projects?",
      a: "Personal projects are encouraged as long as they align with the club's learning objectives and you follow the safety protocols. You must get approval from the lab manager first."
    }
  ];

  return (
    <div className="py-32 container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black uppercase mb-4 section-title after:mx-auto">Questions?</h2>
        <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">Everything you need to know about joining DRC</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-white/5 rounded-xl bg-card overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-white">{faq.q}</span>
              <svg 
                className={`w-5 h-5 text-primary transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100 p-6 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

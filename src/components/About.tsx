import React from 'react';
import ScrollReveal from './ScrollReveal';

interface AboutData {
  title: string;
  description?: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  image: {
    url: string;
    alt: string;
  };
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = React.useState<AboutData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openParagraphIndex, setOpenParagraphIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) {
          throw new Error('Failed to fetch about data');
        }
        const data = await response.json();
        const aboutContent = Array.isArray(data) ? data.find((item: any) => item.isActive) || data[0] : data;
        setAboutData(aboutContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const truncateText = (text: string, wordLimit: number = 30) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const toggleParagraph = (index: number) => {
    setOpenParagraphIndex(openParagraphIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="text-center text-red-500 text-sm sm:text-base">
          {error || 'Failed to load about section'}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Text Content - Always first on mobile */}
        <ScrollReveal animation="left" className="order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase mb-4 sm:mb-6 md:mb-8 relative inline-block section-title text-center sm:text-left">
            {aboutData.title}
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
            {/* If description exists and paragraphs array is empty, show description */}
            {aboutData.description && aboutData.paragraphs.length === 0 && (
              <p className="text-center sm:text-left">{aboutData.description}</p>
            )}
            
            {/* Map through paragraphs array if it exists */}
            {aboutData.paragraphs && aboutData.paragraphs.length > 0 ? (
              aboutData.paragraphs.map((paragraph, index) => {
                const isOpen = openParagraphIndex === index;
                const words = paragraph.split(' ');
                const shouldTruncate = words.length > 30 && !isOpen;
                const displayText = shouldTruncate ? truncateText(paragraph) : paragraph;

                return (
                  <div key={index} className="paragraph-container text-center sm:text-left">
                    <p>
                      {paragraph.includes('<strong>') ? (
                        <span dangerouslySetInnerHTML={{ 
                          __html: shouldTruncate ? truncateText(paragraph) : paragraph 
                        }} />
                      ) : (
                        displayText
                      )}
                    </p>
                    {words.length > 30 && (
                      <button
                        onClick={() => toggleParagraph(index)}
                        className="text-primary hover:text-primary/80 font-semibold text-xs sm:text-sm mt-1 sm:mt-2 transition-colors"
                      >
                        {isOpen ? 'Read less' : 'Read more...'}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              /* Fallback to hardcoded content if no paragraphs are provided */
              <>
                {[
                  'The DUET Robotics Club (DRC) is the premier student-led organization at Dhaka University of Engineering & Technology, dedicated to fostering an ecosystem of robotics, automation, and AI.',
                  'Founded with the vision to make DUET a hub for technological excellence, DRC provides students with a platform to transform theoretical knowledge into functional prototypes. We believe in learning by doing.',
                  'From building autonomous line followers to competing in international aerial robotics competitions, our members are constantly pushing the boundaries of what\'s possible in the Bangladeshi tech landscape.'
                ].map((paragraph, index) => {
                  const isOpen = openParagraphIndex === index;
                  const words = paragraph.split(' ');
                  const shouldTruncate = words.length > 30 && !isOpen;
                  const displayText = shouldTruncate ? truncateText(paragraph) : paragraph;

                  return (
                    <div key={index} className="paragraph-container text-center sm:text-left">
                      <p>
                        {index === 0 ? (
                          <>
                            The <strong className="text-white">DUET Robotics Club (DRC)</strong> is the premier student-led organization at 
                            Dhaka University of Engineering & Technology, dedicated to fostering an ecosystem of 
                            robotics, automation, and AI.
                          </>
                        ) : (
                          displayText
                        )}
                      </p>
                      {words.length > 30 && (
                        <button
                          onClick={() => toggleParagraph(index)}
                          className="text-primary hover:text-primary/80 font-semibold text-xs sm:text-sm mt-1 sm:mt-2 transition-colors"
                        >
                          {isOpen ? 'Read less' : 'Read more...'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            
            <div className="pt-4 sm:pt-5 md:pt-6 text-center sm:text-left">
              <a href={aboutData.buttonLink}>
                <button className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 border border-white/20 text-white font-bold uppercase text-xs sm:text-sm rounded hover:bg-white hover:text-dark transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto">
                  {aboutData.buttonText}
                </button>
              </a>
            </div>
          </div>
        </ScrollReveal>
        
        {/* Image - Second on mobile */}
        <ScrollReveal animation="right" className="order-1 lg:order-2 relative">
          <div className="absolute -inset-2 sm:-inset-4 bg-primary/20 blur-2xl sm:blur-3xl -z-10 rounded-full animate-pulse" />
          <img 
            src={aboutData.image.url}
            alt={aboutData.image.alt}
            className="rounded-xl shadow-2xl border border-white/10 w-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.02] aspect-[4/3] sm:aspect-auto"
          />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default About;
import React from 'react';
import ScrollReveal from './ScrollReveal';

interface AboutData {
  introduction?: {
    isEnabled: boolean;
    shortIntro: string;
    longDescription: string;
  };
  story?: {
    isEnabled: boolean;
    content: string;
    image: { url: string; alt: string };
  };
  mission?: {
    isEnabled: boolean;
    content: string;
    image: { url: string; alt: string };
  };
  // Legacy fields for backward compatibility
  title?: string;
  description?: string;
  paragraphs?: string[];
  buttonText?: string;
  buttonLink?: string;
  image?: { url: string; alt: string };
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
        setAboutData(data);
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
    return null; // Hide section on error
  }

  // Get the primary content section (introduction > story > legacy)
  const hasIntroduction = aboutData.introduction?.isEnabled && aboutData.introduction?.shortIntro;
  const hasStory = aboutData.story?.isEnabled && aboutData.story?.content;
  const hasMission = aboutData.mission?.isEnabled && aboutData.mission?.content;
  const hasLegacy = aboutData.title || aboutData.description || (aboutData.paragraphs && aboutData.paragraphs.length > 0);

  // If no content at all, hide the section
  if (!hasIntroduction && !hasStory && !hasMission && !hasLegacy) {
    return null;
  }

  // Determine what to show
  const title = hasIntroduction ? 'About Us' : aboutData.title || 'About Us';
  const description = aboutData.introduction?.shortIntro || aboutData.description || '';
  const paragraphs = aboutData.paragraphs || [];
  const buttonText = aboutData.buttonText || 'Learn More';
  const buttonLink = aboutData.buttonLink || '/about';
  const imageUrl = aboutData.story?.image?.url || aboutData.mission?.image?.url || aboutData.image?.url || '';
  const imageAlt = aboutData.story?.image?.alt || aboutData.mission?.image?.alt || aboutData.image?.alt || 'About DRC';

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Text Content */}
        <ScrollReveal animation="left" className="order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase mb-4 sm:mb-6 md:mb-8 relative inline-block section-title text-center sm:text-left">
            {title}
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
            {/* Main description */}
            {description && (
              <p className="text-center sm:text-left">{description}</p>
            )}

            {/* Long description from introduction */}
            {aboutData.introduction?.longDescription && (
              <div
                className="text-center sm:text-left"
                dangerouslySetInnerHTML={{ __html: aboutData.introduction.longDescription }}
              />
            )}

            {/* Story content */}
            {hasStory && aboutData.story?.content && (
              <div
                className="text-center sm:text-left"
                dangerouslySetInnerHTML={{ __html: aboutData.story.content }}
              />
            )}

            {/* Legacy paragraphs */}
            {!hasIntroduction && !hasStory && paragraphs.length > 0 && paragraphs.map((paragraph, index) => {
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
            })}

            {/* Fallback content if nothing else exists */}
            {!description && paragraphs.length === 0 && !hasStory && (
              <p className="text-center sm:text-left">
                The <strong className="text-white">DUET Robotics Club (DRC)</strong> is the premier student-led organization at
                Dhaka University of Engineering & Technology, dedicated to fostering an ecosystem of
                robotics, automation, and AI.
              </p>
            )}

            <div className="pt-4 sm:pt-5 md:pt-6 text-center sm:text-left">
              <a href={buttonLink}>
                <button className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 border border-white/20 text-white font-bold uppercase text-xs sm:text-sm rounded hover:bg-white hover:text-dark transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto">
                  {buttonText}
                </button>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Image */}
        {imageUrl && (
          <ScrollReveal animation="right" className="order-1 lg:order-2 relative">
            <div className="absolute -inset-2 sm:-inset-4 bg-primary/20 blur-2xl sm:blur-3xl -z-10 rounded-full animate-pulse" />
            <img
              src={imageUrl}
              alt={imageAlt}
              className="rounded-xl shadow-2xl border border-white/10 w-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.02] aspect-[4/3] sm:aspect-auto"
            />
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default About;

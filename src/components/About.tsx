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
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) throw new Error('Failed to fetch about data');
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

  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error || !aboutData) return null;

  const hasIntroduction = aboutData.introduction?.isEnabled && aboutData.introduction?.shortIntro;
  const hasStory = aboutData.story?.isEnabled && aboutData.story?.content;
  const hasMission = aboutData.mission?.isEnabled && aboutData.mission?.content;
  const hasLegacy = aboutData.title || aboutData.description || (aboutData.paragraphs && aboutData.paragraphs.length > 0);

  if (!hasIntroduction && !hasStory && !hasMission && !hasLegacy) return null;

  const title = hasIntroduction ? 'About Us' : aboutData.title || 'About Us';
  const description = aboutData.introduction?.shortIntro || aboutData.description || '';
  const longDescription = aboutData.introduction?.longDescription || '';
  const storyContent = aboutData.story?.content || '';
  const paragraphs = aboutData.paragraphs || [];
  const buttonText = aboutData.buttonText || 'Learn More';
  const buttonLink = aboutData.buttonLink || '/about';
  const imageUrl = aboutData.story?.image?.url || aboutData.mission?.image?.url || aboutData.image?.url || '';
  const imageAlt = aboutData.story?.image?.alt || aboutData.mission?.image?.alt || aboutData.image?.alt || 'About DRC';

  const plainText = [
    description,
    longDescription ? longDescription.replace(/<[^>]*>/g, ' ') : '',
    storyContent ? storyContent.replace(/<[^>]*>/g, ' ') : '',
    ...(!hasIntroduction && !hasStory ? paragraphs : []),
  ].filter(Boolean).join(' ');

  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const needsTruncation = wordCount > 40;

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
        <ScrollReveal animation="left" className="order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase mb-4 sm:mb-6 md:mb-8 relative inline-block section-title text-center sm:text-left">
            {title}
          </h2>

          <div className={`space-y-4 text-muted text-sm sm:text-base leading-relaxed ${!expanded ? 'max-h-[240px] sm:max-h-[280px] md:max-h-[320px] overflow-hidden' : ''}`}>
            {description && (
              <p className="text-center sm:text-left">{description}</p>
            )}

            {longDescription && (
              <div
                className="text-center sm:text-left"
                dangerouslySetInnerHTML={{ __html: longDescription }}
              />
            )}

            {hasStory && storyContent && (
              <div
                className="text-center sm:text-left"
                dangerouslySetInnerHTML={{ __html: storyContent }}
              />
            )}

            {!hasIntroduction && !hasStory && paragraphs.length > 0 && paragraphs.map((paragraph, index) => (
              <div key={index} className="text-center sm:text-left">
                {paragraph.includes('<strong>') ? (
                  <span dangerouslySetInnerHTML={{ __html: paragraph }} />
                ) : (
                  <p>{paragraph}</p>
                )}
              </div>
            ))}

            {!description && paragraphs.length === 0 && !hasStory && (
              <p className="text-center sm:text-left">
                The <strong className="text-foreground">DUET Robotics Club (DRC)</strong> is the premier student-led organization at
                Dhaka University of Engineering & Technology, dedicated to fostering an ecosystem of
                robotics, automation, and AI.
              </p>
            )}
          </div>

          <div className="pt-4 sm:pt-5 md:pt-6 text-center sm:text-left">
            {needsTruncation && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-primary hover:text-primary/80 font-bold text-xs sm:text-sm mb-3 sm:mb-4 transition-colors"
              >
                {expanded ? 'Show less' : 'Read more...'}
              </button>
            )}
            <div>
              <a href={buttonLink}>
                <button className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 border border-border text-foreground font-bold uppercase text-xs sm:text-sm rounded hover:bg-foreground hover:text-background transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto">
                  {buttonText}
                </button>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {imageUrl && (
          <ScrollReveal animation="right" className="order-1 lg:order-2 relative">
            <div className="absolute -inset-2 sm:-inset-4 bg-primary/20 blur-2xl sm:blur-3xl -z-10 rounded-full animate-pulse" />
            <img
              src={imageUrl}
              alt={imageAlt}
              className="rounded-xl shadow-2xl border border-border w-full object-cover transition-all duration-700 hover:scale-[1.02] aspect-[4/3] sm:aspect-auto"
            />
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default About;

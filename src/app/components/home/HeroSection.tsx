import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, TrendingUp, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useSiteContent } from '../../../hooks/useSiteContent';
import { EditableWrapper } from '../admin/EditableWrapper';

// Default content for fallback
const defaults = {
  title: 'Shape Your Future at INCPUC',
  subtitle: "Join India's leading Pre-University College with a proven track record of 99% pass rate and excellence in education.",
  ctaApply: 'Apply Now',
  ctaFaculty: 'Meet Our Faculty',
  passRate: '99%',
  students: '450+',
  distinction: '85%'
};

interface HeroSectionProps {
  editorMode?: boolean;
}

export function HeroSection({ editorMode = false }: HeroSectionProps) {
  const { content: titleContent, loading: titleLoading } = useSiteContent('hero_title');
  const { content: subtitleContent, loading: subtitleLoading } = useSiteContent('hero_subtitle');
  const { content: ctaContent, loading: ctaLoading } = useSiteContent('hero_cta_text');

  const loading = titleLoading || subtitleLoading || ctaLoading;

  // Use Firestore content or fallback to defaults
  const title = titleContent || defaults.title;
  const subtitle = subtitleContent || defaults.subtitle;
  const ctaApply = ctaContent || defaults.ctaApply;

  if (loading) {
    return (
      <section
        className="relative bg-gradient-to-br from-primary via-primary to-secondary py-20 px-4 sm:px-6 lg:px-8"
        aria-label="Hero section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary-foreground/50" />
          </div>
        </div>
      </section>
    );
  }

  // Render content - either editable or static
  const renderTitle = () => {
    const titleElement = (
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
        {title}
      </h1>
    );

    if (editorMode) {
      return (
        <EditableWrapper
          sectionId="hero_title"
          label="Hero Title"
          defaultContent={defaults.title}
          inline={false}
        >
          {titleElement}
        </EditableWrapper>
      );
    }
    return titleElement;
  };

  const renderSubtitle = () => {
    const subtitleElement = (
      <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
        {subtitle}
      </p>
    );

    if (editorMode) {
      return (
        <EditableWrapper
          sectionId="hero_subtitle"
          label="Hero Subtitle"
          defaultContent={defaults.subtitle}
          inline={false}
        >
          {subtitleElement}
        </EditableWrapper>
      );
    }
    return subtitleElement;
  };

  const renderCTAButton = () => {
    const ctaElement = (
      <Link
        to="/admissions"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
      >
        {ctaApply}
        <ArrowRight className="size-5" aria-hidden="true" />
      </Link>
    );

    if (editorMode) {
      return (
        <EditableWrapper
          sectionId="hero_cta_text"
          label="CTA Button Text"
          defaultContent={defaults.ctaApply}
          inline={false}
        >
          <div className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg">
            {ctaApply}
            <ArrowRight className="size-5" aria-hidden="true" />
          </div>
        </EditableWrapper>
      );
    }
    return ctaElement;
  };

  return (
    <section
      className="relative bg-gradient-to-br from-primary via-primary to-secondary py-20 px-4 sm:px-6 lg:px-8"
      aria-label="Hero section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {renderTitle()}
            {renderSubtitle()}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {renderCTAButton()}
              <Link
                to="/faculty"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-all shadow-lg"
              >
                {defaults.ctaFaculty}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2">
                  <Award className="size-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">{defaults.passRate}</div>
                <div className="text-sm text-primary-foreground/80">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2">
                  <Users className="size-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">{defaults.students}</div>
                <div className="text-sm text-primary-foreground/80">Students</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2">
                  <TrendingUp className="size-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">{defaults.distinction}</div>
                <div className="text-sm text-primary-foreground/80">Distinction</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:block">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
              alt="Students studying in a modern college environment"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

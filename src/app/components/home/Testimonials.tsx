import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Quote, Star, Loader2 } from 'lucide-react';
import { useTestimonials } from '../../../hooks/useContent';
import { testimonials as fallbackTestimonials } from '../../../data/mockData';

export function Testimonials() {
  const { data: testimonials, loading, error } = useTestimonials();

  // Use Firestore data or fallback to static data
  const testimonialData = testimonials.length > 0 ? testimonials : (error ? fallbackTestimonials : []);

  // Loading state
  if (loading) {
    return (
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
              <Star className="size-5" aria-hidden="true" />
              <span className="text-sm font-semibold">Success Stories</span>
            </div>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Hear from our successful alumni about their journey at INCPUC
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl shadow-md border border-border p-6 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-secondary rounded" />
                    <div className="h-3 w-16 bg-secondary rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-secondary rounded" />
                  <div className="h-3 w-full bg-secondary rounded" />
                  <div className="h-3 w-3/4 bg-secondary rounded" />
                </div>
                <div className="h-3 w-1/2 bg-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no data and not loading, return null gracefully
  if (testimonialData.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <Star className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Success Stories</span>
          </div>
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Hear from our successful alumni about their journey at INCPUC
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonialData.map((testimonial) => (
            <article
              key={testimonial.id}
              className="bg-card rounded-xl shadow-md border border-border p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-${testimonial.id === 'test1' ? '1500648767791' :
                      testimonial.id === 'test2' ? '1494790108377' :
                        testimonial.id === 'test3' ? '1507003211169' : '1573497019940'
                    }-c0f0cddb62d8?w=200&q=80`}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                />
                <div>
                  <h3 className="font-semibold text-primary">{testimonial.name}</h3>
                  <p className="text-sm text-muted">Batch of {testimonial.batch}</p>
                </div>
              </div>

              <div className="mb-4">
                <Quote className="size-8 text-accent mb-2" aria-hidden="true" />
                <blockquote className="text-body leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-sm text-muted italic">
                  {testimonial.currentPosition}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

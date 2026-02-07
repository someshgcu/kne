import { Quote, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { usePrincipalMessage } from '../../../hooks/useContent';
import { principalMessage as fallbackMessage } from '../../../data/mockData';

export function PrincipalMessage() {
  const { data: principalMessage, loading, error } = usePrincipalMessage();

  // Loading state - show skeleton
  if (loading) {
    return (
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="principal-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-border">
            <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-center">
              {/* Skeleton Photo */}
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-secondary animate-pulse" />
                <div className="mt-6 space-y-2 text-center">
                  <div className="h-6 w-40 bg-secondary animate-pulse rounded mx-auto" />
                  <div className="h-4 w-24 bg-secondary animate-pulse rounded mx-auto" />
                </div>
              </div>
              {/* Skeleton Content */}
              <div className="space-y-4">
                <div className="h-8 w-64 bg-secondary animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-secondary animate-pulse rounded" />
                  <div className="h-4 w-full bg-secondary animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-secondary animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Use Firestore data, or fallback to static data if not available
  const message = principalMessage || fallbackMessage;

  // Error state - use fallback silently
  if (error) {
    console.error('[PrincipalMessage] Error:', error);
  }

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="principal-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-border">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-center">
            {/* Principal Photo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                  alt={`${message.name}, Principal of INCPUC`}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-accent shadow-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-3 rounded-full shadow-lg">
                  <Quote className="size-6" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-primary">
                  {message.name}
                </h3>
                <p className="text-sm text-muted">
                  {message.designation}
                </p>
              </div>
            </div>

            {/* Message Content */}
            <div>
              <h2 id="principal-heading" className="text-3xl font-bold text-primary mb-6">
                Principal's Message
              </h2>
              <blockquote className="space-y-4">
                <p className="text-lg text-body leading-relaxed">
                  {message.message}
                </p>
                <footer className="mt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-12 bg-accent" aria-hidden="true"></div>
                    <cite className="not-italic text-primary font-semibold">
                      {message.name}
                    </cite>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

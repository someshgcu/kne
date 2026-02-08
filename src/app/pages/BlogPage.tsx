import { useState, useEffect } from 'react';
import { Calendar, Newspaper, Loader2, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNews } from '../../hooks/useContent';

export function BlogPage() {
  const { data: news, loading, error } = useNews();

  // Loading skeleton
  if (loading) {
    return (
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4">
              <div className="size-5 bg-secondary-foreground/20 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-secondary-foreground/20 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-64 bg-secondary mx-auto rounded animate-pulse mb-4"></div>
            <div className="h-6 w-96 bg-secondary mx-auto rounded animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`bg-card rounded-xl border border-border overflow-hidden ${i === 1 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
              >
                <div className={`bg-secondary animate-pulse ${i === 1 ? 'h-96' : 'h-48'}`}></div>
                <div className={i === 1 ? 'p-8' : 'p-6'}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="size-4 bg-secondary rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-secondary rounded animate-pulse"></div>
                  </div>
                  <div className={`h-6 bg-secondary rounded animate-pulse mb-3 ${i === 1 ? 'w-3/4' : 'w-2/3'}`}></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary rounded animate-pulse"></div>
                    <div className="h-4 bg-secondary rounded animate-pulse w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
            <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Unable to Load News
            </h3>
            <p className="text-red-600">{error instanceof Error ? error.message : String(error)}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <Newspaper className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">News & Updates</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Latest from INCPUC
          </h1>
          <p className="text-lg text-body max-w-3xl mx-auto">
            Stay informed about campus events, achievements, and important announcements
          </p>
        </div>

        {/* News Grid */}
        {news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <article
                key={item.id}
                className={`bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-xl transition-shadow ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
              >
                {item.image && (
                  <div className={`relative overflow-hidden bg-secondary/20 ${index === 0 ? 'h-96' : 'h-48'
                    }`}>
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}

                <div className={index === 0 ? 'p-8' : 'p-6'}>
                  <div className="flex items-center gap-2 text-sm text-muted mb-3">
                    <Calendar className="size-4" aria-hidden="true" />
                    <time dateTime={item.date}>
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  <h2 className={`font-bold text-primary mb-3 ${index === 0 ? 'text-3xl' : 'text-xl'
                    }`}>
                    {item.title}
                  </h2>

                  <p className={`text-body leading-relaxed ${index === 0 ? 'text-lg mb-4' : 'line-clamp-3'
                    }`}>
                    {index === 0 ? item.content : (item.excerpt || item.content?.substring(0, 150) + '...')}
                  </p>

                  {index !== 0 && (
                    <button
                      className="mt-4 text-accent hover:text-accent/80 transition-colors font-medium"
                      onClick={() => {
                        alert(`Reading: ${item.title}\n\n${item.content}`);
                      }}
                    >
                      Read More →
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16 bg-secondary/10 rounded-xl"
            role="status"
          >
            <Newspaper className="size-16 text-muted mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              No News Available
            </h3>
            <p className="text-body">
              Check back soon for updates and announcements
            </p>
          </div>
        )}

        {/* Subscribe Section */}
        <section className="mt-16 bg-primary text-primary-foreground rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest news and updates directly in your inbox
          </p>
          <form
            className="max-w-md mx-auto flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing!');
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg border-2 border-transparent focus:border-accent focus:outline-none text-foreground"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

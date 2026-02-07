import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper, Loader2 } from 'lucide-react';
import { useNews } from '../../../hooks/useContent';

export function NewsTicker() {
  const { data: newsItems, loading, error } = useNews();

  // Show only the 3 most recent news items
  const recentNews = newsItems.slice(0, 3);

  // Loading state
  if (loading) {
    return (
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/10"
        aria-labelledby="news-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="size-6 animate-spin text-accent" />
            <p className="text-muted">Loading latest news...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state - show nothing gracefully
  if (error) {
    console.error('[NewsTicker] Error:', error);
    return null;
  }

  if (recentNews.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/10"
      aria-labelledby="news-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-accent text-accent-foreground p-3 rounded-lg">
              <Newspaper className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="news-heading" className="text-3xl font-bold text-primary">
                Latest Updates
              </h2>
              <p className="text-sm text-body mt-1">Stay informed about campus happenings</p>
            </div>
          </div>
          <Link
            to="/news"
            className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            View All
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* News Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNews.map((news) => (
            <article
              key={news.id}
              className="bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted mb-3">
                  <Calendar className="size-4" aria-hidden="true" />
                  <time dateTime={news.date}>{news.date}</time>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-body line-clamp-3 mb-4">
                  {news.excerpt}
                </p>
                <Link
                  to={`/news/${news.id}`}
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  Read More
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
          >
            View All News
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

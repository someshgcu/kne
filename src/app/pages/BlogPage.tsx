import { newsItems } from '../../data/mockData';
import { Calendar, Newspaper } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function BlogPage() {
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
        {newsItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news, index) => (
              <article
                key={news.id}
                className={`bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-xl transition-shadow ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                {news.image && (
                  <div className={`relative overflow-hidden bg-secondary/20 ${
                    index === 0 ? 'h-96' : 'h-48'
                  }`}>
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-${
                        index === 0 ? '1461896836934' :
                        index === 1 ? '1523050854058' :
                        index === 2 ? '1546410531' :
                        index === 3 ? '1532619187' : '1523580494'
                      }-d95a6aa61b07?w=800&q=80`}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                
                <div className={index === 0 ? 'p-8' : 'p-6'}>
                  <div className="flex items-center gap-2 text-sm text-muted mb-3">
                    <Calendar className="size-4" aria-hidden="true" />
                    <time dateTime={news.date}>{news.date}</time>
                  </div>
                  
                  <h2 className={`font-bold text-primary mb-3 ${
                    index === 0 ? 'text-3xl' : 'text-xl'
                  }`}>
                    {news.title}
                  </h2>
                  
                  <p className={`text-body leading-relaxed ${
                    index === 0 ? 'text-lg mb-4' : 'line-clamp-3'
                  }`}>
                    {index === 0 ? news.content : news.excerpt}
                  </p>
                  
                  {index !== 0 && (
                    <button
                      className="mt-4 text-accent hover:text-accent/80 transition-colors font-medium"
                      onClick={() => {
                        // In a real app, this would navigate to a detail page
                        alert(`Reading: ${news.title}\n\n${news.content}`);
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

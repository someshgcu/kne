import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary via-primary to-secondary">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-foreground mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors font-semibold"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold"
          >
            <Home className="size-5" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

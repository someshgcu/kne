import { useState, useEffect, ReactElement } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { HeroSection } from '../components/home/HeroSection';
import { ImpactDashboard } from '../components/home/ImpactDashboard';
import { PrincipalMessage } from '../components/home/PrincipalMessage';
import { NewsTicker } from '../components/home/NewsTicker';
import { Gallery } from '../components/home/Gallery';
import { Testimonials } from '../components/home/Testimonials';
import { Loader2 } from 'lucide-react';

// Component mapping for dynamic rendering
type ComponentKey = 'hero' | 'impact' | 'principal_message' | 'news' | 'gallery' | 'testimonials';

const componentMap: Record<ComponentKey, () => ReactElement> = {
  hero: () => <HeroSection />,
  impact: () => <ImpactDashboard />,
  principal_message: () => <PrincipalMessage />,
  news: () => <NewsTicker />,
  gallery: () => <Gallery />,
  testimonials: () => <Testimonials />
};

// Default layout order if Firestore is empty
const DEFAULT_LAYOUT: ComponentKey[] = [
  'hero',
  'impact',
  'principal_message',
  'news',
  'gallery',
  'testimonials'
];

interface HomeLayoutData {
  order: ComponentKey[];
  updatedAt?: Date;
}

export function HomePage() {
  const [layout, setLayout] = useState<ComponentKey[]>(DEFAULT_LAYOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to layout changes from Firestore
    const layoutRef = doc(db, 'settings', 'home_layout');

    const unsubscribe = onSnapshot(layoutRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as HomeLayoutData;
        if (data.order && Array.isArray(data.order) && data.order.length > 0) {
          // Filter to only include valid component keys
          const validOrder = data.order.filter(
            (key): key is ComponentKey => key in componentMap
          );
          if (validOrder.length > 0) {
            setLayout(validOrder);
          }
        }
      }
      setLoading(false);
    }, (error) => {
      console.error('[HomePage] Error fetching layout:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-br from-primary via-primary to-secondary py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-10 animate-spin text-primary-foreground/50" />
            </div>
          </div>
        </div>

        {/* Content Skeletons */}
        <div className="max-w-7xl mx-auto px-4 py-16 w-full">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-secondary rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-secondary rounded w-full mb-2"></div>
                <div className="h-4 bg-secondary rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col">
      {layout.map((componentKey, index) => {
        const Component = componentMap[componentKey];
        if (!Component) {
          console.warn('[HomePage] Unknown component key:', componentKey);
          return null;
        }
        return (
          <div key={`${componentKey}-${index}`}>
            {Component()}
          </div>
        );
      })}
    </main>
  );
}

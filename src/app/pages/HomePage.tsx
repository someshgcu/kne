import { HeroSection } from '../components/home/HeroSection';
import { ImpactDashboard } from '../components/home/ImpactDashboard';
import { PrincipalMessage } from '../components/home/PrincipalMessage';
import { NewsTicker } from '../components/home/NewsTicker';
import { Gallery } from '../components/home/Gallery';
import { Testimonials } from '../components/home/Testimonials';

export function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <ImpactDashboard />
      <PrincipalMessage />
      <NewsTicker />
      <Gallery />
      <Testimonials />
    </main>
  );
}

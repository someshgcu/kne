import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function HeroSection() {
  return (
    <section 
      className="relative bg-gradient-to-br from-primary via-primary to-secondary py-20 px-4 sm:px-6 lg:px-8"
      aria-label="Hero section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Shape Your Future at INCPUC
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Join India's leading Pre-University College with a proven track record of 
              <span className="text-accent font-bold"> 99% pass rate</span> and excellence in education.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/admissions"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
              >
                Apply Now
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
              <Link
                to="/faculty"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-all shadow-lg"
              >
                Meet Our Faculty
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2">
                  <Award className="size-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">99%</div>
                <div className="text-sm text-primary-foreground/80">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2">
                  <Users className="size-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">450+</div>
                <div className="text-sm text-primary-foreground/80">Students</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2">
                  <TrendingUp className="size-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">85%</div>
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

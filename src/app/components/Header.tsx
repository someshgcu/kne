import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/admissions', label: 'Admissions' },
    { path: '/faculty', label: 'Faculty' },
    { path: '/news', label: 'News' },
    { path: '/careers', label: 'Careers' }
  ];

  return (
    <header 
      className="sticky top-0 z-50 bg-primary shadow-md"
      role="banner"
    >
      <nav 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary-foreground hover:opacity-90 transition-opacity"
            aria-label="INCPUC Home"
          >
            <GraduationCap className="size-8" aria-hidden="true" />
            <span className="text-xl font-bold">INCPUC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="ml-2 px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/10">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive(link.path)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-primary-foreground hover:bg-primary-foreground/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Public navigation links (when logged out)
  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/admissions', label: 'Admissions' },
    { path: '/courses', label: 'Courses' },
    { path: '/news', label: 'News' },
    { path: '/careers', label: 'Careers' },
  ];

  // Principal/Admin navigation links (when logged in)
  const principalLinks = [
    { path: '/principal/dashboard', label: 'Dashboard' },
    { path: '/principal/courses', label: 'Manage Courses' },
    { path: '/', label: 'Public Site' },
  ];

  const currentLinks = user ? principalLinks : publicLinks;

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="size-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold hidden sm:block">
              INCPUC
            </span>
            <span className="text-xl font-bold sm:hidden">KNE College</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {currentLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === link.path
                  ? 'bg-primary-foreground/20 font-semibold'
                  : 'hover:bg-primary-foreground/10'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            ) : (
              <Link
                to="/admin"
                className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg transition-colors font-semibold"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20">
            <nav className="flex flex-col gap-2">
              {currentLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === link.path
                    ? 'bg-primary-foreground/20 font-semibold'
                    : 'hover:bg-primary-foreground/10'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold text-left"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg transition-colors font-semibold"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

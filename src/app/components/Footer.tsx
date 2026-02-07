import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-foreground">INCPUC</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Empowering students with quality education and 99% success rate. 
              Your future starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admissions" 
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    Admissions
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faculty" 
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    Faculty
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/careers" 
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Contact Us</h4>
            <address className="not-italic space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>INCPUC Campus, MG Road<br />Bangalore - 560001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="tel:+918023456789" 
                  className="hover:text-accent transition-colors"
                >
                  +91-80-2345-6789
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="mailto:info@incpuc.edu.in" 
                  className="hover:text-accent transition-colors"
                >
                  info@incpuc.edu.in
                </a>
              </div>
            </address>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="size-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="size-5" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="size-5" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Follow us on YouTube"
              >
                <Youtube className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} INCPUC. All rights reserved. Built with excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}

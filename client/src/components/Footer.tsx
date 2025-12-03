import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border py-12 px-4">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 neon-green">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Calwer Pizza & Kebaphaus</p>
                  <p className="text-sm text-foreground/70">Inselgasse 3</p>
                  <p className="text-sm text-foreground/70">75365 Calw</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+4970519275 87" className="hover:text-primary transition-colors">
                  +49 7051 927587
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@calwer-kebap.de" className="hover:text-primary transition-colors">
                  info@calwer-kebap.de
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 neon-orange">Öffnungszeiten</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-1" />
                <div className="text-sm">
                  <p className="font-medium">Montag - Sonntag</p>
                  <p className="text-foreground/70">10:00 - 22:00 Uhr</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 neon-green">Schnellzugriff</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#menu" className="hover:text-primary transition-colors">
                  Speisekarte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Über uns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  AGB
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Impressum
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 neon-orange">Folge uns</h3>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/calwerpizzakebap/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @calwerpizzakebap
              </a>
              <div className="pt-4">
                <p className="text-sm text-foreground/70">
                  Mindestbestellwert: 10€
                </p>
                <p className="text-sm text-foreground/70">
                  Liefergebühr: 2€
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
          <p>
            © {new Date().getFullYear()} Calwer Pizza & Kebaphaus. Alle Rechte vorbehalten.
          </p>
          <p className="mt-2">
            Made with <span className="neon-green">💚</span> in Calw
          </p>
        </div>
      </div>
    </footer>
  );
}

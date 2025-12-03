import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Star, Leaf, Flame, UtensilsCrossed, MapPin, Phone, Clock } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: featured } = trpc.products.featured.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex max-w-6xl items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[rgb(var(--green-primary))] to-[rgb(var(--brown-warm))] shadow-[0_0_16px_rgba(63,175,97,0.35)]" />
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-display">
                Calwer
              </p>
              <p className="font-semibold tracking-wide">
                Pizza & Kebaphaus
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex" role="navigation" aria-label="Hauptnavigation">
            <a href="#menu" className="hover:text-white transition-colors">
              Speisekarte
            </a>
            <a href="#quality" className="hover:text-white transition-colors">
              Qualität
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              Über uns
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Kontakt
            </a>
          </nav>

          <button
            className="btn-primary rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--green-primary))]"
            aria-label="Jetzt bestellen"
          >
            Jetzt bestellen
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto max-w-6xl pb-16 pt-6 md:pt-10">
        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center" aria-labelledby="hero-heading">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] neon-green">
              Frisch. Ehrlich. Handgemacht.
            </p>
            <h1 id="hero-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Döner, wie er sein muss.{" "}
              <span className="block neon-green">
                Voller Geschmack. Null Kompromisse.
              </span>
            </h1>
            <p className="max-w-xl text-sm text-[rgb(var(--text-secondary))] sm:text-base">
              Saftiges Fleisch vom Spieß, hausgemachte Soßen, frisches Brot
              und knackiger Salat – direkt aus Calw. Mit Fokus auf Qualität,
              fairen Zutaten und einem Service, dem du vertrauen kannst.
            </p>

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--green-primary))]">
                Online bestellen
              </button>
              <a
                href="#menu"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm hover:border-white/40 hover:text-white transition-colors"
              >
                Speisekarte ansehen
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[rgb(var(--text-secondary))]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[rgb(var(--green-primary))] shadow-[0_0_8px_rgba(63,175,97,0.8)]" />
                <span>Halal & ausgewählte Zutaten</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[rgb(var(--brown-warm))]" />
                <span>Lokaler Familienbetrieb in Calw</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="card-metal rounded-3xl border border-white/8 p-3 shadow-[0_22px_60px_rgba(0,0,0,0.9)]">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                <img 
                  src="/images/doener-kebap.jpg" 
                  alt="Klassischer Döner Kebap mit frischen Zutaten" 
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-6 flex items-center gap-3 rounded-2xl border border-white/10 glass-glow px-3 py-2 text-xs text-[rgb(var(--text-secondary))]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--green-primary))] text-[11px] font-bold text-black shadow-[0_0_16px_rgba(63,175,97,0.7)]">
                4.8
              </span>
              <div className="leading-tight">
                <p className="font-medium text-white">
                  Stammkunden lieben es
                </p>
                <p className="text-[11px] text-white/70">
                  200+ Bewertungen in der Umgebung
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* USP Strip */}
        <section className="mt-14 grid gap-4 rounded-2xl border border-white/5 bg-card px-4 py-4 text-xs text-[rgb(var(--text-secondary))] sm:grid-cols-3 sm:text-sm" aria-label="Unsere Vorteile">
          <div className="flex items-start gap-3">
            <UtensilsCrossed className="mt-0.5 h-5 w-5 text-[rgb(var(--green-soft))]" aria-hidden="true" />
            <div>
              <p className="font-semibold text-white">Hausgemachte Soßen</p>
              <p>Rezepturen aus eigener Küche, ohne unnötigen Zusatzkram.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Leaf className="mt-0.5 h-5 w-5 text-[rgb(var(--green-soft))]" aria-hidden="true" />
            <div>
              <p className="font-semibold text-white">Frische Kräuter & Salat</p>
              <p>Täglich frisch vorbereitet, knackig und voller Geschmack.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Flame className="mt-0.5 h-5 w-5 text-[rgb(var(--accent-gold))]" aria-hidden="true" />
            <div>
              <p className="font-semibold text-white">Ehrlicher Grillgeschmack</p>
              <p>Spieß & Grill – ohne Show, mit viel Erfahrung.</p>
            </div>
          </div>
        </section>

        {/* Menu Preview */}
        <section id="menu" className="mt-16" aria-labelledby="menu-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="menu-heading" className="text-xl font-semibold sm:text-2xl">
              Speisekarte – Auswahl
            </h2>
            <a
              href="#"
              className="text-xs neon-green hover:text-[rgb(var(--green-soft))] transition-colors"
            >
              komplette Karte ansehen →
            </a>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured?.slice(0, 6).map((item) => (
              <article
                key={item.id}
                className="group card-hover flex flex-col justify-between rounded-2xl border border-white/8 bg-card p-4 shadow-[0_14px_40px_rgba(0,0,0,0.7)]"
              >
                <div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs text-[rgb(var(--text-secondary))] sm:text-sm">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold neon-green">
                    {(item.basePrice / 100).toFixed(2)} €
                  </span>
                  <button 
                    className="rounded-full border border-[rgb(var(--green-primary))]/40 bg-background/80 px-3 py-1.5 text-xs font-medium neon-green transition group-hover:bg-[rgb(var(--green-primary))] group-hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--green-primary))]"
                    aria-label={`${item.name} in den Warenkorb legen`}
                  >
                    In den Warenkorb
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Qualität & Nachhaltigkeit */}
        <section id="quality" className="mt-16 grid gap-10 md:grid-cols-2" aria-labelledby="quality-heading">
          <div>
            <h2 id="quality-heading" className="text-xl font-semibold sm:text-2xl">
              Qualität, die man schmeckt.
            </h2>
            <p className="mt-3 text-sm text-[rgb(var(--text-secondary))]">
              Wir achten auf kurze Wege, ehrliche Produkte und eine Küche,
              die wir auch unseren eigenen Familien servieren. Kein Show-Effekt,
              sondern Substanz auf dem Teller.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--text-secondary))]" role="list">
              <li>• Ausgewählte Lieferanten aus der Region, wo möglich</li>
              <li>• Sorgsamer Umgang mit Lebensmittelresten</li>
              <li>• Recycelbare Verpackungen für To-Go</li>
              <li>• Transparente Allergene – auf Wunsch einsehbar</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card p-4 text-xs text-[rgb(var(--text-secondary))]">
            <p className="text-[11px] uppercase tracking-[0.25em] neon-green">
              Verantwortung
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              Datenschutz & Fairness by Design
            </p>
            <p className="mt-2">
              Unsere Website sammelt nur Daten, die für deine Bestellung
              notwendig sind. Tracking nur, wenn du zustimmst. Wir arbeiten mit
              sicheren, europäischen Hosting-Lösungen und halten uns an geltendes
              Recht wie DSGVO und zukünftige KI-Regelungen.
            </p>
          </div>
        </section>

        {/* Über uns */}
        <section id="about" className="mt-16 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]" aria-labelledby="about-heading">
          <div>
            <h2 id="about-heading" className="text-xl font-semibold sm:text-2xl">
              Ein Döner, der nach Zuhause schmeckt.
            </h2>
            <p className="mt-3 text-sm text-[rgb(var(--text-secondary))]">
              Hinter dem Calwer Pizza & Kebaphaus stehen Menschen, keine
              Marke aus der Fabrik. Wir kommen aus Calw, kochen seit Jahren
              für unsere Nachbarn und wissen, dass Vertrauen verdient werden
              muss – mit jedem Teller.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-card p-4 text-xs text-[rgb(var(--text-secondary))]">
            <p className="text-[11px] uppercase tracking-[0.25em] neon-green">
              Stimmen aus der Nachbarschaft
            </p>
            <p className="mt-2 italic">
              „Der einzige Laden, wo ich meinen Döner wirklich jedes Mal
              ohne Nachdenken bestelle."
            </p>
            <p className="mt-1 text-[11px] text-[rgb(var(--accent-cream))]/70">
              – Stammkundin aus Calw
            </p>
          </div>
        </section>

        {/* Kontakt & Footer */}
        <section id="contact" className="mt-16" aria-labelledby="contact-heading">
          <div className="rounded-2xl border border-white/10 bg-card p-4 text-sm text-[rgb(var(--text-secondary))] md:flex md:items-center md:justify-between">
            <div>
              <h2 id="contact-heading" className="text-base font-semibold text-white flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Besuch uns in der Inselgasse.
              </h2>
              <p className="mt-1 text-xs sm:text-sm flex items-center gap-2">
                <span>Inselgasse 3, 75365 Calw</span>
              </p>
              <p className="mt-1 text-xs sm:text-sm flex items-center gap-2">
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span>Öffnungszeiten: 10:00 – 22:00 Uhr</span>
              </p>
            </div>
            <div className="mt-3 flex gap-3 text-xs md:mt-0">
              <a 
                href="tel:+4970519275 87" 
                className="rounded-full border border-white/20 px-3 py-1.5 hover:border-white/50 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--green-primary))]"
                aria-label="Anrufen"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                Anrufen
              </a>
              <a 
                href="https://www.google.com/maps/place/Inselgasse+3,+75365+Calw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-3 py-1.5 hover:border-white/50 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--green-primary))]"
                aria-label="Route planen"
              >
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Route planen
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-[rgb(var(--text-muted))]" role="contentinfo">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Calwer Pizza & Kebaphaus – Calw.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/impressum" className="hover:text-[rgb(var(--accent-cream))] transition-colors">
                Impressum
              </a>
              <a href="/datenschutz" className="hover:text-[rgb(var(--accent-cream))] transition-colors">
                Datenschutz
              </a>
              <a href="/cookie-einstellungen" className="hover:text-[rgb(var(--accent-cream))] transition-colors">
                Cookie-Einstellungen
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

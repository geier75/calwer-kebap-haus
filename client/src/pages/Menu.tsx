import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Search, ShoppingCart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Menu() {
  const { user, isAuthenticated } = useAuth();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: allProducts } = trpc.products.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredProducts = allProducts?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToCategory = (categoryId: number) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex max-w-6xl items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[rgb(var(--green-primary))] to-[rgb(var(--brown-warm))] shadow-[0_0_16px_rgba(63,175,97,0.35)]" />
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-display">
                Calwer
              </p>
              <p className="font-semibold tracking-wide">
                Pizza & Kebaphaus
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </Button>
            </Link>
            <button
              className="btn-primary rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2"
              aria-label="Warenkorb"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Warenkorb</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="border-b border-white/5 bg-card/50">
        <div className="container mx-auto max-w-6xl py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              type="text"
              placeholder="Suche nach Gerichten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/80 border-white/10"
            />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-[57px] z-20 border-b border-white/5 bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-[rgb(var(--green-primary))] text-black"
                  : "border border-white/15 text-white/80 hover:border-white/40"
              }`}
            >
              Alle
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-[rgb(var(--green-primary))] text-black"
                    : "border border-white/15 text-white/80 hover:border-white/40"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <main className="container mx-auto max-w-6xl py-8">
        {categories?.map((category) => {
          const categoryProducts = filteredProducts?.filter(
            (p) => p.categoryId === category.id
          );

          if (!categoryProducts || categoryProducts.length === 0) return null;

          return (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="mb-12"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                {category.description && (
                  <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group card-hover flex flex-col justify-between rounded-2xl border border-white/8 bg-card p-4 shadow-[0_14px_40px_rgba(0,0,0,0.7)]"
                  >
                    {product.imageUrl && (
                      <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-base font-semibold">{product.name}</h3>
                      {product.description && (
                        <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-semibold neon-green">
                        {(product.basePrice / 100).toFixed(2)} €
                      </span>
                      <button
                        className="rounded-full border border-[rgb(var(--green-primary))]/40 bg-background/80 px-4 py-2 text-sm font-medium neon-green transition group-hover:bg-[rgb(var(--green-primary))] group-hover:text-black"
                        aria-label={`${product.name} in den Warenkorb legen`}
                      >
                        Hinzufügen
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {filteredProducts?.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-[rgb(var(--text-secondary))]">
              Keine Produkte gefunden.
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
              Versuche einen anderen Suchbegriff.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-[rgb(var(--text-muted))]">
        <div className="container mx-auto max-w-6xl">
          <p>© {new Date().getFullYear()} Calwer Pizza & Kebaphaus – Calw.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/impressum" className="hover:text-[rgb(var(--accent-cream))] transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-[rgb(var(--accent-cream))] transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";

export default function Menu() {
  const { data: categories, isLoading: categoriesLoading } = trpc.menu.categories.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.menu.products.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Lade Speisekarte...</p>
        </div>
      </div>
    );
  }

  const filteredProducts = selectedCategory
    ? products?.filter(p => p.categoryId === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-glow border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Calwer Kebap Deluxe</h1>
              <p className="text-sm text-muted-foreground">Inselgasse 3, 75365 Calw</p>
            </div>
            <Button size="lg" className="glow-green">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Warenkorb (0)
            </Button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="sticky top-[73px] z-40 glass-glow border-b border-border/50">
        <div className="container py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              Alle
            </Button>
            {categories?.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map(product => (
            <div
              key={product.id}
              className="glossy-card rounded-xl overflow-hidden hover-lift"
            >
              {product.imageUrl && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {(product.basePrice / 100).toFixed(2)} €
                  </span>
                  <Button size="lg" className="glow-orange">
                    <Plus className="mr-2 h-5 w-5" />
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-primary">Kontakt</h3>
              <p className="text-sm text-muted-foreground">Inselgasse 3</p>
              <p className="text-sm text-muted-foreground">75365 Calw</p>
              <p className="text-sm text-muted-foreground mt-2">Tel: +49 7051 927587</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-primary">Öffnungszeiten</h3>
              <p className="text-sm text-muted-foreground">Mo-So: 10:00 - 22:00 Uhr</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-primary">Rechtliches</h3>
              <a href="/impressum" className="text-sm text-muted-foreground hover:text-primary block mb-2">Impressum</a>
              <a href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary block">Datenschutz</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © 2024 Calwer Kebap Deluxe. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}

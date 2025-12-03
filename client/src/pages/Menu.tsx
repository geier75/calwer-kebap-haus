import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";
import Hero3D from "@/components/Hero3D";
import OrderChatbot from "@/components/OrderChatbot";
import { motion } from "framer-motion";

export default function Menu() {
  const { data: categories, isLoading: categoriesLoading } = trpc.menu.categories.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.menu.products.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent glow-green"></div>
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
      {/* 3D Hero Section */}
      <Hero3D />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 glass-glow border-b border-border/50 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">Unsere Speisekarte</h2>
              <p className="text-sm text-muted-foreground">Tel: +49 7051 927587</p>
            </div>
            <Button size="lg" className="glow-green hover-lift">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Warenkorb (0)
            </Button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="sticky top-[73px] z-40 glass-glow border-b border-border/50 backdrop-blur-xl">
        <div className="container py-4">
          <motion.div 
            className="flex gap-2 overflow-x-auto pb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap hover-lift"
            >
              Alle
            </Button>
            {categories?.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Button
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap hover-lift"
                >
                  {cat.name}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredProducts?.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.02 }}
              className="glossy-card rounded-2xl overflow-hidden hover-lift group"
            >
              {product.imageUrl && (
                <div className="aspect-square overflow-hidden relative">
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gradient-green">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary glow-green">
                    {(product.basePrice / 100).toFixed(2)} €
                  </span>
                  <Button size="lg" className="glow-orange hover-lift">
                    <Plus className="mr-2 h-5 w-5" />
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* KI Chatbot */}
      <OrderChatbot />

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 glass-glow">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold mb-4 text-primary text-xl">Kontakt</h3>
              <p className="text-sm text-muted-foreground">Inselgasse 3</p>
              <p className="text-sm text-muted-foreground">75365 Calw</p>
              <p className="text-sm text-muted-foreground mt-2">Tel: +49 7051 927587</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-bold mb-4 text-primary text-xl">Öffnungszeiten</h3>
              <p className="text-sm text-muted-foreground">Mo-So: 10:00 - 22:00 Uhr</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-bold mb-4 text-primary text-xl">Rechtliches</h3>
              <a href="/impressum" className="text-sm text-muted-foreground hover:text-primary block mb-2 transition-colors">Impressum</a>
              <a href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary block transition-colors">Datenschutz</a>
            </motion.div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © 2024 Calwer Kebap Deluxe. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

import Hero3D from "@/components/Hero3D";
import OrderChatbot from "@/components/OrderChatbot";
import ProductCard from "@/components/ProductCard";

import OpeningHoursWidget from "@/components/OpeningHoursWidget";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";

export default function Menu() {
  const { data: categories, isLoading: categoriesLoading } = trpc.menu.categories.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.menu.products.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { addItem, getTotalItems, setIsOpen } = useCart();
  
  const handleAddToCart = (product: any, quantity: number) => {
    // Get selected variant price if exists
    const price = product.hasVariants && product.variants?.[0]
      ? product.variants[0].price
      : product.basePrice;
    
    const variant = product.hasVariants && product.variants?.[0]
      ? product.variants[0].size
      : undefined;
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price,
        imageUrl: product.imageUrl,
        variant,
      });
    }
    toast.success(`${product.name} wurde zum Warenkorb hinzugefügt!`);
  };
  
  const totalItems = getTotalItems();

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
            <div className="flex gap-3">

              <Button 
                size="lg" 
                className="glow-green hover-lift relative"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Warenkorb
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
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
      <main className="container py-16 relative">
        {/* Dining Area Background */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: 'url(/images/dining-area.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredProducts?.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product as any}
              index={idx}
              onAddToCart={handleAddToCart}
            />
          ))}
        </motion.div>
      </main>

      {/* KI Chatbot */}
      <OrderChatbot />

      {/* Opening Hours Widget */}
      <OpeningHoursWidget />



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
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}

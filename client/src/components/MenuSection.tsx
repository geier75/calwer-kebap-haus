import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Flame, Leaf } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
}

function ProductCard({ product }: { product: Product }) {
  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)}€`;
  };

  const handleAddToCart = () => {
    toast.success(`${product.name} zum Warenkorb hinzugefügt!`);
  };

  return (
    <Card className="glass-glow card-hover group overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="w-16 h-16" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.isFeatured && (
            <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground">
              Beliebt
            </Badge>
          )}
          {product.isSpicy && (
            <Badge variant="destructive" className="bg-destructive/90">
              <Flame className="w-3 h-3 mr-1" />
              Scharf
            </Badge>
          )}
          {product.isVegan && (
            <Badge className="bg-accent/90 text-accent-foreground">
              <Leaf className="w-3 h-3 mr-1" />
              Vegan
            </Badge>
          )}
          {product.isVegetarian && !product.isVegan && (
            <Badge className="bg-accent/90 text-accent-foreground">
              <Leaf className="w-3 h-3 mr-1" />
              Vegetarisch
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          className="absolute top-2 left-2 p-2 rounded-full glass-glow-orange hover:scale-110 transition-transform"
          onClick={() => toast.info("Favoriten-Feature kommt bald!")}
        >
          <Heart className="w-5 h-5 text-secondary" />
        </button>
      </div>

      <CardHeader>
        <CardTitle className="text-xl neon-green">{product.name}</CardTitle>
        {product.description && (
          <CardDescription className="text-foreground/70">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="flex justify-between items-center">
        <div className="text-2xl font-bold neon-orange">
          {formatPrice(product.basePrice)}
        </div>
        <Button
          className="btn-cyber bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Bestellen
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: featuredProducts } = trpc.products.featured.useQuery();

  if (categoriesLoading || productsLoading) {
    return (
      <section id="menu" className="py-20 px-4 cyber-grid">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-metallic">
              SPEISEKARTE
            </h2>
            <p className="text-xl text-foreground/70">Lädt...</p>
          </div>
        </div>
      </section>
    );
  }

  const filteredProducts = selectedCategory
    ? products?.filter(p => p.categoryId === selectedCategory)
    : products;

  return (
    <section id="menu" className="py-20 px-4 cyber-grid">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-metallic">
            SPEISEKARTE
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Entdecke unsere vielfältige Auswahl an frischen, hochwertigen Gerichten
          </p>
        </div>

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && !selectedCategory && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-6 neon-orange">
              ⭐ Unsere Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="glass-glow w-full justify-start overflow-x-auto flex-nowrap mb-8">
            <TabsTrigger
              value="all"
              onClick={() => setSelectedCategory(null)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Alle
            </TabsTrigger>
            {categories?.map(category => (
              <TabsTrigger
                key={category.id}
                value={category.slug}
                onClick={() => setSelectedCategory(category.id)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory ? categories?.find(c => c.id === selectedCategory)?.slug || "all" : "all"}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Keine Produkte in dieser Kategorie gefunden.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Star, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Product {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  categoryId: number;
  hasVariants?: boolean;
  variants?: Array<{name: string; price: number}>;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [points, setPoints] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0); // Index of selected size

  const handleAddToCart = () => {
    // Get current price (variant or base)
    const currentPrice = product.hasVariants && product.variants?.[selectedVariant]
      ? product.variants[selectedVariant].price
      : product.basePrice;
    
    // Gamification: Award points based on price
    const earnedPoints = Math.floor(currentPrice / 100);
    setPoints(earnedPoints);
    setShowPoints(true);
    
    onAddToCart(product, quantity);
    
    setTimeout(() => {
      setShowPoints(false);
      setShowDialog(false);
      setQuantity(1);
    }, 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, type: "spring", stiffness: 120, damping: 15 }}
        whileHover={{ y: -12, scale: 1.02 }}
        className="glossy-card rounded-3xl overflow-hidden hover-lift group relative cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        {/* Premium Badge */}
        <div className="absolute top-4 right-4 z-10 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-bold glow-green flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Premium
        </div>
        
        {/* Points Badge */}
        <div className="absolute top-4 left-4 z-10 bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-bold glow-orange flex items-center gap-1">
          <Zap className="w-3 h-3 fill-current" />
          +{Math.floor(product.basePrice / 100)} Punkte
        </div>
        
        {product.imageUrl && (
          <div className="aspect-[4/3] overflow-hidden relative">
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15, rotate: 2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Quick View Button */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
            >
              <Button variant="outline" className="bg-background/90 backdrop-blur-sm glow-green">
                Schnellansicht
              </Button>
            </motion.div>
          </div>
        )}
        
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 text-gradient-green group-hover:scale-105 transition-transform duration-300">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-primary glow-green block">
                {(product.basePrice / 100).toFixed(2)} €
              </span>
              <span className="text-xs text-muted-foreground">inkl. MwSt.</span>
            </div>
            <Button 
              size="lg" 
              className="glow-orange hover-lift rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                setShowDialog(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] glossy-card">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gradient-green">{product.name}</DialogTitle>
            <DialogDescription>
              {product.description || 'Wählen Sie Ihre Optionen'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Product Image */}
            {product.imageUrl && (
              <div className="aspect-video overflow-hidden rounded-2xl">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Size Selector (for pizzas) or Extras (for döner) */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                {/* Check if this is a size variant (has 'cm' in name) or extras */}
                {product.variants[0].name.includes('Ø') ? (
                  // Size selector for pizzas
                  <>
                    <label className="text-sm font-medium">Größe wählen</label>
                    <div className="grid grid-cols-2 gap-3">
                      {product.variants.map((variant, idx) => (
                        <Button
                          key={idx}
                          variant={selectedVariant === idx ? "default" : "outline"}
                          className={`h-16 text-lg font-bold ${
                            selectedVariant === idx ? 'glow-green' : ''
                          }`}
                          onClick={() => setSelectedVariant(idx)}
                        >
                          <div className="text-center">
                            <div>{variant.name}</div>
                            <div className="text-sm font-normal">
                              {(variant.price / 100).toFixed(2)} €
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  // Extras checkboxes for döner
                  <>
                    <label className="text-sm font-medium">Extras wählen</label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((extra, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent/10"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            defaultChecked={extra.price === 0}
                          />
                          <span className="text-sm">
                            {extra.name}
                            {extra.price > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (+{(extra.price / 100).toFixed(2)} €)
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Menge</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 rounded-xl"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-3xl font-bold text-primary glow-green w-16 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Points Info */}
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-accent" />
              <div>
                <p className="font-bold text-accent">
                  +{Math.floor(product.basePrice / 100) * quantity} Punkte sammeln
                </p>
                <p className="text-xs text-muted-foreground">
                  Bei dieser Bestellung erhalten Sie Treuepunkte!
                </p>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Gesamtpreis</p>
                <p className="text-3xl font-bold text-primary glow-green">
                  {(
                    ((product.hasVariants && product.variants?.[selectedVariant]
                      ? product.variants[selectedVariant].price
                      : product.basePrice) * quantity) / 100
                  ).toFixed(2)} €
                </p>
              </div>
              <Button
                size="lg"
                className="glow-orange hover-lift px-8"
                onClick={handleAddToCart}
              >
                <Plus className="mr-2 h-5 w-5" />
                In den Warenkorb
              </Button>
            </div>
          </div>
          
          {/* Points Animation */}
          <AnimatePresence>
            {showPoints && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Award className="w-24 h-24 text-accent mx-auto mb-4" />
                  </motion.div>
                  <p className="text-4xl font-bold text-accent glow-orange">
                    +{points} Punkte!
                  </p>
                  <p className="text-muted-foreground mt-2">Zum Warenkorb hinzugefügt</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}

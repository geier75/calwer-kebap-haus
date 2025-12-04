import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X, Star, Zap, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  hasVariants: boolean;
  variants: Array<{ name: string; price: number }> | null;
  isFeatured: boolean;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, quantity: number, selectedExtras?: string[], selectedVariantIndex?: number) => void;
}

export function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showPoints, setShowPoints] = useState(false);
  const [points, setPoints] = useState(0);

  const hasExtras = product.hasVariants && product.variants && product.variants.length > 0 && 
    product.variants.some(v => v.name.startsWith('ohne') || v.name.startsWith('mit'));

  const handleAddToCart = () => {
    // Get current price (variant or base)
    const currentPrice = product.hasVariants && product.variants?.[selectedVariant]
      ? product.variants[selectedVariant].price
      : product.basePrice;
    
    // Calculate extras price
    const extrasPrice = selectedExtras.reduce((sum, extraName) => {
      const extra = product.variants?.find(v => v.name === extraName);
      return sum + (extra?.price || 0);
    }, 0);
    
    // Gamification: Award points based on price
    const earnedPoints = Math.floor((currentPrice + extrasPrice) / 100);
    setPoints(earnedPoints);
    setShowPoints(true);
    
    onAddToCart(product, quantity, selectedExtras, hasExtras ? undefined : selectedVariant);
    
    setTimeout(() => {
      setShowPoints(false);
      setShowDialog(false);
      setQuantity(1);
      setSelectedExtras([]);
    }, 2000);
  };

  const toggleExtra = (extraName: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraName)
        ? prev.filter(e => e !== extraName)
        : [...prev, extraName]
    );
  };

  const getCurrentPrice = () => {
    let price = product.hasVariants && product.variants?.[selectedVariant] && !hasExtras
      ? product.variants[selectedVariant].price
      : product.basePrice;
    
    // Add extras price
    const extrasPrice = selectedExtras.reduce((sum, extraName) => {
      const extra = product.variants?.find(v => v.name === extraName);
      return sum + (extra?.price || 0);
    }, 0);
    
    return price + extrasPrice;
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
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}
        
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-primary glow-green">
              {(product.basePrice / 100).toFixed(2)} €
            </span>
            <Button
              size="sm"
              className="glossy-button bg-primary hover:bg-primary/90 text-primary-foreground glow-green"
              onClick={(e) => {
                e.stopPropagation();
                setShowDialog(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          
          {product.hasVariants && !hasExtras && (
            <div className="mt-3 text-xs text-muted-foreground">
              ab {(product.basePrice / 100).toFixed(2)} €
            </div>
          )}
        </div>
        
        {/* Schnellansicht Badge */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3" />
          Schnellansicht
        </div>
      </motion.div>

      {/* Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glossy-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary glow-green flex items-center gap-2">
              {product.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setShowDialog(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {product.imageUrl && (
              <div className="aspect-video overflow-hidden rounded-2xl">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
            
            {/* Größenauswahl (für Pizza) */}
            {product.hasVariants && !hasExtras && product.variants && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Größe wählen:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedVariant === idx
                          ? 'border-primary bg-primary/10 glow-green'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-bold text-lg">{variant.name}</div>
                      <div className="text-primary font-black text-xl mt-1">
                        {(variant.price / 100).toFixed(2)} €
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Extras-Auswahl (für Döner) */}
            {hasExtras && product.variants && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Extras wählen:</h4>
                <div className="space-y-2">
                  {product.variants.map((extra, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <Checkbox
                        checked={selectedExtras.includes(extra.name)}
                        onCheckedChange={() => toggleExtra(extra.name)}
                      />
                      <span className="flex-1">{extra.name}</span>
                      {extra.price > 0 && (
                        <span className="text-primary font-bold">
                          +{(extra.price / 100).toFixed(2)} €
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Menge */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <span className="font-semibold text-lg">Menge:</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Gesamtpreis & Add Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Gesamtpreis</div>
                <div className="text-4xl font-black text-primary glow-green">
                  {((getCurrentPrice() * quantity) / 100).toFixed(2)} €
                </div>
              </div>
              <Button
                size="lg"
                className="glossy-button bg-primary hover:bg-primary/90 text-primary-foreground glow-green text-lg px-8"
                onClick={handleAddToCart}
              >
                <Plus className="mr-2 h-5 w-5" />
                In den Warenkorb
              </Button>
            </div>
            
            {/* Points Animation */}
            <AnimatePresence>
              {showPoints && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                >
                  <div className="bg-accent/95 backdrop-blur-sm text-accent-foreground px-8 py-6 rounded-3xl glow-orange shadow-2xl">
                    <div className="flex items-center gap-3">
                      <Zap className="w-12 h-12 fill-current" />
                      <div>
                        <div className="text-sm font-medium">Punkte verdient!</div>
                        <div className="text-4xl font-black">+{points}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

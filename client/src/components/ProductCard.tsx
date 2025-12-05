import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X, Star, Zap, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { MenuConfigDialog } from './MenuConfigDialog';
import { PizzaConfigDialog } from './PizzaConfigDialog';
import { CalzoneConfigDialog } from './CalzoneConfigDialog';
import { PideConfigDialog } from './PideConfigDialog';
import { SalatConfigDialog } from './SalatConfigDialog';

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
  const [showMenuConfig, setShowMenuConfig] = useState(false);
  const [showPizzaConfig, setShowPizzaConfig] = useState(false);
  const [showCalzoneConfig, setShowCalzoneConfig] = useState(false);
  const [showPideConfig, setShowPideConfig] = useState(false);
  const [showSalatConfig, setShowSalatConfig] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showPoints, setShowPoints] = useState(false);
  const [points, setPoints] = useState(0);

  const isMenu = product.slug.includes('menue-') || product.slug.includes('menu');

  const hasExtras = product.hasVariants && product.variants && product.variants.length > 0 && 
    product.variants.some(v => v.name.startsWith('ohne') || v.name.startsWith('mit'));

  const handleMenuConfigComplete = (config: any) => {
    const isPizzaMenu = product.name.toLowerCase().includes('pizza');
    const isMenu3 = product.name.toLowerCase().includes('menü 3');
    
    let menuExtras: string[];
    let extrasPrice = 0;
    
    // Helper function to extract price from extra text
    const extractPrice = (extraText: string): number => {
      const match = extraText.match(/\+(\d+),(\d+)/);
      if (match) {
        return parseInt(match[1]) * 100 + parseInt(match[2]);
      }
      return 0;
    };
    
    if (isPizzaMenu) {
      // Pizza menu formatting
      if (isMenu3) {
        // Menü 3: 1 Pizza + Extras + 1 Drink
        menuExtras = [
          `Pizza: ${config.pizza1.pizzaName}${config.pizza1.extras.length > 0 ? ' (' + config.pizza1.extras.join(', ') + ')' : ''}`,
          `Getränk: ${config.drink1}`
        ];
        // Calculate extras price for pizza 1
        extrasPrice = config.pizza1.extras.reduce((sum: number, extra: string) => {
          return sum + extractPrice(extra);
        }, 0);
      } else {
        // Menü 2: 2 Pizzas + Extras + 2 Drinks
        menuExtras = [
          `Pizza 1: ${config.pizza1.pizzaName}${config.pizza1.extras.length > 0 ? ' (' + config.pizza1.extras.join(', ') + ')' : ''}`,
          `Pizza 2: ${config.pizza2.pizzaName}${config.pizza2.extras.length > 0 ? ' (' + config.pizza2.extras.join(', ') + ')' : ''}`,
          `Getränk 1: ${config.drink1}`,
          `Getränk 2: ${config.drink2}`
        ];
        // Calculate extras price for both pizzas
        extrasPrice = config.pizza1.extras.reduce((sum: number, extra: string) => {
          return sum + extractPrice(extra);
        }, 0);
        extrasPrice += config.pizza2.extras.reduce((sum: number, extra: string) => {
          return sum + extractPrice(extra);
        }, 0);
      }
    } else {
      // Döner/Yufka menu formatting
      const itemName = product.name.toLowerCase().includes('yufka') ? 'Yufka' : 'Döner';
      menuExtras = [
        `${itemName} 1: ${config.item1.sauce}${config.item1.extras.length > 0 ? ', ' + config.item1.extras.join(', ') : ''}`,
        `${itemName} 2: ${config.item2.sauce}${config.item2.extras.length > 0 ? ', ' + config.item2.extras.join(', ') : ''}`,
        `Pommes: ${config.pommesSauce}`,
        `Getränk: ${config.drink}`
      ];
      // Calculate extras price for döner/yufka (mit Käse, mit Schafskäse)
      extrasPrice = config.item1.extras.reduce((sum: number, extra: string) => {
        return sum + extractPrice(extra);
      }, 0);
      extrasPrice += config.item2.extras.reduce((sum: number, extra: string) => {
        return sum + extractPrice(extra);
      }, 0);
    }
    
    // Create a modified product with adjusted price
    const productWithExtrasPrice = {
      ...product,
      basePrice: product.basePrice + extrasPrice
    };
    
    onAddToCart(productWithExtrasPrice, 1, menuExtras, 0);
  };

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
    
    if (isMenu) {
      setShowMenuConfig(true);
    } else {
      // Create modified product with total price (base + extras)
      const productWithTotalPrice = {
        ...product,
        basePrice: getCurrentPrice()
      };
      onAddToCart(productWithTotalPrice, quantity, selectedExtras, selectedVariant);
    }
    
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
      onClick={() => {
        if (isMenu) {
          setShowMenuConfig(true);
        } else if (product.slug.startsWith('pizza-') && product.hasVariants) {
          setShowPizzaConfig(true);
        } else {
          setShowDialog(true);
        }
      }}
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
                if (isMenu) {
                  setShowMenuConfig(true);
                } else if (product.slug.startsWith('pizza-') && product.hasVariants) {
                  setShowPizzaConfig(true);
                } else if (product.slug.startsWith('calzone-') || product.slug === 'vegetarische-calzone') {
                  setShowCalzoneConfig(true);
                } else if (product.slug.startsWith('pide-')) {
                  setShowPideConfig(true);
                } else if (product.slug.startsWith('salat-')) {
                  setShowSalatConfig(true);
                } else {
                  setShowDialog(true);
                }
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

      {/* Menu Configuration Dialog */}
      <MenuConfigDialog
        open={showMenuConfig}
        onClose={() => setShowMenuConfig(false)}
        onComplete={handleMenuConfigComplete}
        menuName={product.name}
      />

      {/* Pizza Configuration Dialog */}
      {product.hasVariants && product.variants && (
        <PizzaConfigDialog
          open={showPizzaConfig}
          onOpenChange={setShowPizzaConfig}
          pizzaName={product.name}
          sizes={product.variants.map(v => ({ name: v.name, price: v.price }))}
          onComplete={(config) => {
            // Extract price from extras
            const extractPrice = (extraText: string): number => {
              const match = extraText.match(/\+(\d+),(\d+)/);
              if (match) {
                return parseInt(match[1]) * 100 + parseInt(match[2]);
              }
              return 0;
            };
            
            // Calculate extras price
            const extrasPrice = config.extras.reduce((sum, extra) => {
              return sum + extractPrice(extra);
            }, 0);
            
            // Total price = size price + extras price
            const totalPrice = config.sizePrice + extrasPrice;
            
            // Format extras for display
            const extrasDisplay = config.extras.length > 0 
              ? [`Größe: ${config.size}`, ...config.extras]
              : [`Größe: ${config.size}`];
            
            // Create modified product with correct price
            const productWithPrice = {
              ...product,
              basePrice: totalPrice
            };
            
            onAddToCart(productWithPrice, 1, extrasDisplay, 0);
            setShowPizzaConfig(false);
          }}
        />
      )}

      {/* Calzone Configuration Dialog */}
      <CalzoneConfigDialog
        open={showCalzoneConfig}
        onOpenChange={setShowCalzoneConfig}
        calzoneName={product.name}
        onComplete={(config) => {
          // Extract price from extras
          const extractPrice = (extraText: string): number => {
            const match = extraText.match(/\+(\d+),(\d+)/);
            if (match) {
              return parseInt(match[1]) * 100 + parseInt(match[2]);
            }
            return 0;
          };
          
          // Calculate extras price
          const extrasPrice = config.extras.reduce((sum, extra) => {
            return sum + extractPrice(extra);
          }, 0);
          
          // Total price = base price + extras price
          const totalPrice = product.basePrice + extrasPrice;
          
          // Format extras for display
          const extrasDisplay = config.extras.length > 0 
            ? config.extras
            : [];
          
          // Create modified product with correct price
          const productWithPrice = {
            ...product,
            basePrice: totalPrice
          };
          
          onAddToCart(productWithPrice, 1, extrasDisplay, 0);
          setShowCalzoneConfig(false);
        }}
      />

      {/* Pide Configuration Dialog */}
      <PideConfigDialog
        open={showPideConfig}
        onOpenChange={setShowPideConfig}
        pideName={product.name}
        onComplete={(config) => {
          // Extract price from extras
          const extractPrice = (extraText: string): number => {
            const match = extraText.match(/\+(\d+),(\d+)/);
            if (match) {
              return parseInt(match[1]) * 100 + parseInt(match[2]);
            }
            return 0;
          };
          
          // Calculate extras price
          const extrasPrice = config.extras.reduce((sum, extra) => {
            return sum + extractPrice(extra);
          }, 0);
          
          // Total price = base price + extras price
          const totalPrice = product.basePrice + extrasPrice;
          
          // Format extras for display
          const extrasDisplay = config.extras.length > 0 
            ? config.extras
            : [];
          
          // Create modified product with correct price
          const productWithPrice = {
            ...product,
            basePrice: totalPrice
          };
          
          onAddToCart(productWithPrice, 1, extrasDisplay, 0);
          setShowPideConfig(false);
        }}
      />

      {/* Salat Configuration Dialog */}
      <SalatConfigDialog
        open={showSalatConfig}
        onOpenChange={setShowSalatConfig}
        salatName={product.name}
        onComplete={(config) => {
          // Dressing wird als Extra angezeigt
          const extrasDisplay = [config.dressing];
          
          // Preis bleibt gleich - Dressing ist inklusive
          onAddToCart(product, 1, extrasDisplay, 0);
          setShowSalatConfig(false);
        }}
      />
    </>
  );
}

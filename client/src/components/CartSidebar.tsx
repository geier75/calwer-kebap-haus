import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, getTotalPrice, isOpen, setIsOpen } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between glossy-card">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gradient-green">Warenkorb</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-24 h-24 text-muted-foreground/30 mb-4" />
                  <p className="text-lg text-muted-foreground">Ihr Warenkorb ist leer</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fügen Sie Produkte hinzu, um zu bestellen
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.variant || 'default'}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="glossy-card p-4 rounded-xl border border-border/50"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {item.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            Größe: {item.variant}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary glow-green mt-1">
                          {(item.price / 100).toFixed(2)} €
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1, item.variant)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-bold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1, item.variant)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg ml-auto text-destructive hover:bg-destructive/10"
                            onClick={() => removeItem(item.id, item.variant)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Zwischensumme:</span>
                      <span className="font-bold text-primary">
                        {((item.price * item.quantity) / 100).toFixed(2)} €
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border glossy-card space-y-4">
                {/* Delivery Info Banner */}
                <div 
                  className="p-4 rounded-lg border-2 border-primary/30 space-y-2"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                  }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mindestbestellwert:</span>
                    <span className="font-semibold text-primary">10,00 €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Liefergebühr:</span>
                    <span className="font-semibold text-primary">2,00 €</span>
                  </div>
                  <div className="pt-2 border-t border-primary/20 text-xs text-center text-green-400">
                    ✨ Ab 20€ versandkostenfrei!
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Gesamtsumme:</span>
                  <span className="text-2xl text-primary glow-green">
                    {(getTotalPrice() / 100).toFixed(2)} €
                  </span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full glow-orange hover-lift text-lg font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Zur Kasse
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center">
                  Lieferung innerhalb von 30-45 Minuten
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  variant?: string; // e.g., "26cm" or "30cm" for pizzas
  extras?: string[]; // e.g., ["ohne Zwiebeln", "mit Käse"] for döner
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number, variant?: string) => void;
  updateQuantity: (id: number, quantity: number, variant?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      // Check if item with same id and variant already exists
      const existingIndex = prev.findIndex(
        item => item.id === newItem.id && item.variant === newItem.variant
      );

      if (existingIndex > -1) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      // Add new item
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: number, variant?: string) => {
    setItems(prev =>
      prev.filter(item => !(item.id === id && item.variant === variant))
    );
  };

  const updateQuantity = (id: number, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeItem(id, variant);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

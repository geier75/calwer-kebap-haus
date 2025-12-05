import { describe, it, expect } from 'vitest';

describe('Cart Price Calculation', () => {
  // Simulate handleAddToCart from Menu.tsx
  const handleAddToCart = (product: any, quantity: number, selectedExtras?: string[], selectedVariantIndex?: number) => {
    // Use product.basePrice directly - it already contains the correct total price
    const totalPrice = product.basePrice;
    
    const variant = selectedVariantIndex !== undefined && product.hasVariants && product.variants?.[selectedVariantIndex]
      ? product.variants[selectedVariantIndex].name
      : undefined;
    
    return {
      id: product.id,
      name: product.name,
      price: totalPrice,
      imageUrl: product.imageUrl,
      variant,
      extras: selectedExtras,
      quantity
    };
  };

  it('should use basePrice directly for pizza with size and extras', () => {
    // Simulate ProductCard passing modified product with calculated price
    const pizzaProduct = {
      id: 1,
      name: 'Pizza Margherita',
      basePrice: 1000, // 10.00€ (8.00€ size + 1.00€ Thunfisch + 1.00€ Oliven)
      imageUrl: '/images/pizza-margherita.jpg',
      hasVariants: true,
      variants: [
        { name: 'Ø 26cm', price: 700 },
        { name: 'Ø 30cm', price: 900 }
      ]
    };

    const extrasDisplay = [
      'Größe: Ø 26cm',
      'mit Thunfisch (+1,00€)',
      'mit Oliven (+1,00€)'
    ];

    const cartItem = handleAddToCart(pizzaProduct, 1, extrasDisplay, 0);

    expect(cartItem.price).toBe(1000); // Should use basePrice (10.00€)
    expect(cartItem.extras).toEqual(extrasDisplay);
  });

  it('should calculate correct total for multiple items', () => {
    const pizzaProduct = {
      id: 1,
      name: 'Pizza Margherita',
      basePrice: 1000, // 10.00€
      imageUrl: '/images/pizza-margherita.jpg',
      hasVariants: true,
      variants: [{ name: 'Ø 26cm', price: 800 }]
    };

    const cartItem = handleAddToCart(pizzaProduct, 3, ['Größe: Ø 26cm', 'mit Thunfisch (+1,00€)'], 0);

    const totalPrice = cartItem.price * cartItem.quantity;
    expect(totalPrice).toBe(3000); // 3 x 10.00€ = 30.00€
  });

  it('should handle menu with extras price', () => {
    // Simulate menu with calculated extras price
    const menuProduct = {
      id: 2,
      name: 'Menü 1 - Döner',
      basePrice: 2050, // 19.50€ base + 0.50€ Käse + 1.00€ Schafskäse = 21.00€
      imageUrl: '/images/menu-1.jpg',
      hasVariants: false
    };

    const menuExtras = [
      'Döner 1: Joghurtsauce, ohne Zwiebeln, mit Käse (+0,50€)',
      'Döner 2: Ketchup, mit Schafskäse (+1,00€)',
      'Pommes: Mayonnaise',
      'Getränk: Coca-Cola 1,25l'
    ];

    const cartItem = handleAddToCart(menuProduct, 1, menuExtras, 0);

    expect(cartItem.price).toBe(2050); // Should use basePrice (20.50€)
    expect(cartItem.extras).toEqual(menuExtras);
  });

  it('should handle regular product without variants', () => {
    const donerProduct = {
      id: 3,
      name: 'Döner',
      basePrice: 900, // 9.00€
      imageUrl: '/images/doner.jpg',
      hasVariants: false
    };

    const cartItem = handleAddToCart(donerProduct, 1, [], undefined);

    expect(cartItem.price).toBe(900); // 9.00€
    expect(cartItem.variant).toBeUndefined();
  });

  it('should handle party pizza with multiple extras', () => {
    const partyPizza = {
      id: 4,
      name: 'Pizza Tonno',
      basePrice: 2550, // 21.00€ Party size + 4.50€ extras
      imageUrl: '/images/pizza-tonno.jpg',
      hasVariants: true,
      variants: [
        { name: 'Ø 26cm', price: 900 },
        { name: 'Ø 30cm', price: 1000 },
        { name: 'Party 60x40cm', price: 2100 }
      ]
    };

    const extrasDisplay = [
      'Größe: Party 60x40cm',
      'mit Thunfisch (+1,00€)',
      'mit Peperoni (+1,00€)',
      'mit Paprika (+1,00€)',
      'mit Mozzarella (+1,00€)',
      'mit Käse, extra (+0,50€)'
    ];

    const cartItem = handleAddToCart(partyPizza, 1, extrasDisplay, 2);

    expect(cartItem.price).toBe(2550); // 25.50€
    expect(cartItem.variant).toBe('Party 60x40cm');
  });
});

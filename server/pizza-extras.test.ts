import { describe, it, expect } from 'vitest';

describe('Pizza Extras Price Calculation', () => {
  // Helper function to extract price from extra text (same as in ProductCard)
  const extractPrice = (extraText: string): number => {
    const match = extraText.match(/\+(\d+),(\d+)/);
    if (match) {
      return parseInt(match[1]) * 100 + parseInt(match[2]);
    }
    return 0;
  };

  it('should extract price from formatted extra string with 1 euro', () => {
    const extra = 'mit Oliven (+1,00€)';
    const price = extractPrice(extra);
    expect(price).toBe(100); // 1.00€ = 100 cents
  });

  it('should extract price from formatted extra string with 0.50 euro', () => {
    const extra = 'mit Käse, extra (+0,50€)';
    const price = extractPrice(extra);
    expect(price).toBe(50); // 0.50€ = 50 cents
  });

  it('should return 0 for extras without price', () => {
    const extra = 'mit Knoblauch';
    const price = extractPrice(extra);
    expect(price).toBe(0);
  });

  it('should calculate total price for multiple extras', () => {
    const extras = [
      'mit Thunfisch (+1,00€)',
      'mit Oliven (+1,00€)',
      'mit Käse, extra (+0,50€)'
    ];
    
    const totalExtrasPrice = extras.reduce((sum, extra) => {
      return sum + extractPrice(extra);
    }, 0);
    
    expect(totalExtrasPrice).toBe(250); // 1.00 + 1.00 + 0.50 = 2.50€ = 250 cents
  });

  it('should calculate total pizza price with size and extras', () => {
    const sizePrice = 800; // 8.00€ for Ø 26cm
    const extras = [
      'mit Thunfisch (+1,00€)',
      'mit Champignons (+1,00€)'
    ];
    
    const extrasPrice = extras.reduce((sum, extra) => {
      return sum + extractPrice(extra);
    }, 0);
    
    const totalPrice = sizePrice + extrasPrice;
    
    expect(totalPrice).toBe(1000); // 8.00 + 1.00 + 1.00 = 10.00€ = 1000 cents
  });

  it('should handle pizza with no extras', () => {
    const sizePrice = 900; // 9.00€ for Ø 30cm
    const extras: string[] = [];
    
    const extrasPrice = extras.reduce((sum, extra) => {
      return sum + extractPrice(extra);
    }, 0);
    
    const totalPrice = sizePrice + extrasPrice;
    
    expect(totalPrice).toBe(900); // 9.00€ = 900 cents (no extras)
  });

  it('should handle pizza with only free extras (Knoblauch)', () => {
    const sizePrice = 1000; // 10.00€ for Ø 32cm
    const extras = ['mit Knoblauch'];
    
    const extrasPrice = extras.reduce((sum, extra) => {
      return sum + extractPrice(extra);
    }, 0);
    
    const totalPrice = sizePrice + extrasPrice;
    
    expect(totalPrice).toBe(1000); // 10.00€ = 1000 cents (Knoblauch is free)
  });

  it('should calculate price for Party pizza with multiple extras', () => {
    const sizePrice = 2100; // 21.00€ for Party 60x40cm
    const extras = [
      'mit Thunfisch (+1,00€)',
      'mit Peperoni (+1,00€)',
      'mit Paprika (+1,00€)',
      'mit Mozzarella (+1,00€)',
      'mit Käse, extra (+0,50€)'
    ];
    
    const extrasPrice = extras.reduce((sum, extra) => {
      return sum + extractPrice(extra);
    }, 0);
    
    const totalPrice = sizePrice + extrasPrice;
    
    expect(totalPrice).toBe(2550); // 21.00 + 1.00 + 1.00 + 1.00 + 1.00 + 0.50 = 25.50€ = 2550 cents
  });
});

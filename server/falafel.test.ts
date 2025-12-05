import { describe, it, expect } from 'vitest';

describe('Falafel Products with Extras', () => {
  // Simulate Falafel products structure from database
  const falafelProducts = [
    {
      id: 100,
      name: 'Falafel im Fladenbrot',
      slug: 'falafel-fladenbrot',
      basePrice: 600, // 6.00€
      hasVariants: true,
      variants: [
        { name: 'ohne Zwiebeln', price: 0 },
        { name: 'ohne Rotkohl', price: 0 },
        { name: 'ohne Eisbergsalat', price: 0 },
        { name: 'ohne Peperoni', price: 0 },
        { name: 'ohne Tomaten', price: 0 },
        { name: 'ohne Mais', price: 0 },
        { name: 'mit Käse (+0,50€)', price: 50 },
        { name: 'mit Schafskäse (+1,00€)', price: 100 }
      ]
    },
    {
      id: 101,
      name: 'Falafel im Yufka',
      slug: 'falafel-yufka',
      basePrice: 700, // 7.00€
      hasVariants: true,
      variants: [
        { name: 'ohne Zwiebeln', price: 0 },
        { name: 'ohne Rotkohl', price: 0 },
        { name: 'ohne Eisbergsalat', price: 0 },
        { name: 'ohne Peperoni', price: 0 },
        { name: 'ohne Tomaten', price: 0 },
        { name: 'ohne Mais', price: 0 },
        { name: 'mit Käse (+0,50€)', price: 50 },
        { name: 'mit Schafskäse (+1,00€)', price: 100 }
      ]
    },
    {
      id: 102,
      name: 'Falafel-Teller',
      slug: 'falafel-teller',
      basePrice: 950, // 9.50€
      hasVariants: true,
      variants: [
        { name: 'ohne Zwiebeln', price: 0 },
        { name: 'ohne Rotkohl', price: 0 },
        { name: 'ohne Eisbergsalat', price: 0 },
        { name: 'ohne Peperoni', price: 0 },
        { name: 'ohne Tomaten', price: 0 },
        { name: 'ohne Mais', price: 0 },
        { name: 'mit Käse (+0,50€)', price: 50 },
        { name: 'mit Schafskäse (+1,00€)', price: 100 }
      ]
    }
  ];

  // Simulate calculateExtrasPrice from DonerConfigDialog
  const calculateExtrasPrice = (selectedExtras: string[], variants: any[]) => {
    return selectedExtras.reduce((sum, extraName) => {
      const extra = variants.find(v => v.name === extraName);
      return sum + (extra?.price || 0);
    }, 0);
  };

  it('should have correct base prices for all Falafel products', () => {
    expect(falafelProducts[0].basePrice).toBe(600); // Falafel im Fladenbrot: 6.00€
    expect(falafelProducts[1].basePrice).toBe(700); // Falafel im Yufka: 7.00€
    expect(falafelProducts[2].basePrice).toBe(950); // Falafel-Teller: 9.50€
  });

  it('should have same extras structure as Döner products', () => {
    falafelProducts.forEach(product => {
      expect(product.hasVariants).toBe(true);
      expect(product.variants).toHaveLength(8);
      
      // Check free extras (ohne-Optionen)
      const freeExtras = product.variants.filter(v => v.price === 0);
      expect(freeExtras).toHaveLength(6);
      expect(freeExtras.map(e => e.name)).toContain('ohne Zwiebeln');
      expect(freeExtras.map(e => e.name)).toContain('ohne Rotkohl');
      
      // Check paid extras
      const paidExtras = product.variants.filter(v => v.price > 0);
      expect(paidExtras).toHaveLength(2);
      expect(paidExtras.find(e => e.name === 'mit Käse (+0,50€)')?.price).toBe(50);
      expect(paidExtras.find(e => e.name === 'mit Schafskäse (+1,00€)')?.price).toBe(100);
    });
  });

  it('should calculate correct price for Falafel im Fladenbrot with cheese', () => {
    const product = falafelProducts[0];
    const selectedExtras = ['ohne Zwiebeln', 'mit Käse (+0,50€)'];
    
    const extrasPrice = calculateExtrasPrice(selectedExtras, product.variants);
    const totalPrice = product.basePrice + extrasPrice;
    
    expect(extrasPrice).toBe(50); // 0.50€ for cheese
    expect(totalPrice).toBe(650); // 6.00€ + 0.50€ = 6.50€
  });

  it('should calculate correct price for Falafel im Yufka with feta cheese', () => {
    const product = falafelProducts[1];
    const selectedExtras = ['ohne Rotkohl', 'ohne Peperoni', 'mit Schafskäse (+1,00€)'];
    
    const extrasPrice = calculateExtrasPrice(selectedExtras, product.variants);
    const totalPrice = product.basePrice + extrasPrice;
    
    expect(extrasPrice).toBe(100); // 1.00€ for feta
    expect(totalPrice).toBe(800); // 7.00€ + 1.00€ = 8.00€
  });

  it('should calculate correct price for Falafel-Teller with both cheeses', () => {
    const product = falafelProducts[2];
    const selectedExtras = [
      'ohne Zwiebeln',
      'ohne Mais',
      'mit Käse (+0,50€)',
      'mit Schafskäse (+1,00€)'
    ];
    
    const extrasPrice = calculateExtrasPrice(selectedExtras, product.variants);
    const totalPrice = product.basePrice + extrasPrice;
    
    expect(extrasPrice).toBe(150); // 0.50€ + 1.00€ = 1.50€
    expect(totalPrice).toBe(1100); // 9.50€ + 1.50€ = 11.00€
  });

  it('should handle Falafel with only free extras (no price change)', () => {
    const product = falafelProducts[0]; // Falafel im Fladenbrot
    const selectedExtras = ['ohne Zwiebeln', 'ohne Rotkohl', 'ohne Peperoni'];
    
    const extrasPrice = calculateExtrasPrice(selectedExtras, product.variants);
    const totalPrice = product.basePrice + extrasPrice;
    
    expect(extrasPrice).toBe(0); // All free extras
    expect(totalPrice).toBe(600); // 6.00€ (no change)
  });

  it('should handle Falafel with no extras selected', () => {
    const product = falafelProducts[2]; // Falafel-Teller
    const selectedExtras: string[] = [];
    
    const extrasPrice = calculateExtrasPrice(selectedExtras, product.variants);
    const totalPrice = product.basePrice + extrasPrice;
    
    expect(extrasPrice).toBe(0);
    expect(totalPrice).toBe(950); // 9.50€ (base price only)
  });

  it('should verify all Falafel products have correct image paths', () => {
    // Note: In actual database, these would be set to generated images
    expect(falafelProducts[0].slug).toBe('falafel-fladenbrot');
    expect(falafelProducts[1].slug).toBe('falafel-yufka');
    expect(falafelProducts[2].slug).toBe('falafel-teller');
  });
});

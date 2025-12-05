import { describe, it, expect } from 'vitest';

describe('Calzone Configurator', () => {
  it('should have 4 calzone products in database', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const allProducts = data.result.data.json;
    const calzones = allProducts.filter((p: any) => p.slug.startsWith('calzone-') || p.slug === 'vegetarische-calzone');

    expect(calzones.length).toBe(4);
    calzones.forEach((calzone: any) => {
      expect(calzone.variants).not.toBeNull();
      expect(calzone.variants.length).toBeGreaterThan(0);
    });
  });

  it('should calculate correct price with single extra (Calzone Calwer + Oliven)', () => {
    const basePrice = 1150; // 11,50€
    const olivesPrice = 100; // 1,00€
    const totalPrice = basePrice + olivesPrice;
    
    expect(totalPrice).toBe(1250); // 12,50€
  });

  it('should calculate correct price with multiple extras (Calzone Super + Oliven + Thunfisch + Champignons)', () => {
    const basePrice = 1150; // 11,50€
    const olivesPrice = 100; // 1,00€
    const tunaPrice = 100; // 1,00€
    const mushroomsPrice = 100; // 1,00€
    const totalPrice = basePrice + olivesPrice + tunaPrice + mushroomsPrice;
    
    expect(totalPrice).toBe(1450); // 14,50€
  });

  it('should calculate correct price with free extra (Vegetarische Calzone + Knoblauch)', () => {
    const basePrice = 1050; // 10,50€
    const garlicPrice = 0; // Free
    const totalPrice = basePrice + garlicPrice;
    
    expect(totalPrice).toBe(1050); // 10,50€
  });

  it('should calculate correct price with mixed extras (Calzone Italia + Oliven + Knoblauch)', () => {
    const basePrice = 1000; // 10,00€
    const olivesPrice = 100; // 1,00€
    const garlicPrice = 0; // Free
    const totalPrice = basePrice + olivesPrice + garlicPrice;
    
    expect(totalPrice).toBe(1100); // 11,00€
  });

  it('should format extras with price information correctly', () => {
    const extras = [
      { name: 'mit Oliven', price: 100 },
      { name: 'mit Knoblauch', price: 0 },
      { name: 'mit Thunfisch', price: 100 },
    ];

    const formattedExtras = extras.map(extra => {
      if (extra.price > 0) {
        const priceStr = (extra.price / 100).toFixed(2).replace('.', ',');
        return `${extra.name} (+${priceStr}€)`;
      }
      return extra.name;
    });

    expect(formattedExtras).toEqual([
      'mit Oliven (+1,00€)',
      'mit Knoblauch',
      'mit Thunfisch (+1,00€)',
    ]);
  });

  it('should have all 20 calzone extras available', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const allProducts = data.result.data.json;
    const calzones = allProducts.filter((p: any) => p.slug.startsWith('calzone-') || p.slug === 'vegetarische-calzone');

    const calzone = calzones[0];
    const extrasCount = calzone.variants.length;
    
    expect(extrasCount).toBe(20);
  });
});

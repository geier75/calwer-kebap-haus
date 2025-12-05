import { describe, it, expect } from 'vitest';

describe('Calzone Products', () => {
  it('should have correct base prices for all calzones', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const calzones = data.result.data.json;

    const calwerCalzone = calzones.find((p: any) => p.slug === 'calzone-calwer');
    const superCalzone = calzones.find((p: any) => p.slug === 'calzone-super');
    const vegetarianCalzone = calzones.find((p: any) => p.slug === 'vegetarische-calzone');
    const italiaCalzone = calzones.find((p: any) => p.slug === 'calzone-italia-mozzarella');

    expect(calwerCalzone.basePrice).toBe(1150); // 11,50€
    expect(superCalzone.basePrice).toBe(1150); // 11,50€
    expect(vegetarianCalzone.basePrice).toBe(1050); // 10,50€
    expect(italiaCalzone.basePrice).toBe(1000); // 10,00€
  });

  it('should have 20 pizza extras for all calzones', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const allProducts = data.result.data.json;
    const calzones = allProducts.filter((p: any) => p.slug.startsWith('calzone-') || p.slug === 'vegetarische-calzone');

    calzones.forEach((calzone: any) => {
      expect(calzone.variants).toHaveLength(20);
    });
  });

  it('should have correct image paths', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const calzones = data.result.data.json;

    const calwerCalzone = calzones.find((p: any) => p.slug === 'calzone-calwer');
    const superCalzone = calzones.find((p: any) => p.slug === 'calzone-super');
    const vegetarianCalzone = calzones.find((p: any) => p.slug === 'vegetarische-calzone');
    const italiaCalzone = calzones.find((p: any) => p.slug === 'calzone-italia-mozzarella');

    expect(calwerCalzone.imageUrl).toBe('/images/calzone-calwer.jpg');
    expect(superCalzone.imageUrl).toBe('/images/calzone-super.jpg');
    expect(vegetarianCalzone.imageUrl).toBe('/images/vegetarische-calzone.jpg');
    expect(italiaCalzone.imageUrl).toBe('/images/calzone-italia-mozzarella.jpg');
  });

  it('should include olives extra with 1€ price', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const allProducts = data.result.data.json;
    const calzones = allProducts.filter((p: any) => p.slug.startsWith('calzone-') || p.slug === 'vegetarische-calzone');

    calzones.forEach((calzone: any) => {
      const olivesExtra = calzone.variants.find((v: any) => v.name === 'mit Oliven');
      expect(olivesExtra).toBeDefined();
      expect(olivesExtra.price).toBe(100); // 1,00€
    });
  });

  it('should include free garlic extra', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const allProducts = data.result.data.json;
    const calzones = allProducts.filter((p: any) => p.slug.startsWith('calzone-') || p.slug === 'vegetarische-calzone');

    calzones.forEach((calzone: any) => {
      const garlicExtra = calzone.variants.find((v: any) => v.name === 'mit Knoblauch');
      expect(garlicExtra).toBeDefined();
      expect(garlicExtra.price).toBe(0); // Free
    });
  });

  it('should calculate correct price with extras (Calzone Calwer + Oliven + Thunfisch)', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const calzones = data.result.data.json;

    const calwerCalzone = calzones.find((p: any) => p.slug === 'calzone-calwer');
    const olivesExtra = calwerCalzone.variants.find((v: any) => v.name === 'mit Oliven');
    const tunaExtra = calwerCalzone.variants.find((v: any) => v.name === 'mit Thunfisch');

    const totalPrice = calwerCalzone.basePrice + olivesExtra.price + tunaExtra.price;
    expect(totalPrice).toBe(1350); // 11,50€ + 1,00€ + 1,00€ = 13,50€
  });

  it('should have correct descriptions', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/menu.products?input=%7B%22categoryId%22%3A30038%7D');
    const data = await response.json();
    const calzones = data.result.data.json;

    const calwerCalzone = calzones.find((p: any) => p.slug === 'calzone-calwer');
    const superCalzone = calzones.find((p: any) => p.slug === 'calzone-super');
    const vegetarianCalzone = calzones.find((p: any) => p.slug === 'vegetarische-calzone');
    const italiaCalzone = calzones.find((p: any) => p.slug === 'calzone-italia-mozzarella');

    expect(calwerCalzone.description).toContain('Truthahnsalami');
    expect(superCalzone.description).toContain('Champignons');
    expect(vegetarianCalzone.description).toContain('Artischocken');
    expect(italiaCalzone.description).toContain('Mozzarella');
  });
});

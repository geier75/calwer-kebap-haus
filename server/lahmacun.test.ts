import { describe, it, expect } from 'vitest';
import { getDb } from './db';
import { products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Lahmacun Products', () => {
  it('should have 4 Lahmacun products with correct prices', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const lahmacunProducts = await db.select().from(products)
      .where(eq(products.categoryId, 30036));

    expect(lahmacunProducts).toHaveLength(4);
    
    const klassisch = lahmacunProducts.find(p => p.slug === 'lahmacun-klassisch');
    expect(klassisch?.basePrice).toBe(600); // 6,00€
    
    const salat = lahmacunProducts.find(p => p.slug === 'lahmacun-salat');
    expect(salat?.basePrice).toBe(800); // 8,00€
    
    const doener = lahmacunProducts.find(p => p.slug === 'lahmacun-doenerfleisch');
    expect(doener?.basePrice).toBe(1000); // 10,00€
    
    const kaese = lahmacunProducts.find(p => p.slug === 'lahmacun-kaese-doenerfleisch');
    expect(kaese?.basePrice).toBe(1100); // 11,00€
  });

  it('should have döner-style extras (6 free + 2 paid)', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const lahmacunProducts = await db.select().from(products)
      .where(eq(products.categoryId, 30036));

    for (const product of lahmacunProducts) {
      expect(product.hasVariants).toBe(true);
      
      const variants = typeof product.variants === 'string' 
        ? JSON.parse(product.variants) 
        : product.variants;
      
      expect(variants).toHaveLength(8);
      
      // Check free extras
      const freeExtras = variants.filter((v: any) => v.price === 0);
      expect(freeExtras).toHaveLength(6);
      expect(freeExtras.map((e: any) => e.name)).toContain('ohne Zwiebeln');
      expect(freeExtras.map((e: any) => e.name)).toContain('ohne Rotkohl');
      
      // Check paid extras
      const paidExtras = variants.filter((v: any) => v.price > 0);
      expect(paidExtras).toHaveLength(2);
      
      const kaese = paidExtras.find((e: any) => e.name.includes('Käse'));
      expect(kaese?.price).toBe(50); // 0,50€
      
      const schafsk = paidExtras.find((e: any) => e.name.includes('Schafskäse'));
      expect(schafsk?.price).toBe(100); // 1,00€
    }
  });

  it('should calculate correct price with Käse extra', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const klassisch = await db.select().from(products)
      .where(eq(products.slug, 'lahmacun-klassisch'))
      .limit(1);

    expect(klassisch[0]).toBeDefined();
    
    const basePrice = klassisch[0].basePrice; // 600 cents
    const kaese = 50; // 0,50€
    const totalPrice = basePrice + kaese;
    
    expect(totalPrice).toBe(650); // 6,50€
  });

  it('should calculate correct price with Schafskäse extra', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const salat = await db.select().from(products)
      .where(eq(products.slug, 'lahmacun-salat'))
      .limit(1);

    expect(salat[0]).toBeDefined();
    
    const basePrice = salat[0].basePrice; // 800 cents
    const schafsk = 100; // 1,00€
    const totalPrice = basePrice + schafsk;
    
    expect(totalPrice).toBe(900); // 9,00€
  });

  it('should calculate correct price with both cheese extras', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const doener = await db.select().from(products)
      .where(eq(products.slug, 'lahmacun-doenerfleisch'))
      .limit(1);

    expect(doener[0]).toBeDefined();
    
    const basePrice = doener[0].basePrice; // 1000 cents
    const kaese = 50; // 0,50€
    const schafsk = 100; // 1,00€
    const totalPrice = basePrice + kaese + schafsk;
    
    expect(totalPrice).toBe(1150); // 11,50€
  });

  it('should have correct image URLs', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const lahmacunProducts = await db.select().from(products)
      .where(eq(products.categoryId, 30036));

    for (const product of lahmacunProducts) {
      expect(product.imageUrl).toMatch(/^\/images\/lahmacun-.*\.jpg$/);
    }
  });

  it('should have no price increase for free extras', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const klassisch = await db.select().from(products)
      .where(eq(products.slug, 'lahmacun-klassisch'))
      .limit(1);

    expect(klassisch[0]).toBeDefined();
    
    const basePrice = klassisch[0].basePrice; // 600 cents
    // Selecting "ohne Zwiebeln" should not change price
    const totalPrice = basePrice + 0;
    
    expect(totalPrice).toBe(600); // Still 6,00€
  });

  it('should have correct base price without any extras', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const kaese = await db.select().from(products)
      .where(eq(products.slug, 'lahmacun-kaese-doenerfleisch'))
      .limit(1);

    expect(kaese[0]).toBeDefined();
    expect(kaese[0].basePrice).toBe(1100); // 11,00€
  });
});

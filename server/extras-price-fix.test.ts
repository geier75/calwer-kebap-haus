import { describe, it, expect } from 'vitest';
import { getDb } from './db';
import { products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Extras Price Calculation Fix', () => {
  it('Lahmacun products should have correct base prices', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const lahmacunProducts = await db.select().from(products)
      .where(eq(products.categoryId, 30036));

    expect(lahmacunProducts.length).toBeGreaterThan(0);
    
    for (const product of lahmacunProducts) {
      expect(product.basePrice).toBeGreaterThan(0);
      expect(product.hasVariants).toBe(true);
    }
  });

  it('Falafel products should have correct base prices', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const falafelProducts = await db.select().from(products)
      .where(eq(products.categoryId, 30035));

    expect(falafelProducts.length).toBe(3);
    
    const fladenbrot = falafelProducts.find(p => p.slug === 'falafel-fladenbrot');
    expect(fladenbrot?.basePrice).toBe(600); // 6,00€
    
    const yufka = falafelProducts.find(p => p.slug === 'falafel-yufka');
    expect(yufka?.basePrice).toBe(700); // 7,00€
    
    const teller = falafelProducts.find(p => p.slug === 'falafel-teller');
    expect(teller?.basePrice).toBe(950); // 9,50€
  });

  it('Döner menus should have images', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const doenerMenu = await db.select().from(products)
      .where(eq(products.slug, 'menue-1-doener'))
      .limit(1);

    expect(doenerMenu[0]).toBeDefined();
    expect(doenerMenu[0].imageUrl).toBe('/images/menue-1-doener.jpg');
  });

  it('Yufka menu should have image', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const yufkaMenu = await db.select().from(products)
      .where(eq(products.slug, 'yufka-menu'))
      .limit(1);

    expect(yufkaMenu[0]).toBeDefined();
    expect(yufkaMenu[0].imageUrl).toBe('/images/yufka-menu.jpg');
  });

  it('Lahmacun with Käse extra should calculate correct price', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const klassisch = await db.select().from(products)
      .where(eq(products.slug, 'lahmacun-klassisch'))
      .limit(1);

    expect(klassisch[0]).toBeDefined();
    
    const basePrice = klassisch[0].basePrice; // 600 cents
    const variants = typeof klassisch[0].variants === 'string' 
      ? JSON.parse(klassisch[0].variants) 
      : klassisch[0].variants;
    
    const kaese = variants.find((v: any) => v.name.includes('Käse') && !v.name.includes('Schafskäse'));
    expect(kaese?.price).toBe(50); // 0,50€
    
    const totalPrice = basePrice + kaese.price;
    expect(totalPrice).toBe(650); // 6,50€
  });

  it('Falafel with Schafskäse extra should calculate correct price', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const fladenbrot = await db.select().from(products)
      .where(eq(products.slug, 'falafel-fladenbrot'))
      .limit(1);

    expect(fladenbrot[0]).toBeDefined();
    
    const basePrice = fladenbrot[0].basePrice; // 600 cents
    const variants = typeof fladenbrot[0].variants === 'string' 
      ? JSON.parse(fladenbrot[0].variants) 
      : fladenbrot[0].variants;
    
    const schafsk = variants.find((v: any) => v.name.includes('Schafskäse'));
    expect(schafsk?.price).toBe(100); // 1,00€
    
    const totalPrice = basePrice + schafsk.price;
    expect(totalPrice).toBe(700); // 7,00€
  });
});

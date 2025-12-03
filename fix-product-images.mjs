import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema.ts';
import { eq, like } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function fixProductImages() {
  console.log('Fixing product images...');
  
  // Fix drinks: 0.33L cans
  await db.update(products)
    .set({ imageUrl: '/images/cola-dose-033.jpg' })
    .where(like(products.name, '%Cola%'));
  
  await db.update(products)
    .set({ imageUrl: '/images/fanta-dose-033.jpg' })
    .where(like(products.name, '%Fanta%'));
  
  await db.update(products)
    .set({ imageUrl: '/images/fanta-dose-033.jpg' })
    .where(like(products.name, '%Sprite%'));
  
  // Fix vegetarian döner: no meat
  await db.update(products)
    .set({ imageUrl: '/images/vegetarischer-doener.jpg' })
    .where(like(products.name, '%Vegetarisch%'));
  
  console.log('✅ Product images fixed successfully!');
  process.exit(0);
}

fixProductImages().catch(err => {
  console.error('Error fixing images:', err);
  process.exit(1);
});

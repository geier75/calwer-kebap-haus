import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema.ts';
import { eq, like } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function updateRealImages() {
  console.log('Updating product images with real photos...');
  
  // Update Döner products
  await db.update(products)
    .set({ imageUrl: '/images/doener-real.jpg' })
    .where(like(products.name, '%Döner%'));
  
  // Update Yufka/Wrap products
  await db.update(products)
    .set({ imageUrl: '/images/doener-wrap-real.jpg' })
    .where(like(products.name, '%Yufka%'));
  
  // Update Pizza products
  await db.update(products)
    .set({ imageUrl: '/images/pizza-margherita-real.jpg' })
    .where(like(products.name, '%Pizza%'));
  
  // Update Drinks
  await db.update(products)
    .set({ imageUrl: '/images/drinks-real.jpg' })
    .where(like(products.name, '%Cola%'));
    
  await db.update(products)
    .set({ imageUrl: '/images/drinks-real.jpg' })
    .where(like(products.name, '%Fanta%'));
    
  await db.update(products)
    .set({ imageUrl: '/images/drinks-real.jpg' })
    .where(like(products.name, '%Sprite%'));
  
  console.log('✅ Product images updated successfully!');
  process.exit(0);
}

updateRealImages().catch(err => {
  console.error('Error updating images:', err);
  process.exit(1);
});

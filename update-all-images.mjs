import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { products } from './drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

const imageUpdates = [
  // Döner & Yufka
  { slug: 'doener-kebap', image: '/images/doener-kebap-premium.jpg' },
  { slug: 'yufka-dueruem', image: '/images/yufka-durum.jpg' },
  { slug: 'lahmacun', image: '/images/lahmacun-premium.jpg' },
  { slug: 'falafel-teller', image: '/images/falafel-teller.jpg' },
  
  // Pizza
  { slug: 'pizza-margherita', image: '/images/pizza-margherita-premium.jpg' },
  { slug: 'pizza-salami', image: '/images/pizza-salami.jpg' },
  { slug: 'pizza-funghi', image: '/images/pizza-funghi.jpg' },
  { slug: 'pizza-tonno', image: '/images/pizza-tonno.jpg' },
  { slug: 'pizza-hawaii', image: '/images/pizza-hawaii.jpg' },
  
  // Türkische Spezialitäten
  { slug: 'adana-kebap', image: '/images/adana-kebap.jpg' },
  { slug: 'pide-sucuklu', image: '/images/pide-sucuklu.jpg' },
  { slug: 'kofte-teller', image: '/images/kofte-teller.jpg' },
  
  // Salate & Beilagen
  { slug: 'gemischter-salat', image: '/images/gemischter-salat.jpg' },
  { slug: 'pommes-frites', image: '/images/pommes-frites-premium.jpg' },
  
  // Getränke
  { slug: 'cola-033l', image: '/images/cola-dose.jpg' },
  { slug: 'fanta-033l', image: '/images/cola-dose.jpg' }, // Placeholder
  { slug: 'sprite-033l', image: '/images/cola-dose.jpg' }, // Placeholder
];

console.log('Updating product images...');

for (const update of imageUpdates) {
  try {
    await db.update(products)
      .set({ image: update.image })
      .where(eq(products.slug, update.slug));
    console.log(`✓ Updated ${update.slug}`);
  } catch (error) {
    console.error(`✗ Failed to update ${update.slug}:`, error.message);
  }
}

console.log('✅ All product images updated!');
process.exit(0);

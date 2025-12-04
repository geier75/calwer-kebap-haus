import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🗑️  Clearing existing data...');
await db.delete(schema.products);
await db.delete(schema.categories);

console.log('📝 Creating categories...');
const categoryIds = {};

const categories = [
  { name: 'Menüs', slug: 'menues', sortOrder: 1 },
  { name: 'Best of the Month', slug: 'best-of-month', sortOrder: 2 },
  { name: 'Pizza', slug: 'pizza', sortOrder: 3 },
  { name: 'Falafel', slug: 'falafel', sortOrder: 4 },
  { name: 'Teiggerichte', slug: 'teiggerichte', sortOrder: 5 },
  { name: 'Döner', slug: 'doener', sortOrder: 6 },
  { name: 'Calzone', slug: 'calzone', sortOrder: 7 },
  { name: 'Pommes', slug: 'pommes', sortOrder: 8 },
  { name: 'Salate', slug: 'salate', sortOrder: 9 },
  { name: 'Saucen / Dips', slug: 'saucen', sortOrder: 10 },
  { name: 'Alkoholfreie Getränke', slug: 'getraenke', sortOrder: 11 }
];

for (const cat of categories) {
  const [result] = await db.insert(schema.categories).values(cat);
  categoryIds[cat.slug] = Number(result.insertId);
  console.log(`✅ Created category: ${cat.name}`);
}

console.log('🍕 Creating products...');

// Döner-Extras (ohne-Optionen + kostenpflichtige Extras)
const doenerExtras = JSON.stringify([
  { name: 'ohne Zwiebeln', price: 0 },
  { name: 'ohne Rotkraut', price: 0 },
  { name: 'ohne Eisbergsalat', price: 0 },
  { name: 'ohne Peperoni', price: 0 },
  { name: 'ohne Tomaten', price: 0 },
  { name: 'ohne Mais', price: 0 },
  { name: 'mit Schafskäse', price: 100 },
  { name: 'mit Käse', price: 50 }
]);

// Pizza-Größen (26cm und 30cm)
const pizzaSizes = (price26, price30) => JSON.stringify([
  { name: 'Ø 26cm', price: price26 },
  { name: 'Ø 30cm', price: price30 }
]);

// MENÜS
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['menues'],
    name: 'Menü 1 - Döner',
    slug: 'menue-1-doener',
    description: '2x Döner + 1x große Pommes + 1x alkoholfreies Getränk (1,25l) nach Wahl',
    basePrice: 1950,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['menues'],
    name: 'Menü 2 - Pizza',
    slug: 'menue-2-pizza',
    description: '2x Pizza (30cm) + 2 Beilagensalate + 2x alkoholfreie Getränke (0,33l) nach Wahl',
    basePrice: 3000,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['menues'],
    name: 'Menü 3 - Pizza',
    slug: 'menue-3-pizza',
    description: '1x Pizza (26cm) + 1x Beilagensalat + 1x alkoholfreies Getränk (0,33l) nach Wahl',
    basePrice: 1500,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['menues'],
    name: 'Kindermenü 1',
    slug: 'kindermenue-1',
    description: '2x Schüler Döner + 1x Pommes frites + 2x Durstlöscher (0,5l) nach Wahl',
    basePrice: 1500,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 4
  }
]);

// DÖNER (mit Extras)
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['doener'],
    name: 'Jumbo Döner',
    slug: 'jumbo-doener',
    description: 'Brotteig, Dönerfleisch (Kalb), Gurken, Eisbergsalat, Mais, Tomaten, Zwiebeln, Krautsalat & Peperoni (mild)',
    basePrice: 1100,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Schüler Döner',
    slug: 'schueler-doener',
    description: 'Brotteig, Dönerfleisch (Kalb), Gurken, Eisbergsalat, Tomaten, Mais, Zwiebeln, Krautsalat & Peperoni (mild)',
    basePrice: 700,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Döner',
    slug: 'doener',
    description: 'Brotteig, Dönerfleisch (Kalb), Gurken, Eisbergsalat, Tomaten, Mais, Zwiebeln, Krautsalat & Peperoni (mild)',
    basePrice: 900,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Döner vegetarisch',
    slug: 'doener-vegetarisch',
    description: 'Brotteig, Käse, Gurken, Eisbergsalat, Tomaten, Mais, Zwiebeln, Krautsalat & Peperoni (mild)',
    basePrice: 700,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 4
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Yufka vegetarisch mit Salat',
    slug: 'yufka-vegetarisch',
    description: 'Yufka Brot, Gurken, Eisbergsalat, Tomaten, Mais, Zwiebeln',
    basePrice: 800,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 5
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Yufka Döner mit Salat',
    slug: 'yufka-doener',
    description: 'Yufka Brot, Dönerfleisch (Kalb), Gurken, Eisbergsalat, Mais, Tomaten, Zwiebeln, Krautsalat & Peperoni (mild)',
    basePrice: 1000,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 6
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Döner Teller',
    slug: 'doener-teller',
    description: 'mit Pommes und Salat - Dönerfleisch (Kalb), Pommes, Gurken, Eisbergsalat, Mais, Tomaten, Zwiebeln, Krautsalat & Peperoni (mild)',
    basePrice: 1200,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 7
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Döner Box mit Pommes und Dönerfleisch',
    slug: 'doener-box-pommes',
    description: 'Dönerfleisch (Kalb), Pommes',
    basePrice: 800,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 8
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Döner Box nur mit Fleisch',
    slug: 'doener-box-fleisch',
    description: 'Dönerfleisch (Kalb)',
    basePrice: 900,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 9
  },
  {
    categoryId: categoryIds['doener'],
    name: 'Sucuk Brot',
    slug: 'sucuk-brot',
    description: 'Brotteig, Sucuk, Käse',
    basePrice: 800,
    imageUrl: '/images/placeholder-doner.jpg',
    isAvailable: true,
    sortOrder: 10
  }
]);

// PIZZA (mit Größenauswahl)
const pizzas = [
  { name: 'Pizza Margherita', slug: 'pizza-margherita', description: 'mit Tomatensauce und Käse', price26: 700, price30: 900 },
  { name: 'Pizza Truthahn', slug: 'pizza-truthahn', description: 'mit Truthahn-Salami', price26: 800, price30: 1000 },
  { name: 'Pizza Putenkeule', slug: 'pizza-putenkeule', description: 'mit Putenschinken', price26: 800, price30: 1000 },
  { name: 'Pizza Truthahn-Salami', slug: 'pizza-truthahn-salami', description: 'mit Truthahn-Salami und Putenschinken', price26: 900, price30: 1100 },
  { name: 'Pizza Funghi', slug: 'pizza-funghi', description: 'mit Champignons', price26: 850, price30: 1050 },
  { name: 'Pizza Sucuk', slug: 'pizza-sucuk', description: 'mit Knoblauchwurst', price26: 900, price30: 1100 },
  { name: 'Pizza Quattro Stagioni', slug: 'pizza-quattro-stagioni', description: 'mit Putensalami, Pute, Artischocken, Paprika, Oliven, Champignons', price26: 1050, price30: 1250 },
  { name: 'Pizza Milano', slug: 'pizza-milano', description: 'mit Putensalami, Pute, Thunfisch, Paprika, Ei, Zwiebeln', price26: 1050, price30: 1250 },
  { name: 'Pizza Tonno', slug: 'pizza-tonno', description: 'mit Thunfisch', price26: 900, price30: 1100 },
  { name: 'Pizza Hawaii', slug: 'pizza-hawaii', description: 'mit Pute und Ananas', price26: 800, price30: 1000 },
  { name: 'Pizza Amore', slug: 'pizza-amore', description: 'mit Pute und Zwiebeln', price26: 900, price30: 1100 },
  { name: 'Pizza Vier Jahreszeiten', slug: 'pizza-vier-jahreszeiten', description: 'mit Truthahn-Salami, Pute, Mozzarella, Pilze, Paprika', price26: 1000, price30: 1200 },
  { name: 'Pizza Mozzarella', slug: 'pizza-mozzarella', description: 'mit Mozzarella, Pute, Tomaten', price26: 900, price30: 1100 },
  { name: 'Pizza Döner', slug: 'pizza-doener', description: 'mit Hackfleisch vom Drehspieß', price26: 900, price30: 1100 },
  { name: 'Pizza Calwer (scharf)', slug: 'pizza-calwer', description: 'mit Pute, scharfe Paprika, Champignons', price26: 900, price30: 1100 },
  { name: 'Pizza Wunderbar', slug: 'pizza-wunderbar', description: 'mit Hackfleisch vom Drehspieß, Paprika, Champignons, Zwiebeln', price26: 1100, price30: 1300 },
  { name: 'Pizza Vegetarisch', slug: 'pizza-vegetarisch', description: 'mit Peperoni, Oliven, Artischocken, Paprika, Champignons, Zwiebeln', price26: 1100, price30: 1300 },
  { name: 'Pizza Diavolo', slug: 'pizza-diavolo', description: 'mit Truthahn-Salami, Pute, Peperoni', price26: 1000, price30: 1200 },
  { name: 'Pizza Al Capone', slug: 'pizza-al-capone', description: 'mit Knoblauchwurst, Paprika, Champignons', price26: 1000, price30: 1200 },
  { name: 'Pizza Sardegna', slug: 'pizza-sardegna', description: 'mit Pute, Artischocken, Paprika, Champignons', price26: 1000, price30: 1200 },
  { name: 'Pizza Special', slug: 'pizza-special', description: 'mit Truthahn-Salami, Pute, Ei, Artischocken, Paprika, Tomaten, Knoblauch, Champignons, Zwiebeln', price26: 1100, price30: 1300 }
];

for (const pizza of pizzas) {
  await db.insert(schema.products).values({
    categoryId: categoryIds['pizza'],
    name: pizza.name,
    slug: pizza.slug,
    description: pizza.description,
    basePrice: pizza.price26,
    imageUrl: '/images/placeholder-pizza.jpg',
    hasVariants: true,
    variants: pizzaSizes(pizza.price26, pizza.price30),
    isAvailable: true,
    sortOrder: pizzas.indexOf(pizza) + 1
  });
}

// SAUCEN / DIPS
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['saucen'],
    name: 'Ketchup Dip',
    slug: 'ketchup-dip',
    description: 'Ketchup',
    basePrice: 50,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Mayonnaise Dip',
    slug: 'mayonnaise-dip',
    description: 'Mayonnaise',
    basePrice: 50,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Cocktailsauce Dip',
    slug: 'cocktailsauce-dip',
    description: 'Cocktailsauce',
    basePrice: 100,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Joghurtsauce Dip',
    slug: 'joghurtsauce-dip',
    description: 'Joghurtsauce',
    basePrice: 100,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 4
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Scharfe Sauce Dip',
    slug: 'scharfe-sauce-dip',
    description: 'Scharfe Sauce',
    basePrice: 100,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 5
  }
]);

console.log('✅ Seed completed successfully!');
console.log('📊 Summary:');
console.log('   - 11 categories created');
console.log('   - ~50+ products created');
console.log('   - Döner mit Extras-System');
console.log('   - Pizza mit Größenauswahl');
console.log('   - Saucen verfügbar');

await connection.end();

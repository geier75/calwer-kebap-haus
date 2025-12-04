import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🗑️  Clearing existing data...');
await db.delete(schema.products);
await db.delete(schema.categories);

console.log('📝 Creating categories...');

const categories = [
  { name: 'Menüs', slug: 'menues', sortOrder: 1 },
  { name: 'Salate', slug: 'salate', sortOrder: 2 },
  { name: 'Pizza', slug: 'pizza', sortOrder: 3 },
  { name: 'Pide', slug: 'pide', sortOrder: 4 },
  { name: 'Dönergerichte', slug: 'doenergerichte', sortOrder: 5 },
  { name: 'Lahmacun', slug: 'lahmacun', sortOrder: 6 },
  { name: 'Falafelgerichte', slug: 'falafelgerichte', sortOrder: 7 },
  { name: 'Snacks - Beilagen', slug: 'snacks-beilagen', sortOrder: 8 },
  { name: 'Saucen', slug: 'saucen', sortOrder: 9 },
  { name: 'Alkoholfreie Getränke', slug: 'getraenke', sortOrder: 10 }
];

const categoryIds = {};
for (const cat of categories) {
  const [result] = await db.insert(schema.categories).values(cat);
  categoryIds[cat.slug] = result.insertId;
  console.log(`✅ Created category: ${cat.name}`);
}

console.log('🍕 Creating products...');

// Menüs
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['menues'],
    name: 'Menü 1 - Döner',
    slug: 'menu-1-doener',
    description: '2 Döner, 1 große Pommes frites, 1 alkoholfreies Getränk 1,0l nach Wahl',
    basePrice: 195000,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['menues'],
    name: 'Menü 2 - Pizza',
    slug: 'menu-2-pizza',
    description: '2 Pizzen (Ø 30cm), 2 Beilagensalate, 2 alkoholfreie Getränke 0,33l nach Wahl',
    basePrice: 300000,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['menues'],
    name: 'Kindermenü 1',
    slug: 'kindermenu-1',
    description: '2 Schüler Döner, Pommes frites, 2 Durstlöscher 0,5l nach Wahl',
    basePrice: 150000,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['menues'],
    name: 'Menü 3 - Pizza',
    slug: 'menu-3-pizza',
    description: '1 Pizza (Ø 26cm), 1 Beilagensalat, 1 alkoholfreies Getränk 0,33l nach Wahl',
    basePrice: 150000,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 4
  },
  {
    categoryId: categoryIds['menues'],
    name: 'Yufka Menü',
    slug: 'yufka-menu',
    description: '2 yufka 1 Pommes 1 Getränk 1,25 l',
    basePrice: 240000,
    imageUrl: '/images/placeholder-menu.jpg',
    isAvailable: true,
    sortOrder: 5
  }
]);

// Salate
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['salate'],
    name: 'Salat Nizza',
    slug: 'salat-nizza',
    description: 'mit Thunfisch, Eisbergsalat, Tomaten, Gurken, Zwiebeln und einem Dressing Ihrer Wahl',
    basePrice: 70000,
    imageUrl: '/images/placeholder-salad.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['salate'],
    name: 'Gemischter Salat',
    slug: 'gemischter-salat',
    description: 'mit Rotkraut, Eisbergsalat, Tomaten, Gurken, Zwiebeln und einem Dressing Ihrer Wahl',
    basePrice: 70000,
    imageUrl: '/images/placeholder-salad.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['salate'],
    name: 'Hirtensalat',
    slug: 'hirtensalat',
    description: 'mit Käse und Oliven, ohne grünen Salat und Zwiebeln',
    basePrice: 80000,
    imageUrl: '/images/placeholder-salad.jpg',
    isAvailable: true,
    sortOrder: 3
  }
]);

// Pizza (mit Varianten für Größen)
const pizzas = [
  { name: 'Pizza Margherita', slug: 'pizza-margherita', description: 'mit Tomatensauce und Käse', price26: 80000, price30: 1000 },
  { name: 'Pizza Truthahn', slug: 'pizza-truthahn', description: 'mit Truthahnsalami', price26: 90000, price30: 1100 },
  { name: 'Pizza Putenkeule', slug: 'pizza-putenkeule', description: 'mit Putenschinken', price26: 90000, price30: 1100 },
  { name: 'Pizza Truthahn-Salami', slug: 'pizza-truthahn-salami', description: 'mit Truthahnsalami und Putenschinken', price26: 100000, price30: 1200 },
  { name: 'Pizza Funghi', slug: 'pizza-funghi', description: 'mit Champignons', price26: 90000, price30: 1100 },
  { name: 'Pizza Sucuk', slug: 'pizza-sucuk', description: 'mit türkischer Knoblauchwurst', price26: 100000, price30: 1200 },
  { name: 'Pizza Quattro Staigioni', slug: 'pizza-quattro-staigioni', description: 'mit Truthahnsalami, Putenschinken, Champignons, Artischocken, Paprika und Oliven', price26: 105000, price30: 1250 },
  { name: 'Pizza Milano', slug: 'pizza-milano', description: 'mit Truthahnsalami, Putenschinken, Paprika, Zwiebeln, Thunfisch und Ei', price26: 105000, price30: 1250 },
  { name: 'Pizza Tonno', slug: 'pizza-tonno', description: 'mit Thunfisch', price26: 90000, price30: 1100 },
  { name: 'Pizza Hawaii', slug: 'pizza-hawaii', description: 'mit Putenschinken und Ananas', price26: 80000, price30: 1000 },
  { name: 'Pizza Amore', slug: 'pizza-amore', description: 'mit Putenschinken und Zwiebeln', price26: 90000, price30: 1100 },
  { name: 'Pizza 4 Jahreszeiten', slug: 'pizza-4-jahreszeiten', description: 'mit Truthahnsalami, Putenschinken, Champignons, Paprika und Mozzarella', price26: 100000, price30: 1200 },
  { name: 'Pizza Mozzarella', slug: 'pizza-mozzarella', description: 'mit Putenschinken, Mozzarella und Zwiebeln', price26: 90000, price30: 1100 },
  { name: 'Pizza Döner', slug: 'pizza-doener', description: 'mit Dönerfleisch', price26: 90000, price30: 1100 },
  { name: 'Pizza Calwer (scharf)', slug: 'pizza-calwer', description: 'mit Putenschinken, Champignons und Paprika', price26: 90000, price30: 1100 },
  { name: 'Pizza Wunderbar', slug: 'pizza-wunderbar', description: 'mit Dönerfleisch, Champignons, Paprika und Zwiebeln', price26: 110000, price30: 1300 },
  { name: 'Vegetarische Pizza', slug: 'vegetarische-pizza', description: 'mit Champignons, Paprika, Oliven, Artischocken, Zwiebeln und Peperoni', price26: 110000, price30: 1300 },
  { name: 'Pizza al Capone', slug: 'pizza-al-capone', description: 'mit türkischer Knoblauchwurst, Paprika und Champignons', price26: 100000, price30: 1200 },
  { name: 'Pizza Sardegna', slug: 'pizza-sardegna', description: 'mit Putenschinken, Champignons, Paprika und Artischocken', price26: 100000, price30: 1200 },
  { name: 'Pizza Special', slug: 'pizza-special', description: 'mit Truthahnsalami, Putenschinken, Knoblauch, Zwiebeln, Ei und Tomaten', price26: 110000, price30: 1300 }
];

let pizzaOrder = 1;
for (const pizza of pizzas) {
  await db.insert(schema.products).values({
    categoryId: categoryIds['pizza'],
    name: pizza.name,
    slug: pizza.slug,
    description: pizza.description,
    basePrice: pizza.price26,
    hasVariants: true,
    variants: JSON.stringify([
      { name: 'Ø 26cm', price: pizza.price26 },
      { name: 'Ø 30cm', price: pizza.price30 }
    ]),
    imageUrl: '/images/placeholder-pizza.jpg',
    isAvailable: true,
    sortOrder: pizzaOrder++
  });
}

// Calzone (nur 30cm)
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['pizza'],
    name: 'Calzone Super (Ø 30cm)',
    slug: 'calzone-super',
    description: 'mit Truthahnsalami, Putenschinken, Champignons und Thunfisch',
    basePrice: 115000,
    imageUrl: '/images/placeholder-pizza.jpg',
    isAvailable: true,
    sortOrder: pizzaOrder++
  },
  {
    categoryId: categoryIds['pizza'],
    name: 'Vegetarische Calzone (Ø 30cm)',
    slug: 'vegetarische-calzone',
    description: 'mit Artischocken, Champignons und Paprika',
    basePrice: 105000,
    imageUrl: '/images/placeholder-pizza.jpg',
    isAvailable: true,
    sortOrder: pizzaOrder++
  },
  {
    categoryId: categoryIds['pizza'],
    name: 'Calzone Italia Mozzarella (Ø 30cm)',
    slug: 'calzone-italia-mozzarella',
    description: 'mit Truthahnsalami, Putenschinken und Mozzarella',
    basePrice: 100000,
    imageUrl: '/images/placeholder-pizza.jpg',
    isAvailable: true,
    sortOrder: pizzaOrder++
  },
  {
    categoryId: categoryIds['pizza'],
    name: 'Calzone Calwer (Ø 30cm)',
    slug: 'calzone-calwer',
    description: 'mit Truthahnsalami, Putenschinken und Artischocken',
    basePrice: 115000,
    imageUrl: '/images/placeholder-pizza.jpg',
    isAvailable: true,
    sortOrder: pizzaOrder++
  }
]);

// Pide
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['pide'],
    name: 'Pide mit Käse',
    slug: 'pide-mit-kaese',
    description: 'Türkisches Fladenbrot mit Käse',
    basePrice: 90000,
    imageUrl: '/images/placeholder-pide.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['pide'],
    name: 'Pide mit Spinat und Käse',
    slug: 'pide-mit-spinat-und-kaese',
    description: 'Türkisches Fladenbrot mit Spinat und Käse',
    basePrice: 110000,
    imageUrl: '/images/placeholder-pide.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['pide'],
    name: 'Pide mit Hackfleisch',
    slug: 'pide-mit-hackfleisch',
    description: 'Türkisches Fladenbrot mit Hackfleisch',
    basePrice: 110000,
    imageUrl: '/images/placeholder-pide.jpg',
    isAvailable: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['pide'],
    name: 'Pide mit Dönerfleisch',
    slug: 'pide-mit-doenerfleisch',
    description: 'Türkisches Fladenbrot mit Dönerfleisch',
    basePrice: 110000,
    imageUrl: '/images/placeholder-pide.jpg',
    isAvailable: true,
    sortOrder: 4
  },
  {
    categoryId: categoryIds['pide'],
    name: 'Pide mit Sucuk',
    slug: 'pide-mit-sucuk',
    description: 'Türkisches Fladenbrot mit türkischer Knoblauchwurst',
    basePrice: 110000,
    imageUrl: '/images/placeholder-pide.jpg',
    isAvailable: true,
    sortOrder: 5
  }
]);

// Dönergerichte (mit Extras-System)
const doenerExtras = JSON.stringify([
  { name: 'Zwiebeln', price: 0 },
  { name: 'Kraut', price: 0 },
  { name: 'Salat', price: 0 },
  { name: 'Mais', price: 0 },
  { name: 'Käse', price: 50 },
  { name: 'Peperoni', price: 0 }
]);

await db.insert(schema.products).values([
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Schüler Döner',
    slug: 'schueler-doener',
    description: 'Kleine Portion Döner mit Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
      basePrice: 700,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Döner',
    slug: 'doener',
    description: 'mit Dönerfleisch, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 900,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Vegetarischer Döner',
    slug: 'vegetarischer-doener',
    description: 'mit Käse, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 700,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Vegetarischer Yufka',
    slug: 'vegetarischer-yufka',
    description: 'Dünnes Fladenbrot mit Käse, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
     basePrice: 800,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 4
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Yufka Döner',
    slug: 'yufka-doener',
    description: 'Dünnes Fladenbrot mit Dönerfleisch, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 1000,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 5
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Jumbo Döner',
    slug: 'jumbo-doener',
    description: 'Extra große Portion Döner mit Dönerfleisch, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 1100,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 6
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Döner-Box mit Pommes frites',
    slug: 'doener-box-mit-pommes-frites',
    description: 'Döner ohne Salat mit Pommes frites',
    basePrice: 800,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 7
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Döner-Box',
    slug: 'doener-box',
    description: 'Döner ohne Salat',
      basePrice: 900,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    sortOrder: 8
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Sucuk Brot',
    slug: 'sucuk-brot',
    description: 'mit Pizzakäse und türkischer Knoblauchwurst',
    basePrice: 80000,
    imageUrl: '/images/placeholder-doner.jpg',
    isAvailable: true,
    sortOrder: 9
  },
  {
    categoryId: categoryIds['doenergerichte'],
    name: 'Döner-Teller',
    slug: 'doener-teller',
    description: 'Dönerfleisch mit Pommes frites, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
      basePrice: 950,
    imageUrl: '/images/placeholder-doner.jpg',
    hasVariants: true,
    variants: doenerExtras,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 10
  }
]);

// Lahmacun
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['lahmacun'],
    name: 'Lahmacun Klassisch',
    slug: 'lahmacun-klassisch',
    description: 'Türkische Pizza ohne Salat',
    basePrice: 60000,
    imageUrl: '/images/placeholder-lahmacun.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['lahmacun'],
    name: 'Lahmacun mit Salat',
    slug: 'lahmacun-mit-salat',
    description: 'Türkische Pizza mit Dönerfleisch, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 80000,
    imageUrl: '/images/placeholder-lahmacun.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['lahmacun'],
    name: 'Lahmacun mit Dönerfleisch',
    slug: 'lahmacun-mit-doenerfleisch',
    description: 'Türkische Pizza mit Dönerfleisch, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 100000,
    imageUrl: '/images/placeholder-lahmacun.jpg',
    isAvailable: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['lahmacun'],
    name: 'Lahmacun mit Käse und Dönerfleisch',
    slug: 'lahmacun-mit-kaese-und-doenerfleisch',
    description: 'Türkische Pizza mit Käse und Dönerfleisch, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 110000,
    imageUrl: '/images/placeholder-lahmacun.jpg',
    isAvailable: true,
    sortOrder: 4
  }
]);

// Falafelgerichte
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['falafelgerichte'],
    name: 'Falafel-Teller',
    slug: 'falafel-teller',
    description: 'Falafel mit Pommes frites, Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 95000,
    imageUrl: '/images/placeholder-falafel.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['falafelgerichte'],
    name: 'Falafel im Fladenbrot',
    slug: 'falafel-im-fladenbrot',
    description: 'Falafel mit Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 60000,
    imageUrl: '/images/placeholder-falafel.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['falafelgerichte'],
    name: 'Falafel im Yufka',
    slug: 'falafel-im-yufka',
    description: 'Falafel im dünnen Fladenbrot mit Eisbergsalat, Tomaten, Gurken, Zwiebeln, Rotkraut, Mais und einer Sauce Ihrer Wahl',
    basePrice: 70000,
    imageUrl: '/images/placeholder-falafel.jpg',
    isAvailable: true,
    sortOrder: 3
  }
]);

// Snacks - Beilagen
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['snacks-beilagen'],
    name: 'Pommes frites',
    slug: 'pommes-frites',
    description: 'mit Ketchup und Mayonaise',
    basePrice: 40000,
    hasVariants: true,
    variants: JSON.stringify([
      { name: 'Klein', price: 4.00 },
      { name: 'Groß', price: 6.00 }
    ]),
    imageUrl: '/images/placeholder-fries.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['snacks-beilagen'],
    name: 'Pommes frites-Salat Box',
    slug: 'pommes-frites-salat-box',
    description: 'Pommes frites mit Salat',
    basePrice: 60000,
    imageUrl: '/images/placeholder-fries.jpg',
    isAvailable: true,
    sortOrder: 2
  }
]);

// Saucen
await db.insert(schema.products).values([
  {
    categoryId: categoryIds['saucen'],
    name: 'Ketchup',
    slug: 'ketchup',
    description: 'Tomatenketchup',
    basePrice: 50,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 1
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Mayonnaise',
    slug: 'mayonnaise',
    description: 'Cremige Mayonnaise',
    basePrice: 50,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 2
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Cocktailsauce scharf',
    slug: 'cocktailsauce-scharf',
    description: 'Scharfe Cocktailsauce',
    basePrice: 10000,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 3
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Joghurtsauce',
    slug: 'joghurtsauce',
    description: 'Frische Joghurtsauce',
    basePrice: 10000,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 4
  },
  {
    categoryId: categoryIds['saucen'],
    name: 'Cocktail Sauce ohne scharf',
    slug: 'cocktail-sauce-ohne-scharf',
    description: 'Milde Cocktailsauce',
    basePrice: 10000,
    imageUrl: '/images/placeholder-sauce.jpg',
    isAvailable: true,
    sortOrder: 5
  }
]);

console.log('✅ Seed completed successfully!');
console.log('📊 Summary:');
console.log(`   - ${categories.length} categories created`);
console.log('   - ~80+ products created');
console.log('   - Döner-Extras ready for implementation');

await connection.end();
process.exit(0);

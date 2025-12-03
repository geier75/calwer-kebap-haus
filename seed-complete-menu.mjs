import { drizzle } from 'drizzle-orm/mysql2';
import { categories, products } from './drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

const completeMenu = {
  categories: [
    { name: 'Menüs', slug: 'menus', sortOrder: 1 },
    { name: 'Döner & Yufka', slug: 'doener-yufka', sortOrder: 2 },
    { name: 'Pizza 26cm', slug: 'pizza-26cm', sortOrder: 3 },
    { name: 'Pizza 30cm', slug: 'pizza-30cm', sortOrder: 4 },
    { name: 'Türkische Spezialitäten', slug: 'turkish-specialties', sortOrder: 5 },
    { name: 'Falafel', slug: 'falafel', sortOrder: 6 },
    { name: 'Salate', slug: 'salate', sortOrder: 7 },
    { name: 'Pommes & Beilagen', slug: 'pommes-beilagen', sortOrder: 8 },
    { name: 'Getränke', slug: 'getraenke', sortOrder: 9 },
  ],
  products: [
    // Menüs
    {
      categorySlug: 'menus',
      name: 'Menü 1 - Döner',
      slug: 'menu-1-doener',
      description: '2x Döner + 1x große Pommes + 1x alkoholfreies Getränk (1,25l) nach Wahl',
      basePrice: 1950,
      imageUrl: '/images/menu-doener.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'menus',
      name: 'Menü 2 - Pizza',
      slug: 'menu-2-pizza',
      description: '2x Pizza (Ø 30cm) + 2x Beilagensalate + 2x alkoholfreies Getränk nach Wahl',
      basePrice: 3000,
      imageUrl: '/images/menu-pizza.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'menus',
      name: 'Menü 3 - Pizza Klein',
      slug: 'menu-3-pizza-klein',
      description: '1x Pizza (Ø 26cm) + 1x Beilagensalat + 1x alkoholfreies Getränk (0,33l) nach Wahl',
      basePrice: 1500,
      imageUrl: '/images/menu-pizza-klein.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'menus',
      name: 'Yufka Menü',
      slug: 'yufka-menu',
      description: '2x Yufka + 1x Pommes + 1x Getränk (1,25l)',
      basePrice: 2400,
      imageUrl: '/images/menu-yufka.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'menus',
      name: 'Kinder-Menü',
      slug: 'kinder-menu',
      description: 'Kinder-Portion mit Pommes und Getränk',
      basePrice: 800,
      imageUrl: '/images/menu-kinder.jpg',
      isFeatured: false,
    },

    // Döner & Yufka
    {
      categorySlug: 'doener-yufka',
      name: 'Döner im Brot',
      slug: 'doener-im-brot',
      description: 'Klassischer Döner mit Salat, Tomaten, Gurken, Zwiebeln und Soße nach Wahl',
      basePrice: 900,
      imageUrl: '/images/doener-kebap.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'doener-yufka',
      name: 'Schüler Döner',
      slug: 'schueler-doener',
      description: 'Kleinere Portion für Schüler',
      basePrice: 700,
      imageUrl: '/images/doener-kebap.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'doener-yufka',
      name: 'Vegetarischer Döner',
      slug: 'vegetarischer-doener',
      description: 'Mit gegrilltem Gemüse und Falafel',
      basePrice: 700,
      imageUrl: '/images/vegetarischer-doener.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'doener-yufka',
      name: 'Yufka Döner (Dürüm)',
      slug: 'yufka-doener',
      description: 'Döner in dünnem Fladenbrot gerollt',
      basePrice: 1000,
      imageUrl: '/images/doener-kebap.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'doener-yufka',
      name: 'Vegetarischer Yufka',
      slug: 'vegetarischer-yufka',
      description: 'Vegetarische Variante im Yufka',
      basePrice: 800,
      imageUrl: '/images/vegetarischer-doener.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'doener-yufka',
      name: 'Döner Teller',
      slug: 'doener-teller',
      description: 'Döner mit Reis, Salat und Beilagen',
      basePrice: 1200,
      imageUrl: '/images/doener-kebap.jpg',
      isFeatured: true,
    },

    // Pizza 26cm
    {
      categorySlug: 'pizza-26cm',
      name: 'Pizza Margherita',
      slug: 'pizza-margherita-26',
      description: 'Tomatensauce, Käse',
      basePrice: 650,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'pizza-26cm',
      name: 'Pizza Salami',
      slug: 'pizza-salami-26',
      description: 'Tomatensauce, Käse, Salami',
      basePrice: 950,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'pizza-26cm',
      name: 'Pizza Schinken',
      slug: 'pizza-schinken-26',
      description: 'Tomatensauce, Käse, Schinken',
      basePrice: 950,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-26cm',
      name: 'Pizza Funghi',
      slug: 'pizza-funghi-26',
      description: 'Tomatensauce, Käse, Champignons',
      basePrice: 900,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-26cm',
      name: 'Pizza Tonno',
      slug: 'pizza-tonno-26',
      description: 'Tomatensauce, Käse, Thunfisch, Zwiebeln',
      basePrice: 1000,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-26cm',
      name: 'Pizza Vegetaria',
      slug: 'pizza-vegetaria-26',
      description: 'Tomatensauce, Käse, verschiedenes Gemüse',
      basePrice: 1000,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'pizza-26cm',
      name: 'Pizza Calzone',
      slug: 'pizza-calzone-26',
      description: 'Gefaltet: Tomatensauce, Käse, Schinken, Salami',
      basePrice: 1050,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-26cm',
      name: 'Calwer Spezial Pizza',
      slug: 'calwer-spezial-26',
      description: 'Tomatensauce, Käse, Salami, Schinken, Champignons, Paprika',
      basePrice: 1050,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: true,
    },

    // Pizza 30cm
    {
      categorySlug: 'pizza-30cm',
      name: 'Pizza Margherita (30cm)',
      slug: 'pizza-margherita-30',
      description: 'Tomatensauce, Käse',
      basePrice: 950,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-30cm',
      name: 'Pizza Salami (30cm)',
      slug: 'pizza-salami-30',
      description: 'Tomatensauce, Käse, Salami',
      basePrice: 1250,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-30cm',
      name: 'Pizza Schinken (30cm)',
      slug: 'pizza-schinken-30',
      description: 'Tomatensauce, Käse, Schinken',
      basePrice: 1250,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-30cm',
      name: 'Pizza Funghi (30cm)',
      slug: 'pizza-funghi-30',
      description: 'Tomatensauce, Käse, Champignons',
      basePrice: 1200,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-30cm',
      name: 'Pizza Tonno (30cm)',
      slug: 'pizza-tonno-30',
      description: 'Tomatensauce, Käse, Thunfisch, Zwiebeln',
      basePrice: 1300,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-30cm',
      name: 'Pizza Vegetaria (30cm)',
      slug: 'pizza-vegetaria-30',
      description: 'Tomatensauce, Käse, verschiedenes Gemüse',
      basePrice: 1300,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pizza-30cm',
      name: 'Calwer Spezial Pizza (30cm)',
      slug: 'calwer-spezial-30',
      description: 'Tomatensauce, Käse, Salami, Schinken, Champignons, Paprika',
      basePrice: 1350,
      imageUrl: '/images/pizza-margherita.jpg',
      isFeatured: false,
    },

    // Türkische Spezialitäten
    {
      categorySlug: 'turkish-specialties',
      name: 'Lahmacun',
      slug: 'lahmacun',
      description: 'Türkische Pizza mit Hackfleisch',
      basePrice: 500,
      imageUrl: '/images/adana-kebap.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'turkish-specialties',
      name: 'Pide mit Käse',
      slug: 'pide-kaese',
      description: 'Türkisches Schiffchen mit Käse',
      basePrice: 800,
      imageUrl: '/images/adana-kebap.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'turkish-specialties',
      name: 'Pide mit Hackfleisch',
      slug: 'pide-hackfleisch',
      description: 'Türkisches Schiffchen mit Hackfleisch',
      basePrice: 900,
      imageUrl: '/images/adana-kebap.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'turkish-specialties',
      name: 'Pide mit Sucuk',
      slug: 'pide-sucuk',
      description: 'Türkisches Schiffchen mit türkischer Knoblauchwurst',
      basePrice: 1000,
      imageUrl: '/images/adana-kebap.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'turkish-specialties',
      name: 'Adana Kebap',
      slug: 'adana-kebap',
      description: 'Würziges Hackfleisch vom Spieß mit Reis und Salat',
      basePrice: 1200,
      imageUrl: '/images/adana-kebap.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'turkish-specialties',
      name: 'Şiş Kebap',
      slug: 'sis-kebap',
      description: 'Gegrillte Fleischspieße mit Reis und Salat',
      basePrice: 1300,
      imageUrl: '/images/adana-kebap.jpg',
      isFeatured: true,
    },

    // Falafel
    {
      categorySlug: 'falafel',
      name: 'Falafel im Brot',
      slug: 'falafel-im-brot',
      description: 'Falafel mit Salat und Soße',
      basePrice: 700,
      imageUrl: '/images/falafel.jpg',
      isFeatured: true,
    },
    {
      categorySlug: 'falafel',
      name: 'Falafel Teller',
      slug: 'falafel-teller',
      description: 'Falafel mit Reis, Salat und Beilagen',
      basePrice: 1000,
      imageUrl: '/images/falafel.jpg',
      isFeatured: true,
    },

    // Salate
    {
      categorySlug: 'salate',
      name: 'Salat Nizza',
      slug: 'salat-nizza',
      description: 'Eisbergsalat, Tomaten, Gurken, Zwiebeln, Thunfisch, Dressing',
      basePrice: 700,
      imageUrl: '/images/salad.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'salate',
      name: 'Gemischter Salat',
      slug: 'gemischter-salat',
      description: 'Eisbergsalat, Tomaten, Gurken, Zwiebeln, Dressing',
      basePrice: 550,
      imageUrl: '/images/salad.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'salate',
      name: 'Bauernsalat',
      slug: 'bauernsalat',
      description: 'Tomaten, Gurken, Zwiebeln, Schafskäse, Oliven',
      basePrice: 650,
      imageUrl: '/images/salad.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'salate',
      name: 'Beilagensalat',
      slug: 'beilagensalat',
      description: 'Kleiner gemischter Salat',
      basePrice: 350,
      imageUrl: '/images/salad.jpg',
      isFeatured: false,
    },

    // Pommes & Beilagen
    {
      categorySlug: 'pommes-beilagen',
      name: 'Pommes Frites klein',
      slug: 'pommes-klein',
      description: 'Kleine Portion knusprige Pommes',
      basePrice: 350,
      imageUrl: '/images/pommes.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pommes-beilagen',
      name: 'Pommes Frites groß',
      slug: 'pommes-gross',
      description: 'Große Portion knusprige Pommes',
      basePrice: 500,
      imageUrl: '/images/pommes.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pommes-beilagen',
      name: 'Pommes mit Käse überbacken',
      slug: 'pommes-kaese',
      description: 'Pommes mit geschmolzenem Käse',
      basePrice: 600,
      imageUrl: '/images/pommes.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'pommes-beilagen',
      name: 'Reis',
      slug: 'reis',
      description: 'Portion Reis als Beilage',
      basePrice: 350,
      imageUrl: '/images/rice.jpg',
      isFeatured: false,
    },

    // Getränke
    {
      categorySlug: 'getraenke',
      name: 'Cola 0,33l',
      slug: 'cola-033',
      description: 'Coca-Cola',
      basePrice: 250,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Cola Zero 0,33l',
      slug: 'cola-zero-033',
      description: 'Coca-Cola Zero',
      basePrice: 250,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Fanta 0,33l',
      slug: 'fanta-033',
      description: 'Fanta Orange',
      basePrice: 250,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Sprite 0,33l',
      slug: 'sprite-033',
      description: 'Sprite',
      basePrice: 250,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Mezzo Mix 0,33l',
      slug: 'mezzo-mix-033',
      description: 'Mezzo Mix',
      basePrice: 250,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Getränk 1,0l',
      slug: 'getraenk-1l',
      description: 'Alkoholfreies Getränk nach Wahl',
      basePrice: 350,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Getränk 1,25l',
      slug: 'getraenk-125l',
      description: 'Alkoholfreies Getränk nach Wahl',
      basePrice: 400,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Wasser 0,5l',
      slug: 'wasser-05',
      description: 'Stilles oder sprudelndes Wasser',
      basePrice: 200,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Ayran 0,25l',
      slug: 'ayran-025',
      description: 'Türkisches Joghurtgetränk',
      basePrice: 200,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
    {
      categorySlug: 'getraenke',
      name: 'Uludag 0,33l',
      slug: 'uludag-033',
      description: 'Türkische Limonade',
      basePrice: 250,
      imageUrl: '/images/drink.jpg',
      isFeatured: false,
    },
  ],
};

async function seedCompleteMenu() {
  console.log('🌱 Seeding complete menu...');

  // Insert categories
  const categoryMap = new Map();
  for (const cat of completeMenu.categories) {
    const [result] = await db.insert(categories).values(cat);
    categoryMap.set(cat.slug, Number(result.insertId));
    console.log(`✅ Category: ${cat.name}`);
  }

  // Insert products
  for (const prod of completeMenu.products) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.error(`❌ Category not found: ${prod.categorySlug}`);
      continue;
    }

    const { categorySlug, ...productData } = prod;
    await db.insert(products).values({
      ...productData,
      categoryId,
    });
    console.log(`✅ Product: ${prod.name} - ${(prod.basePrice / 100).toFixed(2)}€`);
  }

  console.log('✅ Complete menu seeded successfully!');
  process.exit(0);
}

seedCompleteMenu().catch((error) => {
  console.error('❌ Error seeding menu:', error);
  process.exit(1);
});

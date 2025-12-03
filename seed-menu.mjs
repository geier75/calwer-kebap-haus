import { drizzle } from "drizzle-orm/mysql2";
import { categories, products } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedMenu() {
  console.log("🌱 Seeding menu data...");

  // Categories
  const categoriesData = [
    { id: 1, name: "Menüs", slug: "menus", description: "Komplette Menüs mit Getränk", sortOrder: 1 },
    { id: 2, name: "Döner & Yufka", slug: "doener-yufka", description: "Klassische Döner und Yufka", sortOrder: 2 },
    { id: 3, name: "Pizza 26cm", slug: "pizza-26cm", description: "Kleine Pizzen", sortOrder: 3 },
    { id: 4, name: "Pizza 30cm", slug: "pizza-30cm", description: "Große Pizzen", sortOrder: 4 },
    { id: 5, name: "Türkische Spezialitäten", slug: "tuerkische-spezialitaeten", description: "Authentische türkische Gerichte", sortOrder: 5 },
    { id: 6, name: "Falafel", slug: "falafel", description: "Vegetarische Falafel-Gerichte", sortOrder: 6 },
    { id: 7, name: "Salate", slug: "salate", description: "Frische Salate", sortOrder: 7 },
    { id: 8, name: "Pommes & Beilagen", slug: "pommes-beilagen", description: "Beilagen und Snacks", sortOrder: 8 },
    { id: 9, name: "Getränke", slug: "getraenke", description: "Erfrischende Getränke", sortOrder: 9 },
  ];

  for (const cat of categoriesData) {
    await db.insert(categories).values(cat).onDuplicateKeyUpdate({ set: { name: cat.name } });
  }

  console.log("✅ Categories seeded");

  // Products with real Lieferando prices
  const productsData = [
    // Menüs
    { categoryId: 1, name: "Menü 1 - Döner mit Pommes", slug: "menu-1-doener-pommes", description: "Döner Kebap mit Pommes und Getränk 0,33l", basePrice: 1100, isFeatured: true, sortOrder: 1 },
    { categoryId: 1, name: "Menü 2 - Yufka mit Pommes", slug: "menu-2-yufka-pommes", description: "Yufka mit Pommes und Getränk 0,33l", basePrice: 1150, sortOrder: 2 },
    { categoryId: 1, name: "Menü 3 - Pizza mit Salat", slug: "menu-3-pizza-salat", description: "Pizza 26cm nach Wahl mit Salat und Getränk 0,33l", basePrice: 1200, sortOrder: 3 },

    // Döner & Yufka
    { categoryId: 2, name: "Döner Kebap", slug: "doener-kebap", description: "Klassischer Döner mit Salat und Soße", basePrice: 700, isFeatured: true, sortOrder: 1 },
    { categoryId: 2, name: "Döner Kebap mit Käse", slug: "doener-kebap-kaese", description: "Döner mit extra Käse überbacken", basePrice: 750, sortOrder: 2 },
    { categoryId: 2, name: "Vegetarischer Döner", slug: "vegetarischer-doener", description: "Mit Falafel und frischem Gemüse", basePrice: 700, sortOrder: 3 },
    { categoryId: 2, name: "Yufka", slug: "yufka", description: "Dünnes Fladenbrot gerollt mit Döner", basePrice: 750, sortOrder: 4 },
    { categoryId: 2, name: "Yufka mit Käse", slug: "yufka-kaese", description: "Yufka mit extra Käse", basePrice: 800, sortOrder: 5 },
    { categoryId: 2, name: "Dürüm", slug: "dueruem", description: "Dünner Wrap mit Döner", basePrice: 700, sortOrder: 6 },

    // Pizza 26cm
    { categoryId: 3, name: "Pizza Margherita 26cm", slug: "pizza-margherita-26cm", description: "Tomatensauce, Käse", basePrice: 650, isFeatured: true, sortOrder: 1 },
    { categoryId: 3, name: "Pizza Salami 26cm", slug: "pizza-salami-26cm", description: "Tomatensauce, Käse, Salami", basePrice: 750, sortOrder: 2 },
    { categoryId: 3, name: "Pizza Funghi 26cm", slug: "pizza-funghi-26cm", description: "Tomatensauce, Käse, Champignons", basePrice: 750, sortOrder: 3 },
    { categoryId: 3, name: "Pizza Tonno 26cm", slug: "pizza-tonno-26cm", description: "Tomatensauce, Käse, Thunfisch, Zwiebeln", basePrice: 800, sortOrder: 4 },
    { categoryId: 3, name: "Pizza Hawaii 26cm", slug: "pizza-hawaii-26cm", description: "Tomatensauce, Käse, Schinken, Ananas", basePrice: 800, sortOrder: 5 },

    // Pizza 30cm
    { categoryId: 4, name: "Pizza Margherita 30cm", slug: "pizza-margherita-30cm", description: "Tomatensauce, Käse", basePrice: 850, sortOrder: 1 },
    { categoryId: 4, name: "Pizza Salami 30cm", slug: "pizza-salami-30cm", description: "Tomatensauce, Käse, Salami", basePrice: 950, sortOrder: 2 },
    { categoryId: 4, name: "Pizza Funghi 30cm", slug: "pizza-funghi-30cm", description: "Tomatensauce, Käse, Champignons", basePrice: 950, sortOrder: 3 },
    { categoryId: 4, name: "Pizza Tonno 30cm", slug: "pizza-tonno-30cm", description: "Tomatensauce, Käse, Thunfisch, Zwiebeln", basePrice: 1000, sortOrder: 4 },
    { categoryId: 4, name: "Pizza Hawaii 30cm", slug: "pizza-hawaii-30cm", description: "Tomatensauce, Käse, Schinken, Ananas", basePrice: 1000, sortOrder: 5 },

    // Türkische Spezialitäten
    { categoryId: 5, name: "Lahmacun", slug: "lahmacun", description: "Türkische Pizza mit Hackfleisch", basePrice: 500, isFeatured: true, sortOrder: 1 },
    { categoryId: 5, name: "Pide mit Käse", slug: "pide-kaese", description: "Türkisches Fladenbrot mit Käse", basePrice: 700, sortOrder: 2 },
    { categoryId: 5, name: "Pide mit Sucuk", slug: "pide-sucuk", description: "Türkisches Fladenbrot mit Knoblauchwurst", basePrice: 800, sortOrder: 3 },
    { categoryId: 5, name: "Adana Kebap", slug: "adana-kebap", description: "Scharfes Hackfleisch vom Spieß", basePrice: 900, sortOrder: 4 },
    { categoryId: 5, name: "Köfte", slug: "koefte", description: "Türkische Hackfleischbällchen", basePrice: 850, sortOrder: 5 },

    // Falafel
    { categoryId: 6, name: "Falafel Teller", slug: "falafel-teller", description: "Falafel mit Salat, Reis und Soße", basePrice: 800, sortOrder: 1 },
    { categoryId: 6, name: "Falafel Wrap", slug: "falafel-wrap", description: "Falafel im Fladenbrot", basePrice: 650, sortOrder: 2 },
    { categoryId: 6, name: "Falafel Box", slug: "falafel-box", description: "Falafel mit Pommes", basePrice: 750, sortOrder: 3 },

    // Salate
    { categoryId: 7, name: "Gemischter Salat klein", slug: "gemischter-salat-klein", description: "Frischer Salat mit Dressing", basePrice: 400, sortOrder: 1 },
    { categoryId: 7, name: "Gemischter Salat groß", slug: "gemischter-salat-gross", description: "Großer frischer Salat mit Dressing", basePrice: 600, sortOrder: 2 },
    { categoryId: 7, name: "Thunfisch Salat", slug: "thunfisch-salat", description: "Salat mit Thunfisch", basePrice: 700, sortOrder: 3 },
    { categoryId: 7, name: "Schafskäse Salat", slug: "schafskaese-salat", description: "Salat mit Schafskäse", basePrice: 700, sortOrder: 4 },

    // Pommes & Beilagen
    { categoryId: 8, name: "Pommes Frites klein", slug: "pommes-frites-klein", description: "Knusprige Pommes", basePrice: 300, sortOrder: 1 },
    { categoryId: 8, name: "Pommes Frites groß", slug: "pommes-frites-gross", description: "Große Portion Pommes", basePrice: 400, sortOrder: 2 },
    { categoryId: 8, name: "Pommes mit Käse", slug: "pommes-kaese", description: "Pommes mit geschmolzenem Käse", basePrice: 450, sortOrder: 3 },
    { categoryId: 8, name: "Chicken Nuggets", slug: "chicken-nuggets", description: "6 Stück Chicken Nuggets", basePrice: 500, sortOrder: 4 },

    // Getränke
    { categoryId: 9, name: "Coca Cola 0,33l", slug: "coca-cola-033l", description: "Erfrischende Cola", basePrice: 250, sortOrder: 1 },
    { categoryId: 9, name: "Fanta 0,33l", slug: "fanta-033l", description: "Orangenlimonade", basePrice: 250, sortOrder: 2 },
    { categoryId: 9, name: "Sprite 0,33l", slug: "sprite-033l", description: "Zitronenlimonade", basePrice: 250, sortOrder: 3 },
    { categoryId: 9, name: "Wasser 0,5l", slug: "wasser-05l", description: "Stilles Wasser", basePrice: 200, sortOrder: 4 },
    { categoryId: 9, name: "Ayran 0,25l", slug: "ayran-025l", description: "Türkisches Joghurtgetränk", basePrice: 200, sortOrder: 5 },
  ];

  for (const product of productsData) {
    await db.insert(products).values(product).onDuplicateKeyUpdate({ set: { name: product.name } });
  }

  console.log("✅ Products seeded");
  console.log(`🎉 Seeded ${categoriesData.length} categories and ${productsData.length} products`);
  
  process.exit(0);
}

seedMenu().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});

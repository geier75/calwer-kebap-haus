import { drizzle } from "drizzle-orm/mysql2";
import { categories, products, productVariants, productExtras, achievements, rewards } from "./drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding database...");

  // Categories
  const cats = [
    { id: 1, name: "Döner", nameEn: "Döner", nameTr: "Döner", nameAr: "دونر", slug: "doener", description: "Frisch vom Spieß", imageUrl: "/images/categories/doener.jpg", sortOrder: 1 },
    { id: 2, name: "Pizza", nameEn: "Pizza", nameTr: "Pizza", nameAr: "بيتزا", slug: "pizza", description: "Knusprig & lecker", imageUrl: "/images/categories/pizza.jpg", sortOrder: 2 },
    { id: 3, name: "Kebap", nameEn: "Kebab", nameTr: "Kebap", nameAr: "كباب", slug: "kebap", description: "Gegrillte Spezialitäten", imageUrl: "/images/categories/kebap.jpg", sortOrder: 3 },
    { id: 4, name: "Falafel", nameEn: "Falafel", nameTr: "Falafel", nameAr: "فلافل", slug: "falafel", description: "Vegetarisch & vegan", imageUrl: "/images/categories/falafel.jpg", sortOrder: 4 },
    { id: 5, name: "Lahmacun", nameEn: "Lahmacun", nameTr: "Lahmacun", nameAr: "لحم بعجين", slug: "lahmacun", description: "Türkische Pizza", imageUrl: "/images/categories/lahmacun.jpg", sortOrder: 5 },
    { id: 6, name: "Pommes", nameEn: "Fries", nameTr: "Patates Kızartması", nameAr: "بطاطس مقلية", slug: "pommes", description: "Knusprig goldbraun", imageUrl: "/images/categories/pommes.jpg", sortOrder: 6 },
  ];

  for (const cat of cats) {
    await db.insert(categories).values(cat).onDuplicateKeyUpdate({ set: { name: cat.name } });
  }
  console.log("✅ Categories seeded");

  // Products
  const prods = [
    // Döner
    { id: 1, categoryId: 1, name: "Döner Kebap", nameEn: "Döner Kebab", nameTr: "Döner Kebap", nameAr: "دونر كباب", slug: "doener-kebap", description: "Klassischer Döner mit frischem Salat", basePrice: 650, isFeatured: true, sortOrder: 1 },
    { id: 2, categoryId: 1, name: "Döner Teller", nameEn: "Döner Plate", nameTr: "Döner Tabağı", nameAr: "طبق دونر", slug: "doener-teller", description: "Döner mit Reis und Salat", basePrice: 950, isFeatured: true, sortOrder: 2 },
    { id: 3, categoryId: 1, name: "Vegetarischer Döner", nameEn: "Vegetarian Döner", nameTr: "Vejetaryen Döner", nameAr: "دونر نباتي", slug: "vegetarischer-doener", description: "Mit Falafel und Gemüse", basePrice: 600, isVegetarian: true, sortOrder: 3 },
    
    // Pizza
    { id: 4, categoryId: 2, name: "Pizza Margherita", nameEn: "Pizza Margherita", nameTr: "Margherita Pizza", nameAr: "بيتزا مارغريتا", slug: "pizza-margherita", description: "Tomatensauce, Käse", basePrice: 700, isVegetarian: true, sortOrder: 1 },
    { id: 5, categoryId: 2, name: "Pizza Salami", nameEn: "Pizza Salami", nameTr: "Salam Pizza", nameAr: "بيتزا سلامي", slug: "pizza-salami", description: "Tomatensauce, Käse, Truthahnsalami", basePrice: 850, isFeatured: true, sortOrder: 2 },
    { id: 6, categoryId: 2, name: "Calwer Pizza (scharf)", nameEn: "Calwer Pizza (spicy)", nameTr: "Calwer Pizza (acı)", nameAr: "بيتزا كالفر (حار)", slug: "calwer-pizza", description: "Döner, Zwiebeln, Peperoni", basePrice: 950, isSpicy: true, isFeatured: true, sortOrder: 3 },
    
    // Kebap
    { id: 7, categoryId: 3, name: "Adana Kebap", nameEn: "Adana Kebab", nameTr: "Adana Kebap", nameAr: "كباب أضنة", slug: "adana-kebap", description: "Scharfes Hackfleisch vom Grill", basePrice: 1100, isSpicy: true, sortOrder: 1 },
    { id: 8, categoryId: 3, name: "Şiş Kebap", nameEn: "Shish Kebab", nameTr: "Şiş Kebap", nameAr: "شيش كباب", slug: "sis-kebap", description: "Gegrillte Fleischspieße", basePrice: 1200, sortOrder: 2 },
    
    // Falafel
    { id: 9, categoryId: 4, name: "Falafel Tasche", nameEn: "Falafel Pocket", nameTr: "Falafel Dürüm", nameAr: "جيب فلافل", slug: "falafel-tasche", description: "Knusprige Falafel mit Salat", basePrice: 550, isVegetarian: true, isVegan: true, sortOrder: 1 },
    { id: 10, categoryId: 4, name: "Falafel Teller", nameEn: "Falafel Plate", nameTr: "Falafel Tabağı", nameAr: "طبق فلافل", slug: "falafel-teller", description: "Falafel mit Hummus und Salat", basePrice: 850, isVegetarian: true, isVegan: true, sortOrder: 2 },
    
    // Lahmacun
    { id: 11, categoryId: 5, name: "Lahmacun", nameEn: "Lahmacun", nameTr: "Lahmacun", nameAr: "لحم بعجين", slug: "lahmacun", description: "Türkische Pizza mit Hackfleisch", basePrice: 450, sortOrder: 1 },
    
    // Pommes
    { id: 12, categoryId: 6, name: "Pommes klein", nameEn: "Fries small", nameTr: "Küçük Patates", nameAr: "بطاطس صغيرة", slug: "pommes-klein", description: "Knusprige Pommes", basePrice: 300, isVegetarian: true, sortOrder: 1 },
    { id: 13, categoryId: 6, name: "Pommes groß", nameEn: "Fries large", nameTr: "Büyük Patates", nameAr: "بطاطس كبيرة", slug: "pommes-gross", description: "Große Portion Pommes", basePrice: 450, isVegetarian: true, sortOrder: 2 },
  ];

  for (const prod of prods) {
    await db.insert(products).values(prod).onDuplicateKeyUpdate({ set: { name: prod.name } });
  }
  console.log("✅ Products seeded");

  // Product Variants
  const variants = [
    // Pizza sizes
    { productId: 4, name: "Ø 26cm", nameEn: "Ø 26cm", priceModifier: 0, isDefault: true, sortOrder: 1 },
    { productId: 4, name: "Ø 30cm", nameEn: "Ø 30cm", priceModifier: 200, isDefault: false, sortOrder: 2 },
    { productId: 5, name: "Ø 26cm", nameEn: "Ø 26cm", priceModifier: 0, isDefault: true, sortOrder: 1 },
    { productId: 5, name: "Ø 30cm", nameEn: "Ø 30cm", priceModifier: 200, isDefault: false, sortOrder: 2 },
    { productId: 6, name: "Ø 26cm", nameEn: "Ø 26cm", priceModifier: 0, isDefault: true, sortOrder: 1 },
    { productId: 6, name: "Ø 30cm", nameEn: "Ø 30cm", priceModifier: 250, isDefault: false, sortOrder: 2 },
  ];

  for (const variant of variants) {
    await db.insert(productVariants).values(variant);
  }
  console.log("✅ Variants seeded");

  // Product Extras
  const extras = [
    { id: 1, name: "Extra Käse", nameEn: "Extra Cheese", nameTr: "Ekstra Peynir", nameAr: "جبن إضافي", price: 100, sortOrder: 1 },
    { id: 2, name: "Extra Fleisch", nameEn: "Extra Meat", nameTr: "Ekstra Et", nameAr: "لحم إضافي", price: 200, sortOrder: 2 },
    { id: 3, name: "Scharf", nameEn: "Spicy", nameTr: "Acı", nameAr: "حار", price: 0, sortOrder: 3 },
    { id: 4, name: "Ohne Zwiebeln", nameEn: "No Onions", nameTr: "Soğansız", nameAr: "بدون بصل", price: 0, sortOrder: 4 },
    { id: 5, name: "Knoblauchsauce", nameEn: "Garlic Sauce", nameTr: "Sarımsak Sos", nameAr: "صلصة الثوم", price: 50, sortOrder: 5 },
  ];

  for (const extra of extras) {
    await db.insert(productExtras).values(extra).onDuplicateKeyUpdate({ set: { name: extra.name } });
  }
  console.log("✅ Extras seeded");

  // Achievements
  const achievs = [
    { id: 1, key: "first_order", name: "Erste Bestellung", nameEn: "First Order", description: "Deine erste Bestellung aufgegeben", pointsReward: 50, sortOrder: 1 },
    { id: 2, key: "loyal_customer", name: "Stammkunde", nameEn: "Loyal Customer", description: "10 Bestellungen abgeschlossen", pointsReward: 200, sortOrder: 2 },
    { id: 3, key: "big_spender", name: "Großer Genießer", nameEn: "Big Spender", description: "Über 100€ ausgegeben", pointsReward: 500, sortOrder: 3 },
    { id: 4, key: "night_owl", name: "Nachteule", nameEn: "Night Owl", description: "Bestellung nach 22 Uhr", pointsReward: 100, sortOrder: 4 },
    { id: 5, key: "pizza_lover", name: "Pizza-Liebhaber", nameEn: "Pizza Lover", description: "10 Pizzen bestellt", pointsReward: 150, sortOrder: 5 },
  ];

  for (const achiev of achievs) {
    await db.insert(achievements).values(achiev).onDuplicateKeyUpdate({ set: { name: achiev.name } });
  }
  console.log("✅ Achievements seeded");

  // Rewards
  const rews = [
    { id: 1, name: "10% Rabatt", nameEn: "10% Discount", description: "10% auf deine nächste Bestellung", type: "discount_percent", value: 10, pointsCost: 500, sortOrder: 1 },
    { id: 2, name: "5€ Rabatt", nameEn: "5€ Discount", description: "5€ Rabatt ab 20€ Bestellwert", type: "discount_fixed", value: 500, pointsCost: 800, minOrderAmount: 2000, sortOrder: 2 },
    { id: 3, name: "Gratis Pommes", nameEn: "Free Fries", description: "Gratis Pommes zu deiner Bestellung", type: "free_item", value: 0, pointsCost: 300, sortOrder: 3 },
    { id: 4, name: "Gratis Lieferung", nameEn: "Free Delivery", description: "Kostenlose Lieferung", type: "free_delivery", value: 0, pointsCost: 400, sortOrder: 4 },
  ];

  for (const rew of rews) {
    await db.insert(rewards).values(rew).onDuplicateKeyUpdate({ set: { name: rew.name } });
  }
  console.log("✅ Rewards seeded");

  console.log("🎉 Database seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();
const db = drizzle(process.env.DATABASE_URL);

async function updatePrices() {
  console.log("🔄 Updating prices with real data...");
  
  const updates = [
    { id: 1, basePrice: 900 }, // Döner Kebap: 9,00 €
    { id: 2, basePrice: 1200 }, // Döner Teller: 12,00 €
    { id: 3, basePrice: 700 }, // Vegetarischer Döner: 7,00 €
    { id: 4, basePrice: 800 }, // Pizza Margherita 26cm: 8,00 €
    { id: 5, basePrice: 950 }, // Pizza Salami 26cm: 9,50 €
    { id: 6, basePrice: 1050 }, // Calwer Pizza 26cm: 10,50 €
    { id: 7, basePrice: 1200 }, // Adana Kebap: 12,00 €
    { id: 8, basePrice: 1300 }, // Şiş Kebap: 13,00 €
    { id: 9, basePrice: 700 }, // Falafel Tasche: 7,00 €
    { id: 10, basePrice: 1000 }, // Falafel Teller: 10,00 €
    { id: 11, basePrice: 500 }, // Lahmacun: 5,00 €
    { id: 12, basePrice: 350 }, // Pommes klein: 3,50 €
    { id: 13, basePrice: 500 }, // Pommes groß: 5,00 €
  ];
  
  for (const update of updates) {
    await db.update(products).set({ basePrice: update.basePrice }).where(eq(products.id, update.id));
    console.log(`✅ Updated product ${update.id} to ${update.basePrice} cents`);
  }
  
  console.log("🎉 Prices updated successfully!");
  process.exit(0);
}

updatePrices().catch((err) => {
  console.error("❌ Update failed:", err);
  process.exit(1);
});

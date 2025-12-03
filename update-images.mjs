import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function updateImages() {
  console.log("🖼️  Updating product images...");

  const imageMap = {
    "doener-kebap": "/images/doener-kebap.jpg",
    "pizza-margherita-26cm": "/images/pizza-margherita.jpg",
    "pizza-margherita-30cm": "/images/pizza-margherita.jpg",
    "lahmacun": "/images/lahmacun.jpg",
    "falafel-teller": "/images/falafel.jpg",
    "falafel-wrap": "/images/falafel.jpg",
    "falafel-box": "/images/falafel.jpg",
    "pommes-frites-klein": "/images/pommes-frites.jpg",
    "pommes-frites-gross": "/images/pommes-frites.jpg",
    "pommes-kaese": "/images/pommes-frites.jpg",
  };

  for (const [slug, imageUrl] of Object.entries(imageMap)) {
    await db.update(products)
      .set({ imageUrl })
      .where(eq(products.slug, slug));
    console.log(`✅ Updated ${slug}`);
  }

  console.log("🎉 All images updated!");
  process.exit(0);
}

updateImages().catch((error) => {
  console.error("❌ Update failed:", error);
  process.exit(1);
});

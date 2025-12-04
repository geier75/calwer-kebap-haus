import Database from "better-sqlite3";

const db = new Database(process.env.DATABASE_URL?.replace("file:", "") || "./data.db");

db.prepare(`
  UPDATE products 
  SET imageUrl = '/images/menu-1.jpg'
  WHERE slug = 'menu-1'
`).run();

console.log("✅ Menü 1 Bild aktualisiert!");
db.close();

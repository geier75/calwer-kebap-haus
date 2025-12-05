import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = drizzle(connection, { schema, mode: 'default' });

// Get all categories
const categories = await db.select().from(schema.categories);
console.log('=== ALL CATEGORIES ===');
categories.forEach(cat => {
  console.log(`ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}`);
});

// Get Falafel products
const [falafelProducts] = await connection.execute(
  'SELECT id, name, categoryId FROM products WHERE name LIKE "%Falafel%"'
);
console.log('\n=== FALAFEL PRODUCTS ===');
console.log(falafelProducts);

// Get products by category 7
const [cat7Products] = await connection.execute(
  'SELECT id, name, categoryId FROM products WHERE categoryId = 7'
);
console.log('\n=== PRODUCTS IN CATEGORY 7 ===');
console.log(cat7Products);

await connection.end();

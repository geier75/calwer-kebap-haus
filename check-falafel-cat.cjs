const mysql = require('mysql2/promise');

async function checkCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('=== ALL CATEGORIES ===');
  const [categories] = await connection.execute('SELECT id, name, slug FROM categories ORDER BY id');
  categories.forEach(cat => {
    console.log(`ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}`);
  });

  console.log('\n=== FALAFEL PRODUCTS ===');
  const [products] = await connection.execute(
    'SELECT id, name, categoryId FROM products WHERE name LIKE "%Falafel%"'
  );
  products.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name}, CategoryID: ${p.categoryId}`);
  });

  await connection.end();
}

checkCategories().catch(console.error);

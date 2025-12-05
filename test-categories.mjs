import 'dotenv/config';

const API_URL = 'http://localhost:3000/api/trpc';

async function testCategories() {
  try {
    // Fetch categories
    const categoriesRes = await fetch(`${API_URL}/menu.categories`);
    const categoriesData = await categoriesRes.json();
    
    console.log('=== CATEGORIES ===');
    console.log(JSON.stringify(categoriesData, null, 2));
    
    // Fetch all products
    const productsRes = await fetch(`${API_URL}/menu.products`);
    const productsData = await productsRes.json();
    
    console.log('\n=== FALAFEL PRODUCTS ===');
    const falafelProducts = productsData.result?.data?.filter(p => p.name.includes('Falafel'));
    console.log(JSON.stringify(falafelProducts, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCategories();

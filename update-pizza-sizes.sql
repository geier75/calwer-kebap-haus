-- Update all pizzas with size variants (26cm and 30cm)

UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 800}, {"size": "30cm", "price": 950}]', basePrice = 800 WHERE name = 'Pizza Margherita';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1200}]', basePrice = 900 WHERE name LIKE '%Salami%' OR name LIKE '%Truthahn%';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1200}]', basePrice = 900 WHERE name LIKE '%Schinken%' OR name LIKE '%Putenkeule%';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1200}]', basePrice = 900 WHERE name = 'Pizza Funghi';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1300}]', basePrice = 900 WHERE name = 'Pizza Tonno';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1000}, {"size": "30cm", "price": 1350}]', basePrice = 1000 WHERE name = 'Pizza Quattro Stagioni';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1100}, {"size": "30cm", "price": 1400}]', basePrice = 1100 WHERE name = 'Pizza Sucuk';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 800}, {"size": "30cm", "price": 1100}]', basePrice = 800 WHERE name = 'Pizza Hawaii';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1200}]', basePrice = 900 WHERE name = 'Pizza Amore';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1000}, {"size": "30cm", "price": 1300}]', basePrice = 1000 WHERE name = 'Pizza 4 Jahreszeiten';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1200}]', basePrice = 900 WHERE name = 'Pizza Mozzarella';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1200}]', basePrice = 900 WHERE name = 'Pizza Döner';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 900}, {"size": "30cm", "price": 1200}]', basePrice = 900 WHERE name = 'Pizza Calwer';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1100}, {"size": "30cm", "price": 1400}]', basePrice = 1100 WHERE name = 'Pizza Wunderbar';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1100}, {"size": "30cm", "price": 1400}]', basePrice = 1100 WHERE name LIKE '%Vegetaria%' OR name LIKE '%Vegetarisch%';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1000}, {"size": "30cm", "price": 1300}]', basePrice = 1000 WHERE name = 'Pizza Diavolo';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1000}, {"size": "30cm", "price": 1300}]', basePrice = 1000 WHERE name = 'Pizza al Capone';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1000}, {"size": "30cm", "price": 1300}]', basePrice = 1000 WHERE name = 'Pizza Sardegna';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1100}, {"size": "30cm", "price": 1400}]', basePrice = 1100 WHERE name = 'Pizza Special';
UPDATE products SET hasVariants = TRUE, variants = '[{"size": "26cm", "price": 1050}, {"size": "30cm", "price": 1350}]', basePrice = 1050 WHERE name = 'Pizza Quattro Formaggi';

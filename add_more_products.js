require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    try {
        const data = JSON.parse(fs.readFileSync('supabase.txt', 'utf8'));

        // Find categories again
        const { data: cats } = await supabase.from('categories').select('id, slug');
        const catMap = {};
        cats.forEach(c => { catMap[c.slug] = c.id; });

        const baseProducts = data.products;
        const newProducts = [];

        // Duplicate each product with a variation
        for (let i = 0; i < 3; i++) { // Duplicate 3 times
            for (const p of baseProducts) {
                let catId = p.categoryId ? catMap[p.categoryId] : null;
                if (!catId) continue;

                let name = (p.meta && p.meta.en && p.meta.en.name) ? p.meta.en.name : (p.sku || p.id);
                name = `${name} - Edition ${i + 2}`;

                let priceStr = (p.price && p.price.current) ? p.price.current : '0';
                let price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) + (i * 100);

                let images = p.images && p.images.gallery ? [...p.images.gallery] : [];
                if (p.images && p.images.primary) images.unshift(p.images.primary);

                newProducts.push({
                    category_id: catId,
                    name: name,
                    price: price,
                    stock: Math.floor(Math.random() * 50) + 1,
                    image_urls: images,
                    is_featured: true,
                    rating: 4 + Math.random(),
                    metadata: { ...p, is_duplicate: true }
                });
            }
        }

        console.log(`Inserting ${newProducts.length} additional products...`);
        const { error } = await supabase.from('products').insert(newProducts);

        if (error) {
            console.error('Insert error:', error.message);
        } else {
            console.log('Successfully added more products!');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}
run();

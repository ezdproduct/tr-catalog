require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    try {
        const data = JSON.parse(fs.readFileSync('supabase.txt', 'utf8'));

        console.log('Clearing old data...');
        await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const catMap = {}; // slug -> uuid

        async function insertCat(c) {
            if (!c.slug) return;
            let name = (c.meta && c.meta.en && c.meta.en.name) ? c.meta.en.name : c.id;
            let desc = (c.meta && c.meta.en && c.meta.en.description) ? c.meta.en.description : '';
            let imgUrl = c.bannerImage || (c.heroVideo && c.heroVideo.poster) || '';

            const { data: inserted, error } = await supabase.from('categories').insert({
                name: name,
                slug: c.slug,
                description: desc,
                image_url: imgUrl,
                metadata: c
            }).select('id').single();

            if (error) {
                console.error('Category insert error for', c.slug, error.message);
            } else {
                catMap[c.slug] = inserted.id;
            }
        }

        console.log('Inserting categories...');
        for (const c of data.categories) {
            await insertCat(c);
        }
        for (const c of data.categories) {
            if (c.children) {
                for (const child of c.children) {
                    await insertCat(child);
                }
            }
        }

        console.log('Inserting products...');
        for (const p of data.products) {
            let catId = p.categoryId ? catMap[p.categoryId] : null;
            let name = (p.meta && p.meta.en && p.meta.en.name) ? p.meta.en.name : (p.sku || p.id);
            let priceStr = (p.price && p.price.current) ? p.price.current : '0';
            let price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
            if (isNaN(price)) price = 0;

            let stock = p.stockCount || 0;
            let rating = p.rating || 0;
            let isFeatured = p.status === 'inStock' || p.status === 'onlyLeft' ? true : false;

            let images = p.images && p.images.gallery ? [...p.images.gallery] : [];
            if (p.images && p.images.primary) images.unshift(p.images.primary);

            const { error } = await supabase.from('products').insert({
                category_id: catId,
                name: name,
                price: price,
                stock: stock,
                image_urls: images,
                is_featured: isFeatured,
                rating: rating,
                metadata: p
            });

            if (error) {
                console.error('Product insert error for', name, error.message);
            }
        }

        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Script Error:', err);
    }
}
run();

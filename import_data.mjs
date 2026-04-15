import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import { v5 as uuidv5 } from 'uuid';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for bypass RLS

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Namespace for UUID v5 generation to keep IDs consistent
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const rawData = JSON.parse(fs.readFileSync('./supabase.txt', 'utf8'));

async function run() {
    console.log('Starting clear and import...');

    // 0. Clear existing data
    console.log('Wiping existing products, categories, and media...');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('media').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 1. Extract ALL media URLs from the entire JSON
    const allMediaUrls = new Set();
    const mediaRegex = /\.(jpg|png|webp|svg|jpeg|gif|avif|mp4|webm)/i;

    function findUrls(obj) {
        if (typeof obj === 'string') {
            if (mediaRegex.test(obj) && (obj.startsWith('http') || obj.startsWith('//') || obj.startsWith('/'))) {
                allMediaUrls.add(obj);
            }
        } else if (Array.isArray(obj)) {
            obj.forEach(findUrls);
        } else if (obj !== null && typeof obj === 'object') {
            Object.values(obj).forEach(findUrls);
        }
    }

    findUrls(rawData);
    console.log(`Found ${allMediaUrls.size} unique media URLs in total.`);

    const mediaToInsert = Array.from(allMediaUrls).map(url => ({
        url,
        type: url.split('.').pop().split('?')[0].toLowerCase()
    }));

    if (mediaToInsert.length > 0) {
        console.log(`Inserting ${mediaToInsert.length} media records...`);
        const { error: mediaErr } = await supabase.from('media').upsert(mediaToInsert, { onConflict: 'url' });
        if (mediaErr) console.error('Media Import Error:', mediaErr);
    }

    // 2. Process Categories
    const categoryMap = new Map();
    const flatCategories = [];

    function flattenCategories(cats, parentId = null) {
        for (const cat of cats) {
            const generatedId = uuidv5(cat.id, NAMESPACE);
            categoryMap.set(cat.id, generatedId);

            flatCategories.push({
                id: generatedId,
                name: cat.meta?.vi?.name || cat.id,
                slug: cat.slug,
                description: cat.meta?.vi?.description || '',
                image_url: cat.bannerImage || '',
                metadata: cat.meta || {}
            });

            if (cat.children && cat.children.length > 0) {
                flattenCategories(cat.children, generatedId);
            }
        }
    }

    flattenCategories(rawData.categories);

    console.log(`Upserting ${flatCategories.length} categories...`);
    const { error: catError } = await supabase.from('categories').upsert(flatCategories, { onConflict: 'slug' });
    if (catError) console.error('Category Import Error:', catError);

    // 2. Process Products
    const products = rawData.products.map(p => {
        const images = [];
        if (p.images?.primary) images.push(p.images.primary);
        if (p.images?.hover) images.push(p.images.hover);
        if (p.images?.gallery) images.push(...p.images.gallery);

        // Filter to count only valid strings for images
        const cleanImages = images.filter(url => typeof url === 'string' && url.trim().length > 0);

        const priceNum = typeof p.price?.current === 'string'
            ? parseFloat(p.price.current.replace(/[^0-9.]/g, ''))
            : 0;

        return {
            id: uuidv5(p.id, NAMESPACE),
            category_id: categoryMap.get(p.categoryId) || null,
            name: p.meta?.vi?.name || p.id,
            description: p.meta?.vi?.description || '',
            price: priceNum,
            image_urls: cleanImages,
            metadata: p.meta || {},
            tag: p.status || '',
            is_featured: p.sortOrder <= 6
        };
    });

    console.log(`Upserting ${products.length} products...`);
    const { error: prodError } = await supabase.from('products').upsert(products);
    if (prodError) console.error('Product Import Error:', prodError);

    console.log('Import completed successfully.');
}

run();

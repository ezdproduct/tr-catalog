
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importCatalog() {
    const rawData = fs.readFileSync('catalog.json', 'utf8');
    const catalog = JSON.parse(rawData);

    console.log('--- CLEANING EXISTING DATA ---');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const categoryMap = new Map(); // jsonId -> supabaseId

    console.log('--- IMPORTING CATEGORIES ---');
    // First level categories
    for (const cat of catalog.categories) {
        const { data, error } = await supabase.from('categories').insert({
            name: cat.meta.vi.name,
            slug: cat.slug,
            description: cat.meta.vi.description,
            image_url: cat.bannerImage,
            metadata: {
                id_legacy: cat.id,
                meta: cat.meta,
                bannerImageMobile: cat.bannerImageMobile,
                collectionCard: cat.collectionCard,
                descriptionMedia: cat.descriptionMedia
            }
        }).select().single();

        if (error) {
            console.error(`Error inserting category ${cat.id}:`, error);
            continue;
        }
        categoryMap.set(cat.id, data.id);

        // Children
        if (cat.children && cat.children.length > 0) {
            for (const child of cat.children) {
                const { data: childData, error: childError } = await supabase.from('categories').insert({
                    name: child.meta.vi.name,
                    slug: child.slug,
                    description: child.meta.vi.description,
                    image_url: child.bannerImage,
                    metadata: {
                        id_legacy: child.id,
                        parentId_legacy: cat.id,
                        meta: child.meta,
                        bannerImageMobile: child.bannerImageMobile,
                        collectionCard: child.collectionCard,
                        descriptionMedia: child.descriptionMedia
                    }
                }).select().single();

                if (childError) {
                    console.error(`Error inserting child category ${child.id}:`, childError);
                } else {
                    categoryMap.set(child.id, childData.id);
                }
            }
        }
    }

    console.log('--- IMPORTING PRODUCTS ---');
    for (const prod of catalog.products) {
        const priceStr = prod.price?.current || '$0';
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;

        const imageUrls = [];
        if (prod.images?.primary) imageUrls.push(prod.images.primary);
        if (prod.images?.hover) imageUrls.push(prod.images.hover);
        if (prod.images?.gallery) imageUrls.push(...prod.images.gallery);

        const { error } = await supabase.from('products').insert({
            name: prod.meta.vi.name,
            description: prod.meta.vi.description || '',
            price: price,
            category_id: categoryMap.get(prod.categoryId) || null,
            image_urls: imageUrls,
            is_featured: prod.status === 'inStock',
            metadata: {
                id_legacy: prod.id,
                sku: prod.sku,
                type: prod.type,
                status: prod.status,
                price_meta: prod.price,
                meta: prod.meta,
                variants: prod.variants
            }
        });

        if (error) {
            console.error(`Error inserting product ${prod.id}:`, error);
        } else {
            console.log(`Inserted product: ${prod.meta.vi.name}`);
        }
    }

    console.log('--- IMPORTING MEDIA ---');
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

    findUrls(catalog);
    console.log(`Found ${allMediaUrls.size} unique media URLs across all sections.`);

    for (const url of allMediaUrls) {
        let fullUrl = url;
        if (url.startsWith('//')) {
            fullUrl = 'https:' + url;
        }

        // Determine type from extension
        const type = fullUrl.split('.').pop().split('?')[0].toLowerCase();

        await supabase.from('media').upsert({
            url: fullUrl,
            type: type
        }, { onConflict: 'url' });
    }

    console.log('--- IMPORT COMPLETED ---');
}

importCatalog();

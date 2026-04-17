
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v5 as uuidv5 } from 'uuid';

dotenv.config({ path: '.env.local' });

const NAMESPACE = '6b8b4567-d1a2-4e21-876a-3957973c1352';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function harvestFromMedia() {
    console.log('Fetching all media to discover products from folder structure...');
    const { data: media } = await supabase.from('media').select('url');
    if (!media) return;

    const productMap = new Map(); // FolderName -> Set of URLs

    media.forEach(m => {
        const parts = m.url.split('/');
        if (parts.length < 5) return; // Not in a structured product folder

        // Structure: .../Category/ProductName/Variant/...
        const categoryName = decodeURIComponent(parts[parts.length - 4] || '');
        const productName = decodeURIComponent(parts[parts.length - 3] || '');
        const variantName = decodeURIComponent(parts[parts.length - 2] || '');

        const folderKey = productName || categoryName;
        if (!folderKey) return;

        if (!productMap.has(folderKey)) {
            productMap.set(folderKey, {
                name: folderKey,
                category: categoryName,
                images: new Set()
            });
        }
        productMap.get(folderKey).images.add(m.url);
    });

    console.log(`Discovered ${productMap.size} potential products from media folders.`);

    const productsToUpsert = [];
    for (const [key, data] of productMap) {
        productsToUpsert.push({
            id: uuidv5(key, NAMESPACE),
            name: key.replace(/ Dining Set/g, '').replace(/ - /g, ' '),
            description: `Auto-harvested collection for ${key}`,
            price: 2999, // default
            image_urls: Array.from(data.images),
            metadata: {
                original_folder: key,
                original_category: data.category,
                harvested: true
            },
            sort_order: 100 // default for harvested
        });
    }

    console.log(`Upserting ${productsToUpsert.length} products to database...`);
    const { error } = await supabase.from('products').upsert(productsToUpsert, { onConflict: 'id' });

    if (error) {
        console.error('Upsert Error:', error);
    } else {
        console.log('Harvest complete!');
    }
}

harvestFromMedia();

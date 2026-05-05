
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

if (!supabaseUrl || !supabaseKey || !r2PublicUrl) {
    console.error('Missing environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and NEXT_PUBLIC_R2_PUBLIC_URL are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUrls() {
    console.log('Fetching products with local catalog URLs...');
    
    // Fetch all products
    const { data: products, error } = await supabase.from('products').select('id, image_urls');
    
    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} products. Checking for local URLs...`);

    for (const product of products) {
        if (!product.image_urls) continue;

        let updated = false;
        const newUrls = product.image_urls.map(url => {
            if (url.startsWith('/catalog/')) {
                updated = true;
                return `${r2PublicUrl}${url}`;
            }
            return url;
        });

        if (updated) {
            console.log(`Updating product ${product.id}...`);
            const { error: updateError } = await supabase
                .from('products')
                .update({ image_urls: newUrls })
                .eq('id', product.id);
            
            if (updateError) {
                console.error(`Error updating product ${product.id}:`, updateError);
            }
        }
    }

    console.log('Updating media table...');
    const { data: media, error: mediaError } = await supabase.from('media').select('id, url');
    
    if (mediaError) {
        console.error('Error fetching media:', mediaError);
    } else {
        for (const item of media) {
            if (item.url.startsWith('/catalog/')) {
                console.log(`Updating media ${item.id}...`);
                await supabase
                    .from('media')
                    .update({ url: `${r2PublicUrl}${item.url}` })
                    .eq('id', item.id);
            }
        }
    }

    console.log('Update completed.');
}

updateUrls();

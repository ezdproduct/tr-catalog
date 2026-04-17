
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function smartLink() {
    console.log('Fetching all products and all media...');
    const { data: products } = await supabase.from('products').select('id, name');
    const { data: media } = await supabase.from('media').select('url');

    if (!products || !media) {
        console.error('Failed to fetch data');
        return;
    }

    console.log(`Found ${products.length} products and ${media.length} media items.`);

    const updates = products.map(p => {
        // Try to find media that matches the product name parts
        const nameParts = p.name.split(' ').map(part => part.toLowerCase().replace(/[^a-z0-9]/g, ''));

        const matchedMedia = media.filter(m => {
            const url = m.url.toLowerCase();
            // Simplified matching: if product name keyword is in URL
            // Special cases for Transformer names
            if (p.name.includes('ngoài trời') && url.includes('outdoor')) return true;
            if (p.name.includes('Family') && url.includes('family')) return true;
            if (p.name.includes('Host') && url.includes('host')) return true;
            if (p.name.includes('Practical') && url.includes('practical')) return true;
            if (p.name.includes('Nova') && url.includes('nova')) return true;
            if (p.name.includes('Bàn trà') && (url.includes('coffee') || url.includes('table'))) return true;
            if (p.name.includes('Storage') && url.includes('storage')) return true;

            return false;
        }).map(m => m.url);

        console.log(`Product: ${p.name} - Matched ${matchedMedia.length} images`);

        return {
            id: p.id,
            image_urls: matchedMedia.length > 0 ? matchedMedia : [media[0].url] // Fallback to first if none
        };
    });

    console.log('Updating products with matched image URLs...');
    for (const update of updates) {
        const { error } = await supabase.from('products').update({ image_urls: update.image_urls }).eq('id', update.id);
        if (error) console.error(`Error updating product ${update.id}:`, error);
    }

    console.log('Link complete.');
}

smartLink();

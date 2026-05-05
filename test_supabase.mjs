
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    console.log('Testing Categories...');
    const { data: catData, error: catError } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    console.log('Categories:', { catData, catError });

    console.log('Testing Products...');
    const { data: prodData, error: prodError } = await supabase.from('products').select('*', { count: 'exact', head: true });
    console.log('Products:', { prodData, prodError });

    console.log('Testing Media...');
    const { data: mediaData, error: mediaError } = await supabase.from('media').select('*', { count: 'exact', head: true });
    console.log('Media:', { mediaData, mediaError });
}

test();

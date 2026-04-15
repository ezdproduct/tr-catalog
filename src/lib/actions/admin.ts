'use server';

import { uploadImage } from '../r2';
import { supabase } from '../supabase';

export async function uploadProductImage(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `products/${Date.now()}-${file.name}`;

    const url = await uploadImage(buffer, fileName, file.type);
    return url;
}

export async function uploadCategoryBanner(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `categories/${Date.now()}-${file.name}`;

    const url = await uploadImage(buffer, fileName, file.type);
    return url;
}

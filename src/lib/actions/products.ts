'use server';

import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/r2';
import { revalidatePath } from 'next/cache';

export async function getProducts(page: number = 1, pageSize: number = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*, categories(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  } catch (err) {
    console.error('getProducts Error:', err);
    return { data: [], count: 0 };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const priceStr = formData.get('price') as string;
    const price = priceStr ? parseFloat(priceStr) : 0;
    const category_id = formData.get('category_id') as string;
    const metadataStr = formData.get('metadata') as string;
    const metadata = metadataStr ? JSON.parse(metadataStr) : {};

    const files = formData.getAll('images') as File[];
    const image_urls: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `prod-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const url = await uploadImage(buffer, fileName, file.type);
        image_urls.push(url);
      }
    }

    const { error } = await supabase.from('products').insert([{
      name, description, price, category_id,
      image_urls, metadata
    }]);

    if (error) throw error;
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('createProduct Error:', err);
    throw new Error(err.message || 'Lỗi khi tạo sản phẩm');
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const priceStr = formData.get('price') as string;
    const price = priceStr ? parseFloat(priceStr) : 0;
    const category_id = formData.get('category_id') as string;
    const metadataStr = formData.get('metadata') as string;
    const metadata = metadataStr ? JSON.parse(metadataStr) : {};
    const existingImagesStr = formData.get('existing_images') as string;

    const files = formData.getAll('images') as File[];
    const new_image_urls: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `prod-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const url = await uploadImage(buffer, fileName, file.type);
        new_image_urls.push(url);
      }
    }

    const updateData: any = { name, description, price, category_id, metadata };

    // Kết hợp ảnh cũ (nếu có tham số existing_images) và ảnh mới
    if (existingImagesStr !== null) {
      const existingImages = JSON.parse(existingImagesStr);
      updateData.image_urls = [...existingImages, ...new_image_urls];
    } else if (new_image_urls.length > 0) {
      updateData.image_urls = new_image_urls;
    }

    const { error } = await supabase.from('products').update(updateData).eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('updateProduct Error:', err);
    throw new Error(err.message || 'Lỗi khi cập nhật sản phẩm');
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('deleteProduct Error:', err);
    throw new Error(err.message || 'Lỗi khi xóa sản phẩm');
  }
}

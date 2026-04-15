'use server';

import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/r2';
import { revalidatePath } from 'next/cache';

export async function getCategories(page: number = 1, pageSize: number = 10, search: string = '') {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    let query = supabase
      .from('categories')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, count };
  } catch (err) {
    console.error('getCategories Error:', err);
    return { data: [], count: 0 };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = (formData.get('description') as string) || '';
    const metadataStr = formData.get('metadata') as string;
    const metadata = metadataStr ? JSON.parse(metadataStr) : {};

    const file = formData.get('image') as File;
    let image_url = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `cat-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      image_url = await uploadImage(buffer, fileName, file.type);
    }

    const { error } = await supabase.from('categories').insert([{
      name, slug, description, metadata, image_url
    }]);

    if (error) throw error;
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('createCategory Error:', err);
    throw new Error(err.message || 'Lỗi khi tạo danh mục');
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = (formData.get('description') as string) || '';
    const metadataStr = formData.get('metadata') as string;
    const metadata = metadataStr ? JSON.parse(metadataStr) : {};
    const existingImageStr = formData.get('existing_image') as string;

    const file = formData.get('image') as File;
    let image_url = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `cat-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      image_url = await uploadImage(buffer, fileName, file.type);
    }

    const updateData: any = { name, slug, description, metadata };

    if (image_url) {
      // Nếu có ảnh mới upload thì dùng ảnh mới
      updateData.image_url = image_url;
    } else if (existingImageStr !== null) {
      // Nếu không có ảnh mới nhưng client truyền lên trạng thái ảnh cũ
      updateData.image_url = existingImageStr === '' ? null : existingImageStr;
    }

    const { error } = await supabase.from('categories').update(updateData).eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('updateCategory Error:', err);
    throw new Error(err.message || 'Lỗi khi cập nhật danh mục');
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('deleteCategory Error:', err);
    throw new Error(err.message || 'Lỗi khi xóa danh mục');
  }
}

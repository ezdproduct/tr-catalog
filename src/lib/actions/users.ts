'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
}

export async function updateUserRole(id: string, role: 'admin' | 'user') {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  if (error) throw error;
  revalidatePath('/[locale]/admin/dashboard', 'page');
}

export async function deleteUser(id: string) {
  // Note: Usually you'd delete from auth.users via admin client
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/[locale]/admin/dashboard', 'page');
}

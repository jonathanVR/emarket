import { mapProductRow } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import type { Product, ProductInput, ProductRow } from '@/lib/types';
import { toProductRow } from '@/lib/products';

export async function listProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ProductRow[]).map(mapProductRow);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapProductRow(data as ProductRow);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .insert(toProductRow(input))
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProductRow(data as ProductRow);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .update(toProductRow(input))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProductRow(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function setProductStatus(
  id: string,
  status: Product['status'],
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

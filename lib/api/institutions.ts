import { supabase } from '@/lib/supabase';
import type { Institution } from '@/lib/supabase';

export async function getInstitutions() {
  const { data, error } = await supabase
    .from('institutions')
    .select(`
      *,
      branch:branches(
        *,
        company:companies(*)
      )
    `)
    .eq('branch.is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching institutions:', error);
    return [];
  }

  return data as Institution[];
}

export async function getInstitutionsByCategory(category: string) {
  const { data, error } = await supabase
    .from('institutions')
    .select(`
      *,
      branch:branches(
        *,
        company:companies(*)
      )
    `)
    .eq('category', category)
    .eq('branch.is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching institutions by category:', error);
    return [];
  }

  return data as Institution[];
}

export async function getPopularInstitutions() {
  const { data, error } = await supabase
    .from('institutions')
    .select(`
      *,
      branch:branches(
        *,
        company:companies(*)
      )
    `)
    .eq('is_popular', true)
    .eq('branch.is_active', true)
    .order('rating', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching popular institutions:', error);
    return [];
  }

  return data as Institution[];
}

export async function getInstitutionById(id: string) {
  const { data, error } = await supabase
    .from('institutions')
    .select(`
      *,
      branch:branches(
        *,
        company:companies(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching institution:', error);
    return null;
  }

  return data as Institution;
}

export async function updateInstitutionStatus(id: string, status: 'open' | 'closed' | 'busy' | 'break') {
  const { data, error } = await supabase
    .from('institutions')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating institution status:', error);
    return null;
  }

  return data as Institution;
}

export async function searchInstitutions(query: string) {
  const { data, error } = await supabase
    .from('institutions')
    .select(`
      *,
      branch:branches(
        *,
        company:companies(*)
      )
    `)
    .or(`name.ilike.%${query}%, category.ilike.%${query}%, location.ilike.%${query}%`)
    .eq('branch.is_active', true)
    .order('name');

  if (error) {
    console.error('Error searching institutions:', error);
    return [];
  }

  return data as Institution[];
}
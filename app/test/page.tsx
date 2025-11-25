import { supabase } from '@/utils/supabase/client';

export default function TestPage() {
  const testConnection = async () => {
    const { data, error } = await supabase.from('your_table').select('*').limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('✅ Supabase is working!', data);
    }
  };

  return <button onClick={testConnection}>Test Supabase</button>;
}
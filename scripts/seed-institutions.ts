import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
);

async function seedInstitutions() {
  // First, you need branches. Create a company and branch:
  const { data: company } = await supabase
    .from('companies')
    .insert({
      name: 'Zanaco Bank',
      business_type: 'Banking',
      city: 'Lusaka',
      country: 'Zambia'
    })
    .select()
    .single();

  const { data: branch } = await supabase
    .from('branches')
    .insert({
      company_id: company.id,
      name: 'Cairo Road Branch',
      address: 'Cairo Road, Lusaka',
      city: 'Lusaka',
      phone: '+260 211 229229',
      services: ['Account Opening', 'Loans', 'General Banking']
    })
    .select()
    .single();

  // Now create the institution
  const { data: institution, error } = await supabase
    .from('institutions')
    .insert({
      branch_id: branch.id,
      name: 'Zanaco Bank - Cairo Road',
      category: 'Banking',
      location: 'Cairo Road, Lusaka',
      status: 'open',
      current_queue_count: 0,
      estimated_wait_time: 15,
      services: ['Account Opening', 'Loans', 'General Banking'],
      phone: '+260 211 229229',
      rating: 4.3,
      is_popular: true
    });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Institution created:', institution);
  }
}

seedInstitutions();
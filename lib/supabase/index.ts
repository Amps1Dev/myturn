import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export all types
export type UserRole = 'client' | 'company_admin' | 'branch_manager' | 'super_admin';
export type QueueStatus = 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show';
export type InstitutionStatus = 'open' | 'closed' | 'busy' | 'break';
export type NotificationType = 'queue_update' | 'appointment_reminder' | 'system_alert' | 'promotion';
export type PriorityType = 'normal' | 'elderly' | 'pregnant' | 'premium' | 'disability';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  date_of_birth?: string;
  is_pregnant?: boolean;
  has_disability?: boolean;
  priority_type: PriorityType;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  business_type: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  manager_id?: string;
  operating_hours: Record<string, { open: string | null; close: string | null }>;
  services: string[];
  max_queue_size: number;
  average_service_time: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Institution {
  id: string;
  branch_id: string;
  name: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: InstitutionStatus;
  current_queue_count: number;
  estimated_wait_time: number;
  operating_hours: Record<string, { open: string | null; close: string | null }>;
  services: string[];
  phone?: string;
  is_popular: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  branch?: Branch;
}

export interface QueueEntry {
  id: string;
  user_id: string;
  institution_id: string;
  branch_id: string;
  queue_number: number;
  priority_type: PriorityType;
  service_type?: string;
  status: QueueStatus;
  estimated_wait_time: number;
  actual_wait_time?: number;
  joined_at: string;
  called_at?: string;
  served_at?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
  institution?: Institution;
  branch?: Branch;
}

export interface Appointment {
  id: string;
  user_id: string;
  institution_id: string;
  branch_id: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  status: string;
  priority_type: PriorityType;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface AnalyticsDaily {
  id: string;
  branch_id: string;
  date: string;
  total_customers: number;
  completed_services: number;
  cancelled_services: number;
  no_shows: number;
  average_wait_time: number;
  peak_hour?: string;
  total_revenue: number;
  customer_satisfaction: number;
  created_at: string;
}

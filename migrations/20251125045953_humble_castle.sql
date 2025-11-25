/*
  # MyTurn Queue Management System Database Schema

  1. New Tables
    - `profiles` - User profiles for both clients and companies
    - `companies` - Company information and settings
    - `branches` - Company branch locations and details
    - `institutions` - All institutions/companies offering queue services
    - `queue_entries` - Active and historical queue entries
    - `appointments` - Scheduled appointments
    - `notifications` - User notifications and alerts
    - `analytics_daily` - Daily analytics and statistics
    - `subscription_plans` - Premium subscription plans
    - `user_subscriptions` - User subscription status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Company users can only access their company/branch data
    - Clients can only access their own queue entries and public institution data

  3. Features
    - Real-time queue management
    - Priority queuing system
    - Analytics and reporting
    - Subscription management
    - Notification system
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'company_admin', 'branch_manager', 'super_admin');
CREATE TYPE queue_status AS ENUM ('waiting', 'called', 'served', 'cancelled', 'no_show');
CREATE TYPE institution_status AS ENUM ('open', 'closed', 'busy', 'break');
CREATE TYPE notification_type AS ENUM ('queue_update', 'appointment_reminder', 'system_alert', 'promotion');
CREATE TYPE priority_type AS ENUM ('normal', 'elderly', 'pregnant', 'premium', 'disability');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  role user_role NOT NULL DEFAULT 'client',
  date_of_birth date,
  is_pregnant boolean DEFAULT false,
  has_disability boolean DEFAULT false,
  priority_type priority_type DEFAULT 'normal',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  business_type text NOT NULL,
  logo_url text,
  website text,
  phone text,
  email text,
  address text,
  city text DEFAULT 'Lusaka',
  country text DEFAULT 'Zambia',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text DEFAULT 'Lusaka',
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  phone text,
  email text,
  manager_id uuid REFERENCES profiles(id),
  operating_hours jsonb DEFAULT '{"monday": {"open": "08:00", "close": "17:00"}, "tuesday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "friday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "08:00", "close": "13:00"}, "sunday": {"open": null, "close": null}}',
  services jsonb DEFAULT '[]',
  max_queue_size integer DEFAULT 50,
  average_service_time integer DEFAULT 15,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Institutions table (public view of companies/branches)
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  status institution_status DEFAULT 'open',
  current_queue_count integer DEFAULT 0,
  estimated_wait_time integer DEFAULT 0,
  operating_hours jsonb,
  services text[] DEFAULT '{}',
  phone text,
  is_popular boolean DEFAULT false,
  rating decimal(3, 2) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Queue entries table
CREATE TABLE IF NOT EXISTS queue_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  queue_number integer NOT NULL,
  priority_type priority_type DEFAULT 'normal',
  service_type text,
  status queue_status DEFAULT 'waiting',
  estimated_wait_time integer DEFAULT 0,
  actual_wait_time integer,
  joined_at timestamptz DEFAULT now(),
  called_at timestamptz,
  served_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  service_type text NOT NULL,
  status text DEFAULT 'scheduled',
  priority_type priority_type DEFAULT 'normal',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Analytics daily table
CREATE TABLE IF NOT EXISTS analytics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_customers integer DEFAULT 0,
  completed_services integer DEFAULT 0,
  cancelled_services integer DEFAULT 0,
  no_shows integer DEFAULT 0,
  average_wait_time decimal(5, 2) DEFAULT 0,
  peak_hour time,
  total_revenue decimal(10, 2) DEFAULT 0,
  customer_satisfaction decimal(3, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(branch_id, date)
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  duration_months integer NOT NULL,
  features jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  auto_renew boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Companies: Public read, company admins can manage
CREATE POLICY "Anyone can read companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Company admins can manage companies"
  ON companies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('company_admin', 'super_admin')
    )
  );

-- Branches: Public read, company users can manage their branches
CREATE POLICY "Anyone can read branches"
  ON branches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Company users can manage their branches"
  ON branches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN companies c ON c.id = branches.company_id
      WHERE p.id = auth.uid()
      AND p.role IN ('company_admin', 'branch_manager', 'super_admin')
    )
  );

-- Institutions: Public read
CREATE POLICY "Anyone can read institutions"
  ON institutions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Branch managers can update their institutions"
  ON institutions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN branches b ON b.id = institutions.branch_id
      WHERE p.id = auth.uid()
      AND (p.role IN ('company_admin', 'super_admin') OR b.manager_id = p.id)
    )
  );

-- Queue entries: Users can read their own, branch staff can read their branch queues
CREATE POLICY "Users can read own queue entries"
  ON queue_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create queue entries"
  ON queue_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Branch staff can read their branch queues"
  ON queue_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN branches b ON b.id = queue_entries.branch_id
      WHERE p.id = auth.uid()
      AND (p.role IN ('company_admin', 'super_admin') OR b.manager_id = p.id)
    )
  );

CREATE POLICY "Branch staff can update their branch queues"
  ON queue_entries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN branches b ON b.id = queue_entries.branch_id
      WHERE p.id = auth.uid()
      AND (p.role IN ('company_admin', 'super_admin') OR b.manager_id = p.id)
    )
  );

-- Appointments: Users can manage their own appointments
CREATE POLICY "Users can manage own appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Branch staff can read their branch appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN branches b ON b.id = appointments.branch_id
      WHERE p.id = auth.uid()
      AND (p.role IN ('company_admin', 'super_admin') OR b.manager_id = p.id)
    )
  );

-- Notifications: Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Analytics: Branch staff can read their branch analytics
CREATE POLICY "Branch staff can read their branch analytics"
  ON analytics_daily
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN branches b ON b.id = analytics_daily.branch_id
      WHERE p.id = auth.uid()
      AND (p.role IN ('company_admin', 'super_admin') OR b.manager_id = p.id)
    )
  );

-- Subscription plans: Public read
CREATE POLICY "Anyone can read subscription plans"
  ON subscription_plans
  FOR SELECT
  TO authenticated
  USING (true);

-- User subscriptions: Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_branches_company_id ON branches(company_id);
CREATE INDEX IF NOT EXISTS idx_institutions_category ON institutions(category);
CREATE INDEX IF NOT EXISTS idx_institutions_status ON institutions(status);
CREATE INDEX IF NOT EXISTS idx_queue_entries_user_id ON queue_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_queue_entries_branch_id ON queue_entries(branch_id);
CREATE INDEX IF NOT EXISTS idx_queue_entries_status ON queue_entries(status);
CREATE INDEX IF NOT EXISTS idx_queue_entries_joined_at ON queue_entries(joined_at);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_branch_id ON appointments(branch_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_branch_date ON analytics_daily(branch_id, date);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_queue_entries_updated_at BEFORE UPDATE ON queue_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update queue numbers
CREATE OR REPLACE FUNCTION update_queue_numbers()
RETURNS TRIGGER AS $$
BEGIN
  -- Update current queue count for the institution
  UPDATE institutions 
  SET current_queue_count = (
    SELECT COUNT(*) 
    FROM queue_entries 
    WHERE institution_id = NEW.institution_id 
    AND status = 'waiting'
  )
  WHERE id = NEW.institution_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for queue number updates
CREATE TRIGGER update_queue_numbers_trigger 
  AFTER INSERT OR UPDATE OR DELETE ON queue_entries 
  FOR EACH ROW EXECUTE FUNCTION update_queue_numbers();

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, duration_months, features) VALUES
('Basic', 'Standard queue access', 0.00, 1, '["Standard queue access", "Basic notifications"]'),
('Premium', 'Priority queue access with advanced features', 25.00, 1, '["Priority queue access", "Advanced notifications", "Appointment booking", "Queue predictions"]'),
('VIP', 'Ultimate queue experience', 50.00, 1, '["VIP priority access", "Instant notifications", "Unlimited appointments", "Personal queue assistant", "Skip-the-line privileges"]');
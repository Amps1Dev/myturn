"use client";
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Shield, 
  Bell, 
  Heart, 
  Save,
  Edit3,
  Check,
  Loader2
} from 'lucide-react';
import { ClientLayout } from '@/components/client-layout';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface ProfileState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isPregnant: boolean;
  hasDisability: boolean;
  role: string;
}

const ClientProfileEdit: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState<ProfileState>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    isPregnant: false,
    hasDisability: false,
    role: 'client'
  });

  // Load profile from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast.error("Please sign in to view your profile");
          setLoading(false);
          return;
        }

        // Fetch profile from database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          toast.error("Failed to load profile");
          setLoading(false);
          return;
        }

        if (profileData) {
          setProfile({
            id: profileData.id,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            dateOfBirth: profileData.date_of_birth || '',
            isPregnant: profileData.is_pregnant || false,
            hasDisability: profileData.has_disability || false,
            role: profileData.role || 'client'
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error("An error occurred while loading your profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile.id) {
      toast.error("No user ID found");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          date_of_birth: profile.dateOfBirth || null,
          is_pregnant: profile.isPregnant,
          has_disability: profile.hasDisability,
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Update error:', error);
        toast.error("Failed to save profile");
        setSaving(false);
        return;
      }

      setSaved(true);
      setIsEditing(false);
      toast.success("Profile saved successfully!");
      
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save error:', error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const InputField: React.FC<{ 
    label: string;
    type?: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
  }> = ({ label, type = "text", value, onChange, placeholder, disabled = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || !isEditing}
        className="w-full p-3 border border-[#beb5a9] dark:border-[#6e473b] rounded-lg
        bg-white dark:bg-[#6e473b]/30 text-[#291c0e] dark:text-[#e1d4c2]
        disabled:opacity-60 disabled:cursor-not-allowed
        focus:ring-2 focus:ring-[#a78d78] focus:border-transparent"
      />
    </div>
  );

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: () => void;
    label: string;
    description?: string;
  }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2]">
          {label}
        </p>
        {description && (
          <p className="text-xs text-[#6e473b] dark:text-[#beb5a9]">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={isEditing ? onChange : undefined}
        disabled={!isEditing}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 
          ${checked ? 'bg-[#a78d78]' : 'bg-[#beb5a9] dark:bg-[#6e473b]'}
          ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 
          ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-screen bg-[#e1d4c2] dark:bg-[#291c0e]">
          <Loader2 className="h-8 w-8 animate-spin text-[#a78d78]" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e]">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#291c0e] dark:text-[#e1d4c2]">
                My Profile
              </h1>
              <p className="text-[#6e473b] dark:text-[#beb5a9]">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex gap-3">
              {saved && (
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded-xl">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Saved!</span>
                </div>
              )}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-[#6e473b] text-white px-6 py-3 rounded-xl hover:bg-[#a78d78]"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#6e473b] text-white px-6 py-3 rounded-xl hover:bg-[#a78d78] disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="bg-white dark:bg-[#291c0e] rounded-lg shadow-lg p-6 border border-[#beb5a9] dark:border-[#6e473b] mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-[#a78d78] rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2]">
                  {profile.firstName} {profile.lastName}
                </h4>
                <p className="text-[#6e473b] dark:text-[#beb5a9]">
                  {profile.email}
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-[#a78d78] text-white text-xs rounded-full">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-[#291c0e] rounded-lg shadow-lg p-6 border border-[#beb5a9] dark:border-[#6e473b]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#a78d78] p-2 rounded-xl">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2]">
                  Personal Information
                </h3>
              </div>
              <div className="space-y-4">
                <InputField
                  label="First Name"
                  value={profile.firstName}
                  onChange={(value) => setProfile({...profile, firstName: value})}
                />
                <InputField
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(value) => setProfile({...profile, lastName: value})}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(value) => setProfile({...profile, dateOfBirth: value})}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-[#291c0e] rounded-lg shadow-lg p-6 border border-[#beb5a9] dark:border-[#6e473b]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#a78d78] p-2 rounded-xl">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2]">
                  Contact Information
                </h3>
              </div>
              <div className="space-y-4">
                <InputField
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(value) => setProfile({...profile, email: value})}
                  disabled={true}
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  value={profile.phone}
                  onChange={(value) => setProfile({...profile, phone: value})}
                  placeholder="+260 XXX XXX XXX"
                />
              </div>
            </div>
          </div>

          {/* Priority Status */}
          <div className="mt-6 bg-white dark:bg-[#291c0e] rounded-lg shadow-lg p-6 border border-[#beb5a9] dark:border-[#6e473b]">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#a78d78] p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2]">
                Priority Status
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-[#e1d4c2] dark:bg-[#6e473b]/30 p-4 rounded-xl">
                <ToggleSwitch
                  checked={profile.isPregnant}
                  onChange={() => setProfile({...profile, isPregnant: !profile.isPregnant})}
                  label="Pregnancy Status"
                  description="For priority queue placement"
                />
              </div>
              <div className="bg-[#e1d4c2] dark:bg-[#6e473b]/30 p-4 rounded-xl">
                <ToggleSwitch
                  checked={profile.hasDisability}
                  onChange={() => setProfile({...profile, hasDisability: !profile.hasDisability})}
                  label="Disability Status"
                  description="For priority assistance"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientProfileEdit;
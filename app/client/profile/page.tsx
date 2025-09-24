"use client";
import React, { useState } from 'react';
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
  Baby,
  Save,
  Edit3,
  Eye,
  EyeOff,
  Check,
  X,
  LucideIcon
} from 'lucide-react';
import { ClientLayout } from "@/components/client-layout";

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  isPregnant: boolean;
  age: number;
  hasSpecialNeeds: boolean;
  medicalNotes: string;
  preferredLanguage: string;
}

interface NotificationSettings {
  queueUpdates: boolean;
  appointments: boolean;
  promotions: boolean;
  emergencies: boolean;
}

interface PrivacySettings {
  shareLocation: boolean;
  showProfile: boolean;
  allowNotifications: boolean;
}

interface ProfileSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}

const ClientProfileEdit: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street, Apartment 4B',
    city: 'New York',
    zipCode: '10001',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    isPregnant: false,
    age: 34,
    hasSpecialNeeds: false,
    medicalNotes: '',
    preferredLanguage: 'English'
  });

  const [notifications, setNotifications] = useState({
    queueUpdates: true,
    appointments: true,
    promotions: false,
    emergencies: true
  });

  const [privacy, setPrivacy] = useState({
    shareLocation: true,
    showProfile: true,
    allowNotifications: true
  });

  const handleSave = (): void => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-[#6e473b] rounded-2xl shadow-lg p-6 border border-[#beb5a9] dark:border-[#a78d78]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#a78d78] dark:bg-[#291c0e] p-2 rounded-xl">
          <Icon className="w-5 h-5 text-white dark:text-[#e1d4c2]" />
        </div>
        <h3 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2] font-['Roboto']">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange, placeholder, disabled = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] font-['Roboto']">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled || !isEditing}
        className="w-full p-3 rounded-xl border border-[#beb5a9] dark:border-[#a78d78] bg-[#e1d4c2] dark:bg-[#291c0e] text-[#291c0e] dark:text-[#e1d4c2] placeholder-[#6e473b] dark:placeholder-[#beb5a9] focus:ring-2 focus:ring-[#a78d78] focus:border-transparent transition-all duration-200 font-['Roboto'] disabled:opacity-60"
      />
    </div>
  );

  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] font-['Roboto']">
          {label}
        </p>
        {description && (
          <p className="text-xs text-[#6e473b] dark:text-[#beb5a9] font-['Roboto']">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-[#a78d78] dark:bg-[#beb5a9]' : 'bg-[#beb5a9] dark:bg-[#6e473b]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-[#291c0e] transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e] transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#291c0e] dark:text-[#e1d4c2] font-['Roboto']">
                My Profile
              </h1>
              <p className="text-[#6e473b] dark:text-[#beb5a9] font-['Roboto']">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex gap-3">
              {saved && (
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-xl">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium font-['Roboto']">Saved!</span>
                </div>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-[#6e473b] dark:bg-[#a78d78] text-white dark:text-[#291c0e] px-6 py-3 rounded-xl hover:bg-[#a78d78] dark:hover:bg-[#beb5a9] transition-all duration-200 font-['Roboto']"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Picture Section */}
          <ProfileSection title="Profile Picture" icon={Camera}>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-[#a78d78] dark:bg-[#291c0e] rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white dark:text-[#e1d4c2]" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-[#6e473b] dark:bg-[#a78d78] text-white dark:text-[#291c0e] p-2 rounded-full hover:bg-[#a78d78] dark:hover:bg-[#beb5a9] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2] font-['Roboto']">
                  {profile.firstName} {profile.lastName}
                </h4>
                <p className="text-[#6e473b] dark:text-[#beb5a9] font-['Roboto']">
                  Member since January 2024
                </p>
                {isEditing && (
                  <button className="text-sm text-[#a78d78] dark:text-[#beb5a9] hover:underline mt-1 font-['Roboto']">
                    Upload new photo
                  </button>
                )}
              </div>
            </div>
          </ProfileSection>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Personal Information */}
            <ProfileSection title="Personal Information" icon={User}>
              <div className="space-y-4">
                <InputField
                  label="First Name"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                />
                <InputField
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                />
                <InputField
                  label="Age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                />
              </div>
            </ProfileSection>

            {/* Contact Information */}
            <ProfileSection title="Contact Information" icon={Mail}>
              <div className="space-y-4">
                <InputField
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
                <InputField
                  label="Emergency Contact"
                  value={profile.emergencyContact}
                  onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
                />
                <InputField
                  label="Emergency Phone"
                  type="tel"
                  value={profile.emergencyPhone}
                  onChange={(e) => setProfile({...profile, emergencyPhone: e.target.value})}
                />
              </div>
            </ProfileSection>
          </div>

          {/* Address Information */}
          <div className="mt-6">
            <ProfileSection title="Address Information" icon={MapPin}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Street Address"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                  />
                </div>
                <InputField
                  label="City"
                  value={profile.city}
                  onChange={(e) => setProfile({...profile, city: e.target.value})}
                />
                <InputField
                  label="ZIP Code"
                  value={profile.zipCode}
                  onChange={(e) => setProfile({...profile, zipCode: e.target.value})}
                />
              </div>
            </ProfileSection>
          </div>

          {/* Medical Information */}
          <div className="mt-6">
            <ProfileSection title="Medical Information" icon={Heart}>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#beb5a9] dark:bg-[#291c0e] p-4 rounded-xl border border-[#a78d78] dark:border-[#6e473b]">
                    <ToggleSwitch
                      checked={profile.isPregnant}
                      onChange={() => setProfile({...profile, isPregnant: !profile.isPregnant})}
                      label="Pregnancy Status"
                      description="For priority queue placement"
                    />
                  </div>
                  <div className="bg-[#beb5a9] dark:bg-[#291c0e] p-4 rounded-xl border border-[#a78d78] dark:border-[#6e473b]">
                    <ToggleSwitch
                      checked={profile.hasSpecialNeeds}
                      onChange={() => setProfile({...profile, hasSpecialNeeds: !profile.hasSpecialNeeds})}
                      label="Special Needs"
                      description="For priority assistance"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] font-['Roboto']">
                    Medical Notes (Optional)
                  </label>
                  <textarea
                    value={profile.medicalNotes}
                    onChange={(e) => setProfile({...profile, medicalNotes: e.target.value})}
                    rows={3}
                    disabled={!isEditing}
                    placeholder="Any medical conditions or special requirements..."
                    className="w-full p-3 rounded-xl border border-[#beb5a9] dark:border-[#a78d78] bg-[#e1d4c2] dark:bg-[#291c0e] text-[#291c0e] dark:text-[#e1d4c2] placeholder-[#6e473b] dark:placeholder-[#beb5a9] focus:ring-2 focus:ring-[#a78d78] focus:border-transparent transition-all duration-200 resize-none font-['Roboto'] disabled:opacity-60"
                  />
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Notification Preferences */}
          <div className="mt-6">
            <ProfileSection title="Notification Preferences" icon={Bell}>
              <div className="space-y-1">
                <ToggleSwitch
                  checked={notifications.queueUpdates}
                  onChange={() => setNotifications({...notifications, queueUpdates: !notifications.queueUpdates})}
                  label="Queue Updates"
                  description="Get notified about queue status changes"
                />
                <ToggleSwitch
                  checked={notifications.appointments}
                  onChange={() => setNotifications({...notifications, appointments: !notifications.appointments})}
                  label="Appointment Reminders"
                  description="Receive reminders for upcoming appointments"
                />
                <ToggleSwitch
                  checked={notifications.promotions}
                  onChange={() => setNotifications({...notifications, promotions: !notifications.promotions})}
                  label="Promotions & Offers"
                  description="Get notified about special offers and discounts"
                />
                <ToggleSwitch
                  checked={notifications.emergencies}
                  onChange={() => setNotifications({...notifications, emergencies: !notifications.emergencies})}
                  label="Emergency Alerts"
                  description="Important service disruptions and emergencies"
                />
              </div>
            </ProfileSection>
          </div>

          {/* Privacy Settings */}
          <div className="mt-6">
            <ProfileSection title="Privacy Settings" icon={Shield}>
              <div className="space-y-1">
                <ToggleSwitch
                  checked={privacy.shareLocation}
                  onChange={() => setPrivacy({...privacy, shareLocation: !privacy.shareLocation})}
                  label="Share Location"
                  description="Allow location sharing for dynamic queue management"
                />
                <ToggleSwitch
                  checked={privacy.showProfile}
                  onChange={() => setPrivacy({...privacy, showProfile: !privacy.showProfile})}
                  label="Public Profile"
                  description="Make your profile visible to service providers"
                />
                <ToggleSwitch
                  checked={privacy.allowNotifications}
                  onChange={() => setPrivacy({...privacy, allowNotifications: !privacy.allowNotifications})}
                  label="Push Notifications"
                  description="Allow the app to send push notifications"
                />
              </div>
            </ProfileSection>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSave}
                className="bg-[#6e473b] dark:bg-[#a78d78] text-white dark:text-[#291c0e] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#a78d78] dark:hover:bg-[#beb5a9] focus:ring-2 focus:ring-[#a78d78] focus:ring-offset-2 focus:ring-offset-[#e1d4c2] dark:focus:ring-offset-[#291c0e] transition-all duration-200 flex items-center gap-2 font-['Roboto']"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientProfileEdit;
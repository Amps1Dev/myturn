"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Settings,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Monitor,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Key,
  Trash2,
  Save,
  Edit,
  Download,
  Upload,
  Zap,
  Volume2,
  Smartphone,
  Wifi,
  Database,
  FileText,
  Lock
} from "lucide-react";

// Mock CompanyLayout component since it's not available
const CompanyLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto p-6">
    {children}
  </div>
);

const CompanySettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Company profile data
  const [companyData, setCompanyData] = useState({
    name: "TechCorp Solutions",
    email: "admin@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street, Downtown City",
    website: "www.techcorp.com",
    industry: "Technology",
    employees: "100-500",
    timezone: "UTC-5 (EST)"
  });

  // Queue settings
  const [queueSettings, setQueueSettings] = useState({
    maxQueueSize: 50,
    defaultWaitTime: 15,
    autoAssignNumbers: true,
    allowSkipping: false,
    sendSMSUpdates: true,
    sendEmailUpdates: true,
    operatingHours: {
      monday: { open: "09:00", close: "17:00", enabled: true },
      tuesday: { open: "09:00", close: "17:00", enabled: true },
      wednesday: { open: "09:00", close: "17:00", enabled: true },
      thursday: { open: "09:00", close: "17:00", enabled: true },
      friday: { open: "09:00", close: "17:00", enabled: true },
      saturday: { open: "10:00", close: "14:00", enabled: false },
      sunday: { open: "10:00", close: "14:00", enabled: false }
    }
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    longWaitAlert: { enabled: true, threshold: 20 },
    queueFullAlert: { enabled: true, threshold: 45 },
    systemDownAlert: { enabled: true }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'queues', label: 'Queue Settings', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'data', label: 'Data & Export', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            {/* Company Profile */}
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Profile
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage your company information and contact details
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-[#6e473b] text-[#6e473b] hover:bg-[#6e473b] hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg bg-white border-[#beb5a9] text-gray-900"
                      />
                    ) : (
                      <p className="px-3 py-2 text-gray-700">
                        {companyData.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg bg-white border-[#beb5a9] text-gray-900"
                      />
                    ) : (
                      <p className="px-3 py-2 text-gray-700">
                        {companyData.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg bg-white border-[#beb5a9] text-gray-900"
                      />
                    ) : (
                      <p className="px-3 py-2 text-gray-700">
                        {companyData.phone}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Industry
                    </label>
                    {isEditing ? (
                      <select
                        value={companyData.industry}
                        onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg bg-white border-[#beb5a9] text-gray-900"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Government">Government</option>
                        <option value="Education">Education</option>
                      </select>
                    ) : (
                      <p className="px-3 py-2 text-gray-700">
                        {companyData.industry}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={companyData.address}
                      onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg bg-white border-[#beb5a9] text-gray-900"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-700">
                      {companyData.address}
                    </p>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="bg-[#6e473b] hover:bg-[#291c0e] text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Plan */}
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription className="text-gray-600">
                  Your subscription and usage details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[#a78d78]">Professional Plan</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Up to 10 queues, unlimited customers
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Queues</span>
                        <span>4 / 10</span>
                      </div>
                      <Progress value={40} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Monthly Queue Sessions</span>
                        <span>2,847 / 5,000</span>
                      </div>
                      <Progress value={57} className="h-2" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#a78d78]">$49</p>
                    <p className="text-sm text-gray-600">per month</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'queues':
        return (
          <div className="space-y-6">
            {/* Queue Configuration */}
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Queue Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure default settings for your queues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Maximum Queue Size
                    </label>
                    <input
                      type="number"
                      value={queueSettings.maxQueueSize}
                      onChange={(e) => setQueueSettings({...queueSettings, maxQueueSize: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border rounded-lg bg-white border-[#beb5a9] text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Default Wait Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={queueSettings.defaultWaitTime}
                      onChange={(e) => setQueueSettings({...queueSettings, defaultWaitTime: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border rounded-lg bg-white border-[#beb5a9] text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Queue Features</h4>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'autoAssignNumbers', label: 'Auto-assign queue numbers', description: 'Automatically assign numbers to customers joining queues' },
                      { key: 'allowSkipping', label: 'Allow queue skipping', description: 'Let customers skip their turn for a fee or special circumstances' },
                      { key: 'sendSMSUpdates', label: 'Send SMS updates', description: 'Send SMS notifications to customers about their queue status' },
                      { key: 'sendEmailUpdates', label: 'Send email updates', description: 'Send email notifications to customers about their queue status' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={setting.key}
                          checked={queueSettings[setting.key as keyof typeof queueSettings] as boolean}
                          onChange={(e) => setQueueSettings({...queueSettings, [setting.key]: e.target.checked})}
                          className="mt-1"
                        />
                        <div>
                          <label htmlFor={setting.key} className="font-medium cursor-pointer text-gray-900">
                            {setting.label}
                          </label>
                          <p className="text-sm text-gray-600">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Set your business hours for queue operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(queueSettings.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-20">
                        <input
                          type="checkbox"
                          checked={hours.enabled}
                          onChange={(e) => setQueueSettings({
                            ...queueSettings,
                            operatingHours: {
                              ...queueSettings.operatingHours,
                              [day]: { ...hours, enabled: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="capitalize font-medium">{day}</span>
                      </div>
                      
                      {hours.enabled && (
                        <>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => setQueueSettings({
                              ...queueSettings,
                              operatingHours: {
                                ...queueSettings.operatingHours,
                                [day]: { ...hours, open: e.target.value }
                              }
                            })}
                            className="px-3 py-1 border rounded bg-white border-[#beb5a9] text-gray-900"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => setQueueSettings({
                              ...queueSettings,
                              operatingHours: {
                                ...queueSettings.operatingHours,
                                [day]: { ...hours, close: e.target.value }
                              }
                            })}
                            className="px-3 py-1 border rounded bg-white border-[#beb5a9] text-gray-900"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">General Notifications</h4>
                  {[
                    { key: 'emailAlerts', label: 'Email Alerts', icon: Mail },
                    { key: 'smsAlerts', label: 'SMS Alerts', icon: MessageSquare },
                    { key: 'pushNotifications', label: 'Push Notifications', icon: Smartphone }
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <notification.icon className="h-5 w-5 text-[#a78d78]" />
                        <span className="font-medium">{notification.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[notification.key as keyof typeof notifications] as boolean}
                        onChange={(e) => setNotifications({...notifications, [notification.key]: e.target.checked})}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-[#beb5a9]">
                  <h4 className="font-medium">Alert Thresholds</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Long Wait Time Alert</label>
                        <input
                          type="checkbox"
                          checked={notifications.longWaitAlert.enabled}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            longWaitAlert: { ...notifications.longWaitAlert, enabled: e.target.checked }
                          })}
                        />
                      </div>
                      {notifications.longWaitAlert.enabled && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Alert when wait time exceeds</span>
                          <input
                            type="number"
                            value={notifications.longWaitAlert.threshold}
                            onChange={(e) => setNotifications({
                              ...notifications,
                              longWaitAlert: { ...notifications.longWaitAlert, threshold: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 px-2 py-1 border rounded bg-white border-[#beb5a9] text-gray-900"
                          />
                          <span className="text-sm">minutes</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Queue Full Alert</label>
                        <input
                          type="checkbox"
                          checked={notifications.queueFullAlert.enabled}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            queueFullAlert: { ...notifications.queueFullAlert, enabled: e.target.checked }
                          })}
                        />
                      </div>
                      {notifications.queueFullAlert.enabled && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Alert when queue reaches</span>
                          <input
                            type="number"
                            value={notifications.queueFullAlert.threshold}
                            onChange={(e) => setNotifications({
                              ...notifications,
                              queueFullAlert: { ...notifications.queueFullAlert, threshold: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 px-2 py-1 border rounded bg-white border-[#beb5a9] text-gray-900"
                          />
                          <span className="text-sm">people</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Customize the look and feel of your queue interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Color Scheme Preview</h4>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="space-y-2">
                      <div className="w-full h-16 bg-[#291c0e] rounded"></div>
                      <p className="text-xs text-center">Primary Dark</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-16 bg-[#6e473b] rounded"></div>
                      <p className="text-xs text-center">Secondary Dark</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-16 bg-[#a78d78] rounded"></div>
                      <p className="text-xs text-center">Primary Medium</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-16 bg-[#beb5a9] rounded"></div>
                      <p className="text-xs text-center">Secondary Light</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-16 bg-[#e1d4c2] rounded border"></div>
                      <p className="text-xs text-center">Background Light</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Display Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Show queue numbers</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Show wait times</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Show progress bars</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Animate transitions</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your account security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Password & Authentication</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#a78d78]" />
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#beb5a9]">
                  <h4 className="font-medium">API Access</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">API Key</p>
                        <p className="text-sm text-gray-600">
                          ••••••••••••••••••••••••••••••••
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate New Key
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#beb5a9]">
                  <h4 className="font-medium">Session Management</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-gray-600">
                          3 active sessions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage Sessions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Current Plan</h4>
                    <div className="p-4 border rounded-lg border-[#beb5a9]">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-semibold text-[#a78d78]">Professional</h5>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        $49/month • Billed monthly
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Up to 10 queues</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span>Unlimited customers</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span>Analytics & reports</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span>24/7 support</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Change Plan
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Method</h4>
                    <div className="p-4 border rounded-lg border-[#beb5a9]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <span className="font-medium">•••• •••• •••• 4242</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Expires 12/2025
                      </p>
                      <Button variant="outline" size="sm">
                        Update Payment Method
                      </Button>
                    </div>

                    <h4 className="font-medium">Billing History</h4>
                    <div className="space-y-2">
                      {[
                        { date: '2024-09-01', amount: '$49.00', status: 'Paid' },
                        { date: '2024-08-01', amount: '$49.00', status: 'Paid' },
                        { date: '2024-07-01', amount: '$49.00', status: 'Paid' }
                      ].map((invoice, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{invoice.date}</p>
                            <p className="text-sm text-gray-600">
                              Professional Plan
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{invoice.amount}</p>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download All Invoices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Integrations
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Connect MyTurn with your existing tools and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      name: 'Slack',
                      description: 'Get queue notifications in Slack',
                      icon: '',
                      connected: true
                    },
                    { 
                      name: 'Microsoft Teams',
                      description: 'Integration with Microsoft Teams',
                      icon: '',
                      connected: false
                    },
                    { 
                      name: 'Twilio SMS',
                      description: 'Send SMS notifications via Twilio',
                      icon: '',
                      connected: true
                    },
                    { 
                      name: 'Zapier',
                      description: 'Automate workflows with Zapier',
                      icon: '',
                      connected: false
                    },
                    { 
                      name: 'Google Calendar',
                      description: 'Sync appointments with Google Calendar',
                      icon: '',
                      connected: true
                    },
                    { 
                      name: 'Webhooks',
                      description: 'Custom webhook integrations',
                      icon: '',
                      connected: true
                    }
                  ].map((integration, index) => (
                    <div key={index} className="p-4 border rounded-lg border-[#beb5a9]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-gray-600">
                              {integration.description}
                            </p>
                          </div>
                        </div>
                        {integration.connected ? (
                          <Badge className="bg-green-100 text-green-700">Connected</Badge>
                        ) : (
                          <Badge variant="outline">Not Connected</Badge>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                      >
                        {integration.connected ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-[#beb5a9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Export your data and manage data retention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Data Export</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg border-[#beb5a9]">
                      <h5 className="font-medium mb-2">Queue Data</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        Export all queue sessions, wait times, and statistics
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-[#beb5a9]">
                      <h5 className="font-medium mb-2">Customer Data</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        Export customer information and interaction history
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-[#beb5a9]">
                      <h5 className="font-medium mb-2">Analytics Reports</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        Export detailed analytics and performance reports
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-[#beb5a9]">
                      <h5 className="font-medium mb-2">Complete Backup</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        Export all your data in a comprehensive backup
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Database className="h-4 w-4 mr-2" />
                        Create Backup
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#beb5a9]">
                  <h4 className="font-medium">Data Retention</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Queue Session Data</p>
                        <p className="text-sm text-gray-600">
                          How long to keep queue session records
                        </p>
                      </div>
                      <select className="px-3 py-1 border rounded bg-white border-[#beb5a9] text-gray-900">
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                        <option value="forever">Forever</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics Data</p>
                        <p className="text-sm text-gray-600">
                          How long to keep analytics and reports
                        </p>
                      </div>
                      <select className="px-3 py-1 border rounded bg-white border-[#beb5a9] text-gray-900">
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                        <option value="1095">3 years</option>
                        <option value="forever">Forever</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-red-600">
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-300 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-red-600">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
                
                {showDeleteConfirm && (
                  <div className="p-4 border border-red-300 rounded-lg bg-red-100">
                    <h5 className="font-medium text-red-800 mb-2">Confirm Account Deletion</h5>
                    <p className="text-sm text-red-700 mb-3">
                      This action cannot be undone. All your queues, data, and settings will be permanently deleted.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, Delete My Account
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Select a settings category</div>;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#e1d4c2] text-gray-900">
      <CompanyLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-[#6e473b]" />
            <div>
              <h1 className="text-3xl font-bold">Company Settings</h1>
              <p className="text-sm text-gray-600">
                Manage your company preferences and configuration
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white border-[#beb5a9] border rounded-lg p-4 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#6e473b] text-white'
                      : 'hover:bg-[#e1d4c2] text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            className="border-[#6e473b] text-[#6e473b] hover:bg-[#6e473b] hover:text-white"
          >
            Reset to Defaults
          </Button>
          <Button
            className="bg-[#6e473b] hover:bg-[#291c0e] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </CompanyLayout>
    </div>
  );
};

export default CompanySettings;
import { useState, useEffect } from 'react';
import { 
  X, User, Bell, Shield, Palette, Database,
  Mail, Phone, MapPin, Upload, Save, RefreshCw,
  Lock, Download, Trash2, Settings as SettingsIcon
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'profile' | 'notifications' | 'security' | 'appearance' | 'data';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile' as Tab, name: 'Profile', icon: User, color: 'emerald' },
    { id: 'notifications' as Tab, name: 'Notifications', icon: Bell, color: 'blue' },
    { id: 'security' as Tab, name: 'Security', icon: Shield, color: 'red' },
    { id: 'appearance' as Tab, name: 'Appearance', icon: Palette, color: 'purple' },
    { id: 'data' as Tab, name: 'Data', icon: Database, color: 'orange' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className={`fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white animate-[spin_20s_linear_infinite]" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-white/80 text-sm">Manage your preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-90"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const gradientClasses: Record<string, string> = {
                  emerald: 'from-emerald-500 via-teal-500 to-emerald-600',
                  blue: 'from-blue-500 via-cyan-500 to-blue-600',
                  red: 'from-red-500 via-rose-500 to-red-600',
                  purple: 'from-purple-500 via-violet-500 to-purple-600',
                  orange: 'from-orange-500 via-amber-500 to-orange-600',
                };

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${gradientClasses[tab.color]} text-white shadow-md`
                        : 'text-gray-700 hover:bg-gray-200'
                    } hover:translate-x-1`}
                  >
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="font-medium relative z-10">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg hover:scale-105 hover:rotate-6 transition-all">
                    A
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-all flex items-center gap-2 hover:scale-105">
                      <Upload className="w-4 h-4" />
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Max 2MB</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Admin User"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@recyclehub.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 234 567 8900"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Location
                    </label>
                    <input
                      type="text"
                      defaultValue="Cairo, Egypt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium shadow-md flex items-center gap-2 text-sm hover:scale-105 transition-all">
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2 text-sm hover:scale-105 transition-all">
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>
                
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Text message notifications' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`w-12 h-7 rounded-full transition-all active:scale-95 ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium shadow-md flex items-center gap-2 text-sm hover:scale-105 transition-all">
                  <Shield className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-bold text-gray-900">Appearance</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'Auto'].map((theme) => (
                    <div
                      key={theme}
                      className="p-4 border-2 border-emerald-500 rounded-lg cursor-pointer hover:bg-emerald-50 transition-all text-center hover:scale-105"
                    >
                      <Palette className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 text-sm">{theme}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === 'data' && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-bold text-gray-900">Data & Privacy</h3>
                
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900 text-sm">Download Data</h4>
                      <p className="text-xs text-gray-500">Get your data copy</p>
                    </div>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <h4 className="font-medium text-red-900 text-sm">Delete Account</h4>
                      <p className="text-xs text-red-600">Permanently delete account</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
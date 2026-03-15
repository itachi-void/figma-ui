import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Bell, Shield, Palette, Database,
  Mail, Phone, MapPin, Upload, Save, RefreshCw,
  Lock, Download, Trash2, Settings as SettingsIcon
} from 'lucide-react';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: 'emerald' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'blue' },
    { id: 'security', name: 'Security', icon: Shield, color: 'red' },
    { id: 'appearance', name: 'Appearance', icon: Palette, color: 'purple' },
    { id: 'data', name: 'Data', icon: Database, color: 'orange' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <SettingsIcon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Settings 2</h2>
                  <p className="text-white/80 text-sm">Manage your preferences</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar */}
              <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                <div className="space-y-2">
                  {tabs.map((tab, index) => {
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
                      <motion.button
                        key={tab.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm relative overflow-hidden ${
                          isActive
                            ? `bg-gradient-to-r ${gradientClasses[tab.color]} text-white shadow-md`
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          />
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="font-medium relative z-10">{tab.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                    
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        A
                      </motion.div>
                      <div>
                        <motion.button
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Upload className="w-4 h-4" />
                          Change Photo
                        </motion.button>
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
                      <motion.button
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium shadow-md flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </motion.button>
                      <motion.button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
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
                        <motion.button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`w-12 h-7 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{
                              x: notifications[item.key as keyof typeof notifications] ? 24 : 4,
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
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

                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium shadow-md flex items-center gap-2 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Shield className="w-4 h-4" />
                      Update Password
                    </motion.button>
                  </motion.div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-gray-900">Appearance</h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {['Light', 'Dark', 'Auto'].map((theme) => (
                        <motion.div
                          key={theme}
                          className="p-4 border-2 border-emerald-500 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors text-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Palette className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900 text-sm">{theme}</h4>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Data Tab */}
                {activeTab === 'data' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-gray-900">Data & Privacy</h3>
                    
                    <motion.button
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-600" />
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900 text-sm">Download Data</h4>
                          <p className="text-xs text-gray-500">Get your data copy</p>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      className="w-full flex items-center justify-between p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div className="text-left">
                          <h4 className="font-medium text-red-900 text-sm">Delete Account</h4>
                          <p className="text-xs text-red-600">Permanently delete account</p>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

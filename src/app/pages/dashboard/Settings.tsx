"use client";

import { motion } from "motion/react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Database,
  Zap,
  Mail,
  Phone,
  MapPin,
  Award,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const tabs = [
    {
      id: "profile",
      name: "Profile",
      icon: User,
      color: "emerald",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      color: "blue",
    },
    {
      id: "security",
      name: "Security",
      icon: Shield,
      color: "red",
    },
    {
      id: "gamification",
      name: "Points & Rewards",
      icon: Award,
      color: "yellow",
    },
    {
      id: "system",
      name: "System Config",
      icon: Globe,
      color: "emerald",
    },
    {
      id: "appearance",
      name: "Appearance",
      icon: Palette,
      color: "purple",
    },
    {
      id: "data",
      name: "Data & Privacy",
      icon: Database,
      color: "orange",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <SettingsIcon className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tabs Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-4 shadow-lg border border-gray-200"
        >
          <div className="space-y-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const gradientClasses: Record<string, string> = {
                emerald:
                  "from-emerald-500 via-teal-500 to-emerald-600",
                blue: "from-blue-500 via-cyan-500 to-blue-600",
                red: "from-red-500 via-rose-500 to-red-600",
                yellow:
                  "from-yellow-400 via-orange-500 to-yellow-600",
                purple:
                  "from-purple-500 via-violet-500 to-purple-600",
                orange:
                  "from-orange-500 via-amber-500 to-orange-600",
              };

              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
                    isActive
                      ? `bg-gradient-to-r ${gradientClasses[tab.color]} text-white shadow-lg`
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">
                    {tab.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-9 bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h2>

              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  A
                </motion.div>
                <div>
                  <motion.button
                    onClick={() => alert("Photo upload — connect to storage backend to enable.")}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Change Photo
                  </motion.button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin User"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@recyclehub.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 234 567 8900"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue="Cairo, Egypt"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={() => alert("Profile saved successfully.")}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (window.confirm("Reset all profile fields to defaults?")) {
                      window.location.reload();
                    }
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  {
                    key: "email",
                    label: "Email Notifications",
                    desc: "Receive notifications via email",
                  },
                  {
                    key: "push",
                    label: "Push Notifications",
                    desc: "Receive push notifications in browser",
                  },
                  {
                    key: "sms",
                    label: "SMS Notifications",
                    desc: "Receive SMS text messages",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.desc}
                      </p>
                    </div>
                    <motion.button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]:
                            !notifications[
                              item.key as keyof typeof notifications
                            ],
                        })
                      }
                      className={`w-14 h-8 rounded-full transition-colors ${
                        notifications[
                          item.key as keyof typeof notifications
                        ]
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-6 h-6 bg-white rounded-full shadow-md"
                        animate={{
                          x: notifications[
                            item.key as keyof typeof notifications
                          ]
                            ? 28
                            : 4,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Security Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <motion.button
                  onClick={() => alert("Password update requires backend integration.")}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-5 h-5" />
                  Update Password
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Gamification Tab */}
          {activeTab === "gamification" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Points & Rewards Configuration
              </h2>
              <p className="text-gray-600">
                Configure how citizens earn points from
                recycling activities.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Conversion Rates
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plastic Bottles
                        </label>
                        <p className="text-xs text-gray-500">
                          Points awarded per 1 plastic bottle
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue="10"
                          className="w-24 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-right"
                        />
                        <span className="text-sm font-bold text-gray-500">
                          pts/bottle
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Glass Bottles
                        </label>
                        <p className="text-xs text-gray-500">
                          Points awarded per 1 glass bottle
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue="15"
                          className="w-24 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-right"
                        />
                        <span className="text-sm font-bold text-gray-500">
                          pts/bottle
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    Tier Thresholds
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Silver Tier
                      </label>
                      <input
                        type="number"
                        defaultValue="1000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gold Tier
                      </label>
                      <input
                        type="number"
                        defaultValue="5000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => alert("Reward configuration saved.")}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  Save Configurations
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* System Config Tab */}
          {activeTab === "system" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                System Configurations
              </h2>
              <p className="text-gray-600">
                Manage supported operational zones and system
                parameters.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    Supported Zones
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                        <span className="font-medium text-gray-700">
                          North District
                        </span>
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-bold">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                        <span className="font-medium text-gray-700">
                          South District
                        </span>
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-bold">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                        <span className="font-medium text-gray-700">
                          East District
                        </span>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-bold">
                          Inactive
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const name = window.prompt("Enter new zone name:");
                        if (name) alert(`Zone "${name}" added.`);
                      }}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      + Add New Zone
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={() => alert("System configuration saved.")}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Appearance Settings
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {["Light", "Dark", "Auto"].map((theme) => (
                  <motion.div
                    key={theme}
                    className="p-6 border-2 border-emerald-500 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Palette className="w-8 h-8 text-emerald-600 mb-2" />
                    <h3 className="font-medium text-gray-900">
                      {theme}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === "data" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Data & Privacy
              </h2>

              <div className="space-y-4">
                <motion.button
                  onClick={() => {
                    const data = JSON.stringify({ user: "Admin User", email: "admin@recyclehub.com", exportedAt: new Date().toISOString() }, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "my-data.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">
                        Download Your Data
                      </h3>
                      <p className="text-sm text-gray-500">
                        Get a copy of your data
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (window.confirm("Permanently delete account? This cannot be undone.")) {
                      alert("Account deletion requires backend confirmation.");
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <h3 className="font-medium text-red-900">
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-600">
                        Permanently delete your account
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
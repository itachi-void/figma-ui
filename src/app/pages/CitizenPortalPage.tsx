import { useState } from 'react';
import { Package, Award, TrendingUp, QrCode, Gift, LogOut, User, Trophy, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';

export default function CitizenPortalPage() {
  const [scannerOpen, setScannerOpen] = useState(false);

  const stats = [
    { label: 'Bottles Recycled', value: '156', icon: Package, color: 'from-emerald-500 to-teal-500' },
    { label: 'Points Earned', value: '4,680', icon: Award, color: 'from-blue-500 to-cyan-500' },
    { label: 'This Month', value: '24', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  ];

  const activities = [
    { date: '2024-03-25', bottles: 3, points: 90, location: 'Cairo Central Hub' },
    { date: '2024-03-24', bottles: 5, points: 150, location: 'Giza Collection Center' },
    { date: '2024-03-23', bottles: 2, points: 60, location: 'Cairo Central Hub' },
    { date: '2024-03-22', bottles: 4, points: 120, location: 'Nasr City Point' },
    { date: '2024-03-21', bottles: 6, points: 180, location: 'Cairo Central Hub' },
    { date: '2024-03-20', bottles: 3, points: 90, location: 'Maadi Recycling Hub' },
    { date: '2024-03-19', bottles: 4, points: 120, location: 'Heliopolis Center' },
    { date: '2024-03-18', bottles: 2, points: 60, location: 'Cairo Central Hub' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold">RecycleHub</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <span className="hidden md:block font-medium">John Doe</span>
            </div>
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600">Track your recycling journey and earn rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 border hover:shadow-lg transition-all">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setScannerOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold mb-1">Scan Bottle</p>
              <p className="text-sm opacity-90">Scan QR code to recycle</p>
            </div>
          </button>

          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold mb-1">View Rewards</p>
              <p className="text-sm opacity-90">Redeem your points</p>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Bottles</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Points</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600">{activity.date}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{activity.bottles}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600">+{activity.points}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{activity.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold">My Profile</p>
              <p className="text-sm text-gray-600">Edit your information</p>
            </div>
          </button>

          <button className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Leaderboard</p>
              <p className="text-sm text-gray-600">See top recyclers</p>
            </div>
          </button>

          <button className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Help & Support</p>
              <p className="text-sm text-gray-600">Get assistance</p>
            </div>
          </button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setScannerOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-8">
            <h3 className="text-2xl font-bold mb-4">Scan QR Code</h3>
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <QrCode className="w-24 h-24 text-gray-400" />
              <p className="absolute text-gray-500">QR Scanner Placeholder</p>
            </div>
            <p className="text-center text-gray-600 mb-6">
              Position the QR code within the frame to scan
            </p>
            <button
              onClick={() => setScannerOpen(false)}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
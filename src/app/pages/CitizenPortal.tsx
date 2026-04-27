import { Link } from "react-router";
import { Recycle, QrCode, Award, History, Home } from "lucide-react";

export default function CitizenPortal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <Home className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Recycle className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold">Citizen Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">John Doe</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Dashboard
          </h1>
          <p className="text-gray-600">
            Track your recycling activity and rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bottles Recycled</p>
                <p className="text-2xl font-bold text-gray-900">248</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">1,240</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <QrCode className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Scan Bottle
            </h2>
            <p className="text-gray-600 mb-4">
              Scan QR code to register recycled bottles
            </p>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Start Scanning
            </button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Redeem Rewards
            </h2>
            <p className="text-gray-600 mb-4">Use your points to get rewards</p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              View Rewards
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { bottles: 5, points: 25, date: "2025-01-24" },
              { bottles: 8, points: 40, date: "2025-01-22" },
              { bottles: 3, points: 15, date: "2025-01-20" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between pb-4 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.bottles} bottles recycled
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    +{activity.points} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

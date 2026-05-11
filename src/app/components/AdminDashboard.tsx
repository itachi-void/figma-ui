import React, { useState, useEffect } from "react";
import { Card } from "../../imports/card";
import { Button } from "../../imports/button";
import { Input } from "../../imports/input";
import { Label } from "../../imports/label";
import { Alert } from "../../imports/alert";
import { LoadingSpinner } from "../../imports/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../imports/tabs";
import { adminService, getDashboardStats, DashboardStats } from "../services/adminService";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [recyclers, setRecyclers] = useState<any[]>([]);
  const [recyclersTripCount, setRecyclersTripCount] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard stats";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadRecyclers = async () => {
    try {
      const data = await adminService.getRecyclerDetails();
      setRecyclers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load recyclers"
      );
    }
  };

  const loadRecyclersWithTrips = async () => {
    try {
      const data = await adminService.getRecyclerWithTotalTrip();
      setRecyclersTripCount(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load recyclers with trips"
      );
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsersByFilter();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
  };

  const loadTickets = async () => {
    try {
      const data = await adminService.getSupportTickets();
      setTickets(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tickets"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Manage recyclers, users, categories, and support tickets
        </p>

        {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

        {/* Dashboard Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">Total Recyclers</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {stats.totalRecyclers}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Active: {stats.activeRecyclers}
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {stats.totalUsers}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Active: {stats.activeUsers}
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">
                Pickup Requests
              </p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {stats.totalPickupRequests}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Items: {stats.totalRequestingItems}
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                ${stats.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Wallet Points: {stats.totalWalletPoints.toFixed(0)}
              </p>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recyclers">Recyclers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    📊 Statistics
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Total Recyclers: {stats?.totalRecyclers}</li>
                    <li>• Total Users: {stats?.totalUsers}</li>
                    <li>• Active Pickup Requests: {stats?.totalPickupRequests}</li>
                    <li>• Total Earnings: ${stats?.totalEarnings.toFixed(2)}</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    👥 Users
                  </h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Active Users: {stats?.activeUsers}</li>
                    <li>• Total Wallet Points: {stats?.totalWalletPoints.toFixed(0)}</li>
                    <li>• Total Items Requested: {stats?.totalRequestingItems}</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    ♻️ Recyclers
                  </h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Total Recyclers: {stats?.totalRecyclers}</li>
                    <li>• Active Recyclers: {stats?.activeRecyclers}</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    💰 Financial
                  </h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Total Revenue: ${stats?.totalEarnings.toFixed(2)}</li>
                    <li>• User Wallet Points: {stats?.totalWalletPoints.toFixed(0)}</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={loadDashboardData}
                variant="outline"
                className="mt-4 w-full"
              >
                Refresh Statistics
              </Button>
            </Card>
          </TabsContent>

          {/* Recyclers Tab */}
          <TabsContent value="recyclers" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Recyclers Management</h2>

              <div className="flex gap-2 mb-6">
                <Button onClick={loadRecyclers} className="flex-1">
                  Load All Recyclers
                </Button>
                <Button onClick={loadRecyclersWithTrips} variant="outline" className="flex-1">
                  Load with Trip Count
                </Button>
              </div>

              {recyclers.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold mb-2">
                    Recyclers Details ({recyclers.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {recyclers.map((recycler) => (
                      <div
                        key={recycler.recyclerID}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <p className="font-semibold">{recycler.fullName}</p>
                        <p className="text-sm text-gray-600">
                          📞 {recycler.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          🚗 {recycler.vehicleInfo}
                        </p>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs">
                            Status:{" "}
                            <span className="font-semibold">
                              {recycler.status}
                            </span>
                          </span>
                          <span className="text-xs">
                            Rating: ⭐ {recycler.rating}
                          </span>
                          <span className="text-xs">
                            Trips: {recycler.totalTripsCompleted}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recyclersTripCount.length > 0 && (
                <div className="space-y-2 mt-6">
                  <h3 className="font-semibold mb-2">
                    Recyclers by Trip Count
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {recyclersTripCount.map((recycler) => (
                      <div key={recycler.recyclerID} className="bg-blue-50 p-3 rounded">
                        <div className="flex justify-between">
                          <p className="font-semibold">{recycler.fullName}</p>
                          <p className="text-sm">⭐ {recycler.rating}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Total Trips: {recycler.totalTrips}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Users Management</h2>

              <Button onClick={loadUsers} className="mb-6">
                Load All Users
              </Button>

              {users.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold mb-2">Users List ({users.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Points</th>
                          <th className="text-left p-2">Requests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 10).map((user) => (
                          <tr key={user.userId} className="border-b">
                            <td className="p-2">{user.name}</td>
                            <td className="p-2 text-xs">{user.email}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  user.isActive === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.isActive}
                              </span>
                            </td>
                            <td className="p-2">{user.walletPoints}</td>
                            <td className="p-2">{user.totalRequests}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Showing 10 of {users.length} users
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                Waste Categories Management
              </h2>
              <p className="text-gray-600 mb-4">
                Create, update, and manage waste categories here.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-900">
                  Use the admin service to manage categories:
                </p>
                <code className="block bg-gray-800 text-blue-300 p-2 rounded mt-2 text-xs overflow-x-auto">
                  await adminService.createWasteCategory(data)
                </code>
              </div>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>

              <Button onClick={loadTickets} className="mb-6">
                Load Support Tickets
              </Button>

              {tickets.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold mb-2">
                    Tickets ({tickets.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.ticketID}
                        className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{ticket.subject}</p>
                            <p className="text-sm text-gray-600">
                              {ticket.description}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              ticket.priority === "urgent"
                                ? "bg-red-100 text-red-800"
                                : ticket.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>{ticket.citizenName}</span>
                          <span>{ticket.status}</span>
                          <span>Rating: {ticket.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

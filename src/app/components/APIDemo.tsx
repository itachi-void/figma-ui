import React, { useState } from "react";
import { Card } from "../imports/card";
import { Button } from "../imports/button";
import { Input } from "../imports/input";
import { Label } from "../imports/label";
import { Alert } from "../imports/alert";
import { LoadingSpinner } from "../imports/LoadingSpinner";
import { userService, UserData } from "./userService";

/**
 * Quick Start Component - Demo of all API functionalities
 * 
 * This component demonstrates how to use all the Account & User API services
 * This can be used as a reference for how to integrate the APIs into your app
 */

export const APIDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"demo" | "docs">("demo");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ============ Test Functions ============

  const testGetAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.getAllUsers();
      setResult({
        title: "All Users",
        data: users,
        endpoint: "GET /api/User"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const testGetUserById = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getUserById(1);
      setResult({
        title: "User by ID (ID: 1)",
        data: user,
        endpoint: "GET /api/User/{id}"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const testGetUserByEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getUserByEmail("test@example.com");
      setResult({
        title: "User by Email",
        data: user,
        endpoint: "GET /api/User/by-email/{email}"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const testGetAllUsersDto = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.getAllUsersAsDto();
      setResult({
        title: "All Users as DTO",
        data: users,
        endpoint: "GET /api/User/GetallbyDto"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">API Demo</h1>
          <p className="text-gray-600">
            Test the Account & User API endpoints in real-time
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab("demo")}
            variant={activeTab === "demo" ? "default" : "outline"}
          >
            API Tests
          </Button>
          <Button
            onClick={() => setActiveTab("docs")}
            variant={activeTab === "docs" ? "default" : "outline"}
          >
            Documentation
          </Button>
        </div>

        {/* Demo Tab */}
        {activeTab === "demo" && (
          <div className="space-y-6">
            {/* Test Buttons */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">User Endpoints Tests</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  onClick={testGetAllUsers}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <LoadingSpinner /> : "GET All Users"}
                </Button>

                <Button
                  onClick={testGetUserById}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <LoadingSpinner /> : "GET User by ID (1)"}
                </Button>

                <Button
                  onClick={testGetUserByEmail}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <LoadingSpinner /> : "GET User by Email"}
                </Button>

                <Button
                  onClick={testGetAllUsersDto}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <LoadingSpinner /> : "GET All Users DTO"}
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Result Display */}
              {result && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-lg font-semibold text-blue-600">
                      {result.title}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">{result.endpoint}</p>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-gray-800">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Reference */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Reference</h2>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Login Service
                  </h3>
                  <code className="text-sm text-blue-800 block">
                    await accountService.login(&#123; name, password, role &#125;)
                  </code>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Get All Users
                  </h3>
                  <code className="text-sm text-green-800 block">
                    await userService.getAllUsers()
                  </code>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Create User
                  </h3>
                  <code className="text-sm text-purple-800 block">
                    await userService.createUser(&#123; FullName, Email, Password, Address &#125;)
                  </code>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Update User
                  </h3>
                  <code className="text-sm text-orange-800 block">
                    await userService.updateUser(userData)
                  </code>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Delete User
                  </h3>
                  <code className="text-sm text-red-800 block">
                    await userService.deleteUser(userId)
                  </code>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === "docs" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Implementation Guide</h2>

              <div className="space-y-6">
                {/* Services */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">
                    📁 Services
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                      <strong>accountService.ts</strong> - User authentication
                    </li>
                    <li>
                      <strong>userService.ts</strong> - User CRUD operations
                    </li>
                  </ul>
                </div>

                {/* Components */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-600">
                    🧩 Components
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                      <strong>LoginForm.tsx</strong> - Complete login form
                    </li>
                    <li>
                      <strong>UserForm.tsx</strong> - User registration & edit
                    </li>
                    <li>
                      <strong>UsersList.tsx</strong> - User management table
                    </li>
                  </ul>
                </div>

                {/* Pages */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-600">
                    📄 Pages
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                      <strong>AccountPage.tsx</strong> - Complete account
                      management page with tabs
                    </li>
                  </ul>
                </div>

                {/* Field Validation */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-orange-600">
                    ✅ Field Validation Rules
                  </h3>
                  <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                    <p>
                      <strong>Full Name:</strong> 5-50 chars, letters &
                      spaces only
                    </p>
                    <p>
                      <strong>Email:</strong> Valid email format
                    </p>
                    <p>
                      <strong>Password:</strong> 8+ chars, uppercase, lowercase,
                      digit, special char
                    </p>
                    <p>
                      <strong>Address:</strong> 30-100 characters
                    </p>
                    <p>
                      <strong>Profile Picture:</strong> Image files only (optional)
                    </p>
                  </div>
                </div>

                {/* API Endpoints */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-red-600">
                    🔌 API Endpoints
                  </h3>
                  <div className="bg-gray-50 p-4 rounded space-y-2 text-sm font-mono">
                    <p className="text-green-700">POST /api/Account/Login</p>
                    <p className="text-blue-700">GET /api/User</p>
                    <p className="text-blue-700">POST /api/User</p>
                    <p className="text-blue-700">PUT /api/User</p>
                    <p className="text-blue-700">GET /api/User/{{id}}</p>
                    <p className="text-blue-700">DELETE /api/User/{{id}}</p>
                    <p className="text-blue-700">GET /api/User/by-email/{{email}}</p>
                    <p className="text-blue-700">GET /api/User/GetallbyDto</p>
                  </div>
                </div>

                {/* Quick Start */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                    🚀 Quick Start
                  </h3>
                  <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                    <p className="text-gray-700 mb-2">
                      Add to your routes:
                    </p>
                    <code className="block bg-gray-800 text-indigo-300 p-3 rounded text-xs overflow-x-auto">
                      {`<Route path="/account" element={<AccountPage />} />`}
                    </code>
                  </div>
                </div>
              </div>
            </Card>

            {/* Documentation Links */}
            <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                📚 Documentation Files
              </h3>
              <ul className="space-y-2 text-yellow-800">
                <li>
                  • <strong>README_ACCOUNT_API.md</strong> - Complete overview
                </li>
                <li>
                  • <strong>API_INTEGRATION.md</strong> - Detailed API reference
                </li>
                <li>
                  • <strong>INTEGRATION_EXAMPLES.md</strong> - Code examples
                </li>
                <li>
                  • <strong>API_TESTING_GUIDE.md</strong> - Testing & debugging
                </li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

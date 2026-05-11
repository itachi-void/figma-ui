import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../imports/tabs";
import { LoginForm } from "../components/LoginForm";
import { UserForm } from "../components/UserForm";
import { UsersList } from "../components/UsersList";

export const AccountPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("login");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [refreshUsersList, setRefreshUsersList] = useState(0);

  const handleLoginSuccess = (response: any) => {
    console.log("Login successful:", response);
    // Redirect or update auth state
  };

  const handleUserCreated = () => {
    setRefreshUsersList((prev) => prev + 1);
    setSelectedTab("users-list");
  };

  const handleEdit = (userId: number) => {
    setEditingUserId(userId);
    setSelectedTab("edit-profile");
  };

  const handleDelete = (userId: number) => {
    setRefreshUsersList((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Account Management
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Manage your account, create users, and view all users
        </p>

        <Tabs
          defaultValue="login"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
            <TabsTrigger value="users-list">All Users</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <div className="bg-white rounded-lg p-8">
              <LoginForm onSuccess={handleLoginSuccess} />
            </div>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="space-y-4">
            <div className="bg-white rounded-lg p-8">
              <UserForm mode="create" onSuccess={handleUserCreated} />
            </div>
          </TabsContent>

          {/* Edit Profile Tab */}
          <TabsContent value="edit-profile" className="space-y-4">
            <div className="bg-white rounded-lg p-8">
              {editingUserId ? (
                <UserForm
                  userId={editingUserId}
                  mode="edit"
                  onSuccess={() => {
                    setEditingUserId(null);
                    setSelectedTab("users-list");
                    setRefreshUsersList((prev) => prev + 1);
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>Select a user from the Users List to edit</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users List Tab */}
          <TabsContent value="users-list" className="space-y-4">
            <div className="bg-white rounded-lg p-8">
              <UsersList key={refreshUsersList} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

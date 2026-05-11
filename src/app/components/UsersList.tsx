import React, { useState, useEffect } from "react";
import { Button } from "../../imports/button";
import { Card } from "../../imports/card";
import { Alert } from "../../imports/alert";
import { LoadingSpinner } from "../../imports/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../imports/table";
import { userService, UserData } from "../services/userService";

interface UsersListProps {
  onEdit?: (userId: number) => void;
  onDelete?: (userId: number) => void;
}

export const UsersList: React.FC<UsersListProps> = ({ onEdit, onDelete }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load users";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeletingId(userId);
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((u) => u.userId !== userId));
      onDelete?.(userId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 flex justify-center">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <Card className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users List</h2>
        <Button onClick={loadUsers} variant="outline">
          Refresh
        </Button>
      </div>

      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

      {users.length === 0 ? (
        <Alert className="text-center">No users found</Alert>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Wallet Points</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.profilePictureUrl && (
                        <img
                          src={user.profilePictureUrl}
                          alt={user.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      {user.fullName}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 line-clamp-2">
                      {user.address}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.walletPoints}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit?.(user.userId!)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(user.userId!)}
                        disabled={deletingId === user.userId}
                      >
                        {deletingId === user.userId ? (
                          <LoadingSpinner />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total users: {users.length}
      </div>
    </Card>
  );
};

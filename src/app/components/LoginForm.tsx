import React, { useState } from "react";
import { Button } from "../../imports/button";
import { Input } from "../../imports/input";
import { Label } from "../../imports/label";
import { Card } from "../../imports/card";
import { Alert } from "../../imports/alert";
import { LoadingSpinner } from "../../imports/LoadingSpinner";
import { accountService, LoginCredentials } from "../services/accountService";

interface LoginFormProps {
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    name: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!credentials.name || !credentials.password) {
        throw new Error("Please fill in all required fields");
      }

      const response = await accountService.login(credentials);
      setSuccess(true);
      setCredentials({ name: "", password: "", role: "" });

      // Store token if needed
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      onSuccess?.(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          Login successful!
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Username or Email</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your username or email"
            value={credentials.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role (Optional)</Label>
          <Input
            id="role"
            name="role"
            type="text"
            placeholder="e.g., admin, user, recycler"
            value={credentials.role}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Card>
  );
};

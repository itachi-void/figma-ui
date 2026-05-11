import React, { useState, useEffect } from "react";
import { Button } from "../../imports/button";
import { Input } from "../../imports/input";
import { Card } from "../../imports/card";
import { Alert } from "../../imports/alert";
import { LoadingSpinner } from "../../imports/LoadingSpinner";
import {
  userService,
  UserCreationData,
  UserData,
} from "../services/userService";
import { adminService } from "../services/adminService";

interface UserFormProps {
  userId?: number;
  mode?: "create" | "edit";
  onSuccess?: (data: UserData) => void;
  onError?: (error: string) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  userId,
  mode = "create",
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<UserCreationData>({
    FullName: "",
    Email: "",
    Password: "",
    Address: "",
    ProfilePictureUrl: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [originalUser, setOriginalUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (mode === "edit" && userId) {
      loadUserData(userId);
    }
  }, [userId, mode]);

  const loadUserData = async (id: number) => {
    setLoadingUser(true);
    try {
      const user = await userService.getUserById(id);

      setOriginalUser(user);

      setFormData({
        FullName: user.fullName,
        Email: user.email,
        Password: "",
        Address: user.address,
        ProfilePictureUrl: undefined,
      });

      if (user.profilePictureUrl) {
        setProfilePreview(user.profilePictureUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          ProfilePictureUrl: file,
        }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (
      !formData.FullName ||
      !formData.Email ||
      !formData.Address ||
      !formData.Password
    ) {
      setError("All fields are required");
      return false;
    }

    if (formData.Address.length < 30) {
      setError("Address must be at least 30 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let response;

      if (mode === "create") {
        const form = new FormData();
        form.append("FullName", formData.FullName);
        form.append("Email", formData.Email);
        form.append("Password", formData.Password);
        form.append("Address", formData.Address);

        if (formData.ProfilePictureUrl) {
          form.append("ProfilePictureUrl", formData.ProfilePictureUrl);
        }

        response = await adminService.createUser(form);
      } else {
        if (!userId) {
          throw new Error("User ID is missing");
        }

        const form = new FormData();
        form.append("UserId", String(userId));
        form.append("FullName", formData.FullName);
        form.append("Email", formData.Email);
        form.append("Password", formData.Password);
        form.append("Address", formData.Address);

        if (formData.ProfilePictureUrl) {
          form.append("ProfilePictureUrl", formData.ProfilePictureUrl);
        }

        response = await userService.updateUser(userId, form);
      }

      setSuccess(true);
      onSuccess?.(response);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error occurred";
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {mode === "create" ? "Create User" : "Edit User"}
      </h2>

      {error && <Alert variant="destructive">{error}</Alert>}
      {success && <Alert className="bg-green-100">Success!</Alert>}

      {loadingUser ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleChange}
          />

          {profilePreview && (
            <img
              src={profilePreview}
              alt="preview"
              className="w-24 h-24 rounded object-cover"
            />
          )}

          <Input
            name="FullName"
            value={formData.FullName}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <Input
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Email"
          />

          <Input
            name="Password"
            type="password"
            value={formData.Password}
            onChange={handleChange}
            placeholder="Password"
          />

          <Input
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            placeholder="Address"
          />

          <Button disabled={loading} type="submit">
            {loading
              ? "Loading..."
              : mode === "create"
              ? "Create"
              : "Update"}
          </Button>
        </form>
      )}
    </Card>
  );
};
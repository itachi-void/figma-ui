import React, { useState, useEffect } from "react";
import { Button } from "../../imports/button";
import { Input } from "../../imports/input";
import { Label } from "../../imports/label";
import { Card } from "../../imports/card";
import { Alert } from "../../imports/alert";
import { LoadingSpinner } from "../../imports/LoadingSpinner";
import { userService, UserCreationData, UserData } from "../services/userService";
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
  const [formData, setFormData] = useState<UserCreationData & { CurrentPasswordHash?: string }>({
    FullName: "",
    Email: "",
    Password: "",
    Address: "",
    ProfilePictureUrl: undefined,
    CurrentPasswordHash: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  // Stores the full original user record so required backend fields
  // (walletPoints, status, role, etc.) are preserved on update
  const [originalUser, setOriginalUser] = useState<UserData | null>(null);

  // Load user data if editing
  useEffect(() => {
    if (mode === "edit" && userId) {
      loadUserData(userId);
    }
  }, [userId, mode]);

  const loadUserData = async (id: number) => {
    setLoadingUser(true);
    try {
      const user = await userService.getUserById(id);
      // Keep the full record so we can merge it back on submit
      setOriginalUser(user);
      setFormData({
        FullName: user.fullName,
        Email: user.email,
        Password: "",
        Address: user.address,
        ProfilePictureUrl: undefined,
        CurrentPasswordHash: user.passwordHash || "",
      });
      if (user.profilePictureUrl) {
        setProfilePreview(user.profilePictureUrl);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user data";
      setError(errorMessage);
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
        // Preview image
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

  const validateForm = (): boolean => {
    if (
      !formData.FullName ||
      !formData.Email ||
      !formData.Address
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    // Password is always required — the backend hashes it server-side on every save
    if (!formData.Password) {
      setError(mode === "create" ? "Password is required" : "Password is required to update your profile");
      return false;
    }

    // Validate full name min length (backend requires > 5)
    if (formData.FullName.trim().length < 5) {
      setError("Full name must be at least 5 characters");
      return false;
    }

    // Validate full name characters
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.FullName)) {
      setError("Full name should only contain letters and spaces");
      return false;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.Email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate address length (backend requires > 30 chars for both modes)
    if (formData.Address.trim().length < 30) {
      setError("Address must be at least 30 characters");
      return false;
    }

    // Validate password complexity (required for both create and edit)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.Password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let response;

      if (mode === "create") {
        // If no profile picture provided, fetch the default image and append it
        let payload = formData;
        if (!formData.ProfilePictureUrl) {
          try {
            const res = await fetch("/default-profile.svg");
            const blob = await res.blob();
            const file = new File([blob], "default-profile.svg", {
              type: blob.type || "image/svg+xml",
            });
            payload = { ...formData, ProfilePictureUrl: file };
            // show default preview
            setProfilePreview("/default-profile.svg");
          } catch (fetchErr) {
            console.warn("Could not load default profile image:", fetchErr);
          }
        }

        response = await adminService.createUser(payload);
      } else {
        // Edit mode: merge edited fields onto the original user record so the
        // backend receives every required field (walletPoints, status, role…)
        // with its real current value — not a default/zero.
        const updateData: UserData = {
          ...originalUser,           // preserve walletPoints, status, role, etc.
          userId: userId,
          fullName: formData.FullName,
          email: formData.Email,
          address: formData.Address,
          passwordHash: formData.Password,
        };
        response = await userService.updateUser(updateData);
      }

      setSuccess(true);
      onSuccess?.(response);

      if (mode === "create") {
        setFormData({
          FullName: "",
          Email: "",
          Password: "",
          Address: "",
          ProfilePictureUrl: undefined,
          CurrentPasswordHash: "",
        });
        setProfilePreview(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {mode === "create" ? "Create User Account" : "Edit User Profile"}
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          {mode === "create"
            ? "User account created successfully!"
            : "User profile updated successfully!"}
        </Alert>
      )}

      {loadingUser ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <div className="flex gap-4">
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="FullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="FullName"
              name="FullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.FullName}
              onChange={handleChange}
              disabled={loading}
              pattern="^[a-zA-Z\s]+$"
              title="Only letters and spaces allowed"
              required
            />
            <p className="text-xs text-gray-500">Min 5 characters, max 50</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="Email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="Email"
              name="Email"
              type="email"
              placeholder="Enter your email address"
              value={formData.Email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="Password">
              {mode === "create" ? (
                <>Password <span className="text-red-500">*</span></>
              ) : (
                <>Password <span className="text-red-500">*</span> <span className="text-gray-400 font-normal text-xs">(required to save changes)</span></>
              )}
            </Label>
            <Input
              id="Password"
              name="Password"
              type="password"
              placeholder={mode === "create" ? "Enter a strong password" : "Enter your password to confirm changes"}
              value={formData.Password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500">
              Min 8 characters: uppercase, lowercase, number, and special
              character
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="Address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="Address"
              name="Address"
              type="text"
              placeholder="Enter your complete address"
              value={formData.Address}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500">Min 30 characters</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                {mode === "create" ? "Creating Account..." : "Updating..."}
              </div>
            ) : mode === "create" ? (
              "Create Account"
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      )}
    </Card>
  );
};

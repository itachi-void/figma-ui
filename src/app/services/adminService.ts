import { apiRequest } from "../utils/api";

export const adminService = {
  // Dashboard stats
  async getDashboardStats() {
    return {
      totalUsers: await apiRequest<number>("/api/admin/total-users"),
      activeUsers: await apiRequest<number>("/api/admin/total-active-users"),
      totalEarnings: await apiRequest<number>("/api/admin/Total-Earing"),
      totalRecyclers: await apiRequest<number>("/api/admin/total-recyclers"),
    };
  },

  // Get users
  async getAllUsers() {
    return await apiRequest<any[]>("/api/admin/users-by-filter");
  },

  // Delete user
  async deleteUser(userId: number) {
    return await apiRequest<void>(
      `/api/admin/delete-user?userId=${userId}`,
      { method: "DELETE" }
    );
  },

  // Create user (IMPORTANT FIX)
  async createUser(data: {
    FullName: string;
    Email: string;
    Password: string;
    Address: string;
    ProfilePictureUrl?: File;
  }) {
    const formData = new FormData();

    formData.append("FullName", data.FullName);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    formData.append("Address", data.Address);

    if (data.ProfilePictureUrl) {
      formData.append("ProfilePictureUrl", data.ProfilePictureUrl);
    }

    return await apiRequest("/api/admin/create-user", {
      method: "POST",
      body: formData,
    });
  },

  // Waste category
  async createWasteCategory(data: any) {
    return await apiRequest("/api/admin/create-waste-category", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
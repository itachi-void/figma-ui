import { apiRequest } from "../utils/api";

// الأنواع (Interfaces)
export interface UserFilterAdminDTO {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: string;
  walletPoints: number;
}

export const adminService = {
  // جلب الإحصائيات
  async getDashboardStats() {
    return {
      totalUsers: await apiRequest<number>("/api/admin/total-users"),
      activeUsers: await apiRequest<number>("/api/admin/total-active-users"),
      totalEarnings: await apiRequest<number>("/api/admin/Total-Earing"),
      totalRecyclers: await apiRequest<number>("/api/admin/total-recyclers"),
    };
  },

  // إدارة المستخدمين
  async getAllUsers(): Promise<UserFilterAdminDTO[]> {
    // المسار المرجح لجلب قائمة المستخدمين كاملة للأدمن
    return await apiRequest<UserFilterAdminDTO[]>("/api/admin/users-by-filter");
  },

  async deleteUser(userId: number): Promise<void> {
    return await apiRequest<void>(`/api/admin/delete-user?userId=${userId}`, {
      method: "DELETE",
    });
  },

  // إدارة الفئات
  async createWasteCategory(data: any): Promise<any> {
    return await apiRequest<any>("/api/admin/create-waste-category", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
};

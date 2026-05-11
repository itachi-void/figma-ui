// Admin API Service for all administrative endpoints
const API_BASE_URL = "/api/admin";

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface RecyclerDetailsDto {
  recyclerID: number;
  fullName: string;
  phone: string;
  vehicleInfo: string;
  status: string;
  rating: number;
  totalTripsCompleted: number;
}

export interface RecyclerWithTotalTripDto {
  recyclerID: number;
  fullName: string;
  totalTrips: number;
  rating: number;
}

export interface RecyclerCreationDTO {
  fullName: string;
  phone: string;
  passwordHash: string;
}

export interface UserFilterAdminDTO {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: string;
  walletPoints: number;
  totalRequests: number;
}

export interface UserCreationDto {
  FullName: string;
  Email: string;
  Password: string;
  Address: string;
  ProfilePictureUrl?: File;
}

export interface HubStaffCreationDto {
  fullName: string;
  passwordHash: string;
}

export interface WasteCategoryCreationDTO {
  categoryId: number;
  categoryName: string;
  pointsPerUnit: number;
  unitType: string;
}

export interface TicketDTO {
  ticketID: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  citizenName: string;
  driverName: string;
  rating: number;
}

// ============================================================================
// Statistics Endpoints
// ============================================================================

export const adminService = {
  // Get total recyclers
  async getTotalRecyclers(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total-recyclers`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch total recyclers (HTTP ${response.status})`);
    const data = await response.json();
    return data.value || data;
  },

  // Get total active recyclers
  async getTotalRecyclingActive(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total-recycling-active`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok)
      throw new Error("Failed to fetch total active recyclers");
    const data = await response.json();
    return data.value || data;
  },

  // Get total pickup requests
  async getTotalPickupRequests(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total-pickup-requests`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok)
      throw new Error("Failed to fetch total pickup requests");
    const data = await response.json();
    return data.value || data;
  },

  // Get total earnings
  async getTotalEarning(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/Total-Earing`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch total earnings");
    const data = await response.json();
    return data.value || data;
  },

  // Get total users
  async getTotalUsers(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total-users`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch total users");
    const data = await response.json();
    return data.value || data;
  },

  // Get total active users
  async getTotalActiveUsers(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total-active-users`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch total active users");
    const data = await response.json();
    return data.value || data;
  },

  // Get total requesting items
  async getTotalRequestingItems(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total-requesting-items`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch total requesting items");
    const data = await response.json();
    return data.value || data;
  },

  // Get total wallet points
  async getTotalWalletPoints(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total-wallet-points`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch total wallet points");
    const data = await response.json();
    return data.value || data;
  },

  // ========================================================================
  // Recyclers Management
  // ========================================================================

  // Get recycler details
  async getRecyclerDetails(): Promise<RecyclerDetailsDto[]> {
    const response = await fetch(`${API_BASE_URL}/recycler-details`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch recycler details");
    return response.json();
  },

  // Get recyclers with total trips
  async getRecyclerWithTotalTrip(): Promise<RecyclerWithTotalTripDto[]> {
    const response = await fetch(`${API_BASE_URL}/recycler-with-total-trip`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok)
      throw new Error("Failed to fetch recyclers with total trips");
    return response.json();
  },

  // Create recycler
  async createRecycler(data: RecyclerCreationDTO): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/create-recycler`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const text = await response.text();
    let parsed: any = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* empty body */ }
    if (!response.ok) {
      throw new Error(parsed?.message || parsed?.title || text || "Failed to create recycler");
    }
    return parsed ?? { success: true };
  },

  // Update recycler status
  async updateRecyclerStatus(
    recyclerId: number,
    newStatus: string
  ): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/update-recycler-status?recyclerId=${recyclerId}&newStatus=${newStatus}`,
      {
        method: "PUT",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok)
      throw new Error("Failed to update recycler status");
    return response.json();
  },

  // Delete recycler
  async deleteRecycler(recyclerId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/delete-recycler?recyclerId=${recyclerId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error("Failed to delete recycler");
  },

  // ========================================================================
  // Users Management
  // ========================================================================

  // Get users by filter
  async getUsersByFilter(
    keyofFilter?: string,
    status?: string
  ): Promise<UserFilterAdminDTO[]> {
    let url = `${API_BASE_URL}/users-by-filter`;
    const params = new URLSearchParams();
    if (keyofFilter) params.append("KeyofFilter", keyofFilter);
    if (status) params.append("status", status);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  // Create user (admin)
  async createUser(data: UserCreationDto): Promise<any> {
    const formData = new FormData();
    formData.append("FullName", data.FullName);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    formData.append("Address", data.Address);
    if (data.ProfilePictureUrl) {
      formData.append("ProfilePictureUrl", data.ProfilePictureUrl);
    }

    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: "POST",
      headers: this.getHeadersWithoutContentType(),
      body: formData,
    });

    // Safely read body — server may return empty body on success (201 No Content)
    const text = await response.text();
    let parsed: any = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      // body is not JSON (plain text message, etc.)
    }

    if (!response.ok) {
      const status = response.status;
      let errorMessage =
        parsed?.message ||
        (parsed?.errors
          ? Object.values(parsed.errors as Record<string, string[]>).flat().join(", ")
          : null) ||
        parsed?.title ||
        text ||
        "";

      // Provide clear messages for auth failures
      if (status === 401) {
        errorMessage = errorMessage || "Unauthorized — please log in as an admin first";
      } else if (status === 403) {
        errorMessage = errorMessage || "Forbidden — admin access required";
      } else {
        errorMessage = errorMessage || `Failed to create user`;
      }

      throw new Error(`${errorMessage} (HTTP ${status})`);
    }

    return parsed ?? { success: true };
  },

  // Delete user
  async deleteUser(userId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/delete-user?userId=${userId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error("Failed to delete user");
  },

  // ========================================================================
  // Hub Staff Management
  // ========================================================================

  // Create hub staff
  async createHubStaff(data: HubStaffCreationDto): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/create-hub-staff`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const text = await response.text();
    let parsed: any = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* empty body */ }
    if (!response.ok) {
      throw new Error(parsed?.message || parsed?.title || text || "Failed to create hub staff");
    }
    return parsed ?? { success: true };
  },

  // Delete hub staff
  async deleteHubStaff(hubStaffId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/delete-hub-staff?hubStaffId=${hubStaffId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error("Failed to delete hub staff");
  },

  // ========================================================================
  // Waste Category Management
  // ========================================================================

  // Create waste category
  async createWasteCategory(data: WasteCategoryCreationDTO): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/create-waste-category`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const text = await response.text();
    let parsed: any = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* empty body */ }
    if (!response.ok) {
      throw new Error(parsed?.message || parsed?.title || text || "Failed to create waste category");
    }
    return parsed ?? { success: true };
  },

  // Update waste category
  async updateWasteCategory(data: WasteCategoryCreationDTO): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/update-waste-category`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const text = await response.text();
    let parsed: any = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* empty body */ }
    if (!response.ok) {
      throw new Error(parsed?.message || parsed?.title || text || "Failed to update waste category");
    }
    return parsed ?? { success: true };
  },

  // Delete waste category
  async deleteWasteCategory(wasteCategoryId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/delete-waste-category?wasteCategoryId=${wasteCategoryId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error("Failed to delete waste category");
  },

  // ========================================================================
  // Support Tickets Management
  // ========================================================================

  // Get support tickets
  async getSupportTickets(status?: string, search?: string): Promise<TicketDTO[]> {
    let url = `${API_BASE_URL}/Show-Support-Ticket`;
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch support tickets");
    return response.json();
  },

  // ========================================================================
  // Helper Methods
  // ========================================================================

  getHeaders(): Record<string, string> {
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  },

  getHeadersWithoutContentType(): Record<string, string> {
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  },
};

// ============================================================================
// Dashboard Statistics Helper
// ============================================================================

export interface DashboardStats {
  totalRecyclers: number;
  activeRecyclers: number;
  totalUsers: number;
  activeUsers: number;
  totalPickupRequests: number;
  totalEarnings: number;
  totalRequestingItems: number;
  totalWalletPoints: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      totalRecyclers,
      activeRecyclers,
      totalUsers,
      activeUsers,
      totalPickupRequests,
      totalEarnings,
      totalRequestingItems,
      totalWalletPoints,
    ] = await Promise.all([
      adminService.getTotalRecyclers(),
      adminService.getTotalRecyclingActive(),
      adminService.getTotalUsers(),
      adminService.getTotalActiveUsers(),
      adminService.getTotalPickupRequests(),
      adminService.getTotalEarning(),
      adminService.getTotalRequestingItems(),
      adminService.getTotalWalletPoints(),
    ]);

    return {
      totalRecyclers,
      activeRecyclers,
      totalUsers,
      activeUsers,
      totalPickupRequests,
      totalEarnings,
      totalRequestingItems,
      totalWalletPoints,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
}

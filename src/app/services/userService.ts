// API Service for User endpoints
const API_BASE_URL = "/api";

export interface UserData {
  userId?: number;
  fullName: string;
  email: string;
  passwordHash?: string;
  address: string;
  status?: string;
  walletPoints?: number;
  profilePictureUrl?: string;
  role?: string;
  createdAt?: string;   // returned by the API, must be echoed back on PUT
}

export interface UserCreationData {
  FullName: string;
  Email: string;
  Password: string;
  Address: string;
  ProfilePictureUrl?: File;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Safely reads a response body and parses it as JSON if possible. */
async function parseResponse(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text; // plain-text body
  }
}

/** Extracts a human-readable error message from a parsed response body. */
function extractError(parsed: any, fallback: string, status: number): string {
  const body =
    (typeof parsed === "string" ? parsed : null) ||
    parsed?.message ||
    (parsed?.errors
      ? Object.values(parsed.errors as Record<string, string[]>).flat().join(", ")
      : null) ||
    parsed?.title ||
    "";

  if (!body) {
    if (status === 401) return `Unauthorized — please log in first (HTTP 401)`;
    if (status === 403) return `Forbidden — you don't have permission to do this (HTTP 403)`;
    return `${fallback} (HTTP ${status})`;
  }
  return `${body} (HTTP ${status})`;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const userService = {
  // GET all users
  async getAllUsers(): Promise<UserData[]> {
    const response = await fetch(`${API_BASE_URL}/User`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const parsed = await parseResponse(response);
      throw new Error(extractError(parsed, "Failed to fetch users", response.status));
    }

    return response.json();
  },

  // GET user by ID
  async getUserById(id: number): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/User/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const parsed = await parseResponse(response);
      throw new Error(extractError(parsed, "Failed to fetch user", response.status));
    }

    return response.json();
  },

  // GET user by email
  async getUserByEmail(email: string): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/User/by-email/${email}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const parsed = await parseResponse(response);
      throw new Error(extractError(parsed, "Failed to fetch user by email", response.status));
    }

    return response.json();
  },

  // GET all users as DTO
  async getAllUsersAsDto(): Promise<UserData[]> {
    const response = await fetch(`${API_BASE_URL}/User/GetallbyDto`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const parsed = await parseResponse(response);
      throw new Error(extractError(parsed, "Failed to fetch users", response.status));
    }

    return response.json();
  },

  // CREATE new user
  async createUser(data: UserCreationData): Promise<UserData> {
    const response = await fetch(`${API_BASE_URL}/User`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        userId: 0,
        fullName: data.FullName,
        email: data.Email,
        passwordHash: data.Password,
        address: data.Address,
        status: "active",
        walletPoints: 0,
        createdAt: new Date().toISOString(),
        role: "user",
      }),
    });

    const parsed = await parseResponse(response);

    if (!response.ok) {
      throw new Error(extractError(parsed, "Failed to create user", response.status));
    }

    return parsed ?? ({} as UserData);
  },

  // UPDATE user
  // All fields are sent (backend requires WalletPoints, Status, Role, etc.)
  // The caller should spread the original user data so these fields carry their
  // real current values \u2014 not defaults.
  async updateUser(data: UserData): Promise<UserData> {
    const payload = {
      userId: data.userId ?? 0,
      fullName: data.fullName,
      email: data.email,
      passwordHash: (data.passwordHash as string) || "",
      address: data.address,
      status: data.status || "active",
      walletPoints: data.walletPoints ?? 0,
      role: data.role || "user",
    };

    const response = await fetch(`${API_BASE_URL}/User/${data.userId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const parsed = await parseResponse(response);

    if (!response.ok) {
      throw new Error(extractError(parsed, "Failed to update user", response.status));
    }

    return parsed ?? ({} as UserData);
  },

  // DELETE user
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/User/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const parsed = await parseResponse(response);
      throw new Error(extractError(parsed, "Failed to delete user", response.status));
    }
  },
};

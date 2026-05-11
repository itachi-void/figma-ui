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
  createdAt?: string;
}

export interface UserCreationData {
  FullName: string;
  Email: string;
  Password: string;
  Address: string;
  ProfilePictureUrl?: File;
}

// ─── Headers ─────────────────────────────────────────────

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem("authToken");

  const headers: Record<string, string> = {};

  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

// ─── Helpers ─────────────────────────────────────────────

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractError(parsed: any, fallback: string, status: number) {
  const msg =
    parsed?.message ||
    parsed?.title ||
    (typeof parsed === "string" ? parsed : null);

  return `${msg || fallback} (HTTP ${status})`;
}

// ─── SERVICE ─────────────────────────────────────────────

export const userService = {
  // GET ALL
  async getAllUsers(): Promise<UserData[]> {
    const res = await fetch(`${API_BASE_URL}/User`, {
      headers: getHeaders(),
    });

    const data = await parseResponse(res);

    if (!res.ok) throw new Error(extractError(data, "Failed users", res.status));

    return data;
  },

  // GET BY ID
  async getUserById(id: number): Promise<UserData> {
    if (!id) throw new Error("User ID is missing ❌");

    const res = await fetch(`${API_BASE_URL}/User/${id}`, {
      headers: getHeaders(),
    });

    const data = await parseResponse(res);

    if (!res.ok) throw new Error(extractError(data, "Failed user", res.status));

    return data;
  },

  // CREATE
  async createUser(data: UserCreationData): Promise<UserData> {
    const res = await fetch(`${API_BASE_URL}/User`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 0,
        fullName: data.FullName,
        email: data.Email,
        passwordHash: data.Password,
        address: data.Address,
        status: "active",
        walletPoints: 0,
        role: "user",
        createdAt: new Date().toISOString(),
      }),
    });

    const parsed = await parseResponse(res);

    if (!res.ok) throw new Error(extractError(parsed, "Create failed", res.status));

    return parsed;
  },

  // UPDATE (FIXED 🚨)
  async updateUser(id: number, data: Partial<UserData>): Promise<UserData> {
    if (!id) throw new Error("User ID is missing ❌");

    const payload = {
      userId: id,
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash || "",
      address: data.address,
      status: data.status || "active",
      walletPoints: data.walletPoints ?? 0,
      role: data.role || "user",
    };

    const res = await fetch(`${API_BASE_URL}/User/${id}`, {
      method: "PUT",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const parsed = await parseResponse(res);

    if (!res.ok) throw new Error(extractError(parsed, "Update failed", res.status));

    return parsed;
  },

  // DELETE
  async deleteUser(id: number) {
    if (!id) throw new Error("User ID is missing ❌");

    const res = await fetch(`${API_BASE_URL}/User/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const parsed = await parseResponse(res);

    if (!res.ok) throw new Error(extractError(parsed, "Delete failed", res.status));
  },
};
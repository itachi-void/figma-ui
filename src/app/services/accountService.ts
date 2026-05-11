// API Service for Account endpoints
const API_BASE_URL = "/api";

export interface LoginCredentials {
  name: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
  };
}

// Login endpoint
export const accountService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/Account/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },
};

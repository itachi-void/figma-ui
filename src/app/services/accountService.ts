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

    // اقرأ الرد كنص الأول
    const text = await response.text();

    let parsed: any = null;

    // حاول تحوله JSON لو ينفع
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }

    // لو فيه error
    if (!response.ok) {
      throw new Error(
        parsed?.message ||
        parsed?.title ||
        parsed ||
        "Login failed"
      );
    }

    // لو الرد فاضي
    return parsed ?? ({} as LoginResponse);
  },
};

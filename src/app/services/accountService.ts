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

export const accountService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/Account/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    // السيرفر بيرجع string (JWT token) مش JSON
    const text = await response.text();

    // لو في خطأ
    if (!response.ok) {
      throw new Error(text || "Login failed");
    }

    // تنظيف التوكن لو جاي بين quotes
    const token = text.replace(/"/g, "");

    // نرجع شكل متوافق مع التطبيق
    return {
      token,
      user: {
        userId: 0,
        email: "",
        fullName: credentials.name,
        role: credentials.role || "",
      },
    };
  },
};

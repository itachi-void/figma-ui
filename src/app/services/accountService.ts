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

      // ❌ مهم: حذفنا role نهائيًا
      body: JSON.stringify({
        name: credentials.name,
        password: credentials.password,
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Login failed");
    }

    // السيرفر بيرجع JWT string
    const token = text.replace(/"/g, "");

    return {
      token,
      user: {
        userId: 0,
        email: "",
        fullName: credentials.name,
        role: "",
      },
    };
  },
};

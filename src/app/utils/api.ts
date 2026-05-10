const API_BASE_URL = "https://smartwaste.runasp.net";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      console.error("Server Error Details:", errorData);
      errorMessage =
        errorData.message ||
        (errorData.errors
          ? Object.values(errorData.errors).flat().join(", ")
          : null) ||
        errorData.title ||
        errorMessage;
    } catch (e) {
      const textError = await response.text().catch(() => "");
      if (textError) errorMessage = textError;
    }

    throw new Error(errorMessage);
  }

  // Handle cases where the response might be a plain string (like the JWT token)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

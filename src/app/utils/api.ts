/**
 * API Configuration & Request Helper
 * Target Server: https://smartwaste.runasp.net
 */

const API_BASE_URL = "https://smartwaste.runasp.net";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // 1. جلب التوكن من التخزين المحلي
  const token = localStorage.getItem("auth_token");

  // 2. إعداد الـ Headers
  const headers = new Headers(options.headers);
  
  // إضافة توكن المصادقة إذا وُجد
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // إخبار السيرفر أننا نتوقع استلام JSON دائماً
  headers.set("Accept", "application/json");

  // تحديد نوع المحتوى كـ JSON إلا إذا كنا نرفع ملفات (FormData)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    // 3. تنفيذ الطلب
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 4. التعامل مع الأخطاء (Status Code != 2xx)
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // إذا كان السيرفر باعت تفاصيل الخطأ كـ JSON
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData.errors) || errorMessage;
      } else {
        // إذا كان السيرفر باعت صفحة HTML (وده سبب مشكلة Unexpected token <)
        const textError = await response.text();
        console.error("HTML Error Page received:", textError);
        errorMessage = `Server Error: Please check if the endpoint '${endpoint}' is correct.`;
      }
      
      throw new Error(errorMessage);
    }

    // 5. التعامل مع الرد الناجح (Success)
    
    // أحياناً عمليات الـ DELETE أو الـ UPDATE بترجع status 204 (No Content)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    // إذا كان الرد نصاً عادياً (مثل التوكن الخام)
    const text = await response.text();
    try {
      // محاولة تحويل النص لـ JSON يدوياً لو السيرفر نسي يبعت Header الـ JSON
      return JSON.parse(text) as T;
    } catch {
      // لو فشل التحويل، يرجع النص كما هو
      return text as unknown as T;
    }

  } catch (error: any) {
    // تسجيل الخطأ في الـ Console لتسهيل الـ Debugging
    console.error(`[API Error] [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
}

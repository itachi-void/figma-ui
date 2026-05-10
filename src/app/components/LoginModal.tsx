import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Lock,
  User,
  ShieldCheck,
  Loader2,
  Mail,
  MapPin,
  Camera,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useRole, UserRole } from "../contexts/RoleContext";
import { notify } from "../utils/notifications";
import { apiRequest } from "../utils/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useRole();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "AhmedMohamed", // For Login
    fullName: "Ahmed Mohamed Ali", // For Register (5-50 chars)
    email: "testuser123@example.com",
    password: "StrongPassword123!", // Must have upper, lower, number, special char
    address: "Cairo, Egypt, Nasr City, Street 15, Building 20, Floor 5", // Min 30 chars
    role: "citizen" as UserRole,
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const regData = new FormData();
        regData.append("FullName", formData.fullName);
        regData.append("Email", formData.email);
        regData.append("Password", formData.password);
        regData.append("Address", formData.address);
        if (profilePicture) regData.append("ProfilePictureUrl", profilePicture);

        // We will use create-user for registration as it's the only one accepting multipart/form-data
        const endpoint = "/api/admin/create-user";

        await apiRequest(endpoint, {
          method: "POST",
          body: regData,
        });

        notify.success(
          "تم التسجيل بنجاح!",
          "تقدر دلوقتي تسجل دخول بحسابك الجديد.",
        );
        setIsRegister(false);
      } else {
        const roleForAPI =
          formData.role.charAt(0).toUpperCase() + formData.role.slice(1);
        const response = await apiRequest<string>("/api/Account/Login", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            password: formData.password,
            role: roleForAPI,
          }),
        });

        // response is the token string
        await login({
          token: response,
          name: formData.name,
          role: formData.role,
        });

        notify.success(
          "أهلاً بيك من جديد!",
          `تم تسجيل الدخول بنجاح باسم ${formData.name}`,
        );
        onClose();
        // Redirect based on role
        setTimeout(() => {
          window.location.href =
            formData.role === "admin" ? "/dashboard" : "/citizen-portal";
        }, 500);
      }
    } catch (error: any) {
      notify.error(
        isRegister ? "فشل التسجيل" : "فشل تسجيل الدخول",
        error.message || "تأكد من البيانات المدخلة",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFastAdminLogin = () => {
    setFormData({
      ...formData,
      name: "Admin",
      password: "AdminPassword123!",
      role: "admin",
    });
    notify.info(
      "Admin Credentials Set",
      "Click Sign In to enter the dashboard.",
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h2>
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => setIsRegister(false)}
                  className={`text-sm font-bold pb-1 transition-all ${!isRegister ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-400"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsRegister(true)}
                  className={`text-sm font-bold pb-1 transition-all ${isRegister ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-400"}`}
                >
                  Register
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar"
            >
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["citizen", "driver", "admin"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${
                        formData.role === r
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 shadow-sm"
                          : "border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {isRegister ? (
                // --- REGISTER FIELDS ---
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="123 Street, City"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      الصورة الشخصية
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // --- LOGIN FIELDS ---
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isRegister ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>

              {!isRegister && (
                <>
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-100 dark:border-gray-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                      <span className="bg-white dark:bg-gray-900 px-2 text-gray-400 font-bold">
                        Quick Access
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFastAdminLogin}
                    className="w-full py-3 border-2 border-dashed border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Fast Admin Setup (Test)
                  </button>
                </>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

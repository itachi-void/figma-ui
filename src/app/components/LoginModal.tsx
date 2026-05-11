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
    name: "Admin", // Existing admin from database
    email: "admin@example.com",
    password: "Admin123!", // Try different password for existing admin
    address: "123 Main Street, Cairo, Egypt - This is a test address for registration purposes", // Min 30 chars
    role: "admin" as UserRole,
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
        regData.append("FullName", formData.name);
        regData.append("Email", formData.email);
        regData.append("Password", formData.password);
        regData.append("Address", formData.address);
        
        // Always append a profile picture to avoid NULL error
        if (profilePicture) {
          regData.append("ProfilePictureUrl", profilePicture);
        } else {
          // Create a default blob for profile picture
          const defaultPic = new Blob(['default'], { type: 'image/jpeg' });
          regData.append("ProfilePictureUrl", defaultPic, 'default.jpg');
        }

        // We will use create-user for registration as it's the only one accepting multipart/form-data
        const endpoint = "/api/admin/create-user";

        console.log("Sending registration data:", Object.fromEntries(regData));
        
        const regResponse = await apiRequest(endpoint, {
          method: "POST",
          body: regData,
        });

        console.log("Registration response:", regResponse);

        // Auto-login after successful registration
        try {
          const loginData = {
            name: formData.name,
            password: formData.password,
            role: formData.role === 'admin' ? 'Admin' : formData.role.toLowerCase(),
          };
          
          console.log("Auto-login with data:", loginData);
          
          const loginResponse = await apiRequest<any>("/api/Account/Login", {
            method: "POST",
            body: JSON.stringify(loginData),
          });

          console.log("Login response:", loginResponse);

          await login({
            token: loginResponse.token,
            name: loginResponse.user || formData.name,
            role: loginResponse.role?.toLowerCase() || formData.role,
          });

          notify.success(
            "تم التسجيل وتسجيل الدخول بنجاح!",
            `أهلاً بك يا ${formData.name}`,
          );
          onClose();
          
          // Redirect based on role
          setTimeout(() => {
            window.location.href =
              formData.role === "admin" ? "/dashboard" : "/citizen-portal";
          }, 500);
          
        } catch (loginError: any) {
          notify.error(
            "تم التسجيل بنجاح",
            "فشل تسجيل الدخول التلقائي. جرب تسجل دخول يدوي.",
          );
          setIsRegister(false);
        }
      } else {
        const roleForAPI = formData.role === 'admin' ? 'Admin' : formData.role.toLowerCase();
        
        const loginData = {
          name: formData.name,
          password: formData.password,
          role: roleForAPI,
        };
        
        console.log("Sending login data:", loginData);
        console.log("formData.name:", formData.name);
        console.log("formData.password:", formData.password);
        console.log("roleForAPI:", roleForAPI);
        
        const response = await apiRequest<any>("/api/Account/Login", {
          method: "POST",
          body: JSON.stringify(loginData),
        });

        console.log("Regular login response:", response);

        await login({
          token: response.token,
          name: response.user || formData.name,
          role: response.role?.toLowerCase() || formData.role,
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
      let errorMessage = error.message || "تأكد من البيانات المدخلة";
      
      // Check if it's a duplicate email error
      if (errorMessage.includes("duplicate key") || errorMessage.includes("UNIQUE KEY")) {
        errorMessage = "الإيميل ده مستخدم قبل كده. جرب إيميل تاني أو سجل دخول لو عندك حساب.";
      }
      
      notify.error(
        isRegister ? "فشل التسجيل" : "فشل تسجيل الدخول",
        errorMessage,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFastAdminLogin = () => {
    setFormData({
      ...formData,
      name: "Administrator",
      password: "123456",
      role: "admin",
    });
    notify.info(
      "Admin Credentials Set",
      "Click Sign In to enter the dashboard.",
    );
  };

  const handleRoleChange = (newRole: UserRole) => {
    setFormData({
      ...formData,
      role: newRole,
    });
  };

  const handleBruteForceAdmin = async () => {
    const passwords = [
      "Admin123!",
      "Admin@123", 
      "password",
      "123456",
      "admin",
      "Admin",
      "StrongPassword123!",
      "Password123!",
      "admin123",
      "Admin123"
    ];

    setLoading(true);
    let foundPassword = null;

    for (const password of passwords) {
      try {
        console.log(`Trying password: ${password}`);
        
        const response = await fetch(`https://smartwaste.runasp.net/api/Account/Login`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: "Admin",
            password: password,
            role: "Admin"
          })
        });

        if (response.ok) {
          const data = await response.json();
          foundPassword = password;
          console.log("SUCCESS! Password found:", password);
          console.log("Login response:", data);
          
          // Store the token
          localStorage.setItem("auth_token", data.token);
          
          notify.success(
            "Admin Password Found!",
            `Password: ${password}`
          );
          break;
        } else {
          console.log(`Failed with password: ${password}`);
        }
      } catch (error) {
        console.log(`Error with password ${password}:`, error);
      }
    }

    if (!foundPassword) {
      notify.error("No Password Found", "Tried all common passwords");
    }

    setLoading(false);
  };

  // Admin API Functions
  const handleGetTotalRecyclers = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/total-recyclers");
      console.log("Total Recyclers:", response);
      notify.success("Total Recyclers", `Count: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get total recyclers", error.message);
    }
  };

  const handleGetActiveRecyclers = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/total-recycling-active");
      console.log("Active Recyclers:", response);
      notify.success("Active Recyclers", `Count: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get active recyclers", error.message);
    }
  };

  const handleGetTotalPickupRequests = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/total-pickup-requests");
      console.log("Total Pickup Requests:", response);
      notify.success("Total Pickup Requests", `Count: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get total pickup requests", error.message);
    }
  };

  const handleGetTotalEarnings = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/Total-Earing");
      console.log("Total Earnings:", response);
      notify.success("Total Earnings", `Amount: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get total earnings", error.message);
    }
  };

  const handleGetRecyclerDetails = async () => {
    try {
      const response = await apiRequest<any[]>("/api/admin/recycler-details");
      console.log("Recycler Details:", response);
      notify.success("Recycler Details", `Found ${response.length} recyclers`);
    } catch (error: any) {
      notify.error("Failed to get recycler details", error.message);
    }
  };

  const handleGetRecyclersWithTrips = async () => {
    try {
      const response = await apiRequest<any[]>("/api/admin/recycler-with-total-trip");
      console.log("Recyclers with Trips:", response);
      notify.success("Recyclers with Trips", `Found ${response.length} recyclers`);
    } catch (error: any) {
      notify.error("Failed to get recyclers with trips", error.message);
    }
  };

  const handleGetTotalUsers = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/total-users");
      console.log("Total Users:", response);
      notify.success("Total Users", `Count: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get total users", error.message);
    }
  };

  const handleGetActiveUsers = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/total-active-users");
      console.log("Active Users:", response);
      notify.success("Active Users", `Count: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get active users", error.message);
    }
  };

  const handleGetRequestingItems = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/total-requesting-items");
      console.log("Requesting Items:", response);
      notify.success("Requesting Items", `Count: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get requesting items", error.message);
    }
  };

  const handleGetTotalWalletPoints = async () => {
    try {
      const response = await apiRequest<number>("/api/admin/total-wallet-points");
      console.log("Total Wallet Points:", response);
      notify.success("Total Wallet Points", `Points: ${response}`);
    } catch (error: any) {
      notify.error("Failed to get total wallet points", error.message);
    }
  };

  const handleGetUsersByFilter = async () => {
    try {
      const response = await apiRequest<any[]>("/api/admin/users-by-filter?KeyofFilter=status&status=active");
      console.log("Users by Filter:", response);
      notify.success("Users by Filter", `Found ${response.length} users`);
    } catch (error: any) {
      notify.error("Failed to get users by filter", error.message);
    }
  };

  const handleGetSupportTickets = async () => {
    try {
      const response = await apiRequest<any[]>("/api/admin/Show-Support-Ticket");
      console.log("Support Tickets:", response);
      notify.success("Support Tickets", `Found ${response.length} tickets`);
    } catch (error: any) {
      notify.error("Failed to get support tickets", error.message);
    }
  };

  // POST API Functions
  const handleCreateUser = async () => {
    try {
      const userData = new FormData();
      userData.append("FullName", "Test User");
      userData.append("Email", `testuser${Date.now()}@example.com`);
      userData.append("Password", "TestPassword123!");
      userData.append("Address", "123 Test Street, Test City, Test Country - This is a test address for registration purposes");
      
      const defaultPic = new Blob(['default'], { type: 'image/jpeg' });
      userData.append("ProfilePictureUrl", defaultPic, 'default.jpg');

      const response = await apiRequest("/api/admin/create-user", {
        method: "POST",
        body: userData,
      });
      
      console.log("User created:", response);
      notify.success("User Created", "New user created successfully");
    } catch (error: any) {
      notify.error("Failed to create user", error.message);
    }
  };

  const handleCreateRecycler = async () => {
    try {
      const recyclerData = {
        fullName: "Test Recycler",
        phone: "01573117042",
        passwordHash: "@6jbA?tQRXOy7Z6k0rytG3BJBf8yyI2c!ErmvYACtt"
      };

      const response = await apiRequest("/api/admin/create-recycler", {
        method: "POST",
        body: JSON.stringify(recyclerData),
      });
      
      console.log("Recycler created:", response);
      notify.success("Recycler Created", "New recycler created successfully");
    } catch (error: any) {
      notify.error("Failed to create recycler", error.message);
    }
  };

  const handleCreateHubStaff = async () => {
    try {
      const hubStaffData = {
        fullName: "Test Hub Staff",
        passwordHash: "xXVkVx@trIY81Fy*bCne4tu35PHvVS5PsST7as3hjR5bZwh50ixxgRP7fTd3NGF7e0i$Gzj00RwXscKBkp69WkO@Z*dpjHK"
      };

      const response = await apiRequest("/api/admin/create-hub-staff", {
        method: "POST",
        body: JSON.stringify(hubStaffData),
      });
      
      console.log("Hub Staff created:", response);
      notify.success("Hub Staff Created", "New hub staff created successfully");
    } catch (error: any) {
      notify.error("Failed to create hub staff", error.message);
    }
  };

  const handleCreateWasteCategory = async () => {
    try {
      const categoryData = {
        categoryId: 0,
        categoryName: "Test Category",
        pointsPerUnit: 10,
        unitType: "kg"
      };

      const response = await apiRequest("/api/admin/create-waste-category", {
        method: "POST",
        body: JSON.stringify(categoryData),
      });
      
      console.log("Waste Category created:", response);
      notify.success("Waste Category Created", "New waste category created successfully");
    } catch (error: any) {
      notify.error("Failed to create waste category", error.message);
    }
  };

  const handleUpdateWasteCategory = async () => {
    try {
      const categoryData = {
        categoryId: 1,
        categoryName: "Updated Category",
        pointsPerUnit: 15,
        unitType: "kg"
      };

      const response = await apiRequest("/api/admin/update-waste-category", {
        method: "PUT",
        body: JSON.stringify(categoryData),
      });
      
      console.log("Waste Category updated:", response);
      notify.success("Waste Category Updated", "Waste category updated successfully");
    } catch (error: any) {
      notify.error("Failed to update waste category", error.message);
    }
  };

  const handleUpdateRecyclerStatus = async () => {
    try {
      const recyclerId = 1;
      const newStatus = "active";

      const response = await apiRequest(`/api/admin/update-recycler-status?recyclerId=${recyclerId}&newStatus=${newStatus}`, {
        method: "PUT",
      });
      
      console.log("Recycler status updated:", response);
      notify.success("Recycler Status Updated", `Recycler ${recyclerId} status updated to ${newStatus}`);
    } catch (error: any) {
      notify.error("Failed to update recycler status", error.message);
    }
  };

  const handleEditUserProfile = async () => {
    try {
      const timestamp = Date.now();
      const userProfile = {
        userId: 1,
        fullName: "Updated User",
        email: `updated_${timestamp}@example.com`,
        address: "123 Updated Street, Downtown District, Cairo, Egypt, Building 5 - This is a test address for profile update purposes",
        passwordHash: "UpdatedPassword123!",
        status: "active",
        walletPoints: 100,
        createdAt: new Date().toISOString(),
        phoneNumber: "01234567890",
        role: "citizen"
      };

      console.log("Sending user profile:", userProfile);
      console.log("Stringified body:", JSON.stringify(userProfile));
      
      const response = await apiRequest("/api/User", {
        method: "POST",
        body: JSON.stringify(userProfile),
      });
      
      console.log("User profile updated:", response);
      notify.success("User Profile Updated", "Profile updated successfully");
    } catch (error: any) {
      notify.error("Failed to update user profile", error.message);
    }
  };

  const handleDeleteAllUsers = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all users? This action cannot be undone!");
    if (!confirmDelete) return;

    // Check if admin token exists
    const token = localStorage.getItem("auth_token");
    if (!token) {
      notify.error("No Admin Token", "Please login as admin first!");
      return;
    }

    console.log("Admin token found:", token.substring(0, 20) + "...");

    setLoading(true);
    try {
      const userIds = [
        1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
        101, 102, 103, 104, 105, 107, 109, 111, 112, 113, 114, 115, 127, 129, 130, 132,
        133, 136, 137, 139, 140
      ];

      let deletedCount = 0;
      let failedCount = 0;

      for (const userId of userIds) {
        try {
          console.log(`Attempting to delete user ${userId}...`);
          const response = await fetch(`https://smartwaste.runasp.net/api/admin/delete-user?userId=${userId}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("auth_token")}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            deletedCount++;
            console.log(`Successfully deleted user ${userId}`);
          } else {
            failedCount++;
            const errorText = await response.text();
            console.error(`Failed to delete user ${userId}. Status: ${response.status}, Error: ${errorText}`);
          }
        } catch (error) {
          failedCount++;
          console.error(`Failed to delete user ${userId}:`, error);
        }
      }

      notify.success(
        "Delete Operation Complete",
        `Deleted: ${deletedCount} users, Failed: ${failedCount} users`
      );
    } catch (error: any) {
      notify.error("Delete Failed", error.message);
    } finally {
      setLoading(false);
    }
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
                      onClick={() => handleRoleChange(r)}
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
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      Name (Username & Full Name)
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
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
                  <button
                    type="button"
                    onClick={handleBruteForceAdmin}
                    className="w-full py-3 border-2 border-dashed border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl text-xs font-bold hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Find Admin Password
                  </button>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleGetTotalRecyclers}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Total Recyclers
                    </button>
                    <button
                      type="button"
                      onClick={handleGetActiveRecyclers}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Active Recyclers
                    </button>
                    <button
                      type="button"
                      onClick={handleGetTotalPickupRequests}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Pickup Requests
                    </button>
                    <button
                      type="button"
                      onClick={handleGetTotalEarnings}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Total Earnings
                    </button>
                    <button
                      type="button"
                      onClick={handleGetRecyclerDetails}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Recycler Details
                    </button>
                    <button
                      type="button"
                      onClick={handleGetRecyclersWithTrips}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Recyclers w/ Trips
                    </button>
                    <button
                      type="button"
                      onClick={handleGetTotalUsers}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Total Users
                    </button>
                    <button
                      type="button"
                      onClick={handleGetActiveUsers}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Active Users
                    </button>
                    <button
                      type="button"
                      onClick={handleGetRequestingItems}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Requesting Items
                    </button>
                    <button
                      type="button"
                      onClick={handleGetTotalWalletPoints}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Wallet Points
                    </button>
                    <button
                      type="button"
                      onClick={handleGetUsersByFilter}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Users by Filter
                    </button>
                    <button
                      type="button"
                      onClick={handleGetSupportTickets}
                      className="py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50"
                    >
                      Support Tickets
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleCreateUser}
                      className="py-2 border border-green-200 text-green-600 rounded-lg text-xs hover:bg-green-50"
                    >
                      Create User
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateRecycler}
                      className="py-2 border border-green-200 text-green-600 rounded-lg text-xs hover:bg-green-50"
                    >
                      Create Recycler
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateHubStaff}
                      className="py-2 border border-green-200 text-green-600 rounded-lg text-xs hover:bg-green-50"
                    >
                      Create Hub Staff
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateWasteCategory}
                      className="py-2 border border-green-200 text-green-600 rounded-lg text-xs hover:bg-green-50"
                    >
                      Create Category
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateWasteCategory}
                      className="py-2 border border-yellow-200 text-yellow-600 rounded-lg text-xs hover:bg-yellow-50"
                    >
                      Update Category
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateRecyclerStatus}
                      className="py-2 border border-yellow-200 text-yellow-600 rounded-lg text-xs hover:bg-yellow-50"
                    >
                      Update Recycler
                    </button>
                    <button
                      type="button"
                      onClick={handleEditUserProfile}
                      className="py-2 border border-purple-200 text-purple-600 rounded-lg text-xs hover:bg-purple-50"
                    >
                      Edit User Profile
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteAllUsers}
                    className="w-full py-3 border-2 border-dashed border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Delete All Users (Admin Only)
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

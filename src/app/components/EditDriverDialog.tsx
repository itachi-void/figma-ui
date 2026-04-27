import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Camera,
  Check,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Mail,
  Truck,
  MapPin,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "../contexts/SidebarContext";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  currentRoute: string;
  completedTrips: number;
  rating: number;
  earnings: number;
  onTimePercentage: number;
  fuelEfficiency: number;
  avatar: string;
  vehicleNumber: string;
  joinDate: string;
  lastActive: string;
}

interface EditDriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (driver: any) => void;
  driver: Driver | null;
}

// Mock data for dropdowns
const vehicleOptions = [
  { id: "VEH-101", name: "Truck A - VEH-101" },
  { id: "VEH-102", name: "Truck B - VEH-102" },
  { id: "VEH-103", name: "Van C - VEH-103" },
  { id: "VEH-104", name: "Truck D - VEH-104" },
];

const routeOptions = [
  { id: "RT-001", name: "Route #12 - Downtown" },
  { id: "RT-002", name: "Route #8 - North District" },
  { id: "RT-003", name: "Route #15 - South Area" },
  { id: "RT-004", name: "Route #22 - East Zone" },
];

export function EditDriverDialog({
  isOpen,
  onClose,
  onSuccess,
  driver,
}: EditDriverDialogProps) {
  const { sidebarOpen } = useSidebar();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    route: "",
    completedTrips: "",
    earnings: "",
    onTimePercentage: "",
    rating: "",
    fuelEfficiency: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [routeSearch, setRouteSearch] = useState("");

  const firstInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load driver data when driver prop changes
  useEffect(() => {
    if (driver && isOpen) {
      setFormData({
        name: driver.name,
        phone: driver.phone,
        email: driver.email,
        vehicle: driver.vehicleNumber,
        route: "",
        completedTrips: String(driver.completedTrips),
        earnings: String(driver.earnings),
        onTimePercentage: String(driver.onTimePercentage),
        rating: String(driver.rating),
        fuelEfficiency: String(driver.fuelEfficiency),
      });
    }
  }, [driver, isOpen]);

  // Focus first input on open
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 0 || !parts[0]) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Validation rules
  const validateField = (field: string, value: string) => {
    if (!value || !value.trim()) return "";

    switch (field) {
      case "name":
        if (value.trim().length < 3)
          return "Name must be at least 3 characters";
        return "";

      case "phone":
        const phoneRegex = /^\+20\d{10}$/;
        if (!phoneRegex.test(value.replace(/\s/g, "")))
          return "Please enter a valid phone number (+201xxxxxxxxx)";
        return "";

      case "email":
        if (!value.endsWith("@recyclehub.com"))
          return "Only @recyclehub.com emails are allowed";
        return "";

      case "completedTrips":
        const trips = parseInt(value);
        if (isNaN(trips) || trips < 0) return "Must be a positive number";
        return "";

      case "earnings":
        const earnings = parseFloat(value);
        if (isNaN(earnings) || earnings < 0) return "Must be a positive number";
        return "";

      case "onTimePercentage":
        const percentage = parseInt(value);
        if (isNaN(percentage) || percentage < 0 || percentage > 100)
          return "Must be between 0 and 100";
        return "";

      case "rating":
        const rating = parseFloat(value);
        if (isNaN(rating) || rating < 0 || rating > 5)
          return "Must be between 0 and 5";
        return "";

      case "fuelEfficiency":
        const fuel = parseFloat(value);
        if (isNaN(fuel) || fuel < 0) return "Must be a positive number";
        return "";

      default:
        return "";
    }
  };

  // Handle field change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return Object.keys(formData).every(
      (key) =>
        validateField(key, formData[key as keyof typeof formData]) === "",
    );
  };

  // Handle save
  const handleSave = async () => {
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaveSuccess(true);

    // Show success toast
    toast.success("Driver updated successfully");

    // Close after 1.5 seconds
    setTimeout(() => {
      handleClose();
      if (driver) {
        onSuccess?.({ id: driver.id, ...formData });
      }
    }, 1500);
  };

  // Handle close
  const handleClose = () => {
    const hasChanges =
      driver &&
      (formData.name !== driver.name ||
        formData.phone !== driver.phone ||
        formData.email !== driver.email ||
        formData.vehicle !== driver.vehicleNumber ||
        formData.completedTrips !== String(driver.completedTrips) ||
        formData.earnings !== String(driver.earnings) ||
        formData.onTimePercentage !== String(driver.onTimePercentage) ||
        formData.rating !== String(driver.rating) ||
        formData.fuelEfficiency !== String(driver.fuelEfficiency));

    if (hasChanges && !saveSuccess) {
      setShowCancelConfirm(true);
    } else {
      resetAndClose();
    }
  };

  // Reset and close
  const resetAndClose = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicle: "",
      route: "",
      completedTrips: "",
      earnings: "",
      onTimePercentage: "",
      rating: "",
      fuelEfficiency: "",
    });
    setErrors({});
    setTouched({});
    setAvatarImage(null);
    setIsSaving(false);
    setSaveSuccess(false);
    setShowCancelConfirm(false);
    setRouteSearch("");
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !showCancelConfirm) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, showCancelConfirm, formData]);

  // Filter routes based on search
  const filteredRoutes = routeOptions.filter((route) =>
    route.name.toLowerCase().includes(routeSearch.toLowerCase()),
  );

  if (!driver) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed bg-black/60 backdrop-blur-sm transition-all duration-300"
            style={{
              top: 0,
              bottom: 0,
              left: sidebarOpen ? "256px" : "0",
              right: 0,
              zIndex: 99,
            }}
          />

          {/* Dialog */}
          <div
            className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none transition-all duration-300"
            style={{
              zIndex: 100,
              left: sidebarOpen ? "256px" : "0",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 100 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl bg-white/95 backdrop-blur-xl md:rounded-3xl rounded-t-3xl shadow-2xl border border-white/20 overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
              style={{
                marginLeft: sidebarOpen ? "0" : "0",
                marginRight: sidebarOpen ? "128px" : "0",
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Driver
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update driver details - {driver.id}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/80 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center"
                  >
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg">
                        {avatarImage ? (
                          <motion.img
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            src={avatarImage}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {getInitials(formData.name) || driver.avatar}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      {avatarImage && (
                        <button
                          type="button"
                          onClick={() => setAvatarImage(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>

                  {/* Form Fields - Same as AddDriverDialog but all fields included */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                          errors.name && touched.name
                            ? "border-red-400 bg-red-50"
                            : formData.name && !errors.name
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-gray-200"
                        }`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone & Email in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          onBlur={() => handleBlur("phone")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.phone && touched.phone
                              ? "border-red-400 bg-red-50"
                              : formData.phone && !errors.phone
                                ? "border-emerald-400 bg-emerald-50"
                                : "border-gray-200"
                          }`}
                        />
                        {errors.phone && touched.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          onBlur={() => handleBlur("email")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.email && touched.email
                              ? "border-red-400 bg-red-50"
                              : formData.email && !errors.email
                                ? "border-emerald-400 bg-emerald-50"
                                : "border-gray-200"
                          }`}
                        />
                        {errors.email && touched.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Performance Stats
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Completed Trips */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Completed Trips
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.completedTrips}
                          onChange={(e) =>
                            handleChange("completedTrips", e.target.value)
                          }
                          onBlur={() => handleBlur("completedTrips")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.completedTrips && touched.completedTrips
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                        {errors.completedTrips && touched.completedTrips && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.completedTrips}
                          </p>
                        )}
                      </div>

                      {/* Earnings */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Earnings ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.earnings}
                          onChange={(e) =>
                            handleChange("earnings", e.target.value)
                          }
                          onBlur={() => handleBlur("earnings")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.earnings && touched.earnings
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                        {errors.earnings && touched.earnings && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.earnings}
                          </p>
                        )}
                      </div>

                      {/* On-Time % */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          On-Time (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.onTimePercentage}
                          onChange={(e) =>
                            handleChange("onTimePercentage", e.target.value)
                          }
                          onBlur={() => handleBlur("onTimePercentage")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.onTimePercentage && touched.onTimePercentage
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rating (0-5)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={formData.rating}
                          onChange={(e) =>
                            handleChange("rating", e.target.value)
                          }
                          onBlur={() => handleBlur("rating")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.rating && touched.rating
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                      </div>

                      {/* Fuel Efficiency */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fuel Efficiency (km/L)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.fuelEfficiency}
                          onChange={(e) =>
                            handleChange("fuelEfficiency", e.target.value)
                          }
                          onBlur={() => handleBlur("fuelEfficiency")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.fuelEfficiency && touched.fuelEfficiency
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200/50 bg-gray-50/50 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isFormValid() || isSaving || saveSuccess}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      Saved
                    </>
                  ) : (
                    "Update Driver"
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Cancel Confirmation */}
          <AnimatePresence>
            {showCancelConfirm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed bg-black/40 transition-all duration-300"
                  style={{
                    top: 0,
                    bottom: 0,
                    left: sidebarOpen ? "256px" : "0",
                    right: 0,
                    zIndex: 110,
                  }}
                  onClick={() => setShowCancelConfirm(false)}
                />
                <div
                  className="fixed flex items-center justify-center p-4 transition-all duration-300"
                  style={{
                    top: 0,
                    bottom: 0,
                    left: sidebarOpen ? "256px" : "0",
                    right: 0,
                    zIndex: 120,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Discard changes?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You have unsaved changes. Do you want to discard them?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                      >
                        Continue Editing
                      </button>
                      <button
                        onClick={resetAndClose}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
                      >
                        Discard
                      </button>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

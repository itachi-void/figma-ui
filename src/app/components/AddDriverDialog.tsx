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

interface AddDriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (driver: any) => void;
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

export function AddDriverDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddDriverDialogProps) {
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

  // Validation rules - all fields are optional
  const validateField = (field: string, value: string) => {
    // If field is empty, it's valid (all fields are optional)
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

  // Check if form is valid - all fields are optional, just check for validation errors
  const isFormValid = () => {
    return Object.keys(formData).every(
      (key) =>
        validateField(key, formData[key as keyof typeof formData]) === "",
    );
  };

  // Handle save
  const handleSave = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    setSaveSuccess(true);

    // Show success toast with undo option
    toast.success("Driver added successfully", {
      action: {
        label: "Undo",
        onClick: () => {
          toast.info("Action cancelled");
        },
      },
      duration: 5000,
    });

    // Close after 1.5 seconds
    setTimeout(() => {
      handleClose();
      onSuccess?.(formData);
    }, 1500);
  };

  // Handle close
  const handleClose = () => {
    const hasData = Object.values(formData).some((val) => val.trim() !== "");
    if (hasData && !saveSuccess) {
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

          {/* Dialog - Desktop: Modal, Mobile: Bottom Sheet */}
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
              <div className="p-6 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add New Driver
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Fill in driver details
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
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg">
                        {avatarImage ? (
                          <motion.img
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            src={avatarImage}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{getInitials(formData.name) || "?"}</span>
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

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
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
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                            : formData.name && !errors.name
                              ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                              : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.name && touched.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Phone */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                          errors.phone && touched.phone
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                            : formData.phone && !errors.phone
                              ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                              : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                        }`}
                        placeholder="+201xxxxxxxxx"
                      />
                      {errors.phone && touched.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                          errors.email && touched.email
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                            : formData.email && !errors.email
                              ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                              : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                        }`}
                        placeholder="name@recyclehub.com"
                      />
                      {errors.email && touched.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Vehicle */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Truck className="w-4 h-4 inline mr-2" />
                        Vehicle Type
                      </label>
                      <select
                        value={formData.vehicle}
                        onChange={(e) =>
                          handleChange("vehicle", e.target.value)
                        }
                        onBlur={() => handleBlur("vehicle")}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                          errors.vehicle && touched.vehicle
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                            : formData.vehicle && !errors.vehicle
                              ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                              : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                        }`}
                      >
                        <option value="">Select vehicle</option>
                        {vehicleOptions.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                          </option>
                        ))}
                      </select>
                      {errors.vehicle && touched.vehicle && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.vehicle}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Route - Searchable */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Route Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={
                            formData.route
                              ? routeOptions.find(
                                  (r) => r.id === formData.route,
                                )?.name || routeSearch
                              : routeSearch
                          }
                          onChange={(e) => {
                            setRouteSearch(e.target.value);
                            if (!e.target.value) {
                              handleChange("route", "");
                            }
                          }}
                          onFocus={() => {
                            if (!formData.route) setRouteSearch("");
                          }}
                          onBlur={() => handleBlur("route")}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                            errors.route && touched.route
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                              : formData.route && !errors.route
                                ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                                : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                          }`}
                          placeholder="Search for route..."
                        />
                        {routeSearch && !formData.route && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto z-10"
                          >
                            {filteredRoutes.map((route) => (
                              <button
                                key={route.id}
                                type="button"
                                onClick={() => {
                                  handleChange("route", route.id);
                                  setRouteSearch(route.name);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                {route.name}
                              </button>
                            ))}
                            {filteredRoutes.length === 0 && (
                              <div className="px-4 py-3 text-gray-500 text-center">
                                No results
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                      {errors.route && touched.route && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.route}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Performance Stats Header */}
                    <div className="mt-8 mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Performance Stats (Optional)
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Leave empty to use default values
                      </p>
                    </div>

                    {/* Grid for performance fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Completed Trips */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
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
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                              : formData.completedTrips &&
                                  !errors.completedTrips
                                ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                                : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                          }`}
                          placeholder="0"
                        />
                        {errors.completedTrips && touched.completedTrips && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.completedTrips}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Earnings */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Earnings ($)
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
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                              : formData.earnings && !errors.earnings
                                ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                                : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                          }`}
                          placeholder="0.00"
                        />
                        {errors.earnings && touched.earnings && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.earnings}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* On-Time Percentage */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          On-Time Percentage (%)
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
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                              : formData.onTimePercentage &&
                                  !errors.onTimePercentage
                                ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                                : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                          }`}
                          placeholder="100"
                        />
                        {errors.onTimePercentage &&
                          touched.onTimePercentage && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {errors.onTimePercentage}
                            </motion.p>
                          )}
                      </motion.div>

                      {/* Rating */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                      >
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
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                              : formData.rating && !errors.rating
                                ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                                : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                          }`}
                          placeholder="5.0"
                        />
                        {errors.rating && touched.rating && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.rating}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Fuel Efficiency */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="md:col-span-2"
                      >
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
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                              : formData.fuelEfficiency &&
                                  !errors.fuelEfficiency
                                ? "border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                                : "border-gray-200 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20"
                          }`}
                          placeholder="8.0"
                        />
                        {errors.fuelEfficiency && touched.fuelEfficiency && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.fuelEfficiency}
                          </motion.p>
                        )}
                      </motion.div>
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
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isFormValid() || isSaving || saveSuccess}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    "Save"
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
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Continue Editing
                      </button>
                      <button
                        onClick={resetAndClose}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
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

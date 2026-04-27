import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Users,
  Clock,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "../contexts/SidebarContext";

interface AddCenterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (center: any) => void;
}

const centerTypeOptions = [
  { id: "collection", name: "Collection Center" },
  { id: "sorting", name: "Sorting Center" },
  { id: "processing", name: "Processing Center" },
  { id: "storage", name: "Storage Center" },
];

const zoneOptions = [
  { id: "zone-1", name: "Downtown Zone" },
  { id: "zone-2", name: "North District" },
  { id: "zone-3", name: "South Area" },
  { id: "zone-4", name: "East Zone" },
  { id: "zone-5", name: "West Sector" },
];

export function AddCenterDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddCenterDialogProps) {
  const { sidebarOpen } = useSidebar();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    zone: "",
    phone: "",
    email: "",
    capacity: "",
    staffCount: "",
    workingHoursStart: "",
    workingHoursEnd: "",
    centerType: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        address: "",
        zone: "",
        phone: "",
        email: "",
        capacity: "",
        staffCount: "",
        workingHoursStart: "08:00",
        workingHoursEnd: "18:00",
        centerType: "",
      });
      setErrors({});
      setTouched({});
      setSaveSuccess(false);
    }
  }, [isOpen]);

  // Validation rules
  const validateField = (field: string, value: string) => {
    // Required fields
    const requiredFields = ["name", "address", "capacity"];

    if (requiredFields.includes(field) && (!value || !value.trim())) {
      return "This field is required";
    }

    switch (field) {
      case "name":
        if (value.trim().length < 3)
          return "Center name must be at least 3 characters";
        return "";

      case "phone":
        if (!value || !value.trim()) return ""; // Optional
        const phoneRegex = /^\+20\d{10}$/;
        if (!phoneRegex.test(value))
          return "Phone must be in format: +201xxxxxxxxx";
        return "";

      case "email":
        if (!value || !value.trim()) return ""; // Optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email format";
        return "";

      case "capacity":
        if (value && parseInt(value) <= 0)
          return "Capacity must be greater than 0";
        return "";

      case "staffCount":
        if (!value || !value.trim()) return ""; // Optional
        if (parseInt(value) < 0) return "Staff count cannot be negative";
        return "";

      default:
        return "";
    }
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on change if already touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Handle blur
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Check if form is valid
  const isFormValid = () => {
    const requiredFields = ["name", "address", "capacity"];

    // Check all required fields are filled
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || !formData[field as keyof typeof formData].trim()) {
        return false;
      }
    }

    // Check no errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    return !hasErrors;
  };

  // Check if form has changes
  const hasChanges = () => {
    return Object.values(formData).some((value) => value && value.trim() !== "");
  };

  // Handle save
  const handleSave = async () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData]
      );
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      toast.error("Please fix validation errors");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newCenter = {
      id: `CEN-${Date.now()}`,
      name: formData.name,
      location: formData.address,
      zone: formData.zone || "Unassigned",
      phone: formData.phone || "N/A",
      email: formData.email || "N/A",
      capacity: parseInt(formData.capacity),
      currentLoad: 0,
      staffCount: formData.staffCount ? parseInt(formData.staffCount) : 0,
      workingHours: formData.workingHoursStart && formData.workingHoursEnd
        ? `${formData.workingHoursStart} - ${formData.workingHoursEnd}`
        : "08:00 - 18:00",
      centerType: formData.centerType || "collection",
      status: "active",
      manager: "To be assigned",
      contact: formData.phone || "+20 XXX XXX XXXX",
    };

    setIsSaving(false);
    setSaveSuccess(true);

    toast.success("Center added successfully!", {
      description: `${formData.name} has been added to the system.`,
    });

    if (onSuccess) {
      onSuccess(newCenter);
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Handle close
  const handleClose = () => {
    if (hasChanges() && !saveSuccess) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  };

  // Confirm cancel
  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

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
            className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none transition-all duration-300"
            style={{
              zIndex: 100,
              left: sidebarOpen ? "256px" : "0",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                      Add New Collection Center
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Register a new recycling collection center
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/80 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Center Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Center Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            ref={firstInputRef}
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            onBlur={() => handleBlur("name")}
                            placeholder="e.g., Downtown Collection Center"
                            className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none transition-colors ${
                              errors.name && touched.name
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-emerald-500"
                            }`}
                          />
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.name && touched.name && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name}
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            onBlur={() => handleBlur("address")}
                            placeholder="e.g., 123 Main Street, Cairo"
                            className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none transition-colors ${
                              errors.address && touched.address
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-emerald-500"
                            }`}
                          />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.address && touched.address && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.address}
                          </div>
                        )}
                      </div>

                      {/* Zone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Zone
                        </label>
                        <select
                          value={formData.zone}
                          onChange={(e) =>
                            handleInputChange("zone", e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                        >
                          <option value="">Select zone...</option>
                          {zoneOptions.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Center Type */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Center Type
                        </label>
                        <select
                          value={formData.centerType}
                          onChange={(e) =>
                            handleInputChange("centerType", e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                        >
                          <option value="">Select type...</option>
                          {centerTypeOptions.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            onBlur={() => handleBlur("phone")}
                            placeholder="+201234567890"
                            className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none transition-colors ${
                              errors.phone && touched.phone
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-emerald-500"
                            }`}
                          />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.phone && touched.phone && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          onBlur={() => handleBlur("email")}
                          placeholder="center@recyclehub.com"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.email && touched.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-emerald-500"
                          }`}
                        />
                        {errors.email && touched.email && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Operational Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-600" />
                      Operational Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Capacity */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Capacity (kg) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) =>
                            handleInputChange("capacity", e.target.value)
                          }
                          onBlur={() => handleBlur("capacity")}
                          placeholder="e.g., 5000"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.capacity && touched.capacity
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-emerald-500"
                          }`}
                        />
                        {errors.capacity && touched.capacity && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.capacity}
                          </div>
                        )}
                      </div>

                      {/* Staff Count */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Staff Count
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.staffCount}
                            onChange={(e) =>
                              handleInputChange("staffCount", e.target.value)
                            }
                            onBlur={() => handleBlur("staffCount")}
                            placeholder="e.g., 10"
                            className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none transition-colors ${
                              errors.staffCount && touched.staffCount
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-emerald-500"
                            }`}
                          />
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.staffCount && touched.staffCount && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.staffCount}
                          </div>
                        )}
                      </div>

                      {/* Working Hours */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Working Hours
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={formData.workingHoursStart}
                              onChange={(e) =>
                                handleInputChange(
                                  "workingHoursStart",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={formData.workingHoursEnd}
                              onChange={(e) =>
                                handleInputChange("workingHoursEnd", e.target.value)
                              }
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isFormValid() || isSaving || saveSuccess}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Add Center
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Cancel Confirmation Dialog */}
          <AnimatePresence>
            {showCancelConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
                style={{ zIndex: 101 }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Discard Changes?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You have unsaved changes. Are you sure you want to close without
                    saving?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Keep Editing
                    </button>
                    <button
                      onClick={confirmCancel}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

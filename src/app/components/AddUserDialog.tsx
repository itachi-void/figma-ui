"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Upload, 
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Recycle,
  UserPlus
} from "lucide-react";
import { createAdminUser, createRecycler, createHubStaff, CreateUserRequest } from "@/app/utils/adminApi";
import { toast } from "sonner";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'user' | 'recycler' | 'hub-staff';
}

export default function AddUserDialog({ isOpen, onClose, userType }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    Address: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePicture) {
      toast.error("يرجى اختيار صورة الشخصية");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateUserRequest = {
        ...formData,
        ProfilePictureUrl: profilePicture
      };

      let response: string;
      if (userType === 'user') {
        response = await createAdminUser(data);
      } else if (userType === 'recycler') {
        response = await createRecycler(data);
      } else {
        response = await createHubStaff(data);
      }

      setSuccess(true);
      toast.success(response || "تم إنشاء المستخدم بنجاح");
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إنشاء المستخدم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ FullName: "", Email: "", Password: "", Address: "" });
    setProfilePicture(null);
    setPreviewUrl(null);
    setSuccess(false);
    onClose();
  };

  const getTitle = () => {
    switch (userType) {
      case 'user': return "إضافة مستخدم جديد";
      case 'recycler': return "إضافة مُعيد تدوير جديد";
      case 'hub-staff': return "إضافة موظف مركز جديد";
      default: return "إضافة مستخدم";
    }
  };

  const getIcon = () => {
    switch (userType) {
      case 'user': return <UserPlus className="w-6 h-6 text-emerald-600" />;
      case 'recycler': return <Recycle className="w-6 h-6 text-blue-600" />;
      case 'hub-staff': return <ShieldCheck className="w-6 h-6 text-purple-600" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                  {getIcon()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{getTitle()}</h3>
                  <p className="text-sm text-gray-500">أدخل البيانات المطلوبة لإنشاء الحساب</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">تم بنجاح!</h4>
                    <p className="text-gray-500 mt-1">تم إنشاء الحساب وإرسال البيانات للنظام</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div 
                      className="relative w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden group cursor-pointer transition-all hover:border-emerald-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-emerald-500">
                          <Camera className="w-8 h-8" />
                          <span className="text-[10px] font-bold mt-1 uppercase">الصورة</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 font-medium">اضغط لرفع صورة الشخصية *</p>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">الاسم الكامل</label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          required
                          type="text"
                          name="FullName"
                          value={formData.FullName}
                          onChange={handleInputChange}
                          className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                          placeholder="أدخل الاسم بالكامل"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          required
                          type="email"
                          name="Email"
                          value={formData.Email}
                          onChange={handleInputChange}
                          className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                          placeholder="example@mail.com"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          required
                          type="password"
                          name="Password"
                          value={formData.Password}
                          onChange={handleInputChange}
                          className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">العنوان</label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          required
                          type="text"
                          name="Address"
                          value={formData.Address}
                          onChange={handleInputChange}
                          className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                          placeholder="المنطقة، الشارع، رقم العقار"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        إنشاء الحساب الآن
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

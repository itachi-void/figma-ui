import React, { useState } from "react";
import { apiRequest } from "../utils/api";
import { useRole } from "../contexts/RoleContext";
import { notify } from "../utils/notifications";

export const LoginForm = ({ onSuccess }: { onSuccess: (res: any) => void }) => {
  const { login } = useRole();
  const [formData, setFormData] = useState({ name: "", password: "", role: "Admin" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest<any>("/api/Account/Login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      login({
        token: response.token,
        name: response.user || formData.name,
        role: response.role?.toLowerCase() || "admin",
      });

      onSuccess(response);
      notify.success("Success", "Logged in successfully");
    } catch (error: any) {
      notify.error("Login Failed", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        placeholder="Name (e.g. Admin)" 
        className="w-full p-2 border rounded"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="w-full p-2 border rounded"
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <select 
        className="w-full p-2 border rounded"
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      >
        <option value="Admin">Admin</option>
        <option value="citizen">Citizen</option>
      </select>
      <button className="w-full bg-emerald-600 text-white p-2 rounded">Sign In</button>
    </form>
  );
};

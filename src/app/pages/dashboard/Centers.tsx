"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Users,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";
import { Progress } from "../../components/ui/progress";
import { AddCenterDialog } from "../../components/AddCenterDialog";

interface Center {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentLoad: number;
  status: "active" | "inactive" | "maintenance";
  manager: string;
  contact: string;
}

export default function Centers() {
  const [centers, setCenters] = useState<Center[]>([
    {
      id: "1",
      name: "Downtown Center",
      location: "123 Main St, City Center",
      capacity: 5000,
      currentLoad: 3200,
      status: "active",
      manager: "John Doe",
      contact: "+1 234-567-8900",
    },
    {
      id: "2",
      name: "North District Center",
      location: "456 North Ave",
      capacity: 3000,
      currentLoad: 2800,
      status: "active",
      manager: "Jane Smith",
      contact: "+1 234-567-8901",
    },
    {
      id: "3",
      name: "East Side Center",
      location: "789 East Blvd",
      capacity: 4000,
      currentLoad: 1500,
      status: "maintenance",
      manager: "Bob Johnson",
      contact: "+1 234-567-8902",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCenter = (newCenter: any) => {
    setCenters([...centers, newCenter]);
  };

  const deleteCenter = (id: string) => {
    setCenters(centers.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Collection Centers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage recycling collection centers
          </p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Center
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Total Centers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {centers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Active Centers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  centers.filter((c) => c.status === "active")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trash2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Total Capacity
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {centers
                  .reduce((acc, c) => acc + c.capacity, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Center Dialog */}
      <AddCenterDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddCenter}
      />

      {/* Centers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Center Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Current Load
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {centers.map((center) => (
                <tr
                  key={center.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {center.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{center.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {center.capacity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {center.currentLoad.toLocaleString()}
                      </div>
                      <Progress
                        value={
                          (center.currentLoad / center.capacity) * 100
                        }
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        center.status === "active"
                          ? "bg-green-100 text-green-700"
                          : center.status === "inactive"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {center.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {center.manager}
                      </div>
                      <div className="text-xs text-gray-500">
                        {center.contact}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteCenter(center.id)}
                        className="p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
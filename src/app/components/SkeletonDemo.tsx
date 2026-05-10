import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  SkeletonList,
  SkeletonForm,
  SkeletonPageHeader,
  SkeletonStatsGrid,
} from "./ui/skeleton";

export function SkeletonDemo() {
  const [activeDemo, setActiveDemo] = useState<string>("all");
  const [key, setKey] = useState(0);

  const reload = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Skeleton Loading Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Preview of shimmer loading effects (left to right animation)
            </p>
          </div>
          <button
            onClick={reload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Demo
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            "all",
            "cards",
            "table",
            "chart",
            "list",
            "form",
            "basic",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveDemo(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeDemo === tab
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Content */}
      <div key={key} className="max-w-7xl mx-auto space-y-8">
        {/* Basic Skeletons */}
        {(activeDemo === "all" || activeDemo === "basic") && (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Basic Skeletons
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Default Skeleton
                </p>
                <Skeleton className="h-12 w-full" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Circular Skeleton (Avatar)
                </p>
                <Skeleton variant="circular" className="h-16 w-16" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Text Skeleton
                </p>
                <div className="space-y-2">
                  <Skeleton variant="text" className="w-full" />
                  <Skeleton variant="text" className="w-5/6" />
                  <Skeleton variant="text" className="w-4/6" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {(activeDemo === "all" || activeDemo === "cards") && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Stats Cards Skeleton
            </h2>
            <SkeletonStatsGrid count={4} />
          </div>
        )}

        {/* Chart */}
        {(activeDemo === "all" || activeDemo === "chart") && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Chart Skeleton
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonChart height="h-64" />
              <SkeletonChart height="h-64" />
            </div>
          </div>
        )}

        {/* Table */}
        {(activeDemo === "all" || activeDemo === "table") && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Table Skeleton
            </h2>
            <SkeletonTable rows={6} columns={5} />
          </div>
        )}

        {/* List */}
        {(activeDemo === "all" || activeDemo === "list") && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              List Skeleton
            </h2>
            <SkeletonList items={5} />
          </div>
        )}

        {/* Form */}
        {(activeDemo === "all" || activeDemo === "form") && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Form Skeleton
            </h2>
            <SkeletonForm fields={5} />
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="max-w-7xl mx-auto mt-8 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
          ✨ Shimmer Effect
        </h3>
        <p className="text-blue-800 dark:text-blue-200 mb-2">
          Watch the shimmer animation move from left to right across all
          skeleton elements. This provides a smooth, professional loading
          experience.
        </p>
        <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1 text-sm">
          <li>Animation duration: 1.2 seconds</li>
          <li>Direction: Left to Right (translateX)</li>
          <li>Easing: ease-in-out</li>
          <li>Infinite loop</li>
          <li>Works in both Light and Dark modes</li>
        </ul>
      </div>
    </div>
  );
}

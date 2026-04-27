import { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  MapPin,
  Search,
  Filter,
  Map as MapIcon,
  List,
  UserPlus,
  Crown,
  Activity,
  Target,
  Trophy,
  Gift,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useRole } from "@/app/contexts/RoleContext";
import AnimatedCounter from "@/app/components/AnimatedCounter";
import EmptyState from "@/app/components/EmptyState";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface Community {
  id: string;
  name: string;
  owner: string;
  memberCount: number;
  distance: number;
  activityLevel: "high" | "medium" | "low";
  type: "public" | "private" | "school" | "neighborhood";
  totalBottles: number;
  co2Saved: number;
  monthlyTarget?: number;
  targetProgress?: number;
  lat: number;
  lng: number;
}

interface Target {
  id: string;
  type: "personal" | "community";
  period: "daily" | "weekly" | "monthly" | "event";
  startDate: Date;
  endDate: Date;
  goal: number;
  current: number;
  status:
    | "not-started"
    | "in-progress"
    | "achieved"
    | "exceeded";
  reward?: {
    type: "cash" | "voucher" | "points";
    value: number;
    condition: number; // percentage
  };
}

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Green Neighborhood",
    owner: "Ahmed Al-Saud",
    memberCount: 45,
    distance: 1.2,
    activityLevel: "high",
    type: "neighborhood",
    totalBottles: 12500,
    co2Saved: 625,
    monthlyTarget: 15000,
    targetProgress: 83,
    lat: 24.7136,
    lng: 46.6753,
  },
  {
    id: "2",
    name: "King Fahd University",
    owner: "Dr. Sara Al-Rashid",
    memberCount: 230,
    distance: 2.5,
    activityLevel: "high",
    type: "school",
    totalBottles: 45000,
    co2Saved: 2250,
    monthlyTarget: 50000,
    targetProgress: 90,
    lat: 24.7256,
    lng: 46.6653,
  },
  {
    id: "3",
    name: "Al-Malqa Community",
    owner: "Mohammed Al-Qahtani",
    memberCount: 78,
    distance: 3.8,
    activityLevel: "medium",
    type: "private",
    totalBottles: 8900,
    co2Saved: 445,
    monthlyTarget: 12000,
    targetProgress: 74,
    lat: 24.7436,
    lng: 46.6453,
  },
  {
    id: "4",
    name: "Eco Warriors",
    owner: "Fatima Al-Zahrani",
    memberCount: 156,
    distance: 5.2,
    activityLevel: "high",
    type: "public",
    totalBottles: 28000,
    co2Saved: 1400,
    monthlyTarget: 30000,
    targetProgress: 93,
    lat: 24.6936,
    lng: 46.7053,
  },
  {
    id: "5",
    name: "Riyadh Recyclers",
    owner: "Khalid Al-Mutairi",
    memberCount: 12,
    distance: 7.5,
    activityLevel: "low",
    type: "public",
    totalBottles: 3200,
    co2Saved: 160,
    lat: 24.7536,
    lng: 46.6953,
  },
];

const mockTargets: Target[] = [
  {
    id: "1",
    type: "personal",
    period: "weekly",
    startDate: new Date("2026-02-10"),
    endDate: new Date("2026-02-16"),
    goal: 50,
    current: 42,
    status: "in-progress",
    reward: {
      type: "points",
      value: 100,
      condition: 100,
    },
  },
  {
    id: "2",
    type: "community",
    period: "monthly",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-28"),
    goal: 15000,
    current: 12500,
    status: "in-progress",
    reward: {
      type: "voucher",
      value: 500,
      condition: 120,
    },
  },
];

export default function Communities() {
  const { role } = useRole();
  const [viewMode, setViewMode] = useState<"list" | "map">(
    "list",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredCommunities = mockCommunities.filter((c) => {
    const matchesSearch =
      c.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistance = c.distance <= maxDistance;
    const matchesType =
      typeFilter === "all" || c.type === typeFilter;
    return matchesSearch && matchesDistance && matchesType;
  });

  const getActivityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-700 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "school":
        return "🏫";
      case "neighborhood":
        return "🏘️";
      case "private":
        return "🔒";
      default:
        return "🌍";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Nearby Communities
          </h1>
          <p className="text-gray-600 mt-1">
            Discover and join communities in your area
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={
              viewMode === "list" ? "default" : "outline"
            }
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>

          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">
            <Search className="h-4 w-4 mr-2" />
            Discover
          </TabsTrigger>

          <TabsTrigger value="my-communities">
            <Users className="h-4 w-4 mr-2" />
            My Communities
          </TabsTrigger>

          <TabsTrigger value="targets">
            <Target className="h-4 w-4 mr-2" />
            Goals & Rewards
          </TabsTrigger>
        </TabsList>

        {/* Discover Communities */}
        <TabsContent value="discover" className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search for a community or owner..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <select
                  value={maxDistance}
                  onChange={(e) =>
                    setMaxDistance(Number(e.target.value))
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300"
                >
                  <option value={2}>≤ 2 km</option>
                  <option value={5}>≤ 5 km</option>
                  <option value={10}>≤ 10 km</option>
                  <option value={999}>All distances</option>
                </select>
              </div>

              <div>
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300"
                >
                  <option value="all">All types</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="school">School</option>
                  <option value="neighborhood">
                    Neighborhood
                  </option>
                </select>
              </div>
            </div>
          </Card>

          {/* Communities List/Map */}
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredCommunities.length === 0 ? (
            <EmptyState
              title="No communities found"
              description="Try increasing the distance or adjusting the filters"
              icon={Users}
            />
          ) : viewMode === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {getTypeIcon(community.type)}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">
                            {community.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span>{community.owner}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{community.distance} KM</span>
                        </div>
                      </div>
                      <Badge
                        className={getActivityColor(
                          community.activityLevel,
                        )}
                      >
                        {community.activityLevel === "high"
                          ? "Active"
                          : community.activityLevel === "medium"
                            ? "Moderate"
                            : "Quiet"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Members
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {community.memberCount}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Bottles
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          <AnimatedCounter
                            value={community.totalBottles}
                          />
                        </p>
                      </div>
                    </div>

                    {community.monthlyTarget && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Monthly Progress</span>
                          <span>
                            ``
                            {community.targetProgress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${community.targetProgress}%`,
                            }}
                            transition={{
                              duration: 1,
                              delay: index * 0.05,
                            }}
                            className={`h-full ${
                              community.targetProgress >= 90
                                ? "bg-green-500"
                                : community.targetProgress >= 70
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      variant={
                        community.type === "private"
                          ? "outline"
                          : "default"
                      }
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {community.type === "private"
                        ? "Join Request"
                        : "Join now"}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-6 h-[600px]">
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    View the interactive map
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Nearby communities will be displayed on the
                    map
                  </p>{" "}
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* My Communities */}
        <TabsContent
          value="my-communities"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockCommunities
              .slice(0, 2)
              .map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 border-2 border-green-200 bg-green-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                        {getTypeIcon(community.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Member for 3 months
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          <AnimatedCounter
                            value={community.totalBottles}
                          />
                        </p>
                        <p className="text-xs text-gray-600">
                          Bottles
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          <AnimatedCounter
                            value={community.co2Saved}
                          />
                        </p>
                        <p className="text-xs text-gray-600">
                          kg CO₂
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          #{index + 1}
                        </p>
                        <p className="text-xs text-gray-600">
                          Your Rank
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Open Group File
                    </Button>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        {/* Targets & Rewards */}
        <TabsContent value="targets" className="space-y-6">
          {mockTargets.map((target, index) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          target.type === "personal"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {target.type === "personal"
                          ? "Personal"
                          : "Community"}
                      </Badge>

                      <Badge variant="outline">
                        {target.period === "weekly"
                          ? "Weekly"
                          : target.period === "monthly"
                            ? "Monthly"
                            : target.period === "daily"
                              ? "Daily"
                              : "Event"}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Goal: {target.goal} bottles
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {target.startDate.toLocaleDateString(
                          "ar-SA",
                        )}{" "}
                        -{" "}
                        {target.endDate.toLocaleDateString(
                          "ar-SA",
                        )}
                      </span>
                    </div>
                  </div>
                  {target.reward && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
                        <Gift className="h-5 w-5" />
                        {target.reward.type === "cash"
                          ? `${target.reward.value} SAR`
                          : target.reward.type === "voucher"
                            ? `Voucher ${target.reward.value} SAR`
                            : `${target.reward.value} points`}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        At {target.reward.condition}% completion
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>
                      Progress: {target.current} / {target.goal}
                    </span>
                    <span className="font-bold">
                      {Math.round(
                        (target.current / target.goal) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(target.current / target.goal) * 100}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: index * 0.1,
                      }}
                      className={`h-full ${
                        target.status === "achieved"
                          ? "bg-green-500"
                          : target.status === "exceeded"
                            ? "bg-purple-500"
                            : target.current / target.goal >=
                                0.8
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                      }`}
                    />
                  </div>
                </div>

                {target.status === "in-progress" &&
                  target.current / target.goal >=
                    (target.reward?.condition || 100) / 100 && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Trophy className="h-4 w-4 mr-2" />
                      Claim Reward
                    </Button>
                  )}
              </Card>
            </motion.div>
          ))}

          <Button variant="outline" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Create New Goal
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePickup } from "../contexts/PickupContext";
import { useAlertsConfig } from "../contexts/AlertsConfigContext";
import { notify } from "../utils/notifications";

/* ─── Types ───────────────────────────────────────────── */
export interface GuardAlert {
  id: string;
  type: "warning" | "critical";
  title: string;
  description: string;
  time: string;
  location: string;
  status: "active";
  priority: "high" | "medium";
}

/* ─── Module-level toast gate (shared across hook instances) ── */
// Prevents duplicate toasts when the hook is mounted in multiple
// components simultaneously (e.g. DashboardLayout + SmartAlerts).
const GLOBAL_TOASTED = new Set<string>();

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const CAPACITY_KG = 1000;

/* ─── Hook ────────────────────────────────────────────── */
export function useAlertsMonitor() {
  const { requests } = usePickup();
  const { config } = useAlertsConfig();

  const [guardAlerts, setGuardAlerts] = useState<GuardAlert[]>([]);

  // Per-instance tracking so each component gets its own alert cards
  const localSeenRef = useRef<Set<string>>(new Set());

  const check = useCallback(() => {
    const now = Date.now();
    const newAlerts: GuardAlert[] = [];

    /* ── 1. Delayed Pickup Alert ─────────────────────── */
    if (config.delayedPickupAlert) {
      requests
        .filter(
          (r) =>
            r.status === "In-Progress" &&
            now - r.updatedAt.getTime() > TWO_HOURS_MS
        )
        .forEach((r) => {
          const alertId = `guard-delay-${r.id}`;
          const hoursDelayed = Math.floor(
            (now - r.updatedAt.getTime()) / 3_600_000
          );

          // Fire toast only once globally
          if (!GLOBAL_TOASTED.has(alertId)) {
            GLOBAL_TOASTED.add(alertId);
            if (config.channels.dashboardToast) {
              notify.warning(
                `⏰ Delayed Pickup: ${r.id}`,
                `${r.citizen.name} has been In-Progress for ${hoursDelayed}h. Assign a driver!`
              );
            }
          }

          // Add to local alert card list only once per hook instance
          if (!localSeenRef.current.has(alertId)) {
            localSeenRef.current.add(alertId);
            newAlerts.push({
              id: alertId,
              type: "warning",
              title: `Delayed Pickup — ${r.id}`,
              description: `${r.citizen.name} in ${r.zone.name} has been In-Progress for ${hoursDelayed}h+. Driver: ${
                r.driver?.name ?? "Unassigned"
              }. Immediate action required.`,
              time: "Smart Guard detected",
              location: r.zone.name,
              status: "active",
              priority: "high",
            });
          }
        });
    }

    /* ── 2. Zone Capacity Warning ────────────────────── */
    if (config.capacityWarningAlert) {
      // Aggregate weight by zone across active/completed requests
      const zoneWeights: Record<string, { name: string; kg: number }> = {};
      requests
        .filter(
          (r) =>
            r.status === "Completed" ||
            r.status === "In-Progress" ||
            r.status === "Validating"
        )
        .forEach((r) => {
          const zId = r.zone.id;
          if (!zoneWeights[zId])
            zoneWeights[zId] = { name: r.zone.name, kg: 0 };
          zoneWeights[zId].kg += r.items.reduce(
            (s, i) => s + i.expectedWeightKg,
            0
          );
        });

      Object.entries(zoneWeights).forEach(([zId, { name, kg }]) => {
        if (kg <= CAPACITY_KG) return;

        const alertId = `guard-cap-${zId}`;

        if (!GLOBAL_TOASTED.has(alertId)) {
          GLOBAL_TOASTED.add(alertId);
          if (config.channels.dashboardToast) {
            notify.error(
              `🏭 Zone Capacity Alert: ${name}`,
              `${kg.toFixed(0)} kg collected — exceeds the ${CAPACITY_KG} kg threshold`
            );
          }
        }

        if (!localSeenRef.current.has(alertId)) {
          localSeenRef.current.add(alertId);
          newAlerts.push({
            id: alertId,
            type: "critical",
            title: `Zone Capacity Exceeded — ${name}`,
            description: `${kg.toFixed(0)} kg has been collected in the ${name} zone, surpassing the ${CAPACITY_KG} kg warning threshold. Schedule an immediate clearance run.`,
            time: "Smart Guard detected",
            location: name,
            status: "active",
            priority: "high",
          });
        }
      });
    }

    if (newAlerts.length > 0) {
      setGuardAlerts((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const fresh = newAlerts.filter((a) => !existingIds.has(a.id));
        return fresh.length ? [...fresh, ...prev] : prev;
      });
    }
  }, [requests, config]);

  /* ── Run on mount and every 30 s ── */
  useEffect(() => {
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [check]);

  return { guardAlerts };
}

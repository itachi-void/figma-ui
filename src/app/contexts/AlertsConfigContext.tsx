"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

/* ─── Types ──────────────────────────────────────────── */
export interface NotificationChannels {
  dashboardToast: boolean;
  email: boolean;
  browserPush: boolean;
}

export interface AlertsConfig {
  /** AI match percentage threshold (60–100). Matches below this are flagged red. */
  matchThreshold: number;
  /** Fire an alert if any pickup stays In-Progress for more than 2 hours */
  delayedPickupAlert: boolean;
  /** Fire an alert when a zone's cumulative collected weight exceeds 1 000 kg */
  capacityWarningAlert: boolean;
  /** Where admin receives alert notifications */
  channels: NotificationChannels;
}

interface AlertsConfigContextValue {
  config: AlertsConfig;
  updateConfig: (partial: Partial<AlertsConfig>) => void;
  updateChannels: (partial: Partial<NotificationChannels>) => void;
  resetDefaults: () => void;
}

/* ─── Default ────────────────────────────────────────── */
const DEFAULT_CONFIG: AlertsConfig = {
  matchThreshold: 80,
  delayedPickupAlert: true,
  capacityWarningAlert: true,
  channels: {
    dashboardToast: true,
    email: false,
    browserPush: false,
  },
};

/* ─── Context ────────────────────────────────────────── */
const AlertsConfigContext = createContext<AlertsConfigContextValue | null>(null);

const LS_KEY = "recyclehub_alerts_config";

export function AlertsConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AlertsConfig>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback((partial: Partial<AlertsConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateChannels = useCallback((partial: Partial<NotificationChannels>) => {
    setConfig((prev) => ({
      ...prev,
      channels: { ...prev.channels, ...partial },
    }));
  }, []);

  const resetDefaults = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  return (
    <AlertsConfigContext.Provider value={{ config, updateConfig, updateChannels, resetDefaults }}>
      {children}
    </AlertsConfigContext.Provider>
  );
}

export function useAlertsConfig() {
  const ctx = useContext(AlertsConfigContext);
  if (!ctx) throw new Error("useAlertsConfig must be used within AlertsConfigProvider");
  return ctx;
}

'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

type Bronze = 'Bronze';
type Silver = 'Silver';
type Gold = 'Gold';
type Platinum = 'Platinum';

export type Tier = Bronze | Silver | Gold | Platinum;

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
  date: Date;
}

interface WalletState {
  balance: number;
  lifetimeEarned: number;
  tier: Tier;
  transactions: WalletTransaction[];
}

interface WalletContextType extends WalletState {
  addPoints: (amount: number, description: string) => void;
  spendPoints: (amount: number, description: string) => boolean;
  getProgressToNextTier: () => { current: number; required: number; percentage: number; nextTier: Tier | null };
}

const WalletContext = createContext<WalletContextType | null>(null);

const TIER_THRESHOLDS = {
  Silver: 1000,
  Gold: 5000,
  Platinum: 10000,
};

function calculateTier(lifetimePoints: number): Tier {
  if (lifetimePoints >= TIER_THRESHOLDS.Platinum) return 'Platinum';
  if (lifetimePoints >= TIER_THRESHOLDS.Gold) return 'Gold';
  if (lifetimePoints >= TIER_THRESHOLDS.Silver) return 'Silver';
  return 'Bronze';
}

function getNextTierTarget(currentTier: Tier): { nextTier: Tier | null; required: number } {
  switch (currentTier) {
    case 'Bronze': return { nextTier: 'Silver', required: TIER_THRESHOLDS.Silver };
    case 'Silver': return { nextTier: 'Gold', required: TIER_THRESHOLDS.Gold };
    case 'Gold': return { nextTier: 'Platinum', required: TIER_THRESHOLDS.Platinum };
    case 'Platinum': return { nextTier: null, required: 0 };
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(() => {
    const saved = localStorage.getItem('recyclehub_wallet');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        transactions: parsed.transactions.map((t: any) => ({ ...t, date: new Date(t.date) }))
      };
    }
    return {
      balance: 450,
      lifetimeEarned: 450,
      tier: 'Bronze',
      transactions: [
        { id: '1', amount: 150, type: 'earned', description: 'Recycled 15 Plastic Bottles', date: new Date(Date.now() - 86400000 * 2) },
        { id: '2', amount: 300, type: 'earned', description: 'Recycled 10 Glass Bottles', date: new Date(Date.now() - 86400000) },
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('recyclehub_wallet', JSON.stringify(state));
  }, [state]);

  const addPoints = (amount: number, description: string) => {
    setState(prev => {
      const newLifetime = prev.lifetimeEarned + amount;
      const newTier = calculateTier(newLifetime);
      
      if (newTier !== prev.tier) {
        toast.success(`🎉 Congratulations! You've reached ${newTier} Tier!`);
      } else {
        toast.success(`+${amount} points: ${description}`);
      }

      return {
        balance: prev.balance + amount,
        lifetimeEarned: newLifetime,
        tier: newTier,
        transactions: [
          {
            id: Date.now().toString(),
            amount,
            type: 'earned',
            description,
            date: new Date()
          },
          ...prev.transactions
        ]
      };
    });
  };

  const spendPoints = (amount: number, description: string) => {
    if (state.balance < amount) {
      toast.error('Not enough points!');
      return false;
    }

    setState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [
        {
          id: Date.now().toString(),
          amount,
          type: 'spent',
          description,
          date: new Date()
        },
        ...prev.transactions
      ]
    }));
    toast.success(`Redeemed ${amount} points for ${description}`);
    return true;
  };

  const getProgressToNextTier = () => {
    const { nextTier, required } = getNextTierTarget(state.tier);
    if (!nextTier) return { current: state.lifetimeEarned, required: state.lifetimeEarned, percentage: 100, nextTier: null };
    
    // Calculate progress within current tier vs next tier
    let currentTierBase = 0;
    if (state.tier === 'Silver') currentTierBase = TIER_THRESHOLDS.Silver;
    if (state.tier === 'Gold') currentTierBase = TIER_THRESHOLDS.Gold;

    const pointsInCurrentTier = state.lifetimeEarned - currentTierBase;
    const pointsNeededForNextTier = required - currentTierBase;
    
    return {
        current: state.lifetimeEarned,
        required,
        percentage: Math.min(100, Math.max(0, (pointsInCurrentTier / pointsNeededForNextTier) * 100)),
        nextTier
    };
  };

  return (
    <WalletContext.Provider value={{ ...state, addPoints, spendPoints, getProgressToNextTier }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}

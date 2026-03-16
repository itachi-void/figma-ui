'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: string;
  citizenName: string;
  driverName?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: 'complaint' | 'inquiry' | 'rating' | 'other';
  rating?: number; // 1 to 5 if it's a rating
  createdAt: Date;
  updatedAt: Date;
}

interface TicketsState {
  tickets: Ticket[];
}

interface TicketsContextType extends TicketsState {
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  submitDriverRating: (driverName: string, citizenName: string, rating: number, review: string) => void;
}

const TicketsContext = createContext<TicketsContextType | null>(null);

const MOCK_TICKETS: Ticket[] = [
  {
    id: 't-101',
    citizenName: 'Ahmed Hassan',
    driverName: 'Mohamed Ali',
    subject: 'Driver was very helpful and professional',
    description: 'Great experience today. 5 stars!',
    status: 'resolved',
    priority: 'low',
    category: 'rating',
    rating: 5,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 't-102',
    citizenName: 'Sara Mohamed',
    subject: 'Did not receive points for my last smart bin drop',
    description: 'I dropped 20 bottles but my wallet did not update.',
    status: 'open',
    priority: 'high',
    category: 'complaint',
    createdAt: new Date(Date.now() - 3600000 * 4),
    updatedAt: new Date(Date.now() - 3600000 * 4),
  }
];

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TicketsState>(() => {
    const saved = localStorage.getItem('recyclehub_tickets');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        tickets: parsed.tickets.map((t: any) => ({ 
          ...t, 
          createdAt: new Date(t.createdAt), 
          updatedAt: new Date(t.updatedAt) 
        }))
      };
    }
    return { tickets: MOCK_TICKETS };
  });

  const saveState = (newState: TicketsState) => {
    setState(newState);
    localStorage.setItem('recyclehub_tickets', JSON.stringify(newState));
  };

  const createTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: `t-${Math.floor(Math.random() * 10000)}`,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveState({ tickets: [newTicket, ...state.tickets] });
    toast.success('Ticket submitted successfully!');
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    saveState({
      tickets: state.tickets.map(t => 
        t.id === id ? { ...t, status, updatedAt: new Date() } : t
      )
    });
    toast.info(`Ticket #${id} marked as ${status}`);
  };

  const submitDriverRating = (driverName: string, citizenName: string, rating: number, review: string) => {
    createTicket({
      citizenName,
      driverName,
      subject: `Driver Rating: ${rating} Stars`,
      description: review,
      priority: 'low',
      category: 'rating',
      rating,
    });
    toast.success('Thank you for rating your driver!');
  };

  return (
    <TicketsContext.Provider value={{ ...state, createTicket, updateTicketStatus, submitDriverRating }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (!context) throw new Error('useTickets must be used within TicketsProvider');
  return context;
}

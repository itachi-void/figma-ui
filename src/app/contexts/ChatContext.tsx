import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'driver';
  senderAvatar: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  driverColor: string;
  messages: ChatMessage[];
  lastMessage: string;
  unreadCount: number;
}

interface ChatContextType {
  conversations: ChatConversation[];
  sendMessage: (conversationId: string, text: string) => void;
  totalUnread: number;
}

const ChatContext = createContext<ChatContextType | null>(null);

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1', driverId: 'DRV-001', driverName: 'Ahmed Hassan', driverAvatar: 'AH', driverColor: '#3498DB',
    lastMessage: 'On my way to Tahrir, 10 mins ETA',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'admin', senderName: 'Admin', senderRole: 'admin', senderAvatar: 'A', text: 'Ahmed, please check the Ramsis zone after Tahrir.', timestamp: new Date(Date.now() - 15 * 60000), read: true },
      { id: 'm2', senderId: 'DRV-001', senderName: 'Ahmed Hassan', senderRole: 'driver', senderAvatar: 'AH', text: 'Sure, will do that right after my current stop.', timestamp: new Date(Date.now() - 12 * 60000), read: true },
      { id: 'm3', senderId: 'DRV-001', senderName: 'Ahmed Hassan', senderRole: 'driver', senderAvatar: 'AH', text: 'On my way to Tahrir, 10 mins ETA', timestamp: new Date(Date.now() - 3 * 60000), read: false },
    ],
  },
  {
    id: 'conv-2', driverId: 'DRV-002', driverName: 'Mohamed Ali', driverAvatar: 'MA', driverColor: '#E74C3C',
    lastMessage: 'Completed all stops in Maadi!',
    unreadCount: 1,
    messages: [
      { id: 'm4', senderId: 'DRV-002', senderName: 'Mohamed Ali', senderRole: 'driver', senderAvatar: 'MA', text: 'Starting Maadi route now.', timestamp: new Date(Date.now() - 90 * 60000), read: true },
      { id: 'm5', senderId: 'admin', senderName: 'Admin', senderRole: 'admin', senderAvatar: 'A', text: 'Great! Don\'t forget Road 233 section.', timestamp: new Date(Date.now() - 85 * 60000), read: true },
      { id: 'm6', senderId: 'DRV-002', senderName: 'Mohamed Ali', senderRole: 'driver', senderAvatar: 'MA', text: 'Completed all stops in Maadi!', timestamp: new Date(Date.now() - 10 * 60000), read: false },
    ],
  },
  {
    id: 'conv-3', driverId: 'DRV-003', driverName: 'Omar Khaled', driverAvatar: 'OK', driverColor: '#2ECC71',
    lastMessage: 'Ready for next assignment',
    unreadCount: 0,
    messages: [
      { id: 'm7', senderId: 'DRV-003', senderName: 'Omar Khaled', senderRole: 'driver', senderAvatar: 'OK', text: 'Ready for next assignment', timestamp: new Date(Date.now() - 30 * 60000), read: true },
    ],
  },
  {
    id: 'conv-4', driverId: 'DRV-005', driverName: 'Karim Said', driverAvatar: 'KS', driverColor: '#F39C12',
    lastMessage: 'Vehicle issue – need help',
    unreadCount: 3,
    messages: [
      { id: 'm8', senderId: 'DRV-005', senderName: 'Karim Said', senderRole: 'driver', senderAvatar: 'KS', text: 'My vehicle has a flat tire near Dokki.', timestamp: new Date(Date.now() - 20 * 60000), read: false },
      { id: 'm9', senderId: 'DRV-005', senderName: 'Karim Said', senderRole: 'driver', senderAvatar: 'KS', text: 'Can someone call for assistance?', timestamp: new Date(Date.now() - 18 * 60000), read: false },
      { id: 'm10', senderId: 'DRV-005', senderName: 'Karim Said', senderRole: 'driver', senderAvatar: 'KS', text: 'Vehicle issue – need help', timestamp: new Date(Date.now() - 15 * 60000), read: false },
    ],
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const idRef = useRef(300);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: String(++idRef.current),
      senderId: 'admin',
      senderName: 'Admin',
      senderRole: 'admin',
      senderAvatar: 'A',
      text,
      timestamp: new Date(),
      read: true,
    };
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        messages: [...conv.messages, newMsg],
        lastMessage: text,
        unreadCount: 0,
      };
    }));

    // Simulate driver reply after 3-5 seconds
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      const replies = [
        'Got it, on my way!',
        'Understood, will do.',
        'Thanks for the update.',
        'Roger that, proceeding now.',
        'Acknowledged!',
      ];
      setTimeout(() => {
        const replyText = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg: ChatMessage = {
          id: String(++idRef.current),
          senderId: conv.driverId,
          senderName: conv.driverName,
          senderRole: 'driver',
          senderAvatar: conv.driverAvatar,
          text: replyText,
          timestamp: new Date(),
          read: false,
        };
        setConversations(prev => prev.map(c => {
          if (c.id !== conversationId) return c;
          return { ...c, messages: [...c.messages, replyMsg], lastMessage: replyText, unreadCount: c.unreadCount + 1 };
        }));
      }, 3000 + Math.random() * 2000);
    }
  }, [conversations]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <ChatContext.Provider value={{ conversations, sendMessage, totalUnread }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

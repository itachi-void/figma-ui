'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, ChevronLeft } from 'lucide-react';
import { useChat, ChatConversation } from '../contexts/ChatContext';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h`;
}

export function ChatPanel() {
  const { conversations, sendMessage, totalUnread } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [activeConv, setActiveConv] = useState<ChatConversation | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentConv = activeConv
    ? conversations.find(c => c.id === activeConv.id) ?? null
    : null;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Chat with Drivers"
      >
        <MessageSquare className="w-5 h-5 text-gray-600" />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {totalUnread > 9 ? '9+' : totalUnread}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            style={{ height: 420 }}
          >
            <AnimatePresence mode="wait">
              {!currentConv ? (
                /* Conversation list */
                <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900 text-sm">Driver Chat</span>
                      {totalUnread > 0 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-bold">{totalUnread}</span>
                      )}
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-lg">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                    {conversations.map(conv => (
                      <motion.button
                        key={conv.id}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        onClick={() => setActiveConv(conv)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: conv.driverColor }}
                        >
                          {conv.driverAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">{conv.driverName}</p>
                            <span className="text-xs text-gray-400">{timeAgo(conv.messages[conv.messages.length - 1]?.timestamp ?? new Date())}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* Chat window */
                <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 bg-gray-50">
                    <button onClick={() => setActiveConv(null)} className="p-1.5 hover:bg-gray-200 rounded-lg">
                      <ChevronLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: currentConv.driverColor }}>
                      {currentConv.driverAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{currentConv.driverName}</p>
                      <p className="text-xs text-green-500">● Online</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-lg">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                    {currentConv.messages.map((msg) => {
                      const isAdmin = msg.senderRole === 'admin';
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${isAdmin ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${isAdmin ? 'text-green-100' : 'text-gray-400'}`}>{timeAgo(msg.timestamp)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="px-3 py-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                      />
                      <motion.button
                        onClick={handleSend}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!inputText.trim()}
                        className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

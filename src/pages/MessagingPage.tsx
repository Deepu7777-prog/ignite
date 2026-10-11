import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, User } from 'lucide-react';

export const MessagingPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>('');
  const { user, role, isDemo } = useAuth();

  useEffect(() => {
    loadMessages();
  }, [user?.id, isDemo]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const currentUserId = user?.id || (isDemo ? 'usr_customer_demo' : '');
      if (!currentUserId) {
        setMessages([]);
        return;
      }
      const res = await api.getMessages({ userId: currentUserId });
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const currentSenderId = user?.id || (isDemo ? 'usr_customer_demo' : 'guest_user');
      const receiverTarget = role === 'COOK' ? (isDemo ? 'usr_customer_demo' : 'customer') : 'usr_cook_priya';
      const senderDisplayName = user?.name || (isDemo ? 'Rahul Sharma' : (role === 'COOK' ? 'Home Cook' : 'Customer'));

      const res = await api.sendMessage({
        senderId: currentSenderId,
        receiverId: receiverTarget,
        senderName: senderDisplayName,
        text: newMessage.trim(),
      });

      if (res.success) {
        setMessages((prev) => [...prev, res.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 w-full max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Messages & Direct Chat
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Direct communication between Customer and Home Cooks.
        </p>
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          {loading ? (
            <div className="h-32 bg-slate-200/60 rounded-xl animate-pulse" />
          ) : messages.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No conversations yet. Your order messages will appear here.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${
                  m.senderId === user?.id ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 mb-0.5">{m.senderName}</span>
                <div
                  className={`p-3 rounded-2xl text-xs ${
                    m.senderId === user?.id
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

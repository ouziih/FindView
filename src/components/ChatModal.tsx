import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, User as UserIcon, Phone, CheckCircle2 } from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { chatPartner, setChatPartner, currentUser, chatMessages, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, chatPartner]);

  if (!chatPartner || !currentUser) return null;

  const { recipient, appointment } = chatPartner;

  // Filter messages between currentUser and recipient
  const relevantMessages = chatMessages.filter(msg => 
    (msg.senderId === currentUser.id && msg.recipientId === recipient.id) ||
    (msg.senderId === recipient.id && msg.recipientId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(recipient.id, inputText, appointment?.id);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full h-[600px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={recipient.avatar}
              alt={recipient.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500"
            />
            <div>
              <div className="font-extrabold text-sm flex items-center gap-1.5">
                <span>{recipient.name}</span>
                {recipient.role === 'prestataire' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-500/20" />
                )}
              </div>
              <div className="text-[11px] text-slate-300">
                {recipient.role === 'prestataire' ? (recipient.profession || 'Artisan Prestataire') : 'Client'}
                {recipient.phone && ` • ${recipient.phone}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {recipient.phone && (
              <a
                href={`tel:${recipient.phone}`}
                className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                title="Appeler"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => setChatPartner(null)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Context bar if attached to appointment */}
        {appointment && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-center justify-between">
            <span className="truncate font-semibold">
              Rendez-vous : {appointment.serviceTitle} ({appointment.requestedDate})
            </span>
            <span className="font-bold uppercase text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              {appointment.status}
            </span>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          <div className="text-center my-2">
            <span className="text-[10px] text-slate-400 bg-slate-200/60 px-3 py-1 rounded-full">
              Échange sécurisé & direct sur PrestaLink
            </span>
          </div>

          {relevantMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-1 px-1">
                  {isMe ? 'Vous' : msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    isMe
                      ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Écrivez votre message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0"
            title="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

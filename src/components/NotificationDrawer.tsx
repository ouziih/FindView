import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  CalendarClock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  ShieldAlert
} from 'lucide-react';
import { NotificationType } from '../types';

export const NotificationDrawer: React.FC = () => {
  const { 
    currentUser, 
    notifications, 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification,
    setActiveTab
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const userNotifications = currentUser 
    ? notifications.filter(n => n.recipientId === currentUser.id)
    : [];

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment_new':
        return <Clock className="w-4 h-4 text-stone-700" />;
      case 'appointment_accepted':
        return <CheckCircle2 className="w-4 h-4 text-stone-800" />;
      case 'appointment_rescheduled':
        return <CalendarClock className="w-4 h-4 text-[#B8522E]" />;
      case 'appointment_rejected':
        return <XCircle className="w-4 h-4 text-stone-500" />;
      case 'kyc_approved':
        return <ShieldCheck className="w-4 h-4 text-stone-800" />;
      case 'kyc_rejected':
        return <ShieldAlert className="w-4 h-4 text-[#B8522E]" />;
      default:
        return <Bell className="w-4 h-4 text-stone-700" />;
    }
  };

  const handleClickNotif = (notifId: string) => {
    markNotificationAsRead(notifId);
    if (currentUser?.role === 'prestataire') {
      setActiveTab('pro-dashboard');
    } else if (currentUser?.role === 'client') {
      setActiveTab('appointments');
    } else if (currentUser?.role === 'admin') {
      setActiveTab('admin-dashboard');
    }
    setIsNotificationDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Architectural Dark Slate) */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#18181B] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Centre de Notifications</h2>
              <p className="text-[11px] text-stone-400">
                Mises à jour des rendez-vous et messages
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions bar */}
        {userNotifications.length > 0 && (
          <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-600 font-mono tabular-nums">
              {userNotifications.length} notification{userNotifications.length > 1 ? 's' : ''}
            </span>

            <button
              onClick={markAllNotificationsAsRead}
              className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tout marquer comme lu</span>
            </button>
          </div>
        )}

        {/* Notifications list */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2.5">
          {userNotifications.length > 0 ? (
            userNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleClickNotif(notif.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  notif.read 
                    ? 'bg-white border-stone-200 text-stone-700' 
                    : 'bg-stone-50 border-stone-300 text-stone-900 shadow-xs'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#B8522E]" />
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 shrink-0 mt-0.5 border border-stone-200/60">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 pr-4">
                    <div className="text-xs font-bold text-stone-900 mb-1 leading-snug">
                      {notif.title}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100 text-[10px] text-stone-400 font-mono tabular-nums">
                      <span>{new Date(notif.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notif.id);
                        }}
                        className="text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-800 text-xs">Aucune notification</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Vous recevrez ici les confirmations de rendez-vous et messages.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
          >
            Fermer le volet
          </button>
        </div>
      </div>
    </div>
  );
};

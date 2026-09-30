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
  ShieldAlert, 
  Sparkles 
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
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'appointment_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'appointment_rescheduled':
        return <CalendarClock className="w-4 h-4 text-orange-600" />;
      case 'appointment_rejected':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'kyc_approved':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'kyc_rejected':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Centre de Notifications</h2>
              <p className="text-[11px] text-slate-400">
                Mises à jour des rendez-vous et alertes système
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        {userNotifications.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">
              {userNotifications.length} notification{userNotifications.length > 1 ? 's' : ''}
            </span>

            <button
              onClick={markAllNotificationsAsRead}
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tout marquer comme lu</span>
            </button>
          </div>
        )}

        {/* Notifications list */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {userNotifications.length > 0 ? (
            userNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleClickNotif(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                  notif.read 
                    ? 'bg-white border-slate-200 text-slate-700' 
                    : 'bg-amber-50/50 border-amber-200 text-slate-900 shadow-xs'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-600" />
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 pr-4">
                    <div className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                      {notif.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>{new Date(notif.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notif.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Aucune notification</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Vous recevrez ici les confirmations de rendez-vous, propositions de décalage et messages des prestataires.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Fermer le volet
          </button>
        </div>
      </div>
    </div>
  );
};

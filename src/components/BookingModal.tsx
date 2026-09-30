import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:00 - 11:30',
  '11:30 - 13:00',
  '14:00 - 15:30',
  '15:30 - 17:00',
  '17:00 - 18:30',
  '18:30 - 20:00',
];

export const BookingModal: React.FC = () => {
  const { 
    bookingService, 
    setBookingService, 
    currentUser, 
    requestAppointment, 
    setActiveTab 
  } = useApp();

  // Form State
  const today = new Date().toISOString().split('T')[0];
  const [requestedDate, setRequestedDate] = useState(today);
  const [requestedTimeSlot, setRequestedTimeSlot] = useState(TIME_SLOTS[2]);
  const [clientDescription, setClientDescription] = useState('');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!bookingService) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!requestedDate) {
      setErrorMsg('Veuillez sélectionner une date.');
      return;
    }

    if (!clientDescription.trim() || clientDescription.trim().length < 10) {
      setErrorMsg('Veuillez décrire votre besoin (minimum 10 caractères).');
      return;
    }

    if (!currentUser) {
      if (!clientName.trim() || !clientPhone.trim()) {
        setErrorMsg('Veuillez renseigner votre nom et votre numéro de téléphone.');
        return;
      }
    }

    const appt = requestAppointment({
      serviceId: bookingService.id,
      requestedDate,
      requestedTimeSlot,
      clientDescription,
      address,
      clientName: currentUser ? currentUser.name : clientName,
      clientPhone: currentUser ? currentUser.phone : clientPhone,
      clientEmail: currentUser ? currentUser.email : clientEmail,
    });

    if (appt) {
      setIsSuccess(true);
    }
  };

  const handleFinish = (goToAppointments: boolean) => {
    setBookingService(null);
    setIsSuccess(false);
    if (goToAppointments) {
      setActiveTab('appointments');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Demande de Rendez-vous</h2>
              <p className="text-xs text-amber-100 line-clamp-1">{bookingService.title}</p>
            </div>
          </div>

          <button
            onClick={() => setBookingService(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Demande transmise avec succès !</h3>
            <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
              Une notification a été instantanément envoyée à <strong>{bookingService.providerName}</strong>. 
              Vous serez notifié dès qu’il aura validé, décalé ou répondu à votre demande.
            </p>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <div><strong>Date souhaitée :</strong> {requestedDate} ({requestedTimeSlot})</div>
              <div><strong>Prestataire :</strong> {bookingService.providerName} ({bookingService.providerPhone})</div>
              <div><strong>Statut initial :</strong> <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">En attente de validation</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleFinish(true)}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Voir dans "Mes Rendez-vous"
              </button>
              <button
                onClick={() => handleFinish(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Continuer à explorer
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Provider Recap */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={bookingService.providerAvatar}
                alt={bookingService.providerName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900">{bookingService.providerName}</div>
                <div className="text-slate-500">{bookingService.categoryName} • {bookingService.city}</div>
              </div>
            </div>

            {/* Date & Slot selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Date souhaitée
                </label>
                <input
                  type="date"
                  min={today}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Créneau horaire
                </label>
                <select
                  value={requestedTimeSlot}
                  onChange={(e) => setRequestedTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Need Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                Description de votre besoin / problème
              </label>
              <textarea
                rows={3}
                placeholder="Ex : Bonjour, j'ai besoin d'une fabrication sur mesure de 2m x 1m... / J'aimerais visiter le local pour 40 personnes..."
                value={clientDescription}
                onChange={(e) => setClientDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                required
              />
              <span className="text-[11px] text-slate-400">
                Cette description sera directement notifiée au prestataire pour lui permettre d'étudier votre demande.
              </span>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Lieu ou adresse de la prestation (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex : 28 Cours Gambetta, Lyon ou à l'atelier"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Client Coordinates if not logged in */}
            {!currentUser && (
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Vos coordonnées de contact (visiteur)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Votre nom complet"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Adresse email (pour le suivi)"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Notice */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Engagement sans frais :</strong> Le prestataire validera ou vous proposera un créneau ajusté. 
                Vous pouvez annuler à tout moment depuis votre espace.
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingService(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Envoyer ma demande</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

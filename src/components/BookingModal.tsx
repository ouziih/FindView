import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Architectural Dark Slate) */}
        <div className="bg-[#18181B] p-5 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight text-white">Demande de Rendez-vous</h2>
              <p className="text-xs text-stone-400 truncate max-w-xs">{bookingService.title}</p>
            </div>
          </div>

          <button
            onClick={() => setBookingService(null)}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors text-stone-400 hover:text-white"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center mx-auto border border-stone-200">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Demande transmise avec succès</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
              Une notification a été envoyée à <strong>{bookingService.providerName}</strong> avec la description de votre projet.
            </p>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs text-stone-700 space-y-1">
              <div><strong>Date souhaitée :</strong> {requestedDate} ({requestedTimeSlot})</div>
              <div><strong>Prestataire :</strong> {bookingService.providerName} ({bookingService.providerPhone})</div>
              <div><strong>Statut initial :</strong> <span className="font-semibold text-stone-900">En attente de réponse artisan</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => handleFinish(true)}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-[#B8522E] text-white font-bold text-xs transition-colors"
              >
                Suivre dans "Mes Rendez-vous"
              </button>
              <button
                onClick={() => handleFinish(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
              >
                Continuer la visite
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Provider Recap */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={bookingService.providerAvatar}
                alt=""
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-stone-200"
              />
              <div className="text-xs">
                <div className="font-bold text-stone-900">{bookingService.providerName}</div>
                <div className="text-stone-500">{bookingService.categoryName} · {bookingService.city}</div>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  Date souhaitée *
                </label>
                <input
                  type="date"
                  min={today}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  Créneau horaire *
                </label>
                <select
                  value={requestedTimeSlot}
                  onChange={(e) => setRequestedTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-medium cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Need Description */}
            <div>
              <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                Description de votre besoin / projet *
              </label>
              <textarea
                rows={3}
                placeholder="Ex : Bonjour, nous souhaitons une fabrication sur-mesure de 2m x 1m... / Nous souhaitons visiter l'espace pour 35 personnes..."
                value={clientDescription}
                onChange={(e) => setClientDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900 leading-relaxed"
                required
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Cette précision sera immédiatement transmise au professionnel pour lui permettre de se préparer.
              </span>
            </div>

            {/* Address */}
            <div>
              <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                Lieu ou adresse d'intervention (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex : 28 Cours Gambetta, Lyon ou à l'atelier"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Guest details if visitor */}
            {!currentUser && (
              <div className="pt-2 border-t border-stone-200 space-y-3">
                <span className="font-bold text-stone-800 block">Vos coordonnées de contact :</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Votre nom complet"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Numéro de téléphone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email de suivi"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookingService(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#B8522E] hover:bg-[#A34524] text-white font-bold transition-colors shadow-xs"
              >
                Envoyer ma demande
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

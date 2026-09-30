import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, AppointmentStatus } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  CalendarClock, 
  Search, 
  Check, 
  X,
  FileText,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  UserCheck,
  Inbox,
  ArrowRight
} from 'lucide-react';

type ClientSection = 'all' | 'pending' | 'rescheduled' | 'accepted' | 'rejected' | 'artisans';

export const ClientAppointments: React.FC = () => {
  const { 
    currentUser, 
    appointments, 
    acceptRescheduledAppointment, 
    cancelAppointmentByClient, 
    setChatPartner, 
    users, 
    setActiveTab 
  } = useApp();

  const [currentSection, setCurrentSection] = useState<ClientSection>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [cancellingApptId, setCancellingApptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // User's appointments
  const clientAppts = useMemo(() => {
    return appointments.filter(a => {
      if (currentUser) {
        return a.clientId === currentUser.id;
      }
      return a.clientId.startsWith('guest-') || a.clientId === 'user-client-1';
    });
  }, [appointments, currentUser]);

  // Unique artisans contacted
  const contactedArtisans = useMemo(() => {
    const map = new Map<string, { id: string; name: string; phone: string; whatsapp: string; avatar: string; category: string }>();
    clientAppts.forEach(a => {
      if (!map.has(a.providerId)) {
        map.set(a.providerId, {
          id: a.providerId,
          name: a.providerName,
          phone: a.providerPhone,
          whatsapp: a.providerWhatsapp,
          avatar: a.providerAvatar,
          category: a.serviceCategory,
        });
      }
    });
    return Array.from(map.values());
  }, [clientAppts]);

  // Filtered by section
  const filteredAppts = useMemo(() => {
    return clientAppts.filter(a => {
      if (currentSection !== 'all' && a.status !== currentSection) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.serviceTitle.toLowerCase().includes(q) ||
          a.providerName.toLowerCase().includes(q) ||
          a.clientDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [clientAppts, currentSection, searchQuery]);

  const handleOpenChat = (appt: Appointment) => {
    const provider = users.find(u => u.id === appt.providerId);
    if (provider) {
      setChatPartner({ recipient: provider, appointment: appt });
    }
  };

  const openWhatsApp = (phone: string, providerName: string, serviceTitle: string) => {
    const cleanNumber = phone.replace(/\D/g, '');
    const text = encodeURIComponent(`Bonjour ${providerName}, je vous contacte concernant mon rendez-vous pour "${serviceTitle}".`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleConfirmCancel = () => {
    if (cancellingApptId) {
      cancelAppointmentByClient(cancellingApptId, cancelReason);
      setCancellingApptId(null);
      setCancelReason('');
    }
  };

  const pendingCount = clientAppts.filter(a => a.status === 'pending').length;
  const rescheduledCount = clientAppts.filter(a => a.status === 'rescheduled').length;
  const acceptedCount = clientAppts.filter(a => a.status === 'accepted').length;
  const rejectedCount = clientAppts.filter(a => a.status === 'rejected').length;

  const SECTION_TITLES: Record<ClientSection, string> = {
    all: 'Toutes mes Demandes de Rendez-vous',
    pending: 'Demandes en Attente de Réponse',
    rescheduled: 'Horaires Décalés (Action requise de votre part)',
    accepted: 'Rendez-vous Confirmés & À Venir',
    rejected: 'Demandes Refusées (avec explications)',
    artisans: 'Mes Artisans & Prestataires Favoris',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* CLIENT SIDEBAR: ORGANISATION DES USE CASES DU CLIENT                      */}
      {/* ========================================================================= */}
      <aside 
        className={`bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200 flex flex-col justify-between shrink-0 z-20 ${
          sidebarCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'hidden' : 'flex'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-white truncate">
                  Espace Client
                </div>
                <div className="text-[10px] text-blue-400 font-semibold truncate">
                  {currentUser?.name || 'Visiteur Connecté'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
              title={sidebarCollapsed ? 'Développer la barre' : 'Réduire la barre'}
              aria-label="Basculer la barre latérale"
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Urgent Rescheduled Alert */}
          {!sidebarCollapsed && rescheduledCount > 0 && (
            <div 
              onClick={() => setCurrentSection('rescheduled')}
              className="p-3 mx-3 my-3 rounded-xl bg-orange-950/40 border border-orange-700/60 text-xs cursor-pointer hover:bg-orange-900/40 transition-colors"
            >
              <div className="flex items-center justify-between font-bold text-orange-400 mb-1">
                <span>Proposition reçue !</span>
                <span className="font-mono tabular-nums bg-orange-600 text-white px-1.5 py-0.2 rounded text-[10px] animate-pulse">
                  {rescheduledCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Un artisan vous propose un nouvel horaire. Validez en 1 clic.
              </p>
            </div>
          )}

          {/* Nav Categories */}
          <nav className="p-3 space-y-6">
            
            {/* GROUP 1: STATUTS DES RENDEZ-VOUS */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Mes Rendez-vous
                </div>
              )}
              <div className="space-y-1">
                {/* Tous */}
                <button
                  onClick={() => setCurrentSection('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Inbox className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Toutes les demandes</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-mono tabular-nums text-slate-400">{clientAppts.length}</span>
                  )}
                </button>

                {/* En attente */}
                <button
                  onClick={() => setCurrentSection('pending')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'pending'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Clock className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>En attente artisan</span>}
                  </div>
                  {pendingCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                      currentSection === 'pending' ? 'bg-white text-blue-800' : 'bg-amber-500 text-slate-900 font-bold'
                    }`}>
                      {pendingCount}
                    </span>
                  )}
                </button>

                {/* Décalés (Action requise) */}
                <button
                  onClick={() => setCurrentSection('rescheduled')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'rescheduled'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CalendarClock className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Horaires décalés</span>}
                  </div>
                  {rescheduledCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-500 text-white animate-pulse">
                      {rescheduledCount}
                    </span>
                  )}
                </button>

                {/* Validés */}
                <button
                  onClick={() => setCurrentSection('accepted')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'accepted'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Validés & À venir</span>}
                  </div>
                  {!sidebarCollapsed && acceptedCount > 0 && (
                    <span className="text-[10px] font-mono tabular-nums text-emerald-400 font-bold">{acceptedCount}</span>
                  )}
                </button>

                {/* Refusés */}
                <button
                  onClick={() => setCurrentSection('rejected')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'rejected'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <XCircle className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Demandes refusées</span>}
                  </div>
                  {!sidebarCollapsed && rejectedCount > 0 && (
                    <span className="text-[10px] font-mono tabular-nums text-rose-400">{rejectedCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* GROUP 2: CARNET D'ARTISANS */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Contacts & Échanges
                </div>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentSection('artisans')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'artisans'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <UserCheck className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Mes Artisans</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-mono tabular-nums text-slate-400">{contactedArtisans.length}</span>
                  )}
                </button>
              </div>
            </div>

          </nav>
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('home')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-center transition-colors flex items-center justify-center gap-1.5 text-xs"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Explorer d'autres services</span>
            </button>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT: CLIENT ACTIVE USE CASE                                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Breadcrumb */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Mon Espace Client</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-extrabold text-slate-900 text-sm">
              {SECTION_TITLES[currentSection]}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('home')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Prendre un nouveau rendez-vous</span>
          </button>
        </header>

        {/* Content Body */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* ===================================================================== */}
          {/* USE CASE: APPOINTMENTS LIST                                           */}
          {/* ===================================================================== */}
          {currentSection !== 'artisans' ? (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-xs">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  placeholder="Rechercher un artisan, un service, un besoin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
                />
              </div>

              {/* Cards List */}
              {filteredAppts.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppts.map(appt => (
                    <div
                      key={appt.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                    >
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={appt.providerAvatar}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500"
                          />
                          <div>
                            <div className="text-xs text-slate-500 font-semibold">{appt.serviceCategory}</div>
                            <h3 className="font-extrabold text-sm text-slate-900">{appt.serviceTitle}</h3>
                            <div className="text-xs text-slate-700">
                              Prestataire : <span className="font-bold text-amber-900">{appt.providerName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div>
                          {appt.status === 'pending' && (
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 animate-spin" /> En attente de validation
                            </span>
                          )}
                          {appt.status === 'accepted' && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Rendez-vous Validé
                            </span>
                          )}
                          {appt.status === 'rescheduled' && (
                            <span className="text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                              <CalendarClock className="w-3.5 h-3.5" /> Nouvelle date proposée !
                            </span>
                          )}
                          {appt.status === 'rejected' && (
                            <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5" /> Demande Refusée
                            </span>
                          )}
                          {appt.status === 'cancelled' && (
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                              Annulé par vos soins
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-semibold block mb-0.5">Date convenue</span>
                          <div className="font-extrabold text-slate-900 text-sm">{appt.requestedDate}</div>
                          <div className="text-slate-600 font-mono tabular-nums">{appt.requestedTimeSlot}</div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                          <span className="text-slate-400 font-semibold block mb-0.5">Votre besoin spécifié</span>
                          <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60">
                            "{appt.clientDescription}"
                          </p>
                        </div>
                      </div>

                      {/* PROPOSAL BANNER: If Rescheduled by Artisan */}
                      {appt.status === 'rescheduled' && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-xs space-y-2">
                          <div className="font-extrabold text-orange-950 flex items-center gap-2 text-sm">
                            <CalendarClock className="w-4 h-4 text-orange-600" />
                            <span>L'artisan vous propose un nouveau créneau :</span>
                          </div>
                          <div className="font-bold text-orange-900 text-sm">
                            👉 {appt.proposedNewDate} ({appt.proposedNewTimeSlot || appt.requestedTimeSlot})
                          </div>
                          <div className="p-2.5 bg-white/80 rounded-lg border border-orange-200/80 text-orange-900 italic">
                            <strong>Explication de l'artisan :</strong> "{appt.statusReason || 'Contrainte d’emploi du temps'}"
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => acceptRescheduledAppointment(appt.id)}
                              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Valider ce nouveau créneau</span>
                            </button>
                            <button
                              onClick={() => setCancellingApptId(appt.id)}
                              className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                            >
                              Refuser & Annuler
                            </button>
                          </div>
                        </div>
                      )}

                      {/* REFUSAL REASON BANNER: If Rejected */}
                      {appt.status === 'rejected' && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                            <span>Motif du refus communiqué par le prestataire :</span>
                          </div>
                          <p className="italic bg-white p-2 rounded-lg border border-rose-200 text-rose-900">
                            "{appt.statusReason || 'Prestataire non disponible pour ce type d’intervention'}"
                          </p>
                        </div>
                      )}

                      {/* Actions Bar */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openWhatsApp(appt.providerWhatsapp, appt.providerName, appt.serviceTitle)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold flex items-center gap-1.5"
                          >
                            <span className="text-[10px] bg-emerald-200 px-1 py-0.2 rounded font-mono">WA</span>
                            <span>WhatsApp</span>
                          </button>

                          <a
                            href={`tel:${appt.providerPhone}`}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                            title="Téléphoner"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleOpenChat(appt)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                            title="Message direct"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {['pending', 'accepted'].includes(appt.status) && (
                          <button
                            onClick={() => setCancellingApptId(appt.id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                          >
                            Annuler ce rendez-vous
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm">Aucun rendez-vous dans cette section</h3>
                  <p className="text-slate-400 text-xs mt-1">Vos demandes s'afficheront ici en temps réel.</p>
                </div>
              )}
            </div>
          ) : (
            /* ===================================================================== */
            /* USE CASE: MES ARTISANS & PRESTATAIRES CONTACTÉS                       */
            /* ===================================================================== */
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Vos Artisans & Prestataires Référents</h3>
                <p className="text-xs text-slate-500">Contactez directement les artisans avec lesquels vous avez déjà échangé.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {contactedArtisans.map(artisan => (
                  <div key={artisan.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={artisan.avatar} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{artisan.name}</div>
                        <div className="text-[11px] text-slate-500">{artisan.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openWhatsApp(artisan.whatsapp, artisan.name, artisan.category)}
                        className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold"
                        title="WhatsApp"
                      >
                        WA
                      </button>
                      <a
                        href={`tel:${artisan.phone}`}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        title="Appeler"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Cancel Modal */}
      {cancellingApptId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Annuler ce rendez-vous ?</h3>
            <p className="text-slate-600">Le prestataire sera automatiquement notifié de votre annulation.</p>
            <textarea
              rows={2}
              placeholder="Motif (ex: empêchement, besoin déjà résolu...)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setCancellingApptId(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
                Retour
              </button>
              <button onClick={handleConfirmCancel} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold">
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

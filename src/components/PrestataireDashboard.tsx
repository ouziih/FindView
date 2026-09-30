import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, Service, AppointmentStatus } from '../types';
import { 
  Inbox, 
  Calendar as CalendarIcon, 
  Layers, 
  ShieldCheck, 
  ShieldAlert, 
  BarChart3, 
  Plus, 
  Check, 
  X, 
  CalendarClock, 
  Clock, 
  Phone, 
  MessageCircle, 
  Star, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle, 
  Building, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  Search, 
  Palette, 
  Crown, 
  ArrowUpRight, 
  ChevronDown, 
  PanelLeftClose, 
  PanelLeft,
  CalendarCheck,
  UserCheck,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { CreateServiceModal } from './CreateServiceModal';

type ProSection = 
  | 'inbox'         // Boîte de réception des RDV
  | 'schedule'      // Planning & Calendrier
  | 'services'      // Mes Prestations & Services
  | 'branding'      // Identité & Customisation
  | 'kyc'           // Conformité KYC & Documents
  | 'analytics'     // Statistiques d'activité
  | 'subscription'; // Formule Abonnement

export const PrestataireDashboard: React.FC = () => {
  const { 
    currentUser, 
    services, 
    appointments, 
    respondToAppointment, 
    toggleServiceActive, 
    deleteService, 
    setChatPartner, 
    users 
  } = useApp();

  // Sidebar navigation state
  const [currentSection, setCurrentSection] = useState<ProSection>('inbox');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filters within sections
  const [inboxStatusFilter, setInboxStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for Actions
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Appointment response modals
  const [acceptingAppt, setAcceptingAppt] = useState<Appointment | null>(null);
  const [acceptNote, setAcceptNote] = useState('');

  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('14:00 - 15:30');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const [rejectingAppt, setRejectingAppt] = useState<Appointment | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser || currentUser.role !== 'prestataire') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-xs">
          <Building className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Espace réservé aux Prestataires</h2>
          <p className="text-xs text-slate-500 mb-4">
            Connectez-vous en tant que prestataire ou utilisez la barre de démo pour tester ce dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Provider Data
  const providerServices = services.filter(s => s.providerId === currentUser.id);
  const providerAppts = appointments.filter(a => a.providerId === currentUser.id);
  const pendingRequests = providerAppts.filter(a => a.status === 'pending');
  const acceptedRequests = providerAppts.filter(a => a.status === 'accepted');

  // Filtered inbox requests
  const filteredAppts = useMemo(() => {
    return providerAppts.filter(appt => {
      if (inboxStatusFilter !== 'all' && appt.status !== inboxStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          appt.clientName.toLowerCase().includes(q) ||
          appt.serviceTitle.toLowerCase().includes(q) ||
          appt.clientDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [providerAppts, inboxStatusFilter, searchQuery]);

  // Handlers
  const handleConfirmAccept = () => {
    if (acceptingAppt) {
      respondToAppointment(
        acceptingAppt.id, 
        'accepted', 
        acceptNote.trim() || 'Rendez-vous validé ! Je vous recontacte si nécessaire avant la prestation.'
      );
      setAcceptingAppt(null);
      setAcceptNote('');
    }
  };

  const handleConfirmReschedule = () => {
    setErrorMsg('');
    if (!newDate) {
      setErrorMsg('Veuillez indiquer la nouvelle date proposée.');
      return;
    }
    if (!rescheduleReason.trim()) {
      setErrorMsg('Veuillez préciser le motif du décalage (obligatoire pour informer le client).');
      return;
    }
    if (reschedulingAppt) {
      respondToAppointment(
        reschedulingAppt.id, 
        'rescheduled', 
        rescheduleReason, 
        newDate, 
        newTimeSlot
      );
      setReschedulingAppt(null);
      setNewDate('');
      setRescheduleReason('');
    }
  };

  const handleConfirmReject = () => {
    setErrorMsg('');
    if (!rejectReason.trim()) {
      setErrorMsg('Veuillez indiquer la raison du refus (obligatoire).');
      return;
    }
    if (rejectingAppt) {
      respondToAppointment(rejectingAppt.id, 'rejected', rejectReason);
      setRejectingAppt(null);
      setRejectReason('');
    }
  };

  const openWhatsApp = (phone: string, clientName: string, serviceTitle: string) => {
    const cleanNumber = phone.replace(/\D/g, '');
    const text = encodeURIComponent(`Bonjour ${clientName}, je suis ${currentUser.name} de PrestaLink à propos de votre rendez-vous pour "${serviceTitle}".`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const startChat = (appt: Appointment) => {
    const clientUser = users.find(u => u.id === appt.clientId) || {
      id: appt.clientId,
      name: appt.clientName,
      email: appt.clientEmail,
      phone: appt.clientPhone,
      role: 'client' as const,
      avatar: appt.clientAvatar,
      city: 'Client',
      isActive: true,
      createdAt: appt.createdAt,
    };
    setChatPartner({ recipient: clientUser, appointment: appt });
  };

  // Section titles dictionary for breadcrumb
  const SECTION_TITLES: Record<ProSection, string> = {
    inbox: 'Demandes de Rendez-vous',
    schedule: 'Planning & Calendrier des Interventions',
    services: 'Gestion des Prestations & Tarifs',
    branding: 'Identité Visuelle & Badges de Marque',
    kyc: 'Conformité Légale & Dossier KYC',
    analytics: 'Statistiques & Performance',
    subscription: 'Formule & Abonnement Pro (Oral)',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* SIDEBAR: ORGANISATION DES USE CASES DU PRESTATAIRE                        */}
      {/* ========================================================================= */}
      <aside 
        className={`bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200 flex flex-col justify-between shrink-0 z-20 ${
          sidebarCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        <div>
          {/* Pro Workspace Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'hidden' : 'flex'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Building className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-white truncate">
                  {currentUser.businessName || currentUser.name}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold truncate flex items-center gap-1">
                  <span>{currentUser.profession || 'Prestataire'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
              title={sidebarCollapsed ? 'Développer la barre latérale' : 'Réduire la barre'}
              aria-label="Basculer la barre latérale"
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* KYC Status Pill inside sidebar */}
          {!sidebarCollapsed && (
            <div className="p-3 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 font-medium">Statut d'agrément</span>
                {currentUser.kycStatus === 'approved' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> Validé
                  </span>
                ) : currentUser.kycStatus === 'pending' ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3 animate-spin" /> En attente
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold text-[10px]">Rejeté</span>
                )}
              </div>
              <p className="text-slate-400 text-[10px] leading-tight">
                {currentUser.kycStatus === 'approved' 
                  ? 'Vos prestations sont certifiées et visibles publiquement.'
                  : 'Dossier transmis à l’administrateur.'}
              </p>
            </div>
          )}

          {/* Navigation Groups */}
          <nav className="p-3 space-y-6">
            
            {/* GROUP 1: FLUX RENDEZ-VOUS & CLIENTS */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Flux Clients & Rendez-vous
                </div>
              )}
              <div className="space-y-1">
                {/* Inbox RDV */}
                <button
                  onClick={() => setCurrentSection('inbox')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'inbox'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="Demandes de Rendez-vous"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Inbox className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Demandes de RDV</span>}
                  </div>
                  {pendingRequests.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      currentSection === 'inbox' ? 'bg-white text-amber-700' : 'bg-rose-500 text-white animate-pulse'
                    }`}>
                      {pendingRequests.length}
                    </span>
                  )}
                </button>

                {/* Planning & Calendrier */}
                <button
                  onClick={() => setCurrentSection('schedule')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'schedule'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="Planning des interventions"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CalendarIcon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Planning Interventions</span>}
                  </div>
                  {!sidebarCollapsed && acceptedRequests.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {acceptedRequests.length} prévus
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* GROUP 2: GESTION DE L'OFFRE & CATALOGUE */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Offres & Services
                </div>
              )}
              <div className="space-y-1">
                {/* Services */}
                <button
                  onClick={() => setCurrentSection('services')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'services'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="Mes Prestations & Tarifs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Layers className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Mes Prestations</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {providerServices.length}
                    </span>
                  )}
                </button>

                {/* Custom Branding & Badges */}
                <button
                  onClick={() => setCurrentSection('branding')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'branding'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="Identité & Badges de Marque"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Palette className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Identité & Badges</span>}
                  </div>
                </button>
              </div>
            </div>

            {/* GROUP 3: CONFORMITÉ & RENTABILITÉ */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Pilotage & Légal
                </div>
              )}
              <div className="space-y-1">
                {/* KYC Dossier */}
                <button
                  onClick={() => setCurrentSection('kyc')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'kyc'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="Conformité KYC"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Dossier KYC & Kbis</span>}
                  </div>
                </button>

                {/* Statistiques */}
                <button
                  onClick={() => setCurrentSection('analytics')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'analytics'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="Statistiques de conversion"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <BarChart3 className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Performance & Vues</span>}
                  </div>
                </button>

                {/* Formule Abonnement Pro */}
                <button
                  onClick={() => setCurrentSection('subscription')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'subscription'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-300 hover:bg-purple-900/40 hover:text-white'
                  }`}
                  title="Formule Abonnement Pro (Oral)"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Crown className="w-4 h-4 shrink-0 text-amber-300" />
                    {!sidebarCollapsed && <span>Mon Abonnement Pro</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded font-bold uppercase">
                      Oral
                    </span>
                  )}
                </button>
              </div>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
            <div className="flex items-center gap-2 mb-1">
              <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-500" />
              <div className="truncate">
                <div className="font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT: CONTENT DEDICATED TO ACTIVE USE CASE                       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Contextual Breadcrumb & Actions Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Espace Prestataire</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-extrabold text-slate-900 text-sm">
              {SECTION_TITLES[currentSection]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action: New Service */}
            <button
              onClick={() => {
                setEditingService(null);
                setIsCreateModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une Prestation</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* ===================================================================== */}
          {/* SECTION 1: INBOX RENDEZ-VOUS (Validation, Décalage, Refus)            */}
          {/* ===================================================================== */}
          {currentSection === 'inbox' && (
            <div className="space-y-4">
              
              {/* Top Controls: Search + Status Filter Segment */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par client, service, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                {/* Filter Segments */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: 'all', label: 'Tous', count: providerAppts.length },
                    { id: 'pending', label: 'À traiter (Urgent)', count: pendingRequests.length },
                    { id: 'accepted', label: 'Validés', count: acceptedRequests.length },
                    { id: 'rescheduled', label: 'Décalés', count: providerAppts.filter(a => a.status === 'rescheduled').length },
                    { id: 'rejected', label: 'Refusés', count: providerAppts.filter(a => a.status === 'rejected').length },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setInboxStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        inboxStatusFilter === tab.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-md ${
                        inboxStatusFilter === tab.id ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demandes List */}
              {filteredAppts.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppts.map(appt => (
                    <div
                      key={appt.id}
                      className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                        appt.status === 'pending'
                          ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/10'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Top Row: Client & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={appt.clientAvatar}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                              <span>{appt.clientName}</span>
                              <span className="text-slate-400 text-xs font-normal">·</span>
                              <span className="text-xs text-amber-700 font-semibold">{appt.serviceTitle}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono tabular-nums">
                              Reçu le {new Date(appt.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>

                        {/* Status Label (Zero-Pill discipline: unboxed clean badge) */}
                        <div>
                          {appt.status === 'pending' && (
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> Action requise
                            </span>
                          )}
                          {appt.status === 'accepted' && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> Validé
                            </span>
                          )}
                          {appt.status === 'rescheduled' && (
                            <span className="text-xs font-bold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <CalendarClock className="w-3.5 h-3.5" /> Décalé (Attente client)
                            </span>
                          )}
                          {appt.status === 'rejected' && (
                            <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <X className="w-3.5 h-3.5" /> Refusé
                            </span>
                          )}
                          {appt.status === 'cancelled' && (
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                              Annulé par le client
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Details & Client Need (Exact user specification) */}
                      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-semibold block mb-1">Créneau souhaité</span>
                          <div className="font-extrabold text-slate-900 text-sm">{appt.requestedDate}</div>
                          <div className="text-slate-600 font-mono tabular-nums">{appt.requestedTimeSlot}</div>
                          {appt.address && (
                            <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{appt.address}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                          <span className="text-slate-400 font-semibold block mb-1">
                            Description du besoin transmise par le client :
                          </span>
                          <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                            "{appt.clientDescription}"
                          </p>
                        </div>
                      </div>

                      {/* If rescheduled: display proposed date & reason */}
                      {appt.status === 'rescheduled' && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 mb-3 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <CalendarClock className="w-3.5 h-3.5 text-orange-700" />
                            <span>Votre proposition de décalage : {appt.proposedNewDate} ({appt.proposedNewTimeSlot})</span>
                          </div>
                          <div className="italic text-orange-900">
                            Raison notifiée au client : "{appt.statusReason}"
                          </div>
                        </div>
                      )}

                      {/* If rejected: display reason */}
                      {appt.status === 'rejected' && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 mb-3">
                          <strong>Motif de refus notifié au client :</strong> "{appt.statusReason}"
                        </div>
                      )}

                      {/* Bottom Action Bar: WhatsApp, Phone, Chat + Decision buttons */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openWhatsApp(appt.clientPhone, appt.clientName, appt.serviceTitle)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <span className="text-[10px] bg-emerald-200 px-1 py-0.2 rounded font-mono">WA</span>
                            <span>WhatsApp ({appt.clientPhone})</span>
                          </button>

                          <a
                            href={`tel:${appt.clientPhone}`}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            title="Téléphoner"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => startChat(appt)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            title="Messagerie interne"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Interactive Workflow Buttons */}
                        {appt.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            {/* Décaler */}
                            <button
                              onClick={() => {
                                setReschedulingAppt(appt);
                                setNewDate(appt.requestedDate);
                                setNewTimeSlot(appt.requestedTimeSlot);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold border border-orange-200 transition-colors flex items-center gap-1.5"
                            >
                              <CalendarClock className="w-3.5 h-3.5" />
                              <span>Décaler</span>
                            </button>

                            {/* Refuser */}
                            <button
                              onClick={() => setRejectingAppt(appt)}
                              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 transition-colors flex items-center gap-1.5"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Refuser</span>
                            </button>

                            {/* Valider */}
                            <button
                              onClick={() => setAcceptingAppt(appt)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Valider le RDV</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium text-xs">
                            Traitement terminé
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm">Aucune demande dans ce filtre</h3>
                  <p className="text-slate-400 text-xs mt-1">Vos prochaines demandes de rendez-vous apparaîtront ici.</p>
                </div>
              )}

            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION 2: PLANNING & CALENDRIER                                      */}
          {/* ===================================================================== */}
          {currentSection === 'schedule' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Agenda des Interventions Confirmées</h3>
                    <p className="text-xs text-slate-500">Visualisation chronologique de vos chantiers et rendez-vous validés.</p>
                  </div>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200">
                    {acceptedRequests.length} intervention{acceptedRequests.length > 1 ? 's' : ''} au planning
                  </span>
                </div>

                {acceptedRequests.length > 0 ? (
                  <div className="space-y-3">
                    {acceptedRequests.map(item => (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-amber-100 text-amber-900 text-center min-w-[70px]">
                            <div className="text-[10px] font-bold uppercase">{new Date(item.requestedDate).toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                            <div className="text-base font-extrabold">{new Date(item.requestedDate).getDate()}</div>
                            <div className="text-[10px]">{new Date(item.requestedDate).toLocaleDateString('fr-FR', { month: 'short' })}</div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{item.serviceTitle}</div>
                            <div className="text-xs text-slate-600 font-medium">
                              Client : {item.clientName} ({item.clientPhone})
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{item.requestedTimeSlot}</span>
                              <span>•</span>
                              <span>{item.address || 'Sur site'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openWhatsApp(item.clientPhone, item.clientName, item.serviceTitle)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs"
                          >
                            WhatsApp
                          </button>
                          <a
                            href={`tel:${item.clientPhone}`}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Aucune intervention validée pour le moment. Validez vos demandes en attente pour les inscrire à votre planning.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION 3: SERVICES & CATALOGUE                                       */}
          {/* ===================================================================== */}
          {currentSection === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Catalogue de vos Prestations</h3>
                  <p className="text-xs text-slate-500">Ajoutez, activez/désactivez ou personnalisez les services affichés aux clients.</p>
                </div>
                <button
                  onClick={() => { setEditingService(null); setIsCreateModalOpen(true); }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providerServices.map(srv => (
                  <div key={srv.id} className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    srv.isActive ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}>
                    <div>
                      <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <img src={srv.images[0]} alt={srv.title} className="w-full h-full object-cover" />
                        {srv.customBranding?.badgeText && (
                          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${srv.customBranding.badgeColor || 'bg-amber-600 text-white'}`}>
                            {srv.customBranding.badgeText}
                          </span>
                        )}
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          srv.isActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {srv.isActive ? 'Visible' : 'Masqué'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-amber-700">{srv.categoryName}</span>
                        <span className="font-extrabold text-slate-900 font-mono tabular-nums">
                          {srv.price} {srv.currency} ({srv.pricingType})
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mb-1">{srv.title}</h4>
                      <p className="text-slate-600 text-xs line-clamp-2 mb-3">{srv.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => toggleServiceActive(srv.id)}
                        className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900"
                      >
                        {srv.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                            <span>En ligne</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                            <span>Désactivé</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingService(srv); setIsCreateModalOpen(true); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer définitivement la prestation "${srv.title}" ?`)) {
                              deleteService(srv.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION 4: IDENTITÉ VISUELLE & BRANDING                              */}
          {/* ===================================================================== */}
          {currentSection === 'branding' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personnalisation & Identité de Marque</h3>
                <p className="text-xs text-slate-500">
                  Définissez l'image de votre atelier auprès des visiteurs et clients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block">Profil Pro Public</span>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Raison sociale / Nom d'atelier</label>
                    <input
                      type="text"
                      defaultValue={currentUser.businessName}
                      disabled
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Spécialité affichée</label>
                    <input
                      type="text"
                      defaultValue={currentUser.profession}
                      disabled
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                  <span className="font-bold text-amber-900 block">Badges de Confiance Personnalisables</span>
                  <p className="text-slate-600 leading-relaxed">
                    À la création ou modification de chaque prestation, vous pouvez assigner un badge d'accroche personnalisé 
                    (ex : <em>« Artisan Certifié »</em>, <em>« Coup de Cœur »</em>, <em>« Dispo Immédiate »</em>) avec la couleur de votre charte graphique.
                  </p>
                  <button
                    onClick={() => { setEditingService(null); setIsCreateModalOpen(true); }}
                    className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700"
                  >
                    Personnaliser un service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION 5: DOSSIER KYC & CONFORMITÉ LÉGALE                             */}
          {/* ===================================================================== */}
          {currentSection === 'kyc' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Dossier de Conformité & Agrément KYC</h3>
                <p className="text-slate-500">
                  Transparence et sécurité : justificatifs officiels examinés par l'administration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">État du dossier professionnel</span>
                  {currentUser.kycStatus === 'approved' ? (
                    <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Agréé & Conforme
                    </span>
                  ) : currentUser.kycStatus === 'pending' ? (
                    <span className="px-3 py-1 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-3.5 h-3.5" /> En cours d'audit par l'administrateur
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full font-bold bg-rose-100 text-rose-800">
                      Rejeté : {currentUser.kycRejectionReason}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-0.5">Pièce d'Identité</span>
                    <span className="font-mono text-slate-800 font-semibold">{currentUser.kycDocs?.idCardName || 'CNI_fournie.pdf'}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-0.5">Extrait Kbis / Chambre des Métiers</span>
                    <span className="font-mono text-slate-800 font-semibold">{currentUser.kycDocs?.tradeRegisterName || 'Immatriculation_2025.pdf'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION 6: STATISTIQUES & PERFORMANCE                                 */}
          {/* ===================================================================== */}
          {currentSection === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Vues de profil</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {providerServices.reduce((acc, s) => acc + s.viewCount, 0)}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">+18% ce mois</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Demandes reçues</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{providerAppts.length}</div>
                  <span className="text-[11px] text-slate-500">Mises en relation</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Note Moyenne</span>
                  <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-1 font-mono tabular-nums">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    {(currentUser.rating || 5.0).toFixed(1)}
                  </div>
                  <span className="text-[11px] text-slate-500">{currentUser.reviewCount || 12} avis clients</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Taux de réponse</span>
                  <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">98%</div>
                  <span className="text-[11px] text-slate-500">&lt; 2 heures</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION 7: FORMULE ABONNEMENT PRO (Spécifique Soutenance Orale)       */}
          {/* ===================================================================== */}
          {currentSection === 'subscription' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-200 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                    Modèle Économique Prévu pour l'Oral
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Formule d'Abonnement Prestataire Actuelle</h3>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-purple-900 uppercase">Pack Actif (Simulation)</div>
                  <div className="text-2xl font-extrabold text-slate-900 my-1 font-mono tabular-nums">
                    29 € <span className="text-xs font-normal text-slate-500">/ mois (Sans engagement)</span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                    0% de commission prélevée sur vos devis. Demandes de rendez-vous illimitées, messagerie WhatsApp directe débloquée et badge certifié.
                  </p>
                </div>
                <span className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl self-start md:self-auto shadow-xs">
                  Abonnement Pro Actif
                </span>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS: DÉCISIONS RENDEZ-VOUS (VALIDER, DÉCALER, REFUSER)                 */}
      {/* ========================================================================= */}

      {/* MODAL 1: VALIDER UN RENDEZ-VOUS */}
      {acceptingAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Confirmer ce rendez-vous</h3>
                <p className="text-slate-500">{acceptingAppt.clientName} • {acceptingAppt.requestedDate}</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message pour le client (optionnel)</label>
              <textarea
                rows={3}
                placeholder="Ex : Parfait, je serai présent avec les échantillons de teintes..."
                value={acceptNote}
                onChange={(e) => setAcceptNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setAcceptingAppt(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
                Annuler
              </button>
              <button onClick={handleConfirmAccept} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors">
                Valider & Notifier le client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DÉCALER UN RENDEZ-VOUS (NOUVELLE DATE + RAISON OBLIGATOIRE) */}
      {reschedulingAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Proposer un décalage d'horaire</h3>
                <p className="text-slate-500">Client : {reschedulingAppt.clientName}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nouvelle date *</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Créneau *</label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                >
                  <option value="08:30 - 10:00">08:30 - 10:00</option>
                  <option value="10:00 - 11:30">10:00 - 11:30</option>
                  <option value="11:30 - 13:00">11:30 - 13:00</option>
                  <option value="14:00 - 15:30">14:00 - 15:30</option>
                  <option value="15:30 - 17:00">15:30 - 17:00</option>
                  <option value="17:00 - 18:30">17:00 - 18:30</option>
                  <option value="18:30 - 20:00">18:30 - 20:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Raison du décalage <span className="text-rose-600">* (Obligatoire)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Ex : Chantier du matin prolongé, indisponibilité imprévue..."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Le client recevra cette explication dans sa notification avec bouton d'acceptation.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setReschedulingAppt(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
                Annuler
              </button>
              <button onClick={handleConfirmReschedule} className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors">
                Transmettre la proposition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REFUSER UN RENDEZ-VOUS (AVEC RAISON OBLIGATOIRE) */}
      {rejectingAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <X className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Refuser la demande</h3>
                <p className="text-slate-500">Client : {rejectingAppt.clientName}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Motif du refus <span className="text-rose-600">* (Obligatoire)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Ex : Indisponible sur cette période, zone géographique hors secteur..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setRejectingAppt(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
                Annuler
              </button>
              <button onClick={handleConfirmReject} className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors">
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Create/Edit Modal */}
      {isCreateModalOpen && (
        <CreateServiceModal
          initialService={editingService}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingService(null);
          }}
        />
      )}

    </div>
  );
};

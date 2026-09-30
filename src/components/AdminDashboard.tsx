import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Category, User, Service, Appointment } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  Briefcase, 
  Calendar, 
  Check, 
  X, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink, 
  Star, 
  DollarSign, 
  Search, 
  PanelLeftClose, 
  PanelLeft, 
  ChevronRight, 
  BarChart3, 
  Sparkles, 
  Building2, 
  Clock, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

type AdminSection = 
  | 'kyc'           // Validations KYC Prestataires
  | 'categories'    // Contrôle des Catégories
  | 'services'      // Modération des Prestations
  | 'users'         // Gestion des Utilisateurs
  | 'appointments'  // Registre Global des RDV
  | 'analytics'     // Statistiques Globales
  | 'monetization'; // Modèle d'Abonnement (Oral)

const CATEGORY_ICON_OPTIONS = [
  { name: 'Hammer', label: 'Artisanat / Menuiserie' },
  { name: 'Building2', label: 'Immobilier / Salles' },
  { name: 'ShoppingBag', label: 'Boutique / Commerce' },
  { name: 'Wrench', label: 'Bricolage / Plomberie' },
  { name: 'Laptop', label: 'Informatique / Tech' },
  { name: 'Scissors', label: 'Beauté / Coiffure' },
];

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    services, 
    categories, 
    appointments, 
    adminApproveKyc, 
    adminRejectKyc, 
    adminToggleUserStatus, 
    adminAddCategory, 
    adminUpdateCategory, 
    adminToggleCategoryActive, 
    adminToggleServiceFeatured,
    deleteService,
    setActiveTab
  } = useApp();

  // Sidebar state
  const [currentSection, setCurrentSection] = useState<AdminSection>('kyc');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // KYC Reject Modal State
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Category Add/Edit Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('Hammer');
  const [catDesc, setCatDesc] = useState('');
  const [catColor, setCatColor] = useState('amber');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-xs">
          <ShieldCheck className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Accès Administrateur Restreint</h2>
          <p className="text-xs text-slate-500">
            Ce tableau de bord est exclusivement réservé au Super-Administrateur.
          </p>
        </div>
      </div>
    );
  }

  // Presta lists
  const prestataires = users.filter(u => u.role === 'prestataire');
  const pendingKycProviders = prestataires.filter(u => u.kycStatus === 'pending');
  const approvedKycProviders = prestataires.filter(u => u.kycStatus === 'approved');
  const clients = users.filter(u => u.role === 'client');

  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatIcon(cat.icon);
      setCatDesc(cat.description);
      setCatColor(cat.color);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatIcon('Hammer');
      setCatDesc('');
      setCatColor('amber');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      adminUpdateCategory(editingCategory.id, {
        name: catName,
        icon: catIcon,
        description: catDesc,
        color: catColor,
      });
    } else {
      adminAddCategory({
        name: catName,
        icon: catIcon,
        description: catDesc,
        color: catColor,
        isActive: true,
      });
    }
    setIsCategoryModalOpen(false);
  };

  const handleConfirmRejectKyc = () => {
    if (rejectingUserId && rejectReason.trim()) {
      adminRejectKyc(rejectingUserId, rejectReason);
      setRejectingUserId(null);
      setRejectReason('');
    }
  };

  const SECTION_TITLES: Record<AdminSection, string> = {
    kyc: 'Validations KYC des Prestataires',
    categories: 'Contrôle & Gestion des Catégories Métiers',
    services: 'Modération Générale des Prestations',
    users: 'Répertoire des Utilisateurs (Clients & Prestas)',
    appointments: 'Registre Global des Mises en Relation',
    analytics: 'Vue d’Ensemble & Métriques Plateforme',
    monetization: 'Modèle Économique d’Abonnement (Oral)',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* ADMIN SIDEBAR: ORGANISATION DES USE CASES DU SUPER ADMIN                  */}
      {/* ========================================================================= */}
      <aside 
        className={`bg-slate-950 text-slate-300 border-r border-slate-900 transition-all duration-200 flex flex-col justify-between shrink-0 z-20 ${
          sidebarCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-900 flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'hidden' : 'flex'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-900/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Console Admin</span>
                  <span className="bg-rose-500/20 text-rose-400 text-[9px] px-1 py-0.2 rounded font-mono">Dieu</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Contrôle & Modération globale
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors mx-auto"
              title={sidebarCollapsed ? 'Développer la barre' : 'Réduire la barre'}
              aria-label="Basculer la barre latérale"
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Pending Alert Chip in Sidebar */}
          {!sidebarCollapsed && pendingKycProviders.length > 0 && (
            <div 
              onClick={() => setCurrentSection('kyc')}
              className="p-3 mx-3 my-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs cursor-pointer hover:bg-rose-900/40 transition-colors"
            >
              <div className="flex items-center justify-between font-bold text-rose-400 mb-1">
                <span>Dossiers KYC en attente</span>
                <span className="font-mono tabular-nums bg-rose-600 text-white px-1.5 py-0.2 rounded text-[10px]">
                  {pendingKycProviders.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cliquez pour auditer les pièces d'identité et Kbis.
              </p>
            </div>
          )}

          {/* Nav Categories */}
          <nav className="p-3 space-y-6">
            
            {/* GROUP 1: SÉCURITÉ & VÉRIFICATION KYC */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Sécurité & Conformité
                </div>
              )}
              <div className="space-y-1">
                {/* Validations KYC */}
                <button
                  onClick={() => setCurrentSection('kyc')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'kyc'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  title="Validations KYC Prestataires"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Agréments KYC</span>}
                  </div>
                  {pendingKycProviders.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      currentSection === 'kyc' ? 'bg-white text-rose-700' : 'bg-rose-600 text-white animate-pulse'
                    }`}>
                      {pendingKycProviders.length}
                    </span>
                  )}
                </button>

                {/* Gestion des Catégories */}
                <button
                  onClick={() => setCurrentSection('categories')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'categories'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  title="Gestion des Catégories Métiers"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Layers className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Catégories Métiers</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">{categories.length}</span>
                  )}
                </button>

                {/* Modération des Prestations */}
                <button
                  onClick={() => setCurrentSection('services')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'services'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  title="Modération des Services"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Modération Prestations</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">{services.length}</span>
                  )}
                </button>
              </div>
            </div>

            {/* GROUP 2: GESTION DE LA PLATEFORME & AUDIT */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Communauté & Registre
                </div>
              )}
              <div className="space-y-1">
                {/* Utilisateurs */}
                <button
                  onClick={() => setCurrentSection('users')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'users'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  title="Utilisateurs & Profils"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Users className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Répertoire Utilisateurs</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">{users.length}</span>
                  )}
                </button>

                {/* Registre Global des RDV */}
                <button
                  onClick={() => setCurrentSection('appointments')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'appointments'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  title="Registre des Rendez-vous"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Calendar className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Registre des RDV</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">{appointments.length}</span>
                  )}
                </button>

                {/* Analytics */}
                <button
                  onClick={() => setCurrentSection('analytics')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'analytics'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  title="Métriques & KPI"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <BarChart3 className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Métriques Globales</span>}
                  </div>
                </button>
              </div>
            </div>

            {/* GROUP 3: STRATÉGIE BUSINESS & PRÉSENTATION ORALE */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Stratégie Soutenance
                </div>
              )}
              <div className="space-y-1">
                {/* Monétisation Abonnement */}
                <button
                  onClick={() => setCurrentSection('monetization')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentSection === 'monetization'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-300 hover:bg-purple-950/40 hover:text-white'
                  }`}
                  title="Modèle Abonnement Pro & MRR"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <DollarSign className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Modèle Abonnement</span>}
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

        {/* Footer Admin info */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-slate-900 text-[11px] text-slate-400 bg-slate-950">
            <div className="font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] text-rose-400">Super-Administrateur</div>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT: CONTENT DEDICATED TO ACTIVE ADMIN USE CASE                 */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Contextual Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Administration PrestaLink</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-extrabold text-slate-900 text-sm">
              {SECTION_TITLES[currentSection]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentSection === 'categories' && (
              <button
                onClick={() => handleOpenCatModal()}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une Catégorie</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('presentation')}
              className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Fiche Soutenance</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* ===================================================================== */}
          {/* USE CASE 1: VALIDATION DES INSCRIPTIONS PRESTATAIRES (KYC & SÉCURITÉ) */}
          {/* ===================================================================== */}
          {currentSection === 'kyc' && (
            <div className="space-y-6">
              
              {/* Overview strip */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Instruction des Dossiers Professionnels</h3>
                  <p className="text-xs text-slate-500">Contrôle d'identité, vérification du registre de commerce et agrément officiel.</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono tabular-nums bg-amber-50 text-amber-800 px-3 py-1 rounded-lg border border-amber-200 font-bold">
                    {pendingKycProviders.length} en attente
                  </span>
                  <span className="font-mono tabular-nums bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
                    {approvedKycProviders.length} agréés
                  </span>
                </div>
              </div>

              {/* Pending KYC list */}
              {pendingKycProviders.length > 0 ? (
                <div className="space-y-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 block">
                    Dossiers prioritaires à instruire ({pendingKycProviders.length})
                  </span>

                  {pendingKycProviders.map(pro => (
                    <div 
                      key={pro.id}
                      className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={pro.avatar}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                              <span>{pro.name}</span>
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                En attente de validation
                              </span>
                            </div>
                            <div className="text-xs text-slate-700 font-medium">
                              {pro.businessName} · <span className="font-semibold text-amber-800">{pro.profession}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {pro.city} · {pro.phone} · {pro.email}
                            </div>
                          </div>
                        </div>

                        {/* KYC Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setRejectingUserId(pro.id)}
                            className="px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <X className="w-4 h-4" />
                            <span>Refuser le dossier</span>
                          </button>

                          <button
                            onClick={() => adminApproveKyc(pro.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Valider l'Agrément (KYC)</span>
                          </button>
                        </div>
                      </div>

                      {/* Documents Audit Grid */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex items-center gap-2 text-slate-700">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">CNI : <strong>{pro.kycDocs?.idCardName || 'CNI_fournie.pdf'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">Kbis : <strong>{pro.kycDocs?.tradeRegisterName || 'Kbis_2025.pdf'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">Portfolio : {pro.kycDocs?.portfolioUrl || 'Conforme'}</span>
                        </div>
                      </div>

                      {pro.bio && (
                        <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                          "{pro.bio}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-10 rounded-2xl text-center border border-slate-200 text-xs text-slate-400">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  Tous les dossiers KYC ont été vérifiés. Aucun prestataire en attente.
                </div>
              )}

              {/* Verified prestataires list */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Prestataires Agréés & Conformes ({approvedKycProviders.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {approvedKycProviders.map(pro => (
                    <div key={pro.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={pro.avatar} alt="" className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-500" />
                        <div>
                          <div className="font-bold text-slate-900">{pro.name}</div>
                          <div className="text-[11px] text-slate-500">{pro.profession} · {pro.city}</div>
                        </div>
                      </div>
                      <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Agréé
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* USE CASE 2: CONTRÔLE DES CATÉGORIES (Ce qu'on peut proposer)          */}
          {/* ===================================================================== */}
          {currentSection === 'categories' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Catégories Autorisées sur PrestaLink</h3>
                  <p className="text-xs text-slate-500">
                    Contrôlez les secteurs d'activité ouverts à la publication de services.
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrer une catégorie..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-56 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {categories
                  .filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()))
                  .map(cat => {
                    const count = services.filter(s => s.categoryId === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          cat.isActive ? 'bg-slate-50 border-slate-200' : 'bg-slate-100 border-slate-200 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                            <button
                              onClick={() => adminToggleCategoryActive(cat.id)}
                              className="text-xs flex items-center gap-1 text-slate-500"
                              title={cat.isActive ? 'Désactiver la catégorie' : 'Activer'}
                            >
                              {cat.isActive ? (
                                <ToggleRight className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] text-slate-500 font-semibold">
                            {count} prestation{count > 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => handleOpenCatModal(cat)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            Modifier
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* USE CASE 3: MODÉRATION DES PRESTATIONS                                */}
          {/* ===================================================================== */}
          {currentSection === 'services' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Modération des Prestations en Ligne</h3>
                  <p className="text-xs text-slate-500">Mettez en avant des offres certifiées ou supprimez les annonces inappropriées.</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre ou artisan..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-64 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="py-3 px-3">Service</th>
                      <th className="py-3 px-3">Prestataire</th>
                      <th className="py-3 px-3">Catégorie</th>
                      <th className="py-3 px-3">Prix</th>
                      <th className="py-3 px-3">Statut</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services
                      .filter(s => s.title.toLowerCase().includes(serviceSearch.toLowerCase()) || s.providerName.toLowerCase().includes(serviceSearch.toLowerCase()))
                      .map(srv => (
                        <tr key={srv.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 line-clamp-1">{srv.title}</div>
                            <div className="text-[11px] text-slate-400">{srv.city}</div>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700">{srv.providerName}</td>
                          <td className="py-3 px-3 text-slate-600">{srv.categoryName}</td>
                          <td className="py-3 px-3 font-bold font-mono tabular-nums text-slate-900">{srv.price} {srv.currency}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              srv.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {srv.isActive ? 'En ligne' : 'Masqué'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => adminToggleServiceFeatured(srv.id)}
                                className={`p-1.5 rounded-lg text-xs ${
                                  srv.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                                title={srv.isFeatured ? 'Retirer coup de coeur' : 'Mettre en avant sur la page d’accueil'}
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Supprimer définitivement "${srv.title}" ?`)) {
                                    deleteService(srv.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                                title="Supprimer la prestation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* USE CASE 4: RÉPERTOIRE DES UTILISATEURS (Clients & Prestataires)       */}
          {/* ===================================================================== */}
          {currentSection === 'users' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Annuaire des Utilisateurs</h3>
                  <p className="text-xs text-slate-500">Supervision des comptes clients et artisans avec suspension immédiate en cas d'abus.</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Chercher nom, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-64 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="py-3 px-3">Utilisateur</th>
                      <th className="py-3 px-3">Rôle</th>
                      <th className="py-3 px-3">Ville</th>
                      <th className="py-3 px-3">Statut Compte</th>
                      <th className="py-3 px-3 text-right">Action Modération</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users
                      .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <div className="font-bold text-slate-900">{u.name}</div>
                                <div className="text-[11px] text-slate-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                              u.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                              u.role === 'prestataire' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {u.role === 'prestataire' ? (u.profession || 'Prestataire') : u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700">{u.city}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {u.isActive ? 'Actif' : 'Suspendu'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => adminToggleUserStatus(u.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                  u.isActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {u.isActive ? 'Suspendre' : 'Réactiver'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* USE CASE 5: REGISTRE GLOBAL DES RENDEZ-VOUS                           */}
          {/* ===================================================================== */}
          {currentSection === 'appointments' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registre d'Audit des Mises en Relation</h3>
                <p className="text-xs text-slate-500">Traçabilité complète des demandes, validations, décalages et motifs de refus.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Prestataire</th>
                      <th className="py-3 px-3">Prestation</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Statut</th>
                      <th className="py-3 px-3">Motif / Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-semibold text-slate-900">{a.clientName}</td>
                        <td className="py-3 px-3 text-amber-800 font-medium">{a.providerName}</td>
                        <td className="py-3 px-3 text-slate-700 truncate max-w-xs">{a.serviceTitle}</td>
                        <td className="py-3 px-3 font-mono tabular-nums text-slate-600">{a.requestedDate}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            a.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                            a.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            a.status === 'rescheduled' ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">
                          {a.statusReason || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* USE CASE 6: STATISTIQUES GLOBALES                                     */}
          {/* ===================================================================== */}
          {currentSection === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Total Utilisateurs</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{users.length}</div>
                  <span className="text-[11px] text-slate-500">{clients.length} clients · {prestataires.length} prestas</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Prestations Publiées</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{services.length}</div>
                  <span className="text-[11px] text-emerald-600 font-bold">{services.filter(s => s.isActive).length} en ligne</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Mises en Relation</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{appointments.length}</div>
                  <span className="text-[11px] text-slate-500">{appointments.filter(a => a.status === 'accepted').length} acceptées</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Taux d'Agrément KYC</span>
                  <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                    {Math.round((approvedKycProviders.length / (prestataires.length || 1)) * 100)}%
                  </div>
                  <span className="text-[11px] text-slate-500">Profils audités</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* USE CASE 7: STRATÉGIE DE REVENUS ABONNEMENT (ORAL)                    */}
          {/* ===================================================================== */}
          {currentSection === 'monetization' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-200 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                    Argumentaire Oral & Monétisation
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Modèle Économique d'Abonnement Prestataire (SaaS)</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-extrabold text-slate-700 block">Formule Starter (Gratuit)</span>
                  <div className="text-2xl font-extrabold font-mono tabular-nums">0 € / mois</div>
                  <p className="text-slate-500">Pour attirer les artisans sur la plateforme et amorcer l'effet réseau.</p>
                </div>

                <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-50/30 space-y-2 relative">
                  <span className="absolute -top-2.5 right-3 bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                    Cœur de Rentabilité
                  </span>
                  <span className="font-extrabold text-amber-900 block">Pack Artisan Pro</span>
                  <div className="text-2xl font-extrabold text-amber-900 font-mono tabular-nums">29 € / mois</div>
                  <p className="text-slate-700">Prestations illimitées, badge certifié KYC, contact direct WhatsApp.</p>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                  <span className="font-extrabold text-purple-900 block">Pack Enseigne & Espaces</span>
                  <div className="text-2xl font-extrabold text-purple-900 font-mono tabular-nums">79 € / mois</div>
                  <p className="text-slate-700">Gérants de domaines événementiels, pop-up stores et boutiques multipoints.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 text-white rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-400">Simulation de Revenus Récurrents :</div>
                <div className="text-slate-300">
                  À 100 artisans abonnés = <strong>2 900 € / mois (34 800 € / an)</strong> sans le risque ni la friction de la commission par devis.
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* KYC Rejection Modal */}
      {rejectingUserId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Refuser le dossier KYC</h3>
            <p className="text-slate-600">
              Saisissez le motif qui sera notifié au prestataire pour qu'il régularise ses documents.
            </p>
            <textarea
              rows={3}
              placeholder="Ex : Numéro Siret non vérifiable sur le répertoire officiel, pièce d'identité floue..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-slate-900"
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setRejectingUserId(null)} className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold">
                Annuler
              </button>
              <button onClick={handleConfirmRejectKyc} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold">
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">
              {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Nouvelle Catégorie'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom de la catégorie *</label>
                <input
                  type="text"
                  placeholder="Ex : Transport & Logistique"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Icône</label>
                <select
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                >
                  {CATEGORY_ICON_OPTIONS.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

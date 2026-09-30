import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Bell, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    unreadNotificationsCount, 
    setIsNotificationDrawerOpen,
    openAuthModal,
    logout,
    appointments
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check how many appointments the client has
  const clientApptsCount = currentUser 
    ? appointments.filter(a => a.clientId === currentUser.id).length 
    : 0;

  // Check how many pending requests for prestataire
  const proPendingRequests = currentUser && currentUser.role === 'prestataire'
    ? appointments.filter(a => a.providerId === currentUser.id && a.status === 'pending').length
    : 0;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[37px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Presta<span className="text-amber-600">Link</span>
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block leading-none">
                  Services & Artisans de proximité
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-amber-50 text-amber-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Explorer les Services</span>
            </button>

            {/* Client Appointments Tab */}
            {(currentUser?.role === 'client' || (!currentUser && clientApptsCount > 0)) && (
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 relative ${
                  activeTab === 'appointments'
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Mes Rendez-vous</span>
                {clientApptsCount > 0 && (
                  <span className="bg-slate-200 text-slate-700 text-xs px-1.5 py-0.2 rounded-full font-semibold">
                    {clientApptsCount}
                  </span>
                )}
              </button>
            )}

            {/* Prestataire Dashboard Tab */}
            {currentUser?.role === 'prestataire' ? (
              <button
                onClick={() => setActiveTab('pro-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 relative ${
                  activeTab === 'pro-dashboard'
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Mon Espace Pro</span>
                {proPendingRequests > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {proPendingRequests} RDV
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('prestataire')}
                className="px-3 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-1.5 border border-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Proposer un service</span>
              </button>
            )}

            {/* Admin Dashboard Tab */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-rose-600 text-white font-semibold shadow-sm'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Administration</span>
              </button>
            )}

            {/* Presentation Tab */}
            <button
              onClick={() => setActiveTab('presentation')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'presentation'
                  ? 'bg-purple-100 text-purple-800 font-bold'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Modèle Éco & Soutenance</span>
            </button>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notification Bell */}
            {currentUser && (
              <button
                onClick={() => setIsNotificationDrawerOpen(true)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
                aria-label="Centre de notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                      currentUser.role === 'admin' ? 'bg-rose-500' :
                      currentUser.role === 'prestataire' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    {currentUser.role === 'prestataire' ? (currentUser.profession || 'Prestataire') : currentUser.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
                  title="Déconnexion (retour visiteur)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('client')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={() => openAuthModal('client')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all"
                >
                  S'inscrire
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'home' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Explorer les Services</span>
          </button>

          {(currentUser?.role === 'client' || (!currentUser && clientApptsCount > 0)) && (
            <button
              onClick={() => { setActiveTab('appointments'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeTab === 'appointments' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Mes Rendez-vous</span>
              </div>
              {clientApptsCount > 0 && (
                <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {clientApptsCount}
                </span>
              )}
            </button>
          )}

          {currentUser?.role === 'prestataire' && (
            <button
              onClick={() => { setActiveTab('pro-dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeTab === 'pro-dashboard' ? 'bg-amber-600 text-white font-bold' : 'text-amber-800 bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Espace Prestataire</span>
              </div>
              {proPendingRequests > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {proPendingRequests} RDV
                </span>
              )}
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => { setActiveTab('admin-dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'admin-dashboard' ? 'bg-rose-600 text-white font-bold' : 'text-rose-700 bg-rose-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panneau Administrateur</span>
            </button>
          )}

          <button
            onClick={() => { setActiveTab('presentation'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 text-purple-700 bg-purple-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Fiche Modèle Éco & Soutenance</span>
          </button>

          {!currentUser && (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => { openAuthModal('client'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-center text-sm font-semibold border border-slate-300 rounded-lg text-slate-700"
              >
                Connexion
              </button>
              <button
                onClick={() => { openAuthModal('prestataire'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-center text-sm font-semibold bg-amber-600 text-white rounded-lg"
              >
                Devenir Presta
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

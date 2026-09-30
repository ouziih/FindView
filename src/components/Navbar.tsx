import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Search, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  Briefcase, 
  ShieldCheck,
  ChevronDown
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

  const clientApptsCount = currentUser 
    ? appointments.filter(a => a.clientId === currentUser.id).length 
    : 0;

  const proPendingRequests = currentUser && currentUser.role === 'prestataire'
    ? appointments.filter(a => a.providerId === currentUser.id && a.status === 'pending').length
    : 0;

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-[33px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Wordmark (Architectural, refined, single-line) */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 text-left group"
            >
              <span className="font-extrabold text-xl tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                PrestaLink<span className="text-[#B8522E]">.</span>
              </span>
            </button>

            {/* Desktop Navigation Links (Clean text with subtle active state) */}
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
              <button
                onClick={() => setActiveTab('home')}
                className={`transition-colors py-1 ${
                  activeTab === 'home'
                    ? 'text-stone-900 font-bold border-b-2 border-[#B8522E]'
                    : 'hover:text-stone-900'
                }`}
              >
                Explorer le catalogue
              </button>

              {(currentUser?.role === 'client' || (!currentUser && clientApptsCount > 0)) && (
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`transition-colors py-1 flex items-center gap-1.5 ${
                    activeTab === 'appointments'
                      ? 'text-stone-900 font-bold border-b-2 border-[#B8522E]'
                      : 'hover:text-stone-900'
                  }`}
                >
                  <span>Mes Rendez-vous</span>
                  {clientApptsCount > 0 && (
                    <span className="text-[10px] font-mono tabular-nums bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded">
                      {clientApptsCount}
                    </span>
                  )}
                </button>
              )}

              {currentUser?.role === 'prestataire' && (
                <button
                  onClick={() => setActiveTab('pro-dashboard')}
                  className={`transition-colors py-1 flex items-center gap-1.5 ${
                    activeTab === 'pro-dashboard'
                      ? 'text-stone-900 font-bold border-b-2 border-[#B8522E]'
                      : 'hover:text-stone-900'
                  }`}
                >
                  <span>Mon Espace Pro</span>
                  {proPendingRequests > 0 && (
                    <span className="text-[10px] font-bold bg-[#B8522E] text-white px-1.5 py-0.2 rounded-full">
                      {proPendingRequests}
                    </span>
                  )}
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`transition-colors py-1 ${
                    activeTab === 'admin-dashboard'
                      ? 'text-stone-900 font-bold border-b-2 border-[#B8522E]'
                      : 'hover:text-stone-900'
                  }`}
                >
                  Administration
                </button>
              )}

              <button
                onClick={() => setActiveTab('presentation')}
                className={`transition-colors py-1 ${
                  activeTab === 'presentation'
                    ? 'text-stone-900 font-bold border-b-2 border-[#B8522E]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Fiche Soutenance Oral
              </button>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            {currentUser && (
              <button
                onClick={() => setIsNotificationDrawerOpen(true)}
                className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                title="Notifications"
                aria-label="Centre de notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B8522E] rounded-full ring-2 ring-white" />
                )}
              </button>
            )}

            {/* User Profile or Join/Login */}
            {currentUser ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200"
                />
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-bold text-stone-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-stone-400 capitalize">
                    {currentUser.role === 'prestataire' ? (currentUser.profession || 'Prestataire') : currentUser.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors ml-1"
                  title="Déconnexion"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('client')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={() => openAuthModal('prestataire')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#B8522E] hover:bg-[#A34524] text-white shadow-xs transition-colors"
                >
                  Devenir Prestataire
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1 shadow-lg text-xs font-medium">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'home' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-600'}`}
          >
            Explorer le catalogue
          </button>
          <button
            onClick={() => { setActiveTab('appointments'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'appointments' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-600'}`}
          >
            Mes Rendez-vous ({clientApptsCount})
          </button>
          {currentUser?.role === 'prestataire' && (
            <button
              onClick={() => { setActiveTab('pro-dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'pro-dashboard' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-600'}`}
            >
              Mon Espace Pro
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => { setActiveTab('admin-dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'admin-dashboard' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-600'}`}
            >
              Administration
            </button>
          )}
          <button
            onClick={() => { setActiveTab('presentation'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'presentation' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-600'}`}
          >
            Fiche Soutenance Oral
          </button>
        </div>
      )}
    </nav>
  );
};

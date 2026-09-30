/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleDemoBar } from './components/RoleDemoBar';
import { Navbar } from './components/Navbar';
import { VisitorHome } from './components/VisitorHome';
import { ClientAppointments } from './components/ClientAppointments';
import { PrestataireDashboard } from './components/PrestataireDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OralPresentationView } from './components/OralPresentationView';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BookingModal } from './components/BookingModal';
import { ChatModal } from './components/ChatModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { Briefcase, Heart, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, openAuthModal } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Demonstration & Role Switcher Bar */}
      <RoleDemoBar />

      {/* Main Top Navigation */}
      <Navbar />

      {/* Main Content View Switcher */}
      <div className="flex-1">
        {activeTab === 'home' && <VisitorHome />}
        {activeTab === 'appointments' && <ClientAppointments />}
        {activeTab === 'pro-dashboard' && <PrestataireDashboard />}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}
        {activeTab === 'presentation' && <OralPresentationView />}
      </div>

      {/* Global Interactive Modals & Drawers */}
      <ServiceDetailModal />
      <BookingModal />
      <ChatModal />
      <NotificationDrawer />
      <AuthModal />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Presta<span className="text-amber-500">Link</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Plateforme moderne de mise en relation directe entre artisans qualifiés, gérants d'espaces, commerçants de proximité et clients.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Contrôle KYC & Modération Humaine</span>
            </div>
          </div>

          {/* Navigation col */}
          <div>
            <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider block mb-3">
              Navigation Rapide
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Explorer les prestations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('appointments')} className="hover:text-white transition-colors">
                  Espace Mes Rendez-vous
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('prestataire')} className="hover:text-white transition-colors">
                  Devenir Prestataire & Inscription
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('presentation')} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Dossier Soutenance Orale</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Corps de Métiers */}
          <div>
            <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider block mb-3">
              Prestations Populaires
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Menuiserie d'art & Cuisines sur-mesure</li>
              <li>Lofts & Salles pour événements privatisés</li>
              <li>Boutiques éphémères & Vente locale</li>
              <li>Plomberie & Dépannage rapide</li>
              <li>Réparation High-Tech & Informatique</li>
            </ul>
          </div>

          {/* Sécurité & Contact */}
          <div>
            <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider block mb-3">
              Engagement Qualité
            </span>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              0% de commission sur vos devis chantiers. Échange direct via WhatsApp ou téléphone. Suivi des motifs de report et refus.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-amber-300">
              Prêt pour la présentation académique et l'évaluation orale.
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            © 2025 PrestaLink Platform. Tous droits réservés.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Conçu avec</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>pour connecter les talents locaux et leurs clients.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

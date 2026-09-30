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
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, openAuthModal } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-stone-900 font-sans selection:bg-stone-200">
      
      {/* Demonstration & Role Switcher Studio Bar */}
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

      {/* Editorial Footer */}
      <footer className="bg-[#18181B] text-stone-400 border-t border-stone-800 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand col */}
          <div className="space-y-3">
            <div className="font-extrabold text-lg text-white tracking-tight">
              PrestaLink<span className="text-[#B8522E]">.</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              Plateforme de mise en relation directe entre artisans qualifiés, gérants de locaux et clients. 0% de commission sur les prestations.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Contrôle KYC & Agréments vérifiés</span>
            </div>
          </div>

          {/* Navigation col */}
          <div>
            <span className="font-bold text-stone-200 uppercase text-[10px] tracking-wider block mb-3">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Explorer le catalogue
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('appointments')} className="hover:text-white transition-colors">
                  Mes Rendez-vous
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('prestataire')} className="hover:text-white transition-colors">
                  Devenir Prestataire
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('presentation')} className="text-stone-300 hover:text-white transition-colors">
                  Fiche Soutenance Oral
                </button>
              </li>
            </ul>
          </div>

          {/* Corps de Métiers */}
          <div>
            <span className="font-bold text-stone-200 uppercase text-[10px] tracking-wider block mb-3">
              Métiers Référencés
            </span>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Menuiserie d'art & Cuisines</li>
              <li>Lofts & Salles de réception</li>
              <li>Boutiques artisanales & Pop-up</li>
              <li>Dépannage & Travaux techniques</li>
              <li>Informatique & Réparation</li>
            </ul>
          </div>

          {/* Engagement */}
          <div>
            <span className="font-bold text-stone-200 uppercase text-[10px] tracking-wider block mb-3">
              Cadre & Transparence
            </span>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Échangez directement sur WhatsApp ou par téléphone. En cas de refus ou de décalage, un motif précis est obligatoirement fourni au client.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div>
            © 2025 PrestaLink. Tous droits réservés.
          </div>
          <div>
            Conçu pour l'évaluation académique et la mise en relation d'artisans.
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

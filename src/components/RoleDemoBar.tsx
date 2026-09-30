import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, Eye, Briefcase, User, GraduationCap, ShieldCheck } from 'lucide-react';

export const RoleDemoBar: React.FC = () => {
  const { currentUser, switchUser, resetDataToFactory, setActiveTab, activeTab } = useApp();

  return (
    <aside aria-label="Sélecteur de rôle pour la démo" className="bg-[#121316] border-b border-stone-800 text-xs text-stone-300 py-1.5 px-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8522E]" />
            Test 1-Clic :
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {/* Visiteur */}
          <button
            onClick={() => switchUser(null)}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 text-[11px] font-medium ${
              currentUser === null
                ? 'bg-white text-stone-900 font-bold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Tester en visiteur sans compte"
          >
            <Eye className="w-3 h-3" />
            <span>Visiteur Public</span>
          </button>

          {/* Client */}
          <button
            onClick={() => switchUser('user-client-1')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 text-[11px] font-medium ${
              currentUser?.id === 'user-client-1'
                ? 'bg-white text-stone-900 font-bold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Tester en client (Amina Traoré)"
          >
            <User className="w-3 h-3" />
            <span>Client (Amina)</span>
          </button>

          {/* Prestataire Validé */}
          <button
            onClick={() => switchUser('user-presta-1')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 text-[11px] font-medium ${
              currentUser?.id === 'user-presta-1'
                ? 'bg-white text-stone-900 font-bold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Tester en prestataire menuisier (Ibrahima Diallo)"
          >
            <Briefcase className="w-3 h-3" />
            <span>Presta Actif (Menuisier)</span>
          </button>

          {/* Prestataire en attente KYC */}
          <button
            onClick={() => switchUser('user-presta-4-pending')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 text-[11px] font-medium ${
              currentUser?.id === 'user-presta-4-pending'
                ? 'bg-white text-stone-900 font-bold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Tester un profil en attente KYC (Karim Benali)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span>Presta Attente KYC</span>
          </button>

          {/* Administrateur */}
          <button
            onClick={() => switchUser('user-admin-1')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 text-[11px] font-medium ${
              currentUser?.role === 'admin'
                ? 'bg-white text-stone-900 font-bold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Accéder au panneau d'administration générale"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Général</span>
          </button>

          {/* Presentation Orale Helper */}
          <button
            onClick={() => setActiveTab('presentation')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 text-[11px] font-medium ${
              activeTab === 'presentation'
                ? 'bg-stone-700 text-white font-bold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Fiche récapitulative & Modèle d'abonnement pour l'oral"
          >
            <GraduationCap className="w-3 h-3" />
            <span>Fiche Oral & Abonnement</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              if (confirm('Réinitialiser toutes les données aux valeurs par défaut ?')) {
                resetDataToFactory();
              }
            }}
            className="p-1 rounded-md text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors ml-1"
            title="Réinitialiser les données de démo"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};

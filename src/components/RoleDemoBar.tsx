import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, ShieldAlert, Sparkles, RefreshCw, Eye, Briefcase, User, GraduationCap } from 'lucide-react';

export const RoleDemoBar: React.FC = () => {
  const { currentUser, switchUser, resetDataToFactory, setActiveTab, activeTab } = useApp();

  return (
    <aside aria-label="Sélecteur rapide de rôles" className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-3 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            Mode Démo & Soutenance
          </span>
          <span className="hidden sm:inline text-slate-400">Tester en 1 clic :</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Visiteur */}
          <button
            onClick={() => switchUser(null)}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              currentUser === null
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Tester le site sans être connecté (visiteur public)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visiteur Public</span>
          </button>

          {/* Client */}
          <button
            onClick={() => switchUser('user-client-1')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              currentUser?.id === 'user-client-1'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Tester en tant que client (Amina Traoré)"
          >
            <User className="w-3.5 h-3.5" />
            <span>Client (Amina)</span>
          </button>

          {/* Prestataire Validé */}
          <button
            onClick={() => switchUser('user-presta-1')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              currentUser?.id === 'user-presta-1'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Tester en tant que prestataire menuisier vérifié (Ibrahima Diallo)"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Presta Actif (Menuisier)</span>
          </button>

          {/* Prestataire en attente KYC */}
          <button
            onClick={() => switchUser('user-presta-4-pending')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              currentUser?.id === 'user-presta-4-pending'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Tester un profil en attente de vérification KYC (Karim Benali)"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Presta KYC en Attente</span>
          </button>

          {/* Administrateur */}
          <button
            onClick={() => switchUser('user-admin-1')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              currentUser?.role === 'admin'
                ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Accéder au panneau d'administration générale"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Admin ("Dieu")</span>
          </button>

          {/* Presentation Orale Helper */}
          <button
            onClick={() => setActiveTab('presentation')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              activeTab === 'presentation'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-950/60 text-purple-300 border border-purple-800/40 hover:bg-purple-900/60'
            }`}
            title="Fiche récapitulative & Modèle d'abonnement pour l'oral"
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-300" />
            <span>Pitch & Modèle d'Abonnement</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              if (confirm('Réinitialiser toutes les données aux valeurs par défaut ?')) {
                resetDataToFactory();
              }
            }}
            className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 ml-1"
            title="Réinitialiser les données"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

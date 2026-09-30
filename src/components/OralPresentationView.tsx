import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Bell, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Layers
} from 'lucide-react';

export const OralPresentationView: React.FC = () => {
  const { switchUser, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-10 px-4 sm:px-6 lg:px-8 text-stone-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Hero Editorial Header */}
        <div className="bg-[#18181B] text-white rounded-2xl p-8 sm:p-10 border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-[11px] font-semibold mb-4 border border-stone-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8522E]" />
              <span>Dossier de Présentation & Évaluation Orale</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              PrestaLink : Architecture, Rôles & Stratégie Économique
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Dossier de soutenance récapitulant les 3 acteurs de la plateforme, le cycle de vie des rendez-vous avec motifs obligatoires, le contrôle KYC par l'administrateur, et le modèle d'affaires par abonnement SaaS réservé pour votre oral.
            </p>
          </div>
        </div>

        {/* Section 1: Les 3 Acteurs & Matrice des Pouvoirs */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Users className="w-5 h-5 text-stone-700" />
            <h2>1. Matrice des Rôles & Droits d'Accès</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
            {/* Client */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="font-bold text-stone-900 text-sm block mb-1">
                  1. Client / Visiteur
                </span>
                <p className="text-stone-600 mb-3 leading-relaxed">
                  Navigation publique fluide (recherche, filtres métiers, villes, tarification).
                </p>
                <ul className="text-stone-700 space-y-1.5 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span>Création de compte & authentification</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span>Onglet <strong>"Mes Rendez-vous"</strong> avec statuts en direct</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span>Contact direct (WhatsApp, téléphone ou chat app)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => switchUser('user-client-1')}
                className="mt-4 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-center transition-colors"
              >
                Tester Client (Amina)
              </button>
            </div>

            {/* Prestataire */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="font-bold text-stone-900 text-sm block mb-1">
                  2. Prestataire (Menuisier, Loueur, Boutiquier)
                </span>
                <p className="text-stone-600 mb-3 leading-relaxed">
                  Bénéficie des droits du client + son propre tableau de bord professionnel avec barre latérale.
                </p>
                <ul className="text-stone-700 space-y-1.5 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span>Gestion des prestations (créer, modifier, masquer, supprimer)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span><strong>Traitement des RDV</strong> : Valider, Décaler (nouvelle date + raison) ou Refuser (motif obligatoire)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span>Dossier KYC & Kbis</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => switchUser('user-presta-1')}
                className="mt-4 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-center transition-colors"
              >
                Tester Prestataire (Ibrahima)
              </button>
            </div>

            {/* Admin */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="font-bold text-stone-900 text-sm block mb-1">
                  3. Super-Admin ("Le Dieu de l'Appli")
                </span>
                <p className="text-stone-600 mb-3 leading-relaxed">
                  Contrôle total sur l'écosystème pour garantir sécurité, confiance et conformité.
                </p>
                <ul className="text-stone-700 space-y-1.5 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span><strong>Agrément KYC</strong> (contrôle identité/Kbis, validation/refus)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span><strong>Gestion des Catégories</strong> (contrôle de ce qu'on peut proposer)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-stone-400">·</span>
                    <span>Modération de tous les prestataires, services et utilisateurs</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => switchUser('user-admin-1')}
                className="mt-4 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-center transition-colors"
              >
                Tester Admin (Marc)
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Notifications & Cycle de Vie des RDV */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Bell className="w-5 h-5 text-stone-700" />
            <h2>2. Système de Notifications & Motifs Obligatoires</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block mb-1">À la prise de rendez-vous :</strong>
              <p className="text-stone-600 leading-relaxed">
                Le prestataire reçoit une notification instantanée avec les coordonnées et <strong>la description exacte du besoin</strong> rédigée par le client.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block mb-1">Aux réponses du professionnel :</strong>
              <p className="text-stone-600 leading-relaxed">
                Le client reçoit une alerte immédiate avec <strong>le motif obligatoire</strong> en cas de refus ou le <strong>nouveau créneau proposé</strong> en cas de décalage.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Modèle Économique par Abonnement (Soutenance Orale) */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <DollarSign className="w-5 h-5 text-[#B8522E]" />
              <h2>3. Modèle Économique : Monétisation par Abonnement SaaS</h2>
            </div>
            <span className="text-[10px] font-bold text-[#B8522E] bg-stone-100 px-2.5 py-0.5 rounded uppercase">
              Réservé pour l'Oral
            </span>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
            <strong className="text-stone-900">Argumentaire pour le jury :</strong>
            <p>
              « Dans les métiers de proximité (menuiserie, travaux, location), prélever une commission de 15% incite clients et prestataires à contourner la plateforme pour régler en espèces. 
              En optant pour un abonnement forfaitaire mensuel, l'artisan bénéficie de 100% de ses devis et la plateforme assure des revenus récurrents prévisibles (MRR). »
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
              <span className="font-bold text-stone-500 uppercase text-[10px]">Starter</span>
              <div className="text-xl font-bold text-stone-900 font-mono tabular-nums">0 €</div>
              <p className="text-stone-500">1 service publié, jusqu'à 3 contacts par mois.</p>
            </div>

            <div className="p-4 rounded-xl border-2 border-stone-900 bg-stone-50 space-y-2 relative">
              <span className="font-bold text-stone-900 uppercase text-[10px]">Pack Artisan Pro</span>
              <div className="text-xl font-bold text-stone-900 font-mono tabular-nums">29 € <span className="text-xs font-normal text-stone-500">/ mois</span></div>
              <p className="text-stone-600">Services illimités, badge KYC officiel, WhatsApp débloqué.</p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
              <span className="font-bold text-stone-500 uppercase text-[10px]">Enseigne & Domaines</span>
              <div className="text-xl font-bold text-stone-900 font-mono tabular-nums">79 € <span className="text-xs font-normal text-stone-500">/ mois</span></div>
              <p className="text-stone-500">Gérants de lofts, salles de réception, boutiques multipoints.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Guide de Démo en 5 étapes pour la soutenance */}
        <section className="bg-[#18181B] text-white rounded-2xl p-6 sm:p-8 space-y-4 text-xs border border-stone-800">
          <div className="flex items-center gap-2 text-stone-200 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#B8522E]" />
            <span>4. Guide de Démonstration en 5 Étapes pour votre Évaluateur</span>
          </div>

          <div className="space-y-2.5 pt-1 text-stone-300">
            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-md bg-stone-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong>Visiteur :</strong> Explorez le catalogue, filtrez par catégorie et cliquez sur « Demander un Rendez-vous ».
              </div>
            </div>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-md bg-stone-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong>Prestataire :</strong> Passez en « Presta Actif » dans la barre supérieure. Dans la boîte de réception latérale, visualisez la demande reçue avec la description du client.
              </div>
            </div>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-md bg-stone-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong>Décalage ou Refus :</strong> Testez le bouton « Décaler » en spécifiant une nouvelle date et le motif obligatoire.
              </div>
            </div>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-md bg-stone-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <strong>Client :</strong> Basculez sur « Client (Amina) ». Dans la section « Horaires décalés », observez l'explication et validez le nouvel horaire.
              </div>
            </div>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-md bg-stone-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">5</span>
              <div>
                <strong>Admin & KYC :</strong> Basculez en « Admin ». Dans la section « Agréments KYC », validez le dossier en attente de Karim Benali.
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

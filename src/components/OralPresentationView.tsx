import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Bell, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  ArrowRight,
  Target,
  TrendingUp,
  Layers
} from 'lucide-react';

export const OralPresentationView: React.FC = () => {
  const { switchUser, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-4 border border-purple-500/30">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Dossier de Soutenance & Présentation Orale</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              PrestaLink : Architecture, Rôles & Modèle Économique
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Ce guide complet récapitule la conception fonctionnelle, le cycle de vie des rendez-vous avec motifs de décalage/refus, la sécurité KYC sous contrôle administrateur, et la stratégie de monétisation par abonnement réservée pour votre oral.
            </p>
          </div>
        </div>

        {/* Section 1: Les 3 Acteurs Clés */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg">
            <Users className="w-5 h-5 text-amber-600" />
            <h2>1. Les 3 Acteurs de la Plateforme (Spécifications Respectées)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            {/* Client / Visiteur */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 flex flex-col justify-between">
              <div>
                <span className="font-extrabold text-blue-900 text-sm block mb-1">
                  1. Client (Visiteur & Connecté)
                </span>
                <p className="text-slate-600 mb-3 leading-relaxed">
                  Interface visiteur soignée comme les vraies marketplaces (recherche, filtres par catégorie, villes, type de tarification, avis).
                </p>
                <ul className="text-slate-700 space-y-1.5 font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Création de compte & authentification</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Onglet <strong>"Mes Rendez-vous"</strong> avec statuts en direct</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Contact direct (WhatsApp, téléphone ou chat app)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { switchUser('user-client-1'); }}
                className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-center transition-colors shadow-xs"
              >
                Tester en Client (Amina)
              </button>
            </div>

            {/* Prestataire */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="font-extrabold text-amber-950 text-sm block mb-1">
                  2. Prestataire (Artisan / Loueur / Commerçant)
                </span>
                <p className="text-slate-600 mb-3 leading-relaxed">
                  Bénéficie de tous les droits du client + son propre tableau de bord professionnel dédié.
                </p>
                <ul className="text-slate-700 space-y-1.5 font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Gestion des prestations (créer, modifier, activer/désactiver, supprimer)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Personnalisation de l'identité</strong> (badges d'accroche & couleurs)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Traitement RDV</strong> : Valider, Décaler (nouvelle date + raison) ou Refuser (motif obligatoire)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { switchUser('user-presta-1'); }}
                className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-center transition-colors shadow-xs"
              >
                Tester en Prestataire (Ibrahima)
              </button>
            </div>

            {/* Admin */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between">
              <div>
                <span className="font-extrabold text-rose-950 text-sm block mb-1">
                  3. Admin ("Le Dieu de l'Appli")
                </span>
                <p className="text-slate-600 mb-3 leading-relaxed">
                  Contrôle total sur l'écosystème pour garantir sécurité, confiance et conformité légale.
                </p>
                <ul className="text-slate-700 space-y-1.5 font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Agrément KYC</strong> (contrôle identité/Kbis, validation/refus)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Gestion des Catégories</strong> (pour contrôler ce qu'on peut proposer)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>Modération de tous les prestataires, services et utilisateurs</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { switchUser('user-admin-1'); }}
                className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-center transition-colors shadow-xs"
              >
                Tester en Admin (Marc)
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Le Système de Notification Bidirectionnel */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2>2. Système de Notifications & Workflow des Rendez-vous</h2>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 text-sm">
                  1. À chaque demande de rendez-vous :
                </span>
                <p className="text-slate-600">
                  Le prestataire concerné reçoit une notification prioritaire contenant :
                  le nom du client, le service sélectionné, la date/créneau, <strong>ainsi que la description détaillée du besoin ou problème saisi par le client</strong>.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 text-sm">
                  2. Réponses du Prestataire au Client :
                </span>
                <ul className="text-slate-600 space-y-1">
                  <li>• <strong>Validé :</strong> Le client est notifié que son créneau est confirmé avec message d'accueil.</li>
                  <li>• <strong>Décalé :</strong> Le client est notifié de la nouvelle date proposée et de <strong>la raison obligatoire</strong> du décalage (avec bouton pour valider ou refuser).</li>
                  <li>• <strong>Refusé :</strong> Le client est notifié avec <strong>le motif obligatoire</strong> de l'indisponibilité.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Modèle Économique d'Abonnement pour l'Oral */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border-2 border-purple-300 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-purple-950 font-extrabold text-lg">
              <DollarSign className="w-6 h-6 text-purple-700" />
              <h2>3. Modèle Économique : Monétisation par Abonnement Prestataire</h2>
            </div>
            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Pour Présentation Orale
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-200 text-xs leading-relaxed text-slate-700 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Pourquoi le modèle d'abonnement mensuel (SaaS) plutôt qu'une commission par transaction ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <strong className="text-purple-900 block mb-1">1. Désintermédiation évitée</strong>
                Dans les métiers de l'artisanat et des prestations locales, prélever 15% pousse artisans et clients à échanger par téléphone pour payer en espèces. Avec un abonnement fixe, le prestataire a tout intérêt à rester actif et transparent.
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <strong className="text-purple-900 block mb-1">2. Revenus Récurrents Prévisibles (MRR)</strong>
                La plateforme génère un flux de trésorerie régulier et stable chaque mois, indépendamment de la saisonnalité des chantiers.
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <strong className="text-purple-900 block mb-1">3. Valeur ajoutée perçue très élevée</strong>
                Pour un menuisier, remporter 1 seul chantier sur-mesure à 2 500 € rentabilise instantanément 5 ans d'abonnement à 29 €/mois !
              </div>
            </div>
          </div>

          {/* Grille Tarifaire Prévue */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Grille Tarifaire Proposée lors de la soutenance :
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <span className="font-extrabold text-slate-700 text-sm">Freemium Découverte</span>
                <div className="text-xl font-extrabold text-slate-900 my-1">0 €</div>
                <p className="text-slate-500 mb-2">Permet de tester la plateforme et créer 1 service.</p>
                <div className="text-[11px] text-slate-600">Limite à 3 contacts / mois.</div>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-2xl border-2 border-amber-500">
                <span className="font-extrabold text-amber-900 text-sm">Pack Artisan Élite</span>
                <div className="text-xl font-extrabold text-amber-900 my-1">29 € <span className="text-xs font-normal">/ mois</span></div>
                <p className="text-slate-700 mb-2">Services illimités, badge KYC vérifié, contact direct WhatsApp.</p>
                <div className="text-[11px] font-bold text-amber-800">Cœur de cible (90% des abonnés)</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="font-extrabold text-purple-900 text-sm">Pack Enseigne & Lieux</span>
                <div className="text-xl font-extrabold text-purple-900 my-1">79 € <span className="text-xs font-normal">/ mois</span></div>
                <p className="text-slate-700 mb-2">Gérants de domaines, lofts, boutiques multipoints, mise en avant prioritaire.</p>
                <div className="text-[11px] text-purple-800 font-bold">Grands comptes & Événementiel</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Guide de Démonstration pas-à-pas pour l'évaluation */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-base">
            <Sparkles className="w-5 h-5" />
            <h2>4. Scénario de Démonstration en 5 Étapes pour votre Jury</h2>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-slate-100 text-sm block">Mode Visiteur :</strong>
                Explorez le catalogue, filtrez par catégorie (Menuiserie, Location, etc.) et cliquez sur "Demander un Rendez-vous" sur l'offre d'Ibrahima Diallo.
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-slate-100 text-sm block">Bascule Prestataire :</strong>
                Cliquez sur "Presta Actif (Menuisier)" dans la barre supérieure. Ouvrez l'onglet "Demandes de RDV" pour voir la notification reçue avec la description du client.
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-slate-100 text-sm block">Action Prestataire (Décaler ou Refuser avec raison) :</strong>
                Testez le bouton "Décaler" pour proposer un nouveau créneau et saisir la raison, ou "Valider le RDV".
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="text-slate-100 text-sm block">Vérification Client :</strong>
                Basculez sur le rôle "Client (Amina)". Allez dans "Mes Rendez-vous" : constatez l'apparition de l'alerte avec la nouvelle date et l'explication du prestataire !
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">5</span>
              <div>
                <strong className="text-slate-100 text-sm block">Contrôle Admin & KYC :</strong>
                Cliquez sur "Admin". Allez dans "Validations KYC" pour approuver Karim Benali (Serrurier en attente) et dans "Gestion des Catégories" pour ajouter une catégorie sur mesure.
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

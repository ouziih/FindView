import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  Sparkles,
  Check
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authDefaultRole, 
    login, 
    registerClient, 
    registerPrestataire, 
    switchUser 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'client' | 'prestataire'>(authDefaultRole);

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profession, setProfession] = useState('Menuisier Artisan');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [docName, setDocName] = useState('Justificatif_Identite_Kbis.pdf');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(email);
    if (!success) {
      setErrorMsg('Adresse email non reconnue. Utilisez un compte de test ci-dessous ou créez un compte.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !phone.trim() || !city.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (role === 'client') {
      registerClient({ name, email, phone, city });
    } else {
      if (!businessName.trim() || !profession.trim()) {
        setErrorMsg('Veuillez préciser le nom de votre entreprise et votre corps de métier.');
        return;
      }
      registerPrestataire({
        name,
        email,
        phone,
        whatsapp: whatsapp || phone,
        city,
        businessName,
        profession,
        bio: bio || 'Prestataire passionné au service de vos projets avec rigueur et savoir-faire.',
        experienceYears: Number(experienceYears),
        docName,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              {role === 'prestataire' ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-extrabold text-base leading-tight">
                {mode === 'login' ? 'Connexion à PrestaLink' : 'Création de Compte'}
              </h2>
              <p className="text-xs text-slate-400">
                {role === 'prestataire' ? 'Espace Professionnels & Prestataires' : 'Espace Client & Visiteur'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'login'
                ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Se Connecter
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'register'
                ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Créer un Compte
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Login Buttons */}
          {mode === 'login' && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 block">
                Comptes de démonstration 1-clic :
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { switchUser('user-client-1'); closeAuthModal(); }}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-left"
                >
                  <div className="font-bold text-slate-800">Amina Traoré</div>
                  <div className="text-[10px] text-blue-600 font-semibold">Compte Client</div>
                </button>

                <button
                  type="button"
                  onClick={() => { switchUser('user-presta-1'); closeAuthModal(); }}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-left"
                >
                  <div className="font-bold text-slate-800">Ibrahima Diallo</div>
                  <div className="text-[10px] text-amber-700 font-semibold">Presta Menuisier</div>
                </button>

                <button
                  type="button"
                  onClick={() => { switchUser('user-presta-4-pending'); closeAuthModal(); }}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:border-orange-400 text-left"
                >
                  <div className="font-bold text-slate-800">Karim Benali</div>
                  <div className="text-[10px] text-orange-600 font-semibold">Presta Attente KYC</div>
                </button>

                <button
                  type="button"
                  onClick={() => { switchUser('user-admin-1'); closeAuthModal(); }}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:border-rose-400 text-left"
                >
                  <div className="font-bold text-slate-800">Marc Duval</div>
                  <div className="text-[10px] text-rose-600 font-semibold">Admin Général</div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Adresse Email</label>
                <input
                  type="email"
                  placeholder="votre.email@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mot de Passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Se connecter
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Role Toggle */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vous souhaitez :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'client'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold ring-2 ring-blue-300'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Trouver un service (Client)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('prestataire')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'prestataire'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold ring-2 ring-amber-300'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Proposer des services (Presta)
                  </button>
                </div>
              </div>

              {/* Shared fields */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom Complet *</label>
                <input
                  type="text"
                  placeholder="Ex : Moussa Diop / Claire Martin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ville de résidence *</label>
                <input
                  type="text"
                  placeholder="Ex : Lyon, Paris, Marseille..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              {/* Prestataire specific fields */}
              {role === 'prestataire' && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Dossier Professionnel & KYC</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom commercial / Atelier *</label>
                    <input
                      type="text"
                      placeholder="Ex : Atelier Diop Bois & Design"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Métier / Spécialité *</label>
                    <input
                      type="text"
                      placeholder="Ex : Menuisier Ébéniste / Loueur d'espaces / Boutiquier"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Numéro WhatsApp Pro</label>
                    <input
                      type="tel"
                      placeholder="Ex : +33612345678"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  {/* Simulated Document Upload */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Pièce d'Identité & Kbis (Contrôle KYC)
                    </label>
                    <div className="p-3 bg-white rounded-xl border border-dashed border-amber-400 text-center">
                      <Upload className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                      <span className="text-[11px] text-slate-600 font-semibold block">
                        Fichier sélectionné : {docName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Votre dossier sera examiné par l'administrateur avant certification.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors mt-2"
              >
                Créer mon compte {role === 'prestataire' ? 'Prestataire' : 'Client'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

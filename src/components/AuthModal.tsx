import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Upload
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
      setErrorMsg('Adresse email non reconnue. Utilisez un profil de test ci-dessous.');
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
        setErrorMsg('Veuillez préciser le nom de votre entreprise et votre spécialité.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#18181B] p-5 text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <h2 className="font-bold text-sm leading-tight">
              {mode === 'login' ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="text-xs text-stone-400">
              {role === 'prestataire' ? 'Espace Professionnels' : 'Espace Clients & Visiteurs'}
            </p>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              mode === 'login'
                ? 'border-b-2 border-stone-900 text-stone-900 font-bold bg-stone-50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Se Connecter
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              mode === 'register'
                ? 'border-b-2 border-stone-900 text-stone-900 font-bold bg-stone-50'
                : 'text-stone-500 hover:text-stone-800'
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
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="text-[11px] font-bold text-stone-600 block">
                Comptes de test 1-clic :
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { switchUser('user-client-1'); closeAuthModal(); }}
                  className="p-2 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-left"
                >
                  <div className="font-bold text-stone-900">Amina Traoré</div>
                  <div className="text-[10px] text-stone-500 font-medium">Client</div>
                </button>

                <button
                  type="button"
                  onClick={() => { switchUser('user-presta-1'); closeAuthModal(); }}
                  className="p-2 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-left"
                >
                  <div className="font-bold text-stone-900">Ibrahima Diallo</div>
                  <div className="text-[10px] text-stone-500 font-medium">Presta Menuisier</div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3 pt-1">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Adresse Email</label>
                <input
                  type="email"
                  placeholder="votre.email@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mot de Passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-stone-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-[#B8522E] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Se connecter
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Role Toggle */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Votre profil :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'client'
                        ? 'border-stone-900 bg-stone-100 text-stone-900 font-bold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('prestataire')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'prestataire'
                        ? 'border-stone-900 bg-stone-100 text-stone-900 font-bold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Prestataire
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom Complet *</label>
                <input
                  type="text"
                  placeholder="Ex : Claire Martin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ville *</label>
                <input
                  type="text"
                  placeholder="Ex : Lyon, Paris..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300"
                  required
                />
              </div>

              {/* Prestataire fields */}
              {role === 'prestataire' && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nom d'Atelier / Enseigne *</label>
                    <input
                      type="text"
                      placeholder="Ex : Atelier Martin Ebénisterie"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Corps de métier *</label>
                    <input
                      type="text"
                      placeholder="Ex : Menuisier, Loueur d'espaces, Boutiquier..."
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">WhatsApp Professionnel</label>
                    <input
                      type="tel"
                      placeholder="+33612345678"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-center">
                    <span className="text-[11px] text-stone-700 font-semibold block">
                      Dossier KYC : {docName}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Sera soumis à l'administrateur pour certification.
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-[#B8522E] text-white font-bold text-xs transition-colors shadow-xs mt-2"
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

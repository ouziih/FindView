import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCard } from './ServiceCard';
import { 
  Search, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  MessageSquare, 
  CalendarCheck, 
  Sparkles, 
  Hammer, 
  Building2, 
  ShoppingBag, 
  Wrench, 
  Laptop, 
  Scissors, 
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Hammer: Hammer,
  Building2: Building2,
  ShoppingBag: ShoppingBag,
  Wrench: Wrench,
  Laptop: Laptop,
  Scissors: Scissors,
};

export const VisitorHome: React.FC = () => {
  const { services, categories, openAuthModal, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [pricingFilter, setPricingFilter] = useState<string>('all');

  // Distinct cities from services
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    services.forEach(s => {
      // simplify city name
      const mainCity = s.city.split(' ')[0].replace(/,/g, '');
      if (mainCity) cities.add(mainCity);
    });
    return Array.from(cities);
  }, [services]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Must be active
      if (!service.isActive) return false;

      // Category filter
      if (selectedCategory !== 'all' && service.categoryId !== selectedCategory) {
        return false;
      }

      // City filter
      if (selectedCity !== 'all' && !service.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }

      // Verified provider filter
      if (onlyVerified && !service.providerVerified) {
        return false;
      }

      // Pricing filter
      if (pricingFilter !== 'all' && service.pricingType !== pricingFilter) {
        return false;
      }

      // Search keyword filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesProvider = service.providerName.toLowerCase().includes(query);
        const matchesTags = service.tags.some(t => t.toLowerCase().includes(query));
        const matchesCat = service.categoryName.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesProvider && !matchesTags && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [services, selectedCategory, selectedCity, onlyVerified, pricingFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-6 border border-amber-500/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mise en relation directe • 0% commission client</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            Trouvez les meilleurs <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              Prestataires & Artisans
            </span> de proximité
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Menuisiers, gérants de salles, commerçants, réparateurs et spécialistes. 
            Consultez leurs réalisations, contactez-les par WhatsApp ou réservez un rendez-vous directement.
          </p>

          {/* Interactive Search Bar Box */}
          <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl max-w-4xl mx-auto text-slate-800 border border-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              
              {/* Keyword Input */}
              <div className="md:col-span-5 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Search className="w-5 h-5 text-amber-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Que cherchez-vous ? (menuisier, salle, réparation...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
                />
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Filter className="w-5 h-5 text-slate-400 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 focus:outline-hidden font-medium cursor-pointer"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.filter(c => c.isActive).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="md:col-span-3 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 focus:outline-hidden font-medium cursor-pointer"
                >
                  <option value="all">Toutes les villes</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2.5 mt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-600">Recherches populaires :</span>
                {['Menuiserie sur-mesure', 'Loft événementiel', 'Réparation iPhone', 'Boutique locale'].map((keyword, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchTerm(keyword)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-800 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-amber-600 font-medium hover:underline text-xs"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars / Value Prop Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Prestataires Vérifiés (KYC)</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Pièce d’identité et inscription professionnelle auditées par l’administrateur avant toute mise en avant.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Contact Direct WhatsApp ou Appel</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Échangez librement avec les artisans, posez vos questions techniques et comparez les devis sans intermédiaire.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Prise de RDV & Notifications</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Suivez en temps réel la validation, le décalage ou le refus de vos demandes avec motifs détaillés.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Catégories de Prestations</h2>
            <p className="text-xs text-slate-500">Explorez les corps de métiers disponibles sur la plateforme</p>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === 'all' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes ({services.filter(s => s.isActive).length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.filter(c => c.isActive).map(cat => {
            const IconComp = CATEGORY_ICONS[cat.icon] || Hammer;
            const count = services.filter(s => s.categoryId === cat.id && s.isActive).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 line-clamp-1">{cat.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{count} service{count > 1 ? 's' : ''}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Listing Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Listing Filters Header */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              {filteredServices.length} prestation{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
            </span>
            {selectedCategory !== 'all' && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                onlyVerified 
                  ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${onlyVerified ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Prestataires vérifiés uniquement</span>
            </button>

            {/* Pricing Model Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <select
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer pr-1"
              >
                <option value="all">Tous types de tarif</option>
                <option value="quote">Sur devis</option>
                <option value="hourly">À l'heure</option>
                <option value="daily">À la journée</option>
                <option value="fixed">Tarif fixe</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'all' || selectedCity !== 'all' || onlyVerified || pricingFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCity('all');
                  setOnlyVerified(false);
                  setPricingFilter('all');
                  setSearchTerm('');
                }}
                className="text-amber-600 font-semibold hover:underline px-2 py-1"
              >
                Réinitialiser filtres
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Aucun résultat ne correspond à votre recherche</h3>
            <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
              Essayez d'élargir vos filtres de catégorie, de désactiver le filtre vérifié ou d'essayer un autre mot-clé.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCity('all');
                setOnlyVerified(false);
                setPricingFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              Afficher tous les services
            </button>
          </div>
        )}

        {/* Callout Provider Conversion Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Espace Professionnels & Artisans
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-2">
              Vous êtes menuisier, gérant de locaux ou commerçant ?
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Créez votre profil en quelques minutes, soumettez vos documents de vérification (KYC) et recevez des demandes de rendez-vous qualifiées directement sur votre téléphone.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openAuthModal('prestataire')}
              className="px-6 py-3.5 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-md hover:bg-amber-50 transition-all flex items-center gap-2 justify-center"
            >
              <span>Créer mon Compte Prestataire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

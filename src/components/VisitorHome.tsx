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
  Hammer, 
  Building2, 
  ShoppingBag, 
  Wrench, 
  Laptop, 
  Scissors, 
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  ArrowUpRight
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
  const { services, categories, openAuthModal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [pricingFilter, setPricingFilter] = useState<string>('all');

  // Distinct cities from services
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    services.forEach(s => {
      const mainCity = s.city.split(' ')[0].replace(/,/g, '');
      if (mainCity) cities.add(mainCity);
    });
    return Array.from(cities);
  }, [services]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (!service.isActive) return false;

      if (selectedCategory !== 'all' && service.categoryId !== selectedCategory) {
        return false;
      }

      if (selectedCity !== 'all' && !service.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }

      if (onlyVerified && !service.providerVerified) {
        return false;
      }

      if (pricingFilter !== 'all' && service.pricingType !== pricingFilter) {
        return false;
      }

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
    <div className="min-h-screen bg-[#FBFBFA] text-stone-900 pb-20">
      
      {/* ========================================================================= */}
      {/* HERO SECTION: ARCHITECTURAL, CLEAN, NO ABRUPT CUTOFF                     */}
      {/* ========================================================================= */}
      <section className="relative bg-[#18181B] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        
        {/* Subtle architectural grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Quiet Monochromatic Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 text-[11px] font-medium tracking-wide mb-6 border border-stone-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8522E]" />
            <span>Réseau d'artisans & prestataires qualifiés</span>
            <span className="text-stone-500">·</span>
            <span className="text-stone-400">Sans commission intermédiaire</span>
          </div>

          {/* Pure Typographic Headline with Balanced Measure */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.12] text-balance">
            Trouvez les artisans et services de confiance près de chez vous.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-400 mb-10 leading-relaxed font-normal">
            Menuiserie d'art, location d'espaces, commerces locaux et dépannage technique.
            Échangez directement sur WhatsApp ou réservez un créneau en quelques clics.
          </p>

          {/* ===================================================================== */}
          {/* SEARCH BAR CONSOLE: MONOLITHIC, SEAMLESS, COHESIVE                     */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-2xl p-2 shadow-xl shadow-black/20 max-w-3xl mx-auto text-stone-800 border border-stone-200">
            <div className="flex flex-col md:flex-row items-stretch gap-1">
              
              {/* Keyword Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Que recherchez-vous ? (menuisier, loft, dépannage...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden font-medium"
                />
              </div>

              <div className="hidden md:block w-px bg-stone-200 my-2" />

              {/* Category Dropdown */}
              <div className="md:w-56 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors">
                <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-700 focus:outline-hidden font-medium cursor-pointer"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.filter(c => c.isActive).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="hidden md:block w-px bg-stone-200 my-2" />

              {/* City Dropdown */}
              <div className="md:w-44 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-700 focus:outline-hidden font-medium cursor-pointer"
                >
                  <option value="all">Toutes villes</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => {}}
                className="px-5 py-2.5 rounded-xl bg-[#B8522E] hover:bg-[#A34524] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>Rechercher</span>
              </button>
            </div>

            {/* Unboxed Minimalist Search Suggestions (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-2.5 pb-1 mt-1 border-t border-stone-100 text-[11px] text-stone-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-400 font-medium">Recherches fréquentes :</span>
                {['Menuiserie sur-mesure', 'Loft événementiel', 'Réparation High-Tech', 'Boutique artisanale'].map((keyword, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchTerm(keyword)}
                    className="text-stone-700 hover:text-[#B8522E] hover:underline transition-colors font-medium"
                  >
                    {keyword}{i < 3 ? ' ·' : ''}
                  </button>
                ))}
              </div>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-stone-400 hover:text-stone-800 transition-colors text-[11px]"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 PILLARS: DISCIPLINED MONOCHROME ARCHITECTURAL CARDS (NO RAINBOW ICONS!) */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-start gap-4 hover:border-stone-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 border border-stone-200/60">
              <ShieldCheck className="w-5 h-5 text-stone-800" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-xs mb-1">Agréments & KYC Contrôlés</h2>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Pièce d'identité et immatriculation vérifiées par l'administrateur avant toute mise en relation.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-start gap-4 hover:border-stone-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 border border-stone-200/60">
              <MessageSquare className="w-5 h-5 text-stone-800" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-xs mb-1">Contact Direct WhatsApp & Appel</h2>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Échangez librement avec les professionnels sans barrière technique ni commission intermédiaire.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-start gap-4 hover:border-stone-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 border border-stone-200/60">
              <CalendarCheck className="w-5 h-5 text-stone-800" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-xs mb-1">Prise de Rendez-vous Tracée</h2>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Suivi transparent des demandes, notifications immédiates avec motifs de report ou refus détaillés.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORIES BROWSER: COHESIVE, MONOCHROME, ARCHITECTURAL                   */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Secteurs & Métiers Référencés</h2>
            <p className="text-xs text-stone-500">Parcourez les prestations par corps d'activité</p>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-stone-900 text-white' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Tous ({services.filter(s => s.isActive).length})
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
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected 
                    ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-xs' 
                    : 'border-stone-200/90 bg-white hover:border-stone-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200/70'
                }`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900 truncate">{cat.name}</div>
                  <div className="text-[11px] text-stone-400 font-mono tabular-nums">{count} offre{count > 1 ? 's' : ''}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SERVICES CATALOG LISTING: CLEAN CONTROLS & CARDS GRID                     */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Listing Filters Header */}
        <div className="bg-white rounded-xl p-3.5 border border-stone-200/90 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-stone-900">
              {filteredServices.length} prestation{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-stone-500 font-medium">
                dans <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
              </span>
            )}
          </div>

          {/* Quick Segmented Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                onlyVerified 
                  ? 'bg-stone-900 border-stone-900 text-white font-semibold' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${onlyVerified ? 'text-white' : 'text-stone-400'}`} />
              <span>Agréés KYC uniquement</span>
            </button>

            {/* Pricing Model Filter */}
            <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1.5 rounded-lg border border-stone-200">
              <SlidersHorizontal className="w-3 h-3 text-stone-500" />
              <select
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value)}
                className="bg-transparent text-xs text-stone-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="all">Tous types de facturation</option>
                <option value="quote">Sur devis</option>
                <option value="hourly">À l'heure</option>
                <option value="daily">À la journée</option>
                <option value="fixed">Forfait fixe</option>
              </select>
            </div>

            {/* Reset */}
            {(selectedCategory !== 'all' || selectedCity !== 'all' || onlyVerified || pricingFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCity('all');
                  setOnlyVerified(false);
                  setPricingFilter('all');
                  setSearchTerm('');
                }}
                className="text-[#B8522E] font-semibold hover:underline px-2 py-1 text-xs"
              >
                Réinitialiser
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
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-md mx-auto my-8">
            <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-stone-900 text-sm mb-1">Aucune prestation trouvée</h3>
            <p className="text-stone-500 text-xs mb-4">
              Ajustez vos filtres ou sélectionnez une autre catégorie.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCity('all');
                setOnlyVerified(false);
                setPricingFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Afficher tout le catalogue
            </button>
          </div>
        )}

        {/* Pro Join Banner: Clean, Architectural, Dignified */}
        <div className="mt-16 bg-[#18181B] rounded-2xl p-8 sm:p-10 text-white border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Espace Professionnels & Artisans
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Vous êtes menuisier, gérant de locaux ou commerçant ?
            </h3>
            <p className="text-stone-400 text-xs leading-relaxed">
              Créez votre vitrine, soumettez votre dossier de conformité (KYC) et recevez des demandes de rendez-vous qualifiées directement auprès de clients locaux.
            </p>
          </div>

          <button
            onClick={() => openAuthModal('prestataire')}
            className="px-5 py-3 rounded-xl bg-white text-stone-950 font-bold text-xs hover:bg-stone-100 transition-all flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Créer mon Espace Prestataire</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </main>
    </div>
  );
};

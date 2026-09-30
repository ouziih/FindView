import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Building,
  Briefcase
} from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const { 
    selectedService, 
    setSelectedService, 
    setBookingService, 
    setChatPartner, 
    users 
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!selectedService) return null;

  const provider = users.find(u => u.id === selectedService.providerId);

  const formatPrice = () => {
    if (selectedService.pricingType === 'quote') {
      return `Dès ${selectedService.price} ${selectedService.currency} (Sur devis)`;
    }
    if (selectedService.pricingType === 'hourly') {
      return `${selectedService.price} ${selectedService.currency} / heure`;
    }
    if (selectedService.pricingType === 'daily') {
      return `${selectedService.price} ${selectedService.currency} / jour`;
    }
    return `${selectedService.price} ${selectedService.currency}`;
  };

  const openWhatsApp = () => {
    const cleanNumber = selectedService.providerWhatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Bonjour ${selectedService.providerName}, j'ai vu votre offre "${selectedService.title}" sur PrestaLink et j'aimerais échanger avec vous.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const callPhone = () => {
    window.location.href = `tel:${selectedService.providerPhone}`;
  };

  const startChat = () => {
    if (provider) {
      setChatPartner({ recipient: provider });
      setSelectedService(null);
    }
  };

  const handleBook = () => {
    setBookingService(selectedService);
    setSelectedService(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedService(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Gallery Carousel */}
          <div className="relative h-64 sm:h-80 bg-slate-950">
            <img
              src={selectedService.images[activeImageIdx] || selectedService.images[0]}
              alt={selectedService.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Custom Branding Badge */}
            {selectedService.customBranding?.badgeText && (
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${selectedService.customBranding.badgeColor || 'bg-amber-600 text-white'}`}>
                  {selectedService.customBranding.badgeText}
                </span>
              </div>
            )}

            {/* Carousel Arrows if multiple images */}
            {selectedService.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev === 0 ? selectedService.images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-colors"
                  aria-label="Photo précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev === selectedService.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-colors"
                  aria-label="Photo suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {selectedService.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeImageIdx === idx ? 'w-6 bg-amber-500' : 'w-2 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pricing Tag Overlay */}
            <div className="absolute bottom-4 right-4 z-10">
              <span className="text-sm font-extrabold px-3 py-1.5 rounded-xl bg-amber-500 text-white shadow-lg">
                {formatPrice()}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  {selectedService.categoryName}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedService.city}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {selectedService.title}
              </h2>
            </div>

            {/* Provider Profile Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedService.providerAvatar}
                  alt={selectedService.providerName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {selectedService.providerName}
                    </span>
                    {selectedService.providerVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        KYC Validé
                      </span>
                    )}
                  </div>
                  
                  {provider?.businessName && (
                    <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {provider.businessName}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {selectedService.providerRating.toFixed(1)} ({provider?.reviewCount || 12} avis)
                    </span>
                    {provider?.experienceYears && (
                      <span>• {provider.experienceYears} ans d'expérience</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick direct contact links */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={openWhatsApp}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  title="Ouvrir WhatsApp"
                >
                  <span className="font-bold text-xs">WhatsApp</span>
                </button>
                <button
                  onClick={callPhone}
                  className="p-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
                  title={`Téléphoner (${selectedService.providerPhone})`}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={startChat}
                  className="p-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
                  title="Message interne PrestaLink"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Description de la Prestation
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-100">
                {selectedService.description}
              </p>
            </div>

            {/* Provider Bio snippet */}
            {provider?.bio && (
              <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 text-xs text-slate-600">
                <span className="font-bold text-amber-900 block mb-1">À propos de l'artisan / prestataire :</span>
                {provider.bio}
              </div>
            )}

            {/* Location & Coverage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Localisation & Déplacement
                </div>
                <div className="text-slate-600">{selectedService.locationDetails || selectedService.city}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Modalités & Tarification
                </div>
                <div className="text-slate-600">
                  {selectedService.pricingType === 'quote' ? 'Devis gratuit sous 24h après premier échange' : 'Tarif transparent, sans frais cachés'}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-slate-400 font-medium">Spécialités :</span>
              {selectedService.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Tarif estimé</span>
            <span className="text-lg font-extrabold text-slate-900">{formatPrice()}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openWhatsApp}
              className="hidden sm:flex px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold items-center gap-1.5 transition-colors"
            >
              <span>WhatsApp Direct</span>
            </button>

            <button
              onClick={handleBook}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Demander un Rendez-vous</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

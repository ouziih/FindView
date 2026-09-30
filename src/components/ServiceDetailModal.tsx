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
  ChevronLeft, 
  ChevronRight,
  Building
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedService(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Gallery Carousel */}
          <div className="relative h-64 sm:h-80 bg-stone-950">
            <img
              src={selectedService.images[activeImageIdx] || selectedService.images[0]}
              alt={selectedService.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Custom Branding Badge */}
            {selectedService.customBranding?.badgeText && (
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-stone-900/90 text-white backdrop-blur-xs border border-white/10 shadow-xs">
                  {selectedService.customBranding.badgeText}
                </span>
              </div>
            )}

            {/* Carousel Arrows */}
            {selectedService.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev === 0 ? selectedService.images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-colors"
                  aria-label="Photo précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImageIdx(prev => (prev === selectedService.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-colors"
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
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIdx === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pricing Tag Overlay */}
            <div className="absolute bottom-4 right-4 z-10">
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-white text-stone-900 shadow-md tabular-nums">
                {formatPrice()}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-stone-500">
                  {selectedService.categoryName}
                </span>
                <span className="text-stone-300">·</span>
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{selectedService.city}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                {selectedService.title}
              </h2>
            </div>

            {/* Provider Profile Card (Architectural & Clean) */}
            <div className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedService.providerAvatar}
                  alt={selectedService.providerName}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-stone-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {selectedService.providerName}
                    </span>
                    {selectedService.providerVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-200/70 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-stone-800" />
                        KYC Agréé
                      </span>
                    )}
                  </div>
                  
                  {provider?.businessName && (
                    <div className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      {provider.businessName}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1 font-semibold text-stone-800">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-mono tabular-nums">{selectedService.providerRating.toFixed(1)}</span>
                      <span className="text-stone-400 font-normal">({provider?.reviewCount || 12} avis)</span>
                    </span>
                    {provider?.experienceYears && (
                      <span>· {provider.experienceYears} ans d'expérience</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct Contact buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={openWhatsApp}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-stone-900 text-white font-medium text-xs hover:bg-[#B8522E] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={callPhone}
                  className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
                  title={`Téléphoner (${selectedService.providerPhone})`}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={startChat}
                  className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
                  title="Message interne PrestaLink"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                Description de la Prestation
              </h3>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 rounded-xl border border-stone-200/80">
                {selectedService.description}
              </p>
            </div>

            {/* Provider Bio snippet */}
            {provider?.bio && (
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-stone-600">
                <span className="font-bold text-stone-900 block mb-1">À propos du professionnel :</span>
                {provider.bio}
              </div>
            )}

            {/* Location & Coverage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-stone-500" />
                  Rayon d'intervention
                </div>
                <div className="text-stone-600">{selectedService.locationDetails || selectedService.city}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-stone-500" />
                  Modalités
                </div>
                <div className="text-stone-600">
                  {selectedService.pricingType === 'quote' ? 'Devis gratuit sous 24h après premier contact' : 'Tarification claire sans frais cachés'}
                </div>
              </div>
            </div>

            {/* Tags Unboxed */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-stone-500">
              <span className="text-stone-400 font-medium">Mots-clés :</span>
              {selectedService.tags.map((tag, idx) => (
                <span key={idx} className="text-stone-600">
                  #{tag}{idx < selectedService.tags.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">Tarification</span>
            <span className="text-base font-bold text-stone-900 font-mono tabular-nums">{formatPrice()}</span>
          </div>

          <button
            onClick={handleBook}
            className="px-6 py-2.5 rounded-xl bg-[#B8522E] hover:bg-[#A34524] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Demander un Rendez-vous</span>
          </button>
        </div>

      </div>
    </div>
  );
};

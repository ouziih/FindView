import React from 'react';
import { Service } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Calendar, 
  Tag
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { setSelectedService, setBookingService, setChatPartner, users } = useApp();

  const provider = users.find(u => u.id === service.providerId);

  const formatPrice = () => {
    if (service.pricingType === 'quote') {
      return `Dès ${service.price} ${service.currency} (Sur devis)`;
    }
    if (service.pricingType === 'hourly') {
      return `${service.price} ${service.currency} / h`;
    }
    if (service.pricingType === 'daily') {
      return `${service.price} ${service.currency} / j`;
    }
    return `${service.price} ${service.currency}`;
  };

  const openWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = service.providerWhatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Bonjour ${service.providerName}, j'ai vu votre prestation "${service.title}" sur PrestaLink et j'aimerais échanger avec vous.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const callPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${service.providerPhone}`;
  };

  const startInAppChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (provider) {
      setChatPartner({ recipient: provider });
    }
  };

  return (
    <article 
      onClick={() => setSelectedService(service)}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-stone-400 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer"
    >
      {/* Image Thumbnail with Controlled Overlays */}
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        <img
          src={service.images[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Custom Branding Badge (Dignified styling) */}
        {service.customBranding?.badgeText && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-stone-900/90 text-white backdrop-blur-xs border border-white/10 shadow-xs">
              {service.customBranding.badgeText}
            </span>
          </div>
        )}

        {/* Category Unboxed Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-medium text-white/90 drop-shadow-xs">
            {service.categoryName}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white text-stone-900 shadow-sm tabular-nums">
            {formatPrice()}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Provider Mini Header (Unboxed & Clean) */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <img
                src={service.providerAvatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-200"
              />
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                {service.providerName}
                {service.providerVerified && (
                  <span title="Prestataire vérifié KYC">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-700 fill-stone-100" />
                  </span>
                )}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs font-semibold text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-mono tabular-nums">{service.providerRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-[#B8522E] transition-colors mb-1.5">
            {service.title}
          </h3>

          {/* Description snippet */}
          <p className="text-stone-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {service.description}
          </p>

          {/* Unboxed Metadata Line (Zero-Pill discipline) */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-4">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate text-stone-600">{service.city}</span>
            <span>·</span>
            <span className="truncate text-stone-500">{service.tags.slice(0, 2).join(' · ')}</span>
          </div>
        </div>

        {/* Footer Actions: Contact & Booking in Cohesive Palette */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          
          {/* Quick Contact Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 text-[11px]">Direct :</span>
            <div className="flex items-center gap-1.5">
              {/* WhatsApp direct */}
              <button
                onClick={openWhatsApp}
                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-[11px] transition-colors flex items-center gap-1"
                title={`Discuter sur WhatsApp (${service.providerWhatsapp})`}
                aria-label="Contacter sur WhatsApp"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span className="font-mono font-bold text-[10px]">WhatsApp</span>
              </button>

              {/* Direct Call */}
              <button
                onClick={callPhone}
                className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                title={`Appeler (${service.providerPhone})`}
                aria-label="Appeler le prestataire"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>

              {/* In-app Message */}
              <button
                onClick={startInAppChat}
                className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                title="Message interne dans l'application"
                aria-label="Envoyer un message interne"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Action Button: Demander un Rendez-vous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookingService(service);
            }}
            className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-[#B8522E] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Demander un Rendez-vous</span>
          </button>
        </div>
      </div>
    </article>
  );
};

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
  Eye, 
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
      return `${service.price} ${service.currency} / heure`;
    }
    if (service.pricingType === 'daily') {
      return `${service.price} ${service.currency} / jour`;
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
      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1 relative"
    >
      {/* Image Thumbnail with Overlay Badges */}
      <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
        <img
          src={service.images[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Custom Branding Badge */}
        {service.customBranding?.badgeText && (
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md ${service.customBranding.badgeColor || 'bg-amber-600 text-white'}`}>
              {service.customBranding.badgeText}
            </span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm text-white flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {service.categoryName}
          </span>
        </div>

        {/* Pricing Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500 text-white shadow-md">
            {formatPrice()}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Provider Mini Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <img
                src={service.providerAvatar}
                alt={service.providerName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  {service.providerName}
                  {service.providerVerified && (
                    <span title="Prestataire vérifié KYC">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{service.providerRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
            {service.title}
          </h3>

          {/* Description snippet */}
          <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed">
            {service.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{service.city}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {service.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions: Contact & Booking */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {/* Quick Contact Icons */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-400 text-[11px]">Joindre directement :</span>
            <div className="flex items-center gap-1.5">
              {/* WhatsApp direct */}
              <button
                onClick={openWhatsApp}
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                title={`Discuter sur WhatsApp (${service.providerWhatsapp})`}
                aria-label="Contacter sur WhatsApp"
              >
                <span className="font-bold text-[11px] px-1">WA</span>
              </button>

              {/* Direct Call */}
              <button
                onClick={callPhone}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                title={`Appeler (${service.providerPhone})`}
                aria-label="Appeler le prestataire"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>

              {/* In-app Message */}
              <button
                onClick={startInAppChat}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
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
            className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Demander un Rendez-vous</span>
          </button>
        </div>
      </div>
    </article>
  );
};

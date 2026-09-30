export type UserRole = 'visitor' | 'client' | 'prestataire' | 'admin';

export type KycStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  city: string;
  address?: string;
  isActive: boolean;
  createdAt: string;

  // Prestataire specific fields
  businessName?: string;
  profession?: string;
  bio?: string;
  kycStatus?: KycStatus;
  kycRejectionReason?: string;
  kycSubmittedAt?: string;
  kycDocs?: {
    idCardName?: string;
    tradeRegisterName?: string;
    portfolioUrl?: string;
  };
  whatsappNumber?: string;
  rating?: number;
  reviewCount?: number;
  experienceYears?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name string
  description: string;
  color: string;
  isActive: boolean;
}

export type PricingType = 'fixed' | 'hourly' | 'daily' | 'quote';

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  providerPhone: string;
  providerWhatsapp: string;
  providerVerified: boolean;
  
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  
  pricingType: PricingType;
  price: number;
  currency: string;
  
  city: string;
  locationDetails: string;
  tags: string[];
  
  isActive: boolean;
  isFeatured?: boolean;
  
  customBranding?: {
    badgeText?: string;
    badgeColor?: string; // hex or tailwind class
  };
  
  viewCount: number;
  bookingCount: number;
  createdAt: string;
}

export type AppointmentStatus = 
  | 'pending'       // En attente de validation par le prestataire
  | 'accepted'      // Validé / Confirmé
  | 'rescheduled'   // Décalé (proposition d'une nouvelle date avec raison)
  | 'rejected'      // Refusé (avec motif obligatoire)
  | 'completed'     // Prestation terminée
  | 'cancelled';    // Annulé par le client

export interface Appointment {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerWhatsapp: string;
  providerAvatar: string;
  
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAvatar: string;
  
  requestedDate: string; // YYYY-MM-DD
  requestedTimeSlot: string; // "09:00 - 10:30"
  clientDescription: string;
  address?: string;
  
  status: AppointmentStatus;
  statusReason?: string; // Raison de refus ou d'ajournement
  proposedNewDate?: string;
  proposedNewTimeSlot?: string;
  
  priceEstimate?: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'appointment_new'         // Reçu par le prestataire
  | 'appointment_accepted'    // Reçu par le client
  | 'appointment_rescheduled' // Reçu par le client
  | 'appointment_rejected'    // Reçu par le client
  | 'kyc_approved'           // Reçu par le prestataire
  | 'kyc_rejected'           // Reçu par le prestataire
  | 'system';

export interface AppNotification {
  id: string;
  recipientId: string;
  senderName?: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedAppointmentId?: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  appointmentId?: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  createdAt: string;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Category, 
  Service, 
  Appointment, 
  AppointmentStatus, 
  AppNotification, 
  ChatMessage 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  categories: Category[];
  services: Service[];
  appointments: Appointment[];
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
  activeTab: 'home' | 'appointments' | 'pro-dashboard' | 'admin-dashboard' | 'presentation';
  selectedService: Service | null;
  bookingService: Service | null;
  chatPartner: { recipient: User; appointment?: Appointment } | null;
  isNotificationDrawerOpen: boolean;
  isAuthModalOpen: boolean;
  authDefaultRole: 'client' | 'prestataire';

  // Navigation & Modals
  setActiveTab: (tab: 'home' | 'appointments' | 'pro-dashboard' | 'admin-dashboard' | 'presentation') => void;
  setSelectedService: (service: Service | null) => void;
  setBookingService: (service: Service | null) => void;
  setChatPartner: (partner: { recipient: User; appointment?: Appointment } | null) => void;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  openAuthModal: (role?: 'client' | 'prestataire') => void;
  closeAuthModal: () => void;

  // Role switching & Auth
  switchUser: (userId: string | null) => void;
  login: (email: string) => boolean;
  registerClient: (data: { name: string; email: string; phone: string; city: string; address?: string }) => void;
  registerPrestataire: (data: { 
    name: string; 
    email: string; 
    phone: string; 
    whatsapp: string; 
    city: string; 
    businessName: string; 
    profession: string; 
    bio: string; 
    experienceYears: number;
    docName?: string;
  }) => void;
  logout: () => void;

  // Prestataire Service Management
  createService: (serviceData: {
    title: string;
    description: string;
    categoryId: string;
    images: string[];
    pricingType: 'fixed' | 'hourly' | 'daily' | 'quote';
    price: number;
    currency: string;
    city: string;
    locationDetails: string;
    tags: string[];
    customBadgeText?: string;
    customBadgeColor?: string;
  }) => void;
  updateService: (serviceId: string, serviceData: Partial<Service>) => void;
  toggleServiceActive: (serviceId: string) => void;
  deleteService: (serviceId: string) => void;

  // Appointments (Client & Prestataire)
  requestAppointment: (data: {
    serviceId: string;
    requestedDate: string;
    requestedTimeSlot: string;
    clientDescription: string;
    address?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
  }) => Appointment | null;
  
  respondToAppointment: (
    appointmentId: string, 
    newStatus: AppointmentStatus, 
    reason?: string, 
    proposedDate?: string, 
    proposedTime?: string
  ) => void;
  
  cancelAppointmentByClient: (appointmentId: string, reason?: string) => void;
  acceptRescheduledAppointment: (appointmentId: string) => void;

  // Admin Actions
  adminApproveKyc: (providerId: string) => void;
  adminRejectKyc: (providerId: string, reason: string) => void;
  adminToggleUserStatus: (userId: string) => void;
  adminAddCategory: (categoryData: Omit<Category, 'id' | 'slug'>) => void;
  adminUpdateCategory: (categoryId: string, data: Partial<Category>) => void;
  adminToggleCategoryActive: (categoryId: string) => void;
  adminToggleServiceFeatured: (serviceId: string) => void;

  // Notifications
  unreadNotificationsCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (notificationId: string) => void;

  // Chat
  sendChatMessage: (recipientId: string, text: string, appointmentId?: string) => void;

  // Reset
  resetDataToFactory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'prestalink_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage initializers
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user_id`);
    if (savedId === 'visitor') return null;
    if (savedId) {
      const found = INITIAL_USERS.find(u => u.id === savedId);
      if (found) return found;
    }
    // Default to the Prestataire Ibrahima Diallo for rich initial demonstration
    return INITIAL_USERS.find(u => u.id === 'user-presta-1') || null;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}chat`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-1',
        appointmentId: 'apt-1',
        senderId: 'user-client-1',
        senderName: 'Amina Traoré',
        recipientId: 'user-presta-1',
        text: 'Bonjour M. Diallo, avez-vous des photos d’un meuble TV similaire au modèle chêne clair ?',
        createdAt: '2025-03-01T15:25:00Z',
      },
      {
        id: 'msg-2',
        appointmentId: 'apt-1',
        senderId: 'user-presta-1',
        senderName: 'Ibrahima Diallo',
        recipientId: 'user-client-1',
        text: 'Bonjour Mme Traoré ! Oui tout à fait, je prépare une sélection que nous pourrons examiner lors du rendez-vous.',
        createdAt: '2025-03-01T15:30:00Z',
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'appointments' | 'pro-dashboard' | 'admin-dashboard' | 'presentation'>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [chatPartner, setChatPartner] = useState<{ recipient: User; appointment?: Appointment } | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'client' | 'prestataire'>('client');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}chat`, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user_id`, currentUser.id);
    } else {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user_id`, 'visitor');
    }
  }, [currentUser]);

  // Auth Helpers
  const openAuthModal = (role: 'client' | 'prestataire' = 'client') => {
    setAuthDefaultRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchUser = (userId: string | null) => {
    if (!userId) {
      setCurrentUser(null);
      setActiveTab('home');
      return;
    }
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'prestataire') {
        setActiveTab('pro-dashboard');
      } else if (user.role === 'admin') {
        setActiveTab('admin-dashboard');
      } else if (user.role === 'client') {
        setActiveTab('home');
      }
    }
  };

  const login = (email: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      closeAuthModal();
      if (user.role === 'prestataire') setActiveTab('pro-dashboard');
      else if (user.role === 'admin') setActiveTab('admin-dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const registerClient = (data: { name: string; email: string; phone: string; city: string; address?: string }) => {
    const newUser: User = {
      id: `user-client-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'client',
      phone: data.phone,
      city: data.city,
      address: data.address,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=200&auto=format&fit=crop&q=80`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    closeAuthModal();
  };

  const registerPrestataire = (data: { 
    name: string; 
    email: string; 
    phone: string; 
    whatsapp: string; 
    city: string; 
    businessName: string; 
    profession: string; 
    bio: string; 
    experienceYears: number;
    docName?: string;
  }) => {
    const newPro: User = {
      id: `user-presta-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'prestataire',
      phone: data.phone,
      whatsappNumber: data.whatsapp,
      city: data.city,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      businessName: data.businessName,
      profession: data.profession,
      bio: data.bio,
      experienceYears: data.experienceYears,
      kycStatus: 'pending', // Pending validation by Admin as specified!
      kycSubmittedAt: new Date().toISOString(),
      kycDocs: {
        idCardName: data.docName || 'Dossier_KYC_PieceIdentite.pdf',
        tradeRegisterName: 'Immatriculation_Professionnelle.pdf',
      },
      rating: 5.0,
      reviewCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [newPro, ...prev]);
    setCurrentUser(newPro);
    closeAuthModal();
    setActiveTab('pro-dashboard');

    // Notify admins of new KYC request
    const adminNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'user-admin-1',
      senderName: data.name,
      title: 'Nouvelle inscription Prestataire (KYC en attente)',
      message: `${data.businessName} (${data.profession}) s'est inscrit et attend votre validation administrative.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  // Prestataire Service Operations
  const createService = (serviceData: {
    title: string;
    description: string;
    categoryId: string;
    images: string[];
    pricingType: 'fixed' | 'hourly' | 'daily' | 'quote';
    price: number;
    currency: string;
    city: string;
    locationDetails: string;
    tags: string[];
    customBadgeText?: string;
    customBadgeColor?: string;
  }) => {
    if (!currentUser || currentUser.role !== 'prestataire') return;

    const cat = categories.find(c => c.id === serviceData.categoryId);
    const newService: Service = {
      id: `srv-${Date.now()}`,
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerAvatar: currentUser.avatar,
      providerRating: currentUser.rating || 5.0,
      providerPhone: currentUser.phone,
      providerWhatsapp: currentUser.whatsappNumber || currentUser.phone,
      providerVerified: currentUser.kycStatus === 'approved',
      title: serviceData.title,
      description: serviceData.description,
      categoryId: serviceData.categoryId,
      categoryName: cat ? cat.name : 'Service',
      images: serviceData.images.length > 0 ? serviceData.images : ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'],
      pricingType: serviceData.pricingType,
      price: serviceData.price,
      currency: serviceData.currency || '€',
      city: serviceData.city,
      locationDetails: serviceData.locationDetails,
      tags: serviceData.tags,
      isActive: true,
      customBranding: serviceData.customBadgeText ? {
        badgeText: serviceData.customBadgeText,
        badgeColor: serviceData.customBadgeColor || 'bg-amber-600 text-white',
      } : undefined,
      viewCount: 1,
      bookingCount: 0,
      createdAt: new Date().toISOString(),
    };

    setServices(prev => [newService, ...prev]);
  };

  const updateService = (serviceId: string, serviceData: Partial<Service>) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, ...serviceData };
      }
      return s;
    }));
  };

  const toggleServiceActive = (serviceId: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, isActive: !s.isActive };
      }
      return s;
    }));
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  // Appointment Flow & Notifications
  const requestAppointment = (data: {
    serviceId: string;
    requestedDate: string;
    requestedTimeSlot: string;
    clientDescription: string;
    address?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
  }): Appointment | null => {
    const service = services.find(s => s.id === data.serviceId);
    if (!service) return null;

    const clientId = currentUser ? currentUser.id : `guest-${Date.now()}`;
    const clientName = currentUser ? currentUser.name : (data.clientName || 'Client Visiteur');
    const clientPhone = currentUser ? currentUser.phone : (data.clientPhone || '');
    const clientEmail = currentUser ? currentUser.email : (data.clientEmail || '');
    const clientAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      serviceCategory: service.categoryName,
      providerId: service.providerId,
      providerName: service.providerName,
      providerPhone: service.providerPhone,
      providerWhatsapp: service.providerWhatsapp,
      providerAvatar: service.providerAvatar,
      clientId,
      clientName,
      clientPhone,
      clientEmail,
      clientAvatar,
      requestedDate: data.requestedDate,
      requestedTimeSlot: data.requestedTimeSlot,
      clientDescription: data.clientDescription,
      address: data.address,
      status: 'pending',
      currency: service.currency,
      priceEstimate: service.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Update service booking count
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, bookingCount: s.bookingCount + 1 } : s));

    // SYSTEME DE NOTIFICATION OBLIGATOIRE:
    // Notifier le prestataire avec la description et détails du besoin
    const notifForPresta: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: service.providerId,
      senderName: clientName,
      title: 'Nouvelle demande de rendez-vous reçue !',
      message: `${clientName} a demandé un RDV pour "${service.title}" le ${data.requestedDate} (${data.requestedTimeSlot}). Besoin : "${data.clientDescription}"`,
      type: 'appointment_new',
      relatedAppointmentId: newAppointment.id,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [notifForPresta, ...prev]);

    return newAppointment;
  };

  const respondToAppointment = (
    appointmentId: string, 
    newStatus: AppointmentStatus, 
    reason?: string, 
    proposedDate?: string, 
    proposedTime?: string
  ) => {
    let updatedAppt: Appointment | undefined;

    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        const updated: Appointment = {
          ...a,
          status: newStatus,
          statusReason: reason || a.statusReason,
          proposedNewDate: proposedDate || a.proposedNewDate,
          proposedNewTimeSlot: proposedTime || a.proposedNewTimeSlot,
          updatedAt: new Date().toISOString(),
        };
        updatedAppt = updated;
        return updated;
      }
      return a;
    }));

    if (!updatedAppt) return;

    // SYSTEME DE NOTIFICATION OBLIGATOIRE:
    // "rendez vous valider , decaller ou refuser on notif avec la raison en cas de refus ou decallage"
    let notifTitle = '';
    let notifMessage = '';
    let notifType: 'appointment_accepted' | 'appointment_rescheduled' | 'appointment_rejected' = 'appointment_accepted';

    if (newStatus === 'accepted') {
      notifType = 'appointment_accepted';
      notifTitle = 'Rendez-vous validé !';
      notifMessage = `${updatedAppt.providerName} a accepté votre rendez-vous pour "${updatedAppt.serviceTitle}" le ${updatedAppt.requestedDate} (${updatedAppt.requestedTimeSlot}).${reason ? ` Note : "${reason}"` : ''}`;
    } else if (newStatus === 'rescheduled') {
      notifType = 'appointment_rescheduled';
      notifTitle = 'Rendez-vous décalé - Nouvelle proposition';
      notifMessage = `${updatedAppt.providerName} propose de décaler le rendez-vous au ${proposedDate} (${proposedTime}). Raison : "${reason || 'Contrainte d’emploi du temps'}"`;
    } else if (newStatus === 'rejected') {
      notifType = 'appointment_rejected';
      notifTitle = 'Rendez-vous refusé';
      notifMessage = `${updatedAppt.providerName} ne peut pas honorer votre demande pour "${updatedAppt.serviceTitle}". Raison invoquée : "${reason || 'Indisponibilité'}"`;
    }

    const notifForClient: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: updatedAppt.clientId,
      senderName: updatedAppt.providerName,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      relatedAppointmentId: appointmentId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [notifForClient, ...prev]);
  };

  const acceptRescheduledAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId && a.proposedNewDate) {
        return {
          ...a,
          requestedDate: a.proposedNewDate,
          requestedTimeSlot: a.proposedNewTimeSlot || a.requestedTimeSlot,
          status: 'accepted',
          statusReason: 'Nouvelle date validée par le client.',
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    }));
  };

  const cancelAppointmentByClient = (appointmentId: string, reason?: string) => {
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) return;

    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return {
          ...a,
          status: 'cancelled',
          statusReason: reason || 'Annulé par le client',
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    }));

    // Notify provider
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: appt.providerId,
      senderName: appt.clientName,
      title: 'Rendez-vous annulé par le client',
      message: `${appt.clientName} a annulé sa demande de rendez-vous pour "${appt.serviceTitle}". Motif : "${reason || 'Annulation sans motif'}"`,
      type: 'system',
      relatedAppointmentId: appt.id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Admin Actions
  const adminApproveKyc = (providerId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === providerId) {
        return { ...u, kycStatus: 'approved', kycRejectionReason: undefined };
      }
      return u;
    }));

    // Mark their services as verified
    setServices(prev => prev.map(s => {
      if (s.providerId === providerId) {
        return { ...s, providerVerified: true };
      }
      return s;
    }));

    // Notify provider
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: providerId,
      senderName: 'Administration PrestaLink',
      title: 'Félicitations ! Votre profil Prestataire est validé (KYC Approuvé)',
      message: 'Vos documents ont été examinés avec succès. Vos prestations sont maintenant officiellement visibles et certifiées auprès de tous les clients.',
      type: 'kyc_approved',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const adminRejectKyc = (providerId: string, reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === providerId) {
        return { ...u, kycStatus: 'rejected', kycRejectionReason: reason };
      }
      return u;
    }));

    // Mark their services as unverified
    setServices(prev => prev.map(s => {
      if (s.providerId === providerId) {
        return { ...s, providerVerified: false };
      }
      return s;
    }));

    // Notify provider
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: providerId,
      senderName: 'Administration PrestaLink',
      title: 'Dossier Prestataire à corriger (KYC non validé)',
      message: `Votre demande d’agrément a été refusée pour le motif suivant : "${reason}". Veuillez mettre à jour vos justificatifs professionnels.`,
      type: 'kyc_rejected',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const adminToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    }));
  };

  const adminAddCategory = (categoryData: Omit<Category, 'id' | 'slug'>) => {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      slug,
    };
    setCategories(prev => [...prev, newCat]);
  };

  const adminUpdateCategory = (categoryId: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, ...data };
      }
      return c;
    }));
  };

  const adminToggleCategoryActive = (categoryId: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, isActive: !c.isActive };
      }
      return c;
    }));
  };

  const adminToggleServiceFeatured = (serviceId: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, isFeatured: !s.isFeatured };
      }
      return s;
    }));
  };

  // Notification Handling
  const unreadNotificationsCount = currentUser 
    ? notifications.filter(n => n.recipientId === currentUser.id && !n.read).length
    : 0;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.recipientId === currentUser.id ? { ...n, read: true } : n));
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Chat handling
  const sendChatMessage = (recipientId: string, text: string, appointmentId?: string) => {
    if (!currentUser || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      appointmentId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, newMsg]);
  };

  // Reset to default
  const resetDataToFactory = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}users`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}categories`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}services`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}appointments`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}notifications`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}chat`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user_id`);

    setUsers(INITIAL_USERS);
    setCategories(INITIAL_CATEGORIES);
    setServices(INITIAL_SERVICES);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS.find(u => u.id === 'user-presta-1') || null);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        categories,
        services,
        appointments,
        notifications,
        chatMessages,
        activeTab,
        selectedService,
        bookingService,
        chatPartner,
        isNotificationDrawerOpen,
        isAuthModalOpen,
        authDefaultRole,

        setActiveTab,
        setSelectedService,
        setBookingService,
        setChatPartner,
        setIsNotificationDrawerOpen,
        openAuthModal,
        closeAuthModal,

        switchUser,
        login,
        registerClient,
        registerPrestataire,
        logout,

        createService,
        updateService,
        toggleServiceActive,
        deleteService,

        requestAppointment,
        respondToAppointment,
        cancelAppointmentByClient,
        acceptRescheduledAppointment,

        adminApproveKyc,
        adminRejectKyc,
        adminToggleUserStatus,
        adminAddCategory,
        adminUpdateCategory,
        adminToggleCategoryActive,
        adminToggleServiceFeatured,

        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,

        sendChatMessage,
        resetDataToFactory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

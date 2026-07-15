
/* ============================================================
   MODELS
   ============================================================ */
export type BookingStatus = 'Confirmed' | 'InProgress' | 'Pending' | 'Cancelled' | 'Completed';
export type OfferType = 'Coupon' | 'Banner' | 'Offer';
export type OfferStatus = 'Active' | 'Scheduled' | 'Ended';
export type DiscountType = 'Percentage' | 'Flat' | 'BuyOneGetOne';
export type SlotStatus = 'Available' | 'Booked' | 'Blocked' | 'InProgress';
export type GenderTarget = 'All' | 'Women' | 'Men';
export type StaffRole = 'Therapist' | 'Senior' | 'Manager' | 'Trainee';
export type MessageFrom = 'Me' | 'Them';
export type NotifTone = 'Plum' | 'Gold' | 'Sage' | 'Info' | 'Rose' | 'Danger';

export interface Booking {
  id: number;
  customerName: string;
  service: string;
  price: number;
  time: string;
  date?: string;
  status: BookingStatus;
  avatarGrad: number;
  staff?: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  durationMin: number;
  bufferMin: number;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  for: GenderTarget;
  tags: string[];
  bookings: number;
}

export interface ServicePackage {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  validityDays: number;
  sessions: number;
  featuredTag: string;
  isActive: boolean;
  serviceIds: number[];
}

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
  status: SlotStatus;
  customerName?: string;
  serviceName?: string;
  price: number;
}

export interface DaySchedule {
  day: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  template: string;
}

export interface Offer {
  id: number;
  type: OfferType;
  name: string;
  discount: string;
  validUntil: string;
  usage: number;
  status: OfferStatus;
  discountKind: DiscountType;
  discountValue: number;
  couponCode?: string;
  appliesTo?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  isLoyal: boolean;
  avatarGrad: number;
  gender?: string;
  notes?: string;
}

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  skills: string[];
  isAvailable: boolean;
  bookingsToday: number;
  earningsToday: number;
  avatarGrad: number;
  rating: number;
}

export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  avatarGrad: number;
  phone: string;
  lastBooking: string;
}

export interface SlotSuggestion { time: string; price: number; save?: string; }

export interface ChatMessage {
  id: number;
  from: MessageFrom;
  text?: string;
  time: string;
  type: 'text' | 'slot-suggest';
  slots?: SlotSuggestion[];
}

export interface AppNotification {
  id: number;
  who: string;
  what: string;
  when: string;
  tone: NotifTone;
  isRead: boolean;
}

export interface Review {
  id: number;
  customerName: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  isReplied: boolean;
  avatarGrad: number;
}

export interface StatCard {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  footer: string;
  icon: string;
  accentBg: string;
  iconBg: string;
  iconColor: string;
}

export interface ChartPoint { label: string; value: number; }
export interface TopService { name: string; bookings: number; color: string; }

/* ============================================================
   HELPERS
   ============================================================ */
export function initials(name: string): string {
  const parts = (name || '').split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name ? name.slice(0, 1).toUpperCase() : '?';
}

export function currencySymbol(currency: string): string {
  return currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  const sym = currencySymbol(currency);
  if (amount >= 100000) return `${sym}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${sym}${(amount / 1000).toFixed(1)}k`;
  return `${sym}${Math.round(amount)}`;
}

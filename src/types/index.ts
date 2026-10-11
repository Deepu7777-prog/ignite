export type UserRole = 'CUSTOMER' | 'COOK' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
}

export interface CookProfile {
  id: string;
  userId: string;
  kitchenName: string;
  ownerName: string;
  photo: string;
  bio: string;
  location: string;
  lat: number;
  lng: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  cuisines: string[];
  experienceYears: number;
  isVerified: boolean;
  verificationDate: string;
  nextCheckDays: number;
  fssaiNumber: string;
  aadhaarStatus: string;
  availableToday: boolean;
  prepTimeMinutes: number;
  openingHours: string;
  acceptedPaymentMethods?: string[];
  payoutSettings?: PayoutSettings;
  availabilitySchedule?: CookAvailabilitySlot[];
}

export interface CookAvailabilitySlot {
  id: string;
  date: string;
  dayName?: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface PayoutSettings {
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  payoutMethod?: 'DIRECT_UPI' | 'BANK_TRANSFER' | 'RAZORPAY_ROUTE';
  settlementStatus?: 'VERIFIED' | 'PENDING_APPROVAL';
}

export type DietaryType = 'VEG' | 'NON_VEG';

export interface MenuItem {
  id: string;
  cookId: string;
  name: string;
  description: string;
  price: number;
  category: string; // Breakfast | Lunch | Dinner | Snacks | Desserts | Specials
  prepTimeMinutes: number;
  dietaryType: DietaryType;
  availableToday: boolean;
  paused: boolean;
  image: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  cookId: string;
  cookName: string;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_CANCELLED';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Address {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  cookId: string;
  cookName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: Address;
  deliveryOption: string;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  prepTimeMinutes: number;
  etaMinutes: number;
  settlementStatus?: 'SETTLED' | 'PENDING_SETTLEMENT';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  cookId: string;
  rating: number;
  comment: string;
  dishRating?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  customerId: string;
  cookId: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  cookId: string;
  kitchenName: string;
  planType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  dishName: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  daysOfWeek: string[];
  mealsLeft: number;
  pricePerMeal: number;
  nextDeliveryDate: string;
}

export interface Quote {
  id: string;
  cookId: string;
  cookName: string;
  price: number;
  deliveryTime: string;
  message: string;
}

export interface CustomRequest {
  id: string;
  customerId: string;
  customerName: string;
  dishName: string;
  servings: number;
  preferredDate: string;
  preferredTime: string;
  budgetMax: number;
  location: string;
  details: string;
  status: 'OPEN' | 'QUOTED' | 'ACCEPTED' | 'COMPLETED';
  quotes: Quote[];
  createdAt: string;
}

export interface Message {
  id: string;
  orderId?: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface VerificationApplication {
  id: string;
  cookId: string;
  applicantName: string;
  phone: string;
  email: string;
  kitchenName: string;
  address: string;
  experienceYears: number;
  cuisines: string[];
  kitchenPhoto: string;
  aadhaarNumber: string;
  fssaiNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalCustomers: number;
  totalCooks: number;
  verifiedCooks: number;
  pendingVerifications: number;
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
  platformCommission: number;
}

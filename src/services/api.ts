import {
  User,
  CookProfile,
  MenuItem,
  Order,
  Review,
  Subscription,
  CustomRequest,
  VerificationApplication,
  Message,
  Notification,
  AdminStats
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (credentials: { email: string; password?: string; role?: string }) => 
    fetchJson<{ success: boolean; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { email: string; password?: string; name: string; phone?: string; role?: string }) =>
    fetchJson<{ success: boolean; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  loginDemo: (role: string) =>
    fetchJson<{ success: boolean; user: User }>('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  sendOtp: (data: { recipient: string; type?: string }) =>
    fetchJson<{ success: boolean; message: string; expiresMinutes?: number }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyOtp: (data: { recipient: string; code: string; userId?: string }) =>
    fetchJson<{ success: boolean; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { recipient: string; code: string; newPassword: string }) =>
    fetchJson<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkAdminAuthorization: (data: { userId?: string; email?: string }) =>
    fetchJson<{ isAuthorized: boolean; status: string; record?: any }>('/auth/check-admin-authorization', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAdminAuthorizations: () =>
    fetchJson<{ success: boolean; count: number; authorizations: any[] }>('/admin/authorizations'),

  authorizeTeamMember: (data: { email: string; grantedBy?: string }) =>
    fetchJson<{ success: boolean; message: string; authorization: any }>('/admin/authorize-team-member', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleAdminAuthorizationStatus: (id: string) =>
    fetchJson<{ success: boolean; message: string; authorization: any }>(`/admin/authorizations/${id}/toggle-status`, {
      method: 'PATCH',
    }),

  // Cooks
  getCooks: (params?: { search?: string; cuisine?: string; isVeg?: boolean; maxDistance?: number; minRating?: number; availableToday?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.cuisine) query.append('cuisine', params.cuisine);
    if (params?.isVeg) query.append('isVeg', 'true');
    if (params?.maxDistance) query.append('maxDistance', String(params.maxDistance));
    if (params?.minRating) query.append('minRating', String(params.minRating));
    if (params?.availableToday) query.append('availableToday', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; cooks: CookProfile[] }>(`/cooks${queryString}`);
  },

  getCookById: (id: string) => 
    fetchJson<{ success: boolean; cook: CookProfile; menuItems: MenuItem[]; reviews: Review[] }>(`/cooks/${id}`),

  // Menu
  getMenu: (cookId?: string, category?: string) => {
    const query = new URLSearchParams();
    if (cookId) query.append('cookId', cookId);
    if (category) query.append('category', category);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; items: MenuItem[] }>(`/menu${queryString}`);
  },

  addMenuItem: (itemData: Partial<MenuItem>) =>
    fetchJson<{ success: boolean; item: MenuItem }>('/menu', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),

  updateMenuItem: (id: string, updates: Partial<MenuItem>) =>
    fetchJson<{ success: boolean; item: MenuItem }>(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteMenuItem: (id: string) =>
    fetchJson<{ success: boolean; message: string }>(`/menu/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: (params?: { customerId?: string; cookId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.customerId) query.append('customerId', params.customerId);
    if (params?.cookId) query.append('cookId', params.cookId);
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; orders: Order[] }>(`/orders${queryString}`);
  },

  getOrderById: (id: string) =>
    fetchJson<{ success: boolean; order: Order }>(`/orders/${id}`),

  createOrder: (orderData: Partial<Order>) =>
    fetchJson<{ success: boolean; order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateOrderStatus: (id: string, status: string) =>
    fetchJson<{ success: boolean; order: Order }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateOrderSettlement: (id: string, settlementStatus: string) =>
    fetchJson<{ success: boolean; order: Order }>(`/orders/${id}/settlement`, {
      method: 'PATCH',
      body: JSON.stringify({ settlementStatus }),
    }),

  // Reviews
  getCookReviews: (cookId: string) =>
    fetchJson<{ success: boolean; reviews: Review[] }>(`/reviews/cook/${cookId}`),

  addReview: (reviewData: Partial<Review>) =>
    fetchJson<{ success: boolean; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  // Favorites
  getFavorites: (customerId: string) =>
    fetchJson<{ success: boolean; favorites: any[]; cooks: CookProfile[] }>(`/favorites?customerId=${customerId}`),

  toggleFavorite: (customerId: string, cookId: string) =>
    fetchJson<{ success: boolean; isFavorite: boolean }>('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ customerId, cookId }),
    }),

  // Verifications
  getVerifications: () =>
    fetchJson<{ success: boolean; count: number; applications: VerificationApplication[] }>('/verifications'),

  submitVerification: (appData: Partial<VerificationApplication>) =>
    fetchJson<{ success: boolean; application: VerificationApplication }>('/verifications', {
      method: 'POST',
      body: JSON.stringify(appData),
    }),

  updateVerificationStatus: (id: string, status: 'APPROVED' | 'REJECTED', notes?: string) =>
    fetchJson<{ success: boolean; application: VerificationApplication }>(`/verifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  // Custom Requests
  getCustomRequests: () =>
    fetchJson<{ success: boolean; requests: CustomRequest[] }>('/custom-requests'),

  createCustomRequest: (reqData: Partial<CustomRequest>) =>
    fetchJson<{ success: boolean; request: CustomRequest }>('/custom-requests', {
      method: 'POST',
      body: JSON.stringify(reqData),
    }),

  submitQuote: (requestId: string, quoteData: { cookId: string; cookName: string; price: number; deliveryTime: string; message: string }) =>
    fetchJson<{ success: boolean; request: CustomRequest }>(`/custom-requests/${requestId}/quote`, {
      method: 'POST',
      body: JSON.stringify(quoteData),
    }),

  // Subscriptions
  getSubscriptions: () =>
    fetchJson<{ success: boolean; subscriptions: Subscription[] }>('/subscriptions'),

  createSubscription: (subData: Partial<Subscription>) =>
    fetchJson<{ success: boolean; subscription: Subscription }>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subData),
    }),

  updateSubscriptionStatus: (id: string, status: string) =>
    fetchJson<{ success: boolean; subscription: Subscription }>(`/subscriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Messages
  getMessages: (params?: { orderId?: string; userId?: string }) => {
    const query = new URLSearchParams();
    if (params?.orderId) query.append('orderId', params.orderId);
    if (params?.userId) query.append('userId', params.userId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; messages: Message[] }>(`/messages${queryString}`);
  },

  sendMessage: (msgData: Partial<Message>) =>
    fetchJson<{ success: boolean; message: Message }>('/messages', {
      method: 'POST',
      body: JSON.stringify(msgData),
    }),

  // Notifications
  getNotifications: (userId: string) =>
    fetchJson<{ success: boolean; notifications: Notification[] }>(`/notifications?userId=${userId}`),

  // Cook Payment Methods & Payout Settings
  updateCookPaymentMethods: (cookId: string, acceptedPaymentMethods: string[]) =>
    fetchJson<{ success: boolean; cook: CookProfile }>(`/cooks/${cookId}/payment-methods`, {
      method: 'PATCH',
      body: JSON.stringify({ acceptedPaymentMethods }),
    }),

  updateCookPayoutSettings: (cookId: string, payoutSettings: any) =>
    fetchJson<{ success: boolean; cook: CookProfile }>(`/cooks/${cookId}/payout-settings`, {
      method: 'PATCH',
      body: JSON.stringify({ payoutSettings }),
    }),

  // Real Payment Gateway (Razorpay / PhonePe / COD)
  createPaymentOrder: (orderId: string, amount: number, customerId?: string) =>
    fetchJson<{ success: boolean; keyId: string; gatewayOrderId: string; amount: number; currency: string; paymentId: string }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, customerId }),
    }),

  createPhonePeOrder: (orderId: string, amount: number, customerId?: string) =>
    fetchJson<{ success: boolean; merchantId: string; merchantTransactionId: string; amount: number; currency: string; paymentId: string }>('/payments/create-phonepe-order', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, customerId }),
    }),

  confirmCODOrder: (orderId: string) =>
    fetchJson<{ success: boolean; message: string; paymentStatus: string }>('/payments/cod-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),

  cancelPayment: (orderId: string, reason?: string) =>
    fetchJson<{ success: boolean; message: string }>('/payments/cancel', {
      method: 'POST',
      body: JSON.stringify({ orderId, reason }),
    }),

  verifyPayment: (payload: { orderId: string; gatewayOrderId: string; gatewayPaymentId: string; gatewaySignature: string }) =>
    fetchJson<{ success: boolean; message: string; paymentStatus: string }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  completeDirectPayment: (payload: { orderId: string; gatewayOrderId: string; gatewayPaymentId: string }) =>
    fetchJson<{ success: boolean; message: string; paymentStatus: string }>('/payments/complete-direct-gateway', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Admin Stats & Users
  getAdminStats: () =>
    fetchJson<{ success: boolean; stats: AdminStats }>('/admin/stats'),

  getAdminUsers: () =>
    fetchJson<{ success: boolean; users: User[]; counts: { total: number; customers: number; cooks: number; admins: number } }>('/admin/users'),
};


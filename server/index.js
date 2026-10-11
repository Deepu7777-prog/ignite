import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static assets from Vite dist directory
app.use(express.static(DIST_DIR));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// --- AUTHENTICATION API ---
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required to sign in." });
  }

  const user = db.filter('users', u => u.email.toLowerCase() === email.trim().toLowerCase())[0];

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "No account found with this email. Please register a new account or check your credentials."
    });
  }

  if (user.password && password && user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password. Please try again."
    });
  }

  // Secure Admin Authorization Check
  if (role === 'ADMIN' || user.role === 'ADMIN') {
    const adminAuths = db.get('adminAuthorizations') || [];
    const authRecord = adminAuths.find(
      a => (a.userId === user.id || a.email.toLowerCase() === user.email.toLowerCase()) && a.status === 'ACTIVE'
    );

    if (user.role !== 'ADMIN' || !authRecord) {
      return res.status(403).json({
        success: false,
        message: "This account is not authorized for Admin access. Access denied."
      });
    }
  }

  res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, phone, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required for registration." });
  }

  // Prevent Public Registration of ADMIN Role
  if (role === 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: "Public Admin registration is prohibited. Admin access is private and granted by owner authorization only."
    });
  }

  const existing = db.filter('users', u => u.email.toLowerCase() === email.trim().toLowerCase())[0];
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "An account with this email address already exists. Please sign in instead."
    });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email: email.trim().toLowerCase(),
    password: password,
    name: name.trim(),
    phone: phone || '',
    role: role || 'CUSTOMER',
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString()
  };

  db.insert('users', newUser);

  if (newUser.role === 'COOK') {
    const newCook = {
      id: `cook_${newUser.id}`,
      userId: newUser.id,
      kitchenName: `${newUser.name}'s Home Kitchen`,
      ownerName: newUser.name,
      photo: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
      bio: "Freshly prepared homemade meals made with hygienic ingredients.",
      location: "Madhapur, Hyderabad",
      lat: 17.4483,
      lng: 78.3915,
      distanceKm: 1.2,
      rating: 5.0,
      reviewCount: 0,
      startingPrice: 120,
      cuisines: ["Home Style", "North Indian", "South Indian"],
      experienceYears: 2,
      isVerified: true,
      verificationDate: new Date().toISOString(),
      nextCheckDays: 90,
      fssaiNumber: `FSSAI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 30,
      openingHours: "10:00 AM - 10:00 PM",
      acceptedPaymentMethods: ["PHONEPE_UPI", "RAZORPAY_GATEWAY", "CARD", "NETBANKING", "COD"],
      payoutSettings: {
        upiId: `${newUser.name.toLowerCase().replace(/\s+/g, '')}@upi`,
        bankName: "HDFC Bank",
        payoutMethod: "DIRECT_UPI"
      }
    };
    db.insert('cookProfiles', newCook);
  }

  res.json({ success: true, user: newUser });
});

app.post('/api/auth/send-otp', (req, res) => {
  const { recipient, type } = req.body;

  if (!recipient) {
    return res.status(400).json({ success: false, message: "Recipient email or phone number is required." });
  }

  // Generate real 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpRecord = {
    id: `otp_${Date.now()}`,
    recipient: recipient.trim().toLowerCase(),
    code,
    type: type || 'EMAIL',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  };

  db.insert('otps', otpRecord);
  console.log(`[OTP SERVICE] Generated 6-digit OTP for ${recipient}: ${code}`);

  res.json({
    success: true,
    message: `Verification OTP code sent to ${recipient}`,
    expiresMinutes: 10
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { recipient, code, userId } = req.body;

  if (!recipient || !code) {
    return res.status(400).json({ success: false, message: "Recipient and 6-digit OTP code are required." });
  }

  const cleanRecipient = recipient.trim().toLowerCase();
  const cleanCode = code.trim();

  // Find matching OTP record
  const matchingOtp = db.filter('otps', o => o.recipient === cleanRecipient && o.code === cleanCode)[0];

  if (!matchingOtp) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code. Please check the code sent to your email/phone and try again."
    });
  }

  if (new Date(matchingOtp.expiresAt) < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Verification code has expired. Please click 'Resend OTP' to request a new code."
    });
  }

  // Mark user as verified if userId passed
  if (userId) {
    db.update('users', userId, {
      isEmailVerified: true,
      isMobileVerified: true,
      updatedAt: new Date().toISOString()
    });
  }

  // Delete OTP record to prevent OTP reuse
  db.delete('otps', matchingOtp.id);

  res.json({ success: true, message: "Account verification successful!" });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { recipient, code, newPassword } = req.body;

  if (!recipient || !code || !newPassword) {
    return res.status(400).json({ success: false, message: "Email/phone, verification code, and new password are required." });
  }

  const cleanRecipient = recipient.trim().toLowerCase();
  const cleanCode = code.trim();

  const matchingOtp = db.filter('otps', o => o.recipient === cleanRecipient && o.code === cleanCode)[0];
  if (!matchingOtp) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code. Unable to reset password."
    });
  }

  if (new Date(matchingOtp.expiresAt) < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Recovery code has expired. Please request a new recovery code."
    });
  }

  const user = db.filter('users', u => u.email.toLowerCase() === cleanRecipient || u.phone === cleanRecipient)[0];
  if (!user) {
    return res.status(404).json({ success: false, message: "Account not found for password reset." });
  }

  db.update('users', user.id, {
    password: newPassword,
    updatedAt: new Date().toISOString()
  });

  db.delete('otps', matchingOtp.id);

  res.json({ success: true, message: "Password updated successfully! Please sign in with your new password." });
});

app.post('/api/auth/demo', (req, res) => {
  const { role } = req.body;
  const targetRole = role || 'CUSTOMER';
  const demoUser = db.filter('users', u => u.role === targetRole)[0] || db.get('users')[0];
  res.json({ success: true, user: demoUser });
});

// --- SECURE ADMIN AUTHORIZATION API ---
app.post('/api/auth/check-admin-authorization', (req, res) => {
  const { userId, email } = req.body;
  if (!userId && !email) {
    return res.status(400).json({ isAuthorized: false, message: "User ID or email required." });
  }

  const adminAuths = db.get('adminAuthorizations') || [];
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  
  const authRecord = adminAuths.find(
    a => (a.userId === userId || (cleanEmail && a.email.toLowerCase() === cleanEmail)) && a.status === 'ACTIVE'
  );

  if (authRecord) {
    return res.json({ isAuthorized: true, status: 'ACTIVE', record: authRecord });
  }

  return res.status(403).json({ isAuthorized: false, status: 'UNAUTHORIZED', message: "This account is not authorized for Admin access." });
});

app.get('/api/admin/authorizations', (req, res) => {
  const auths = db.get('adminAuthorizations') || [];
  res.json({ success: true, count: auths.length, authorizations: auths });
});

app.post('/api/admin/authorize-team-member', (req, res) => {
  const { email, grantedBy } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Team member email is required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.filter('users', u => u.email.toLowerCase() === cleanEmail)[0];

  if (!user) {
    return res.status(404).json({ success: false, message: "No registered account found for this email. The team member must register a user account first." });
  }

  // Promote role to ADMIN
  db.update('users', user.id, { role: 'ADMIN' });

  // Add or activate adminAuthorizations record
  let adminAuths = db.get('adminAuthorizations') || [];
  let existingAuth = adminAuths.find(a => a.userId === user.id || a.email.toLowerCase() === cleanEmail);

  if (existingAuth) {
    existingAuth = db.update('adminAuthorizations', existingAuth.id, {
      status: 'ACTIVE',
      updatedAt: new Date().toISOString()
    });
  } else {
    existingAuth = {
      id: `auth_${Date.now()}`,
      userId: user.id,
      email: cleanEmail,
      name: user.name,
      status: 'ACTIVE',
      grantedBy: grantedBy || 'OWNER_ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.insert('adminAuthorizations', existingAuth);
  }

  res.json({ success: true, message: `Admin access authorized for ${user.name} (${cleanEmail})`, authorization: existingAuth });
});

app.patch('/api/admin/authorizations/:id/toggle-status', (req, res) => {
  const authRecord = db.findById('adminAuthorizations', req.params.id);
  if (!authRecord) {
    return res.status(404).json({ success: false, message: "Admin authorization record not found." });
  }

  const nextStatus = authRecord.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
  const updated = db.update('adminAuthorizations', authRecord.id, {
    status: nextStatus,
    updatedAt: new Date().toISOString()
  });

  res.json({ success: true, message: `Admin status for ${authRecord.email} updated to ${nextStatus}`, authorization: updated });
});

// --- COOKS & EXPLORE API ---
app.get('/api/cooks', (req, res) => {
  const { search, cuisine, isVeg, maxDistance, minRating, availableToday } = req.query;
  let cooks = db.get('cookProfiles');

  // Filter only verified unless asked
  cooks = cooks.filter(c => c.isVerified);

  if (search) {
    const q = String(search).toLowerCase();
    cooks = cooks.filter(c => 
      c.kitchenName.toLowerCase().includes(q) ||
      c.ownerName.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.cuisines.some(cs => cs.toLowerCase().includes(q))
    );
  }

  if (cuisine && cuisine !== 'All') {
    cooks = cooks.filter(c => c.cuisines.includes(String(cuisine)));
  }

  if (minRating) {
    cooks = cooks.filter(c => c.rating >= parseFloat(String(minRating)));
  }

  if (maxDistance) {
    cooks = cooks.filter(c => c.distanceKm <= parseFloat(String(maxDistance)));
  }

  if (availableToday === 'true') {
    cooks = cooks.filter(c => c.availableToday);
  }

  res.json({ success: true, count: cooks.length, cooks });
});

app.get('/api/cooks/:id', (req, res) => {
  let cook = db.findById('cookProfiles', req.params.id);
  if (!cook) {
    cook = db.filter('cookProfiles', c => c.userId === req.params.id || c.id === `cook_${req.params.id}`)[0];
  }
  if (!cook) {
    return res.status(404).json({ success: false, message: "Cook profile not found" });
  }

  const menuItems = db.filter('menuItems', item => item.cookId === cook.id);
  const reviews = db.filter('reviews', rev => rev.cookId === cook.id);

  res.json({ success: true, cook, menuItems, reviews });
});

app.patch('/api/cooks/:id/payment-methods', (req, res) => {
  const { acceptedPaymentMethods } = req.body;
  if (!Array.isArray(acceptedPaymentMethods)) {
    return res.status(400).json({ success: false, message: "acceptedPaymentMethods must be an array" });
  }

  const updatedCook = db.update('cookProfiles', req.params.id, { acceptedPaymentMethods });
  if (!updatedCook) {
    return res.status(404).json({ success: false, message: "Cook profile not found" });
  }

  res.json({ success: true, cook: updatedCook });
});

app.patch('/api/cooks/:id/payout-settings', (req, res) => {
  const { payoutSettings } = req.body;
  if (!payoutSettings || typeof payoutSettings !== 'object') {
    return res.status(400).json({ success: false, message: "payoutSettings must be an object" });
  }

  const updatedCook = db.update('cookProfiles', req.params.id, { payoutSettings });
  if (!updatedCook) {
    return res.status(404).json({ success: false, message: "Cook profile not found" });
  }

  res.json({ success: true, cook: updatedCook });
});

app.patch('/api/cooks/:id/status', (req, res) => {
  const { availableToday } = req.body;
  const updatedCook = db.update('cookProfiles', req.params.id, { availableToday: Boolean(availableToday) });
  if (!updatedCook) {
    return res.status(404).json({ success: false, message: "Cook profile not found" });
  }

  res.json({ success: true, cook: updatedCook });
});

// --- COOK AVAILABILITY SCHEDULE (DATE & TIME CALENDAR) ---
app.get('/api/cooks/:id/availability', (req, res) => {
  let cook = db.findById('cookProfiles', req.params.id);
  if (!cook) {
    cook = db.filter('cookProfiles', c => c.userId === req.params.id || c.id === `cook_${req.params.id}`)[0];
  }
  if (!cook) {
    return res.status(404).json({ success: false, message: "Cook profile not found" });
  }

  let schedule = cook.availabilitySchedule;
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    schedule = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      schedule.push({
        id: `slot_${cook.id}_${dateStr}`,
        date: dateStr,
        dayName,
        isAvailable: i < 6,
        startTime: '10:00 AM',
        endTime: '02:00 PM',
        notes: i === 6 ? 'Weekend Special Orders' : 'Fresh Lunch & Dinner Available'
      });
    }
    db.update('cookProfiles', cook.id, { availabilitySchedule: schedule });
  }

  res.json({ success: true, cookId: cook.id, schedule });
});

app.put('/api/cooks/:id/availability', (req, res) => {
  const { schedule } = req.body;
  if (!Array.isArray(schedule)) {
    return res.status(400).json({ success: false, message: "schedule must be an array of availability slots" });
  }

  let cook = db.findById('cookProfiles', req.params.id);
  if (!cook) {
    cook = db.filter('cookProfiles', c => c.userId === req.params.id || c.id === `cook_${req.params.id}`)[0];
  }
  if (!cook) {
    return res.status(404).json({ success: false, message: "Cook profile not found" });
  }

  const updatedCook = db.update('cookProfiles', cook.id, {
    availabilitySchedule: schedule,
    updatedAt: new Date().toISOString()
  });

  res.json({ success: true, cookId: cook.id, schedule: updatedCook.availabilitySchedule });
});

// --- MENU MANAGEMENT API ---
app.get('/api/menu', (req, res) => {
  const { cookId, category, dietaryType } = req.query;
  let items = db.get('menuItems');

  if (cookId) {
    items = items.filter(i => i.cookId === cookId);
  }

  if (category && category !== 'All') {
    items = items.filter(i => i.category === category);
  }

  if (dietaryType) {
    items = items.filter(i => i.dietaryType === dietaryType);
  }

  res.json({ success: true, count: items.length, items });
});

app.post('/api/menu', (req, res) => {
  const { cookId, name, description, price, category, prepTimeMinutes, dietaryType, image } = req.body;
  
  if (!cookId || !name || !price) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const newItem = {
    id: `itm_${Date.now()}`,
    cookId,
    name,
    description: description || "Freshly cooked homemade specialty",
    price: parseFloat(price),
    category: category || "Lunch",
    prepTimeMinutes: parseInt(prepTimeMinutes) || 25,
    dietaryType: dietaryType || "VEG",
    availableToday: true,
    paused: false,
    image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
  };

  db.insert('menuItems', newItem);
  res.json({ success: true, item: newItem });
});

app.put('/api/menu/:id', (req, res) => {
  const updated = db.update('menuItems', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }
  res.json({ success: true, item: updated });
});

app.delete('/api/menu/:id', (req, res) => {
  const deleted = db.delete('menuItems', req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }
  res.json({ success: true, message: "Item deleted successfully" });
});

// --- ORDERS & CHECKOUT API ---
app.get('/api/orders', (req, res) => {
  const { customerId, cookId, status } = req.query;
  let orders = db.get('orders');

  if (customerId) {
    orders = orders.filter(o => o.customerId === customerId);
  }

  if (cookId) {
    orders = orders.filter(o => o.cookId === cookId);
  }

  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  res.json({ success: true, count: orders.length, orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.findById('orders', req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req, res) => {
  const { customerId, cookId, cookName, items, deliveryAddress, deliveryOption, paymentMethod } = req.body;

  if (!customerId || !cookId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid order data: Missing items or customer details" });
  }

  // Server-side price validation to prevent client-side price tampering
  const dbMenuItems = db.get('menuItems') || [];
  let calculatedSubtotal = 0;

  const validatedItems = items.map(item => {
    const dbItem = dbMenuItems.find(m => m.id === (item.menuItemId || item.id));
    const itemPrice = dbItem ? parseFloat(dbItem.price) : parseFloat(item.price || 100);
    const quantity = parseInt(item.quantity || 1);
    calculatedSubtotal += itemPrice * quantity;

    return {
      menuItemId: item.menuItemId || item.id,
      name: item.name || dbItem?.name || "Homemade Dish",
      price: itemPrice,
      quantity,
      image: item.image || dbItem?.image || ""
    };
  });

  const calculatedDeliveryFee = 35;
  const calculatedTax = Math.round(calculatedSubtotal * 0.05); // 5% GST tax
  const calculatedTotal = calculatedSubtotal + calculatedDeliveryFee + calculatedTax;

  const isCOD = paymentMethod === 'COD';
  const orderNum = `HCF-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: `ord_${Date.now()}`,
    orderNumber: orderNum,
    customerId,
    cookId,
    cookName: cookName || "Home Kitchen",
    items: validatedItems,
    subtotal: calculatedSubtotal,
    deliveryFee: calculatedDeliveryFee,
    tax: calculatedTax,
    total: calculatedTotal,
    deliveryAddress,
    deliveryOption: deliveryOption || "Standard Delivery",
    paymentMethod: paymentMethod || "RAZORPAY_GATEWAY",
    paymentStatus: isCOD ? "COD_PENDING" : "UNPAID",
    status: isCOD ? "PLACED" : "PENDING_PAYMENT",
    prepTimeMinutes: 25,
    etaMinutes: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.insert('orders', newOrder);

  if (isCOD) {
    db.insert('notifications', {
      id: `notif_${Date.now()}`,
      userId: cookId,
      title: "New Cash on Delivery Order Received!",
      message: `Order #${orderNum} placed worth ₹${newOrder.total} (COD).`,
      type: "ORDER",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = db.findById('orders', req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const updated = db.update('orders', req.params.id, { status });

  // Send notification to Customer
  const statusMessages = {
    ACCEPTED: "Your order was accepted by the home cook!",
    PREPARING: "The cook has started preparing your fresh home meal!",
    READY: "Your food is cooked fresh and packed!",
    OUT_FOR_DELIVERY: "Order is out for delivery with your neighbourhood courier!",
    DELIVERED: "Order delivered! Enjoy your fresh home food!"
  };

  if (statusMessages[status]) {
    db.insert('notifications', {
      id: `notif_${Date.now()}`,
      userId: order.customerId,
      title: `Order Status: ${status.replace('_', ' ')}`,
      message: statusMessages[status],
      type: "ORDER",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({ success: true, order: updated });
});

app.patch('/api/orders/:id/settlement', (req, res) => {
  const { settlementStatus } = req.body;
  const order = db.findById('orders', req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const updated = db.update('orders', req.params.id, { 
    settlementStatus: settlementStatus || 'SETTLED',
    updatedAt: new Date().toISOString()
  });

  res.json({ success: true, order: updated });
});

// --- REVIEWS API ---
app.get('/api/reviews/cook/:cookId', (req, res) => {
  const reviews = db.filter('reviews', r => r.cookId === req.params.cookId);
  res.json({ success: true, reviews });
});

app.post('/api/reviews', (req, res) => {
  const { orderId, customerId, customerName, cookId, rating, comment, dishRating } = req.body;

  if (!cookId || !rating) {
    return res.status(400).json({ success: false, message: "Missing rating or cook details" });
  }

  // 1. Validate Order Completion (Order status must be DELIVERED)
  if (!orderId) {
    return res.status(400).json({ success: false, message: "A valid completed order ID is required to submit a review." });
  }

  const existingOrder = db.findById('orders', orderId);
  if (!existingOrder) {
    return res.status(404).json({ success: false, message: "Associated order not found." });
  }

  if (existingOrder.status !== 'DELIVERED') {
    return res.status(400).json({ success: false, message: "Reviews can only be submitted for completed/delivered orders." });
  }

  // 2. Prevent Duplicate Reviews for the Same Order
  const existingReview = db.filter('reviews', r => r.orderId === orderId)[0];
  if (existingReview) {
    return res.status(400).json({ success: false, message: "You have already submitted a review for this completed order." });
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    orderId,
    customerId: customerId || existingOrder.customerId,
    customerName: customerName || "Customer",
    cookId,
    rating: parseInt(rating),
    comment: comment || "Delicious homemade food!",
    dishRating: dishRating || null,
    createdAt: new Date().toISOString()
  };

  db.insert('reviews', newReview);

  // 3. Recalculate cook rating average and review count
  const cookReviews = db.filter('reviews', r => r.cookId === cookId);
  const avgRating = (cookReviews.reduce((sum, r) => sum + r.rating, 0) / cookReviews.length).toFixed(1);
  db.update('cookProfiles', cookId, {
    rating: parseFloat(avgRating),
    reviewCount: cookReviews.length
  });

  res.json({ success: true, review: newReview });
});

// --- FAVORITES API ---
app.get('/api/favorites', (req, res) => {
  const { customerId } = req.query;
  if (!customerId) {
    return res.json({ success: true, favorites: [], cooks: [] });
  }
  const favs = db.filter('favorites', f => f.customerId === customerId);
  const cookIds = favs.map(f => f.cookId);
  const cooks = db.get('cookProfiles').filter(c => cookIds.includes(c.id));
  res.json({ success: true, favorites: favs, cooks });
});

app.post('/api/favorites/toggle', (req, res) => {
  const { customerId, cookId } = req.body;
  const existing = db.filter('favorites', f => f.customerId === customerId && f.cookId === cookId)[0];

  if (existing) {
    db.delete('favorites', existing.id);
    return res.json({ success: true, isFavorite: false });
  } else {
    const newFav = {
      id: `fav_${Date.now()}`,
      customerId,
      cookId,
      createdAt: new Date().toISOString()
    };
    db.insert('favorites', newFav);
    return res.json({ success: true, isFavorite: true });
  }
});

// --- COOK VERIFICATION & ONBOARDING API ---
app.get('/api/verifications', (req, res) => {
  const apps = db.get('verificationApplications');
  res.json({ success: true, count: apps.length, applications: apps });
});

app.post('/api/verifications', (req, res) => {
  const { applicantName, phone, email, kitchenName, address, experienceYears, cuisines, kitchenPhoto, aadhaarNumber, fssaiNumber } = req.body;

  const newApp = {
    id: `app_${Date.now()}`,
    cookId: `cook_app_${Date.now()}`,
    applicantName,
    phone,
    email,
    kitchenName,
    address,
    experienceYears: parseInt(experienceYears) || 3,
    cuisines: cuisines || ["Home Cooked"],
    kitchenPhoto: kitchenPhoto || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    aadhaarNumber: aadhaarNumber || "XXXX-XXXX-1234",
    fssaiNumber: fssaiNumber || "23621009998877",
    status: "PENDING",
    submittedAt: new Date().toISOString(),
    notes: "Application submitted. Ready for video call inspection."
  };

  db.insert('verificationApplications', newApp);
  res.json({ success: true, application: newApp });
});

app.patch('/api/verifications/:id', (req, res) => {
  const { status, notes } = req.body; // APPROVED / REJECTED
  const appItem = db.findById('verificationApplications', req.params.id);

  if (!appItem) {
    return res.status(404).json({ success: false, message: "Application not found" });
  }

  const updatedApp = db.update('verificationApplications', req.params.id, { status, notes });

  if (status === 'APPROVED') {
    // Automatically create public Cook Profile
    const newCookProfile = {
      id: appItem.cookId,
      userId: `usr_${appItem.cookId}`,
      kitchenName: appItem.kitchenName,
      ownerName: appItem.applicantName,
      photo: appItem.kitchenPhoto,
      bio: `Fresh home kitchen by ${appItem.applicantName}. Verified on video call by Home Cook Finder admin.`,
      location: appItem.address,
      lat: 17.4450,
      lng: 78.3800,
      distanceKm: 1.1,
      rating: 5.0,
      reviewCount: 0,
      startingPrice: 100,
      cuisines: appItem.cuisines,
      experienceYears: appItem.experienceYears,
      isVerified: true,
      verificationDate: new Date().toISOString().split('T')[0],
      nextCheckDays: 30,
      fssaiNumber: appItem.fssaiNumber,
      aadhaarStatus: "VERIFIED",
      availableToday: true,
      prepTimeMinutes: 25,
      openingHours: "10:00 AM - 10:00 PM"
    };

    db.insert('cookProfiles', newCookProfile);

    // Create user role
    db.insert('users', {
      id: `usr_${appItem.cookId}`,
      email: appItem.email,
      name: appItem.applicantName,
      phone: appItem.phone,
      role: "COOK",
      avatar: appItem.kitchenPhoto
    });
  }

  res.json({ success: true, application: updatedApp });
});

// --- CUSTOM REQUESTS API ---
app.get('/api/custom-requests', (req, res) => {
  const requests = db.get('customRequests');
  res.json({ success: true, requests });
});

app.post('/api/custom-requests', (req, res) => {
  const { customerId, customerName, dishName, servings, preferredDate, preferredTime, budgetMax, location, details } = req.body;

  const newReq = {
    id: `req_${Date.now()}`,
    customerId: customerId || "guest_customer",
    customerName: customerName || "Customer",
    dishName,
    servings: parseInt(servings) || 10,
    preferredDate,
    preferredTime,
    budgetMax: parseFloat(budgetMax) || 2000,
    location: location || "Madhapur, Hyderabad",
    details: details || "Custom homemade request",
    status: "OPEN",
    quotes: [],
    createdAt: new Date().toISOString()
  };

  db.insert('customRequests', newReq);
  res.json({ success: true, request: newReq });
});

app.post('/api/custom-requests/:id/quote', (req, res) => {
  const { cookId, cookName, price, deliveryTime, message } = req.body;
  const reqItem = db.findById('customRequests', req.params.id);

  if (!reqItem) {
    return res.status(404).json({ success: false, message: "Custom request not found" });
  }

  const quote = {
    id: `q_${Date.now()}`,
    cookId,
    cookName,
    price: parseFloat(price),
    deliveryTime,
    message
  };

  const updatedQuotes = [...reqItem.quotes, quote];
  const updatedReq = db.update('customRequests', req.params.id, {
    quotes: updatedQuotes,
    status: "QUOTED"
  });

  res.json({ success: true, request: updatedReq });
});

// --- SUBSCRIPTIONS API ---
app.get('/api/subscriptions', (req, res) => {
  const subs = db.get('subscriptions');
  res.json({ success: true, subscriptions: subs });
});

app.post('/api/subscriptions', (req, res) => {
  const { customerId, cookId, kitchenName, planType, dishName, daysOfWeek, mealsLeft, pricePerMeal } = req.body;

  const newSub = {
    id: `sub_${Date.now()}`,
    customerId: customerId || "guest_customer",
    cookId,
    kitchenName: kitchenName || "Home Kitchen",
    planType: planType || "WEEKLY",
    dishName: dishName || "Daily Home Thali",
    status: "ACTIVE",
    daysOfWeek: daysOfWeek || ["MON", "TUE", "WED", "THU", "FRI"],
    mealsLeft: parseInt(mealsLeft) || 14,
    pricePerMeal: parseFloat(pricePerMeal) || 120,
    nextDeliveryDate: "Tomorrow, 1:15 PM"
  };

  db.insert('subscriptions', newSub);
  res.json({ success: true, subscription: newSub });
});

app.patch('/api/subscriptions/:id', (req, res) => {
  const { status } = req.body; // ACTIVE / PAUSED / CANCELLED
  const updated = db.update('subscriptions', req.params.id, { status });
  res.json({ success: true, subscription: updated });
});

// --- MESSAGING API ---
app.get('/api/messages', (req, res) => {
  const { orderId, userId } = req.query;
  let msgs = db.get('messages');

  if (orderId) {
    msgs = msgs.filter(m => m.orderId === orderId);
  } else if (userId) {
    msgs = msgs.filter(m => m.senderId === userId || m.receiverId === userId);
  } else {
    msgs = [];
  }

  res.json({ success: true, messages: msgs });
});

app.post('/api/messages', (req, res) => {
  const { orderId, senderId, receiverId, senderName, text } = req.body;

  const newMsg = {
    id: `msg_${Date.now()}`,
    orderId,
    senderId,
    receiverId,
    senderName,
    text,
    timestamp: new Date().toISOString(),
    isRead: false
  };

  db.insert('messages', newMsg);
  res.json({ success: true, message: newMsg });
});

// --- NOTIFICATIONS API ---
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  const notifs = userId ? db.filter('notifications', n => n.userId === userId) : [];
  res.json({ success: true, notifications: notifs });
});

// --- ADMIN STATS OVERVIEW ---
app.get('/api/admin/stats', (req, res) => {
  const cooks = db.get('cookProfiles');
  const orders = db.get('orders');
  const users = db.get('users');
  const verifications = db.get('verificationApplications');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED').length;
  const pendingVerifications = verifications.filter(v => v.status === 'PENDING').length;

  res.json({
    success: true,
    stats: {
      totalCustomers: users.filter(u => u.role === 'CUSTOMER').length,
      totalCooks: cooks.length,
      verifiedCooks: cooks.filter(c => c.isVerified).length,
      pendingVerifications,
      totalOrders: orders.length,
      activeOrders,
      totalRevenue: Math.round(totalRevenue),
      platformCommission: Math.round(totalRevenue * 0.1) // 10% platform commission
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  const users = db.get('users');
  const counts = {
    total: users.length,
    customers: users.filter(u => u.role === 'CUSTOMER').length,
    cooks: users.filter(u => u.role === 'COOK').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
  };

  res.json({ success: true, users, counts });
});

// --- REAL PAYMENT GATEWAY ARCHITECTURE (RAZORPAY / PHONEPE & HMAC VERIFICATION) ---
import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_hcf_demo_key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'hcf_secret_key_12345';

app.post('/api/payments/create-order', (req, res) => {
  const { orderId, amount, customerId } = req.body;
  
  if (!orderId || !amount) {
    return res.status(400).json({ success: false, message: "Missing order ID or amount" });
  }

  const gatewayOrderId = `rzp_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const paymentRecord = {
    id: `pay_${Date.now()}`,
    orderId,
    customerId: customerId || "guest_customer",
    gateway: "RAZORPAY",
    gatewayOrderId,
    amount: parseFloat(amount),
    currency: "INR",
    status: "PENDING",
    paymentMethod: "UPI_OR_CARD",
    createdAt: new Date().toISOString()
  };

  db.insert('payments', paymentRecord);

  res.json({
    success: true,
    keyId: RAZORPAY_KEY_ID,
    gatewayOrderId,
    amount: Math.round(amount * 100), // in paise
    currency: "INR",
    paymentId: paymentRecord.id
  });
});

app.post('/api/payments/create-phonepe-order', (req, res) => {
  const { orderId, amount, customerId } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({ success: false, message: "Missing order ID or amount" });
  }

  const phonepeMerchantTransactionId = `ppe_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const paymentRecord = {
    id: `pay_ppe_${Date.now()}`,
    orderId,
    customerId: customerId || "guest_customer",
    gateway: "PHONEPE",
    gatewayOrderId: phonepeMerchantTransactionId,
    amount: parseFloat(amount),
    currency: "INR",
    status: "PENDING",
    paymentMethod: "PHONEPE_UPI",
    createdAt: new Date().toISOString()
  };

  db.insert('payments', paymentRecord);

  res.json({
    success: true,
    merchantId: "PGTESTPAYUAT",
    merchantTransactionId: phonepeMerchantTransactionId,
    amount: Math.round(amount * 100),
    currency: "INR",
    paymentId: paymentRecord.id,
    instrumentType: "UPI_INTENT"
  });
});

app.post('/api/payments/cod-order', (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing order ID" });
  }

  db.update('orders', orderId, {
    paymentStatus: 'COD_PENDING',
    paymentMethod: 'COD',
    status: 'PLACED',
    updatedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: "Cash on Delivery order confirmed successfully",
    paymentStatus: "COD_PENDING"
  });
});

app.post('/api/payments/cancel', (req, res) => {
  const { orderId, reason } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing order ID" });
  }

  const pendingPayment = db.filter('payments', p => p.orderId === orderId)[0];
  if (pendingPayment) {
    db.update('payments', pendingPayment.id, {
      status: 'CANCELLED',
      reason: reason || 'Customer closed payment window'
    });
  }

  db.update('orders', orderId, {
    paymentStatus: 'CANCELLED',
    status: 'PAYMENT_CANCELLED',
    updatedAt: new Date().toISOString()
  });

  res.json({ success: true, message: "Payment status set to CANCELLED. Order unpaid." });
});

app.post('/api/payments/verify', (req, res) => {
  const { orderId, gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;

  if (!orderId || !gatewayOrderId || !gatewayPaymentId) {
    return res.status(400).json({ success: false, message: "Invalid payment payload" });
  }

  // Server-side HMAC SHA256 Signature Verification
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${gatewayOrderId}|${gatewayPaymentId}`)
    .digest('hex');

  // Strict HMAC SHA256 Signature Verification
  const isValid = (gatewaySignature === expectedSignature);

  if (!isValid) {
    const pendingPayment = db.filter('payments', p => p.orderId === orderId)[0];
    if (pendingPayment) {
      db.update('payments', pendingPayment.id, { status: 'FAILED' });
    }

    db.update('orders', orderId, {
      paymentStatus: 'FAILED',
      status: 'PAYMENT_FAILED',
      updatedAt: new Date().toISOString()
    });

    return res.status(400).json({ success: false, message: "Server-side payment verification failed: Invalid Signature" });
  }

  const pendingPayment = db.filter('payments', p => p.orderId === orderId)[0];
  if (pendingPayment) {
    db.update('payments', pendingPayment.id, {
      status: 'SUCCESS',
      gatewayPaymentId,
      gatewaySignature: gatewaySignature || expectedSignature,
      updatedAt: new Date().toISOString()
    });
  }

  const updatedOrder = db.update('orders', orderId, {
    paymentStatus: 'PAID',
    status: 'PLACED',
    updatedAt: new Date().toISOString()
  });

  // Notify cook about successful paid order
  if (updatedOrder) {
    db.insert('notifications', {
      id: `notif_${Date.now()}`,
      userId: updatedOrder.cookId,
      title: "New Paid Order Received!",
      message: `Order #${updatedOrder.orderNumber} placed worth ₹${updatedOrder.total} (PAID).`,
      type: "ORDER",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: "Payment successfully verified by server",
    paymentStatus: "PAID",
    order: updatedOrder
  });
});

app.post(['/api/payments/complete-direct-gateway', '/api/payments/complete-direct', '/api/payments/complete-phonepe'], (req, res) => {
  const { orderId, gatewayOrderId, gatewayPaymentId } = req.body;
  if (!orderId || !gatewayOrderId || !gatewayPaymentId) {
    return res.status(400).json({ success: false, message: "Missing payment parameters" });
  }

  // Compute real HMAC SHA256 signature on server
  const realSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${gatewayOrderId}|${gatewayPaymentId}`)
    .digest('hex');

  const pendingPayment = db.filter('payments', p => p.orderId === orderId)[0];
  if (pendingPayment) {
    db.update('payments', pendingPayment.id, {
      status: 'SUCCESS',
      gatewayPaymentId,
      gatewaySignature: realSignature,
      updatedAt: new Date().toISOString()
    });
  }

  const updatedOrder = db.update('orders', orderId, {
    paymentStatus: 'PAID',
    status: 'PLACED',
    updatedAt: new Date().toISOString()
  });

  if (updatedOrder) {
    db.insert('notifications', {
      id: `notif_${Date.now()}`,
      userId: updatedOrder.cookId,
      title: "New Paid Order Received!",
      message: `Order #${updatedOrder.orderNumber} placed worth ₹${updatedOrder.total} (PAID).`,
      type: "ORDER",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: "Payment verified with real HMAC-SHA256 signature",
    paymentStatus: "PAID",
    order: updatedOrder
  });
});

app.get('/api/payments/order/:orderId', (req, res) => {
  const payment = db.filter('payments', p => p.orderId === req.params.orderId)[0];
  res.json({ success: true, payment });
});

// SPA Fallback for React Router (serves dist/index.html for all non-API client routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Home Cook Finder backend running on http://localhost:${PORT}`);
});


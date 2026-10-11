import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CookProfilePage } from './pages/CookProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CookDashboard } from './pages/CookDashboard';
import { CookMenuManagement } from './pages/CookMenuManagement';
import { CookVerificationPage } from './pages/CookVerificationPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminVerificationPage } from './pages/AdminVerificationPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { CustomRequestsPage } from './pages/CustomRequestsPage';
import { MessagingPage } from './pages/MessagingPage';
import { LoginPage } from './pages/LoginPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { CookAvailabilityPage } from './pages/CookAvailabilityPage';

const OrdersRouteHandler: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'COOK') return <Navigate to="/cook-orders" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin-orders" replace />;
  return <CustomerDashboard />;
};

const CartRouteHandler: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'COOK') return <Navigate to="/cook-dashboard" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/checkout" replace />;
};

const AppContent: React.FC = () => {
  const { user, isAuthModalOpen, closeAuthModal, authModalMode } = useAuth();

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 ${user ? 'pb-16 lg:pb-0' : ''} w-full max-w-full overflow-x-hidden`}>
      <Navbar />

      <div className="flex-1 flex w-full max-w-full overflow-x-hidden">
        <Sidebar />

        <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden">
          <Routes>
            {/* PUBLIC LANDING & EXPLORATION */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/cook/:id" element={<CookProfilePage />} />
            <Route path="/cook-verification" element={<CookVerificationPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/custom-requests" element={<CustomRequestsPage />} />

            {/* AUTHENTICATION ENTRY ROUTES */}
            <Route path="/login" element={<LoginPage initialMode="LOGIN" />} />
            <Route path="/register" element={<LoginPage initialMode="REGISTER" />} />

            {/* CUSTOMER PROTECTED ROUTES */}
            <Route path="/customer" element={<Navigate to="/customer-dashboard" replace />} />
            <Route path="/customer-dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerProfilePage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'COOK', 'ADMIN']}><OrdersRouteHandler /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CartRouteHandler /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-tracking/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><OrderTrackingPage /></ProtectedRoute>} />

            {/* COOK PROTECTED ROUTES */}
            <Route path="/cook" element={<Navigate to="/cook-dashboard" replace />} />
            <Route path="/cook-dashboard" element={<ProtectedRoute allowedRoles={['COOK']}><CookDashboard /></ProtectedRoute>} />
            <Route path="/cook-orders" element={<ProtectedRoute allowedRoles={['COOK']}><CookDashboard /></ProtectedRoute>} />
            <Route path="/cook/orders" element={<ProtectedRoute allowedRoles={['COOK']}><CookDashboard /></ProtectedRoute>} />
            <Route path="/cook-earnings" element={<ProtectedRoute allowedRoles={['COOK']}><CookDashboard /></ProtectedRoute>} />
            <Route path="/cook-menu" element={<ProtectedRoute allowedRoles={['COOK']}><CookMenuManagement /></ProtectedRoute>} />
            <Route path="/cook/menu" element={<ProtectedRoute allowedRoles={['COOK']}><CookMenuManagement /></ProtectedRoute>} />
            <Route path="/cook/availability" element={<ProtectedRoute allowedRoles={['COOK']}><CookAvailabilityPage /></ProtectedRoute>} />
            <Route path="/cook-availability" element={<ProtectedRoute allowedRoles={['COOK']}><CookAvailabilityPage /></ProtectedRoute>} />
            <Route path="/cook/messages" element={<ProtectedRoute allowedRoles={['COOK']}><MessagingPage /></ProtectedRoute>} />
            <Route path="/cook/profile" element={<ProtectedRoute allowedRoles={['COOK']}><CookVerificationPage /></ProtectedRoute>} />

            {/* ADMIN PROTECTED ROUTES */}
            <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin-verifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminVerificationPage /></ProtectedRoute>} />
            <Route path="/admin-cooks" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminVerificationPage /></ProtectedRoute>} />
            <Route path="/admin-orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrdersPage /></ProtectedRoute>} />
            <Route path="/admin-users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin-reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

            {/* MESSAGING (PROTECTED) */}
            <Route path="/messages" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'COOK', 'ADMIN']}><MessagingPage /></ProtectedRoute>} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <CartDrawer />
      <MobileNav />

      {/* CENTRAL AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

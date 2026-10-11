import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { CartDrawer } from './components/CartDrawer';

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

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 pb-16 lg:pb-0 w-full max-w-full overflow-x-hidden">
              <Navbar />

              <div className="flex-1 flex w-full max-w-full overflow-x-hidden">
                <Sidebar />

                <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/cook/:id" element={<CookProfilePage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />

                    {/* CUSTOMER PROTECTED ROUTES */}
                    <Route path="/customer-dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />

                    {/* COOK PROTECTED ROUTES */}
                    <Route path="/cook-dashboard" element={<ProtectedRoute allowedRoles={['COOK']}><CookDashboard /></ProtectedRoute>} />
                    <Route path="/cook-orders" element={<ProtectedRoute allowedRoles={['COOK']}><CookDashboard /></ProtectedRoute>} />
                    <Route path="/cook-earnings" element={<ProtectedRoute allowedRoles={['COOK']}><CookDashboard /></ProtectedRoute>} />
                    <Route path="/cook-menu" element={<ProtectedRoute allowedRoles={['COOK']}><CookMenuManagement /></ProtectedRoute>} />
                    <Route path="/cook-verification" element={<CookVerificationPage />} />

                    {/* ADMIN PROTECTED ROUTES */}
                    <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin-verifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminVerificationPage /></ProtectedRoute>} />
                    <Route path="/admin-cooks" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminVerificationPage /></ProtectedRoute>} />
                    <Route path="/admin-orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrdersPage /></ProtectedRoute>} />
                    <Route path="/admin-users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsersPage /></ProtectedRoute>} />
                    <Route path="/admin-reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

                    {/* PUBLIC COMMON ROUTES */}
                    <Route path="/subscriptions" element={<SubscriptionsPage />} />
                    <Route path="/custom-requests" element={<CustomRequestsPage />} />
                    <Route path="/messages" element={<MessagingPage />} />
                  </Routes>
                </main>
              </div>

              <CartDrawer />
              <MobileNav />
            </div>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

import React from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';

interface LoginPageProps {
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode = 'LOGIN' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login' && from !== '/register') {
      return <Navigate to={from} replace />;
    }
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'COOK') return <Navigate to="/cook-dashboard" replace />;
    return <Navigate to="/customer-dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40">
      <AuthModal
        isOpen={true}
        onClose={() => navigate('/')}
        initialMode={initialMode}
        isInlinePage={true}
      />
    </div>
  );
};

export default LoginPage;

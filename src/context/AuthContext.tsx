import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isDemo: boolean;
  setRole: (role: UserRole) => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  loginWithUser: (user: User) => void;
  loginWithSupabaseUser: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'LOGIN' | 'REGISTER';
  openAuthModal: (mode?: 'LOGIN' | 'REGISTER') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('CUSTOMER');
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  const openAuthModal = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    setIsLoading(true);
    try {
      // 1. Check local storage persistent user session
      const savedUserStr = localStorage.getItem('hcf_auth_user');
      const savedRoleStr = localStorage.getItem('hcf_auth_role');
      const savedIsDemo = localStorage.getItem('hcf_is_demo') === 'true';

      if (savedUserStr && savedRoleStr) {
        const parsedUser: User = JSON.parse(savedUserStr);

        // If saved role is ADMIN and not demo mode, perform strict server authorization check
        if (parsedUser.role === 'ADMIN' && !savedIsDemo) {
          try {
            const checkRes = await api.checkAdminAuthorization({ userId: parsedUser.id, email: parsedUser.email });
            if (!checkRes.isAuthorized) {
              console.warn("Saved Admin session is no longer authorized. Revoking Admin access.");
              localStorage.removeItem('hcf_auth_user');
              localStorage.removeItem('hcf_auth_role');
              localStorage.removeItem('hcf_is_demo');
              setUser(null);
              setRoleState('CUSTOMER');
              setIsDemo(false);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Failed to verify Admin authorization online:", e);
          }
        }

        setUser(parsedUser);
        setRoleState(savedRoleStr as UserRole);
        setIsDemo(savedIsDemo);
        setIsLoading(false);
        return;
      }

      // 2. Check Supabase session token
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const supaUser = data.session.user;
          const supaRole = (supaUser.user_metadata?.role as UserRole) || 'CUSTOMER';
          const userObj: User = {
            id: supaUser.id,
            email: supaUser.email || '',
            name: supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
            phone: supaUser.user_metadata?.phone || '',
            role: supaRole,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
          };

          // If Supabase user has ADMIN role, verify active admin authorization
          if (supaRole === 'ADMIN') {
            const checkRes = await api.checkAdminAuthorization({ userId: userObj.id, email: userObj.email });
            if (!checkRes.isAuthorized) {
              console.warn("Supabase user does not have active Admin authorization.");
              setUser(null);
              setRoleState('CUSTOMER');
              setIsDemo(false);
              setIsLoading(false);
              return;
            }
          }

          setUser(userObj);
          setRoleState(supaRole);
          setIsDemo(false);
          localStorage.setItem('hcf_auth_user', JSON.stringify(userObj));
          localStorage.setItem('hcf_auth_role', supaRole);
          localStorage.setItem('hcf_is_demo', 'false');
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Supabase session check skipped or offline:", e);
      }

      // 3. No active session -> Clean guest state (No fake/demo fallback)
      setUser(null);
      setRoleState('CUSTOMER');
      setIsDemo(false);
    } catch (err) {
      console.error("Error initializing session:", err);
      setUser(null);
      setRoleState('CUSTOMER');
      setIsDemo(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithUser = (loggedUser: User) => {
    setUser(loggedUser);
    setRoleState(loggedUser.role);
    setIsDemo(false);
    localStorage.setItem('hcf_auth_user', JSON.stringify(loggedUser));
    localStorage.setItem('hcf_auth_role', loggedUser.role);
    localStorage.setItem('hcf_is_demo', 'false');
  };

  const logout = () => {
    setUser(null);
    setRoleState('CUSTOMER');
    setIsDemo(false);
    localStorage.removeItem('hcf_auth_user');
    localStorage.removeItem('hcf_auth_role');
    localStorage.removeItem('hcf_is_demo');
    localStorage.removeItem('hcf_cart');
    try {
      supabase.auth.signOut().catch(() => {});
    } catch (e) {}
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.loginDemo(targetRole);
      if (res.success) {
        setUser(res.user);
        setRoleState(targetRole);
        setIsDemo(true);
        localStorage.setItem('hcf_auth_user', JSON.stringify(res.user));
        localStorage.setItem('hcf_auth_role', targetRole);
        localStorage.setItem('hcf_is_demo', 'true');
      }
    } catch (err) {
      console.error("Failed to switch demo role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isDemo,
        setRole: setRoleState,
        switchDemoRole,
        loginWithUser,
        loginWithSupabaseUser: loginWithUser,
        logout,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

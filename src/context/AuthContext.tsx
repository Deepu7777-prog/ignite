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

    // Listen to real Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const supaUser = session.user;
        const supaRole = (supaUser.user_metadata?.role as UserRole) || 'CUSTOMER';
        const userObj: User = {
          id: supaUser.id,
          email: supaUser.email || '',
          name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
          phone: supaUser.user_metadata?.phone || '',
          role: supaRole,
          avatar: supaUser.user_metadata?.avatar_url || supaUser.user_metadata?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        };
        setUser(userObj);
        setRoleState(supaRole);
        setIsDemo(false);
        sessionStorage.removeItem('hcf_demo_session');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRoleState('CUSTOMER');
        setIsDemo(false);
        sessionStorage.removeItem('hcf_demo_session');
        localStorage.removeItem('hcf_auth_user');
        localStorage.removeItem('hcf_auth_role');
        localStorage.removeItem('hcf_is_demo');
        localStorage.removeItem('hcf_cart');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const initSession = async () => {
    setIsLoading(true);
    try {
      // 1. PRIMARY: Query real Supabase session
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const supaUser = data.session.user;
          const supaRole = (supaUser.user_metadata?.role as UserRole) || 'CUSTOMER';
          const userObj: User = {
            id: supaUser.id,
            email: supaUser.email || '',
            name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
            phone: supaUser.user_metadata?.phone || '',
            role: supaRole,
            avatar: supaUser.user_metadata?.avatar_url || supaUser.user_metadata?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
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
          sessionStorage.removeItem('hcf_demo_session');
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Supabase session check skipped or offline:", e);
      }

      // 2. Check explicitly active Demo Mode in current session only
      const sessionDemo = sessionStorage.getItem('hcf_demo_session');
      if (sessionDemo) {
        try {
          const parsedDemo = JSON.parse(sessionDemo);
          setUser(parsedDemo.user);
          setRoleState(parsedDemo.role);
          setIsDemo(true);
          setIsLoading(false);
          return;
        } catch (e) {}
      }

      // 3. UNAUTHENTICATED = UNKNOWN VISITOR (Clear any legacy demo/user flags)
      setUser(null);
      setRoleState('CUSTOMER');
      setIsDemo(false);
      localStorage.removeItem('hcf_auth_user');
      localStorage.removeItem('hcf_auth_role');
      localStorage.removeItem('hcf_is_demo');
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
    sessionStorage.removeItem('hcf_demo_session');
    setUser(loggedUser);
    setRoleState(loggedUser.role);
    setIsDemo(false);
  };

  const logout = async () => {
    setUser(null);
    setRoleState('CUSTOMER');
    setIsDemo(false);
    sessionStorage.removeItem('hcf_demo_session');
    localStorage.removeItem('hcf_auth_user');
    localStorage.removeItem('hcf_auth_role');
    localStorage.removeItem('hcf_is_demo');
    localStorage.removeItem('hcf_cart');
    try {
      await supabase.auth.signOut();
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
        sessionStorage.setItem('hcf_demo_session', JSON.stringify({ user: res.user, role: targetRole }));
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

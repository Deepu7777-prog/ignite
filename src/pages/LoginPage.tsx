import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BrandLogo } from '../components/BrandLogo';
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ChefHat,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  UtensilsCrossed,
  HeartHandshake,
  Check,
  KeyRound
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode = 'LOGIN' }) => {
  const { user, loginWithUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'RESET'>(initialMode);
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP & Reset Password fields
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpDemoCode, setOtpDemoCode] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode from props or query param
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Handle countdown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if ((mode === 'RESET' || mode === 'FORGOT') && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  // Initialize Google Identity Services if available and configured
  useEffect(() => {
    const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (err) {
        console.warn("[Google GIS Init]", err);
      }
    }
  }, []);

  // Redirect if user is already authenticated
  if (user && !authLoading) {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login' && from !== '/register') {
      return <Navigate to={from} replace />;
    }
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'COOK') return <Navigate to="/cook-dashboard" replace />;
    return <Navigate to="/customer-dashboard" replace />;
  }

  const redirectUserByRole = (userRole: UserRole) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login' && from !== '/register') {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === 'ADMIN') {
      navigate('/admin-dashboard', { replace: true });
    } else if (userRole === 'COOK') {
      navigate('/cook-dashboard', { replace: true });
    } else {
      navigate('/customer-dashboard', { replace: true });
    }
  };

  // Google Credential Callback (GIS)
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      setErrorMsg("Google sign-in was cancelled or failed. Please try again.");
      return;
    }
    setIsGoogleLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.googleAuth({
        credential: response.credential,
        role: role,
      });

      if (res.success && res.user) {
        loginWithUser(res.user, res.token);
        setSuccessMsg(
          res.isNewUser
            ? `Welcome to HOME DELIGHTS, ${res.user.name}! Your account has been created.`
            : `Welcome back, ${res.user.name}!`
        );
        setTimeout(() => {
          redirectUserByRole(res.user.role);
        }, 600);
      } else {
        throw new Error("Unable to complete Google sign in. Please try again.");
      }
    } catch (err: any) {
      console.error("[Google Sign-In Error]", err);
      setErrorMsg(err.message || "Failed to sign in with Google. Please check your connection or use email login.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google Button Click Handler
  const handleGoogleSignInClick = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

    // Check if real Google GIS is available and configured
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        setIsGoogleLoading(true);
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.warn("Google One Tap prompt not displayed:", notification.getNotDisplayedReason());
            setIsGoogleLoading(false);
          } else if (notification.isSkippedMoment()) {
            setIsGoogleLoading(false);
          } else if (notification.isDismissedMoment()) {
            setIsGoogleLoading(false);
          }
        });
        return;
      } catch (err: any) {
        console.warn("[Google Prompt Error]", err);
        setIsGoogleLoading(false);
      }
    }

    // Seamless Fallback / Demo Google Login Flow (When Google Client ID is not yet configured)
    setIsGoogleLoading(true);
    try {
      const lastGoogleEmail = localStorage.getItem('hcf_last_google_email') || (email.trim() ? email.trim() : 'foodie.demo@gmail.com');
      const lastGoogleName = localStorage.getItem('hcf_last_google_name') || (name.trim() ? name.trim() : lastGoogleEmail.split('@')[0]);

      const res = await api.googleAuth({
        role: role,
        userInfo: {
          email: lastGoogleEmail,
          name: lastGoogleName,
          picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
        }
      });

      if (res.success && res.user) {
        loginWithUser(res.user, res.token);
        localStorage.setItem('hcf_last_google_email', res.user.email);
        localStorage.setItem('hcf_last_google_name', res.user.name);
        setSuccessMsg(
          res.isNewUser
            ? `Signed in with Google! Welcome ${res.user.name} to HOME DELIGHTS.`
            : `Welcome back, ${res.user.name}! Signed in via Google.`
        );
        setTimeout(() => {
          redirectUserByRole(res.user.role);
        }, 600);
      } else {
        throw new Error("Google authentication failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate with Google. Please try email sign in.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Email / Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.login({
        email: cleanEmail,
        password,
        role: role
      });

      if (res.success && res.user) {
        loginWithUser(res.user, res.token);
        setSuccessMsg(`Welcome back, ${res.user.name}! Redirecting...`);
        setTimeout(() => {
          redirectUserByRole(res.user.role);
        }, 500);
      } else {
        throw new Error("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      console.error("[Login Error]", err);
      setErrorMsg(err.message || "Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // New User Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please provide a valid email address (e.g. name@example.com).");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please ensure both passwords match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.register({
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim(),
        password,
        role
      });

      if (res.success && res.user) {
        loginWithUser(res.user, res.token);
        setSuccessMsg(`Welcome to HOME DELIGHTS, ${res.user.name}! Your account has been registered.`);
        setTimeout(() => {
          redirectUserByRole(res.user.role);
        }, 600);
      } else {
        throw new Error("Registration could not be completed. Please try again.");
      }
    } catch (err: any) {
      console.error("[Register Error]", err);
      setErrorMsg(err.message || "Registration failed. An account with this email may already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Send OTP
  const handleSendRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpDemoCode(null);

    const cleanRecipient = email.trim();
    if (!cleanRecipient) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendOtp({
        recipient: cleanRecipient,
        type: 'EMAIL'
      });

      if (res.success) {
        setSuccessMsg(`A 6-digit verification code has been sent to ${cleanRecipient}.`);
        if (res.demoCode) {
          setOtpDemoCode(res.demoCode);
          setOtpCode(res.demoCode); // Auto-fill for friction-free developer experience
        }
        setResendTimer(30);
        setCanResend(false);
        setMode('RESET');
      } else {
        throw new Error("Unable to send recovery code. Please verify your email.");
      }
    } catch (err: any) {
      console.error("[Send OTP Error]", err);
      setErrorMsg(err.message || "Failed to send recovery code. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password Submit
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPassword({
        recipient: email.trim(),
        code: otpCode.trim(),
        newPassword
      });

      if (res.success) {
        setSuccessMsg("Password reset successfully! Please sign in with your new password.");
        setTimeout(() => {
          setMode('LOGIN');
          setPassword('');
          setNewPassword('');
          setOtpCode('');
          setOtpDemoCode(null);
        }, 1200);
      } else {
        throw new Error("Invalid or expired code. Unable to reset password.");
      }
    } catch (err: any) {
      console.error("[Reset Password Error]", err);
      setErrorMsg(err.message || "Failed to reset password. Please verify the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="w-full max-w-5xl bg-[#FFFDF7] rounded-3xl sm:rounded-[36px] border border-[#DDEEDF] shadow-garden-lg overflow-hidden grid lg:grid-cols-12 min-h-[580px]">
        
        {/* ================= LEFT BRAND STORY PANEL (DESKTOP / TABLET) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#075C45] via-[#077A58] to-[#079669] text-[#FFFDF7] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle botanical glow circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#CDEEDC]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#E8D99A]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Branding */}
          <div className="space-y-4 relative z-10">
            <Link to="/" className="inline-block" aria-label="HOME DELIGHTS">
              <BrandLogo variant="light" size="lg" />
            </Link>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF7]/15 backdrop-blur-xs text-[#E8D99A] text-[11px] font-extrabold uppercase tracking-wider border border-[#E8D99A]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#E8D99A]" />
                100% Homemade Food
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight mt-3 text-[#FFFDF7] leading-snug">
                Fresh meals cooked by neighborhood mothers with love.
              </h2>
              <p className="font-handwriting text-2xl text-[#E8D99A] pt-1">
                “Homemade food. Made with heart.”
              </p>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="space-y-3.5 my-8 relative z-10 text-xs text-[#F1F8F1]">
            <div className="flex items-start gap-3 bg-[#FFFDF7]/10 backdrop-blur-xs p-3 rounded-2xl border border-[#FFFDF7]/15">
              <div className="w-7 h-7 rounded-xl bg-[#FFFDF7]/20 flex items-center justify-center shrink-0 text-[#E8D99A] font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-[#FFFDF7]">Video-Audited Home Kitchens</p>
                <p className="text-[11px] text-[#CDEEDC] leading-relaxed">
                  Every cook is KYC verified with strict FSSAI hygiene guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#FFFDF7]/10 backdrop-blur-xs p-3 rounded-2xl border border-[#FFFDF7]/15">
              <div className="w-7 h-7 rounded-xl bg-[#FFFDF7]/20 flex items-center justify-center shrink-0 text-[#E8D99A] font-bold">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-[#FFFDF7]">Cooked Fresh on Order</p>
                <p className="text-[11px] text-[#CDEEDC] leading-relaxed">
                  Zero restaurant cold-storage preservatives. Pure traditional family recipes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#FFFDF7]/10 backdrop-blur-xs p-3 rounded-2xl border border-[#FFFDF7]/15">
              <div className="w-7 h-7 rounded-xl bg-[#FFFDF7]/20 flex items-center justify-center shrink-0 text-[#E8D99A] font-bold">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-[#FFFDF7]">Empowering Passionate Home Cooks</p>
                <p className="text-[11px] text-[#CDEEDC] leading-relaxed">
                  Support talented home chefs earning with dignity in your locality.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Quote */}
          <div className="relative z-10 pt-4 border-t border-[#FFFDF7]/20 flex items-center justify-between text-[11px] text-[#CDEEDC]">
            <span>Safe & Secure Authentication</span>
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1 font-bold">
              ← Return Home
            </Link>
          </div>
        </div>

        {/* ================= RIGHT FORM PANEL ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-[#FFFDF7]">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* TOP NAVIGATION / MODE SWITCHER */}
            {(mode === 'LOGIN' || mode === 'REGISTER') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#DDEEDF] pb-3">
                  <div>
                    <h1 className="font-display font-extrabold text-2xl text-[#123F35] tracking-tight">
                      {mode === 'LOGIN' ? 'Welcome Back!' : 'Join HOME DELIGHTS'}
                    </h1>
                    <p className="text-xs text-[#075C45]/80 font-medium">
                      {mode === 'LOGIN'
                        ? 'Sign in to access your neighborhood cooks and orders'
                        : 'Create your account to discover fresh homemade meals'}
                    </p>
                  </div>
                </div>

                {/* LOGIN / REGISTER TAB PILLS */}
                <div className="grid grid-cols-2 p-1 bg-[#F8F4E8] rounded-2xl border border-[#DDEEDF] text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('LOGIN');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      mode === 'LOGIN'
                        ? 'bg-[#075C45] text-[#FFFDF7] shadow-sm font-black'
                        : 'text-[#123F35]/70 hover:text-[#123F35]'
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('REGISTER');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      mode === 'REGISTER'
                        ? 'bg-[#075C45] text-[#FFFDF7] shadow-sm font-black'
                        : 'text-[#123F35]/70 hover:text-[#123F35]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* ROLE CHOOSER PILL: CUSTOMER VS HOME COOK */}
                <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => setRole('CUSTOMER')}
                    className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'CUSTOMER'
                        ? 'bg-[#F1F8F1] border-[#079669] text-[#075C45] shadow-2xs font-black'
                        : 'bg-[#FFFDF7] border-[#DDEEDF] text-[#123F35]/70 hover:bg-[#F8F4E8]'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-[#079669]" />
                    <span>Customer</span>
                    {role === 'CUSTOMER' && <Check className="w-3.5 h-3.5 text-[#079669] ml-1" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('COOK')}
                    className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'COOK'
                        ? 'bg-[#F1F8F1] border-[#079669] text-[#075C45] shadow-2xs font-black'
                        : 'bg-[#FFFDF7] border-[#DDEEDF] text-[#123F35]/70 hover:bg-[#F8F4E8]'
                    }`}
                  >
                    <ChefHat className="w-4 h-4 text-[#079669]" />
                    <span>Home Cook</span>
                    {role === 'COOK' && <Check className="w-3.5 h-3.5 text-[#079669] ml-1" />}
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT OR RESET PASSWORD HEADER */}
            {(mode === 'FORGOT' || mode === 'RESET') && (
              <div className="flex items-center gap-3 border-b border-[#DDEEDF] pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="p-2 rounded-xl bg-[#F8F4E8] text-[#075C45] hover:bg-[#DDEEDF] transition-colors"
                  aria-label="Back to Login"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-[#123F35]">
                    {mode === 'FORGOT' ? 'Reset Password' : 'Enter Verification Code'}
                  </h1>
                  <p className="text-xs text-[#075C45]/80 font-medium">
                    {mode === 'FORGOT'
                      ? 'We will send a 6-digit recovery code to your registered email'
                      : 'Verify your code and create a new secure password'}
                  </p>
                </div>
              </div>
            )}

            {/* ERROR ALERT */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* SUCCESS ALERT */}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* DEMO CODE HINT (FOR TESTING IN DEVELOPMENT) */}
            {otpDemoCode && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between">
                <span>Test Recovery Code: <code className="bg-amber-100 px-2 py-0.5 rounded text-amber-950 font-mono text-sm">{otpDemoCode}</code></span>
                <span className="text-[10px] text-amber-700 font-semibold">(auto-filled for testing)</span>
              </div>
            )}

            {/* ================= GOOGLE SIGN-IN BUTTON ================= */}
            {(mode === 'LOGIN' || mode === 'REGISTER') && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignInClick}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#FFFDF7] hover:bg-[#F8F4E8] active:scale-[0.99] text-[#123F35] font-extrabold text-xs rounded-2xl border border-[#DDEEDF] shadow-sm hover:border-[#079669]/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-[#075C45] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>
                    {isGoogleLoading
                      ? 'Authenticating with Google...'
                      : mode === 'LOGIN'
                      ? 'Continue with Google'
                      : 'Sign up with Google'}
                  </span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-[#DDEEDF] w-full" />
                  <span className="bg-[#FFFDF7] px-3 text-[10px] uppercase font-bold text-[#123F35]/50 tracking-wider absolute">
                    or continue with email
                  </span>
                </div>
              </div>
            )}

            {/* ================= 1. LOGIN FORM ================= */}
            {mode === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-[#123F35] mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-3 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-bold text-[#123F35]">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('FORGOT');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] font-extrabold text-[#075C45] hover:text-[#079669] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#123F35]/50 hover:text-[#075C45] p-0.5"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#075C45] hover:bg-[#079669] active:scale-[0.99] text-[#FFFDF7] font-extrabold text-xs shadow-garden hover:shadow-garden-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as {role === 'COOK' ? 'Home Cook' : 'Customer'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= 2. REGISTRATION FORM ================= */}
            {mode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="block font-bold text-[#123F35] mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#123F35] mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#123F35] mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#123F35] mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#075C45]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-9 py-2.5 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#123F35]/50 hover:text-[#075C45]"
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#123F35] mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#075C45]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-9 py-2.5 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#123F35]/50 hover:text-[#075C45]"
                        aria-label="Toggle confirm password"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#075C45] hover:bg-[#079669] active:scale-[0.99] text-[#FFFDF7] font-extrabold text-xs shadow-garden hover:shadow-garden-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register as {role === 'COOK' ? 'Home Cook' : 'Customer'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= 3. FORGOT PASSWORD FORM ================= */}
            {mode === 'FORGOT' && (
              <form onSubmit={handleSendRecoveryOtp} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-[#123F35] mb-1.5">
                    Your Registered Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-3 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#075C45] hover:bg-[#079669] text-[#FFFDF7] font-extrabold text-xs shadow-garden hover:shadow-garden-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Send 6-Digit Recovery Code</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= 4. RESET PASSWORD FORM ================= */}
            {mode === 'RESET' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-[#123F35] mb-1.5">
                    6-Digit Verification Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 text-center text-xl font-mono font-black tracking-widest bg-[#F8F4E8]/60 border-2 border-[#079669]/50 rounded-2xl text-[#075C45] outline-none focus:border-[#075C45]"
                  />
                  <div className="flex items-center justify-between text-[11px] mt-1.5">
                    <span className="text-[#123F35]/60">
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Code not received?'}
                    </span>
                    <button
                      type="button"
                      onClick={handleSendRecoveryOtp}
                      disabled={!canResend || isLoading}
                      className="font-extrabold text-[#075C45] hover:underline disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Resend Code
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#123F35] mb-1.5">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#075C45]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-3 bg-[#F8F4E8]/60 border border-[#DDEEDF] rounded-2xl text-[#123F35] placeholder:text-[#123F35]/40 focus:ring-2 focus:ring-[#079669]/25 focus:border-[#079669] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#123F35]/50 hover:text-[#075C45]"
                      aria-label="Toggle new password"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full py-3.5 rounded-2xl bg-[#075C45] hover:bg-[#079669] text-[#FFFDF7] font-extrabold text-xs shadow-garden hover:shadow-garden-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Set New Password & Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Privacy and Terms Note */}
            <p className="text-[10px] text-center text-[#123F35]/50 leading-relaxed pt-2">
              By proceeding, you agree to HOME DELIGHTS's Terms of Service and Privacy Policy. All home kitchens are verified under FSSAI food safety norms.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      if (!supabase) {
        showMessage('Supabase not initialized', 'error');
        return;
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const supabase = getSupabase();
      if (!supabase) {
        showMessage('Supabase not initialized', 'error');
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        setUnverifiedEmail(email);
        setShowVerification(true);
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      const supabase = getSupabase();
      if (!supabase) {
        showMessage('Supabase not initialized', 'error');
        return;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      setUnverifiedEmail(email);
      setShowVerification(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      if (!supabase) {
        showMessage('Supabase not initialized', 'error');
        return;
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unverifiedEmail
      });

      if (error) throw error;
      showMessage('Verification email sent!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showMessage('Please enter your email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const supabase = getSupabase();
      if (!supabase) {
        showMessage('Supabase not initialized', 'error');
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) throw error;
      showMessage('Password reset link sent to your email!', 'success');
      setShowForgotPassword(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-main-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-medium text-primary-text no-underline tracking-wide">
              Rarity Leads
            </Link>
          </div>
          
          <div className="bg-card-bg border border-border rounded-card p-8">
            <h3 className="text-xl font-medium text-primary-text mb-4 text-center">
              Please verify your email
            </h3>
            <p className="text-secondary-text text-center mb-6">
              We&apos;ve sent a verification link to <strong className="text-primary-text">{unverifiedEmail}</strong>.
            </p>
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full bg-button-bg text-button-text font-medium rounded-btn py-3 px-6 transition-colors hover:bg-button-hover-bg disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
            <button
              onClick={() => {
                setShowVerification(false);
                setActiveTab('login');
              }}
              className="w-full bg-transparent text-primary-text border border-border rounded-btn py-3 px-6 mt-3 transition-colors hover:bg-button-bg"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-medium text-primary-text no-underline tracking-wide">
            Rarity Leads
          </Link>
        </div>

        {/* Auth Container */}
        <div className="bg-card-bg border border-border rounded-card p-8">
          {/* Tab Buttons */}
          <div className="flex mb-8 bg-button-bg rounded-btn p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-btn font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-main-bg text-primary-text'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-btn font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-main-bg text-primary-text'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Register
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-btn text-sm ${
              message.type === 'success' 
                ? 'bg-green-900/20 text-green-400 border border-green-800' 
                : 'bg-red-900/20 text-red-400 border border-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && !showForgotPassword && (
            <form onSubmit={handleLogin} className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-transparent text-primary-text border border-border rounded-btn py-3 px-6 flex items-center justify-center gap-3 transition-colors hover:bg-button-bg disabled:opacity-50"
              >
                <Image 
                  src="https://www.svgrepo.com/show/475656/google-color.svg" 
                  alt="Google" 
                  width={20} 
                  height={20}
                  unoptimized
                />
                Sign in with Google
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card-bg text-secondary-text">or</span>
                </div>
              </div>

              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-primary-text mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-main-bg border border-border rounded-btn px-4 py-3 text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-border"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-primary-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-main-bg border border-border rounded-btn px-4 py-3 text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-border"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-secondary-text">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary-text hover:text-secondary-text transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-button-bg text-button-text font-medium rounded-btn py-3 px-6 transition-colors hover:bg-button-hover-bg disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-transparent text-primary-text border border-border rounded-btn py-3 px-6 flex items-center justify-center gap-3 transition-colors hover:bg-button-bg disabled:opacity-50"
              >
                <Image 
                  src="https://www.svgrepo.com/show/475656/google-color.svg" 
                  alt="Google" 
                  width={20} 
                  height={20}
                  unoptimized
                />
                Sign up with Google
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card-bg text-secondary-text">or sign up with email</span>
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-primary-text mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="register-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-main-bg border border-border rounded-btn px-4 py-3 text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-border"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-primary-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full bg-main-bg border border-border rounded-btn px-4 py-3 text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-border"
                  placeholder="Enter your password (min 6 characters)"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-button-bg text-button-text font-medium rounded-btn py-3 px-6 transition-colors hover:bg-button-hover-bg disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {showForgotPassword && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <h3 className="text-xl font-medium text-primary-text mb-4 text-center">
                Reset Password
              </h3>
              <p className="text-secondary-text text-center mb-6">
                Enter your email address to receive a password reset link.
              </p>

              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-primary-text mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-main-bg border border-border rounded-btn px-4 py-3 text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-border"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-button-bg text-button-text font-medium rounded-btn py-3 px-6 transition-colors hover:bg-button-hover-bg disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full bg-transparent text-primary-text border border-border rounded-btn py-3 px-6 transition-colors hover:bg-button-bg"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 
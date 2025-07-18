
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sparkles, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const { t } = useTranslation();
  const { signIn, signUp, resetPassword, resendConfirmation, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [currentTab, setCurrentTab] = useState('signin');

  // Check for verification success or email confirmation requirement
  useEffect(() => {
    const verified = searchParams.get('verified');
    const type = searchParams.get('type');
    
    if (verified === 'true') {
      setShowVerificationMessage(true);
      setTimeout(() => {
        if (user) {
          navigate('/dashboard');
        }
      }, 2000);
    }
    
    if (type === 'recovery') {
      setCurrentTab('reset');
    }
  }, [searchParams, user, navigate]);

  // Redirect authenticated users
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (!result.needsVerification) {
        navigate('/dashboard');
      } else {
        setShowVerificationMessage(true);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password);
      setShowVerificationMessage(true);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await resendConfirmation(email);
    } catch (error) {
      console.error('Resend verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
        </div>

        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Rarity Leads
            </h1>
            <p className="text-gray-300 text-sm">Check your inbox</p>
          </div>

          <Card className="glass-card bg-white/10 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl font-medium text-white">Verify your email</CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                We sent a verification link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-green-500/20 border-green-400/50 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-gray-200 text-sm">
                  Click the verification link to access your dashboard
                </AlertDescription>
              </Alert>
              
              <div className="text-center space-y-3 pt-2">
                <p className="text-xs text-gray-400">Didn't receive the email?</p>
                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-sm"
                >
                  {loading ? 'Sending...' : 'Resend verification email'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Rarity Leads
          </h1>
          <p className="text-gray-300 text-sm">Sales prospecting platform</p>
        </div>

        <Card className="glass-card bg-white/10 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl font-medium text-white">Welcome</CardTitle>
            <CardDescription className="text-center text-gray-300 text-sm">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="signin" className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-3"
                  variant="outline"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {googleLoading ? 'Connecting...' : 'Continue with Google'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-gray-300">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-white text-sm font-medium">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password" className="text-white text-sm font-medium">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-gray-300 hover:text-white text-sm"
                    onClick={() => setCurrentTab('reset')}
                  >
                    Forgot your password?
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-3"
                  variant="outline"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {googleLoading ? 'Connecting...' : 'Sign up with Google'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-gray-300">Or create account with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email" className="text-white text-sm font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-white text-sm font-medium">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="text-white text-sm font-medium">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="mt-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Confirm your password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4 mt-6">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email" className="text-white text-sm font-medium">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send reset email'}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-gray-300 hover:text-white text-sm"
                    onClick={() => setCurrentTab('signin')}
                  >
                    Back to Sign In
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

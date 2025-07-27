"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import { ClientOnly } from '@/components/ClientOnly'

export default function AuthPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          setErrorMsg(error.message)
        } else {
          router.push('/dashboard')
        }
      } else {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg(t('auth.passwordsDoNotMatch'))
          return
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          setErrorMsg(error.message)
        } else {
          toast({
            title: t('common.success'),
            description: t('auth.accountCreated'),
          })
          setIsLogin(true)
        }
      }
    } catch (error: any) {
      setErrorMsg(error?.message || t('auth.invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) {
        setErrorMsg(error.message)
      }
    } catch (error: any) {
      setErrorMsg(error?.message || t('auth.googleSignInError'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 dark:from-background/90 dark:to-background/70 flex items-center justify-center p-8">
      {/* Theme Toggle and Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <ClientOnly fallback={
          <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
        }>
          <ThemeToggle />
        </ClientOnly>
        <ClientOnly fallback={
          <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
        }>
          <LanguageSwitcher />
        </ClientOnly>
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border shadow-lg overflow-hidden dark:from-card/90 dark:to-card/70">
            {/* Purple gradient overlay - more prominent in light theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-purple-400/5 to-transparent pointer-events-none dark:from-purple-500/1 dark:to-transparent"></div>
            
            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-foreground text-2xl font-medium mb-2">
                <ClientOnly fallback={isLogin ? "Sign In" : "Sign Up"}>
                  {isLogin ? t('auth.signIn') : t('auth.signUp')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                <ClientOnly fallback="Enter your details below">
                  {t('auth.enterYourDetails')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-foreground">
                    <ClientOnly fallback="Email">
                      {t('auth.email')}
                    </ClientOnly>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-border text-foreground placeholder-muted-foreground"
                    placeholder={t('auth.email')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-foreground">
                    <ClientOnly fallback="Password">
                      {t('auth.password')}
                    </ClientOnly>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-background border-border text-foreground placeholder-muted-foreground"
                    placeholder={t('auth.password')}
                    required
                  />
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword" className="text-foreground">
                      <ClientOnly fallback="Confirm Password">
                        {t('auth.confirmPassword')}
                      </ClientOnly>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="bg-background border-border text-foreground placeholder-muted-foreground"
                      placeholder={t('auth.confirmPassword')}
                      required
                    />
                  </div>
                )}

                {errorMsg && (
                  <div className="text-red-500 text-sm text-center">
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-purple-500/25 dark:from-purple-500/40 dark:to-purple-400/40 dark:hover:from-purple-500/50 dark:hover:to-purple-400/50"
                  disabled={loading}
                >
                  {loading ? (
                    <ClientOnly fallback="Loading...">
                      {t('common.loading')}
                    </ClientOnly>
                  ) : (
                    <ClientOnly fallback={isLogin ? "Sign In" : "Sign Up"}>
                      {isLogin ? t('auth.signIn') : t('auth.signUp')}
                    </ClientOnly>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      <ClientOnly fallback="Or continue with">
                        {t('auth.orContinueWith')}
                      </ClientOnly>
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full border-border text-foreground hover:bg-muted flex items-center justify-center space-x-2 bg-gradient-to-br from-muted to-muted/80 dark:from-muted/60 dark:to-muted/40 hover:from-muted/90 hover:to-muted/70 dark:hover:from-muted/70 dark:hover:to-muted/50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">
                    <ClientOnly fallback="Continue with Google">
                      {t('auth.google')}
                    </ClientOnly>
                  </span>
                </Button>

                <div className="text-center text-muted-foreground text-sm">
                  <ClientOnly fallback={isLogin ? "Don't have an account?" : "Already have an account?"}>
                    {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
                  </ClientOnly>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-500 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300 p-0 ml-1"
                  >
                    <ClientOnly fallback={isLogin ? "Sign Up" : "Sign In"}>
                      {isLogin ? t('auth.signUp') : t('auth.signIn')}
                    </ClientOnly>
                  </Button>
                </div>

                {isLogin && (
                  <div className="text-center">
                    <Link
                      href="/forgot-password"
                      className="text-purple-500 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
                    >
                      <ClientOnly fallback="Forgot Password?">
                        {t('auth.forgotPassword')}
                      </ClientOnly>
                    </Link>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-muted-foreground text-sm">
            <ClientOnly fallback="By signing up, you agree to our Terms of Service and Privacy Policy">
              {t('auth.bySigningUp')}{' '}
              <Link href="/terms" className="text-purple-500 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300">
                {t('auth.termsOfService')}
              </Link>{' '}
              <ClientOnly fallback="and">
                {t('auth.and')}
              </ClientOnly>{' '}
              <Link href="/privacy" className="text-purple-500 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300">
                {t('auth.privacyPolicy')}
              </Link>
            </ClientOnly>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 
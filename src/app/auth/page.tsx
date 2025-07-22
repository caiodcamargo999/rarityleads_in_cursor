"use client"

import { motion, useInView } from 'framer-motion'
import { useState, useRef } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const formRef = useRef(null)
  const formInView = useInView(formRef, { once: true })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      }
      
      // Redirect to dashboard on success
      window.location.href = '/dashboard'
    } catch (error: any) {
      setErrorMsg(error?.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setErrorMsg(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      
      if (error) throw error
      
      // The redirect will happen automatically
    } catch (error: any) {
      setErrorMsg(error?.message || 'Google sign-in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div ref={formRef} className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <Logo />
            </Link>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-normal text-white">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </CardTitle>
                <CardDescription className="text-base text-gray-400">
                  {isLogin ? 'Sign in to your account to continue' : 'Start your free trial today'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {errorMsg && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="mb-4 p-3 rounded bg-red-900/80 text-red-200 border border-red-700 text-sm text-center"
                  >
                    {errorMsg}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-normal text-white mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 rounded-lg focus:ring-2 focus:ring-rarity-purple/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-normal text-white mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 rounded-lg focus:ring-2 focus:ring-rarity-purple/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-800 text-rarity-purple focus:ring-rarity-purple/50 bg-[#0a0a0a]/50" />
                        <span className="ml-2 text-sm text-gray-400">Remember me</span>
                      </label>
                      <Link href="#" className="text-sm text-rarity-purple hover:text-rarity-purple/80 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 mt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                      className="w-full flex items-center justify-center"
                    >
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full flex items-center justify-center"
                      onClick={handleGoogleSignIn}
                      loading={googleLoading}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </Button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[#8b5cf6] hover:text-[#8b5cf6]/80 transition-colors font-normal"
                      aria-label={isLogin ? 'Switch to sign up form' : 'Switch to sign in form'}
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Eye, EyeOff, Key } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ClientOnly } from '@/components/ClientOnly'

export default function ChangePasswordPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate passwords match
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: t('common.error'),
          description: t('auth.passwordsDoNotMatch'),
          variant: 'destructive'
        })
        return
      }

      // Validate password strength
      if (formData.newPassword.length < 6) {
        toast({
          title: t('common.error'),
          description: 'Password must be at least 6 characters long',
          variant: 'destructive'
        })
        return
      }

      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (error) {
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive'
        })
      } else {
        toast({
          title: t('common.success'),
          description: 'Password updated successfully'
        })
        router.push('/settings')
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <ClientOnly fallback="Back">
            {t('common.back')}
          </ClientOnly>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            <ClientOnly fallback="Change Password">
              {t('settings.security.changePassword')}
            </ClientOnly>
          </h1>
          <p className="text-gray-400 mt-1">
            <ClientOnly fallback="Update your account password">
              Update your account password
            </ClientOnly>
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-neutral-900 border-neutral-800 max-w-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="w-5 h-5 mr-2" />
              <ClientOnly fallback="Change Password">
                {t('settings.security.changePassword')}
              </ClientOnly>
            </CardTitle>
            <CardDescription className="text-gray-400">
              <ClientOnly fallback="Enter your current password and choose a new one">
                Enter your current password and choose a new one
              </ClientOnly>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-white">
                  <ClientOnly fallback="Current Password">
                    Current Password
                  </ClientOnly>
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white pr-10"
                    placeholder="Enter current password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-neutral-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-white">
                  <ClientOnly fallback="New Password">
                    New Password
                  </ClientOnly>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-neutral-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white">
                  <ClientOnly fallback="Confirm New Password">
                    Confirm New Password
                  </ClientOnly>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white pr-10"
                    placeholder="Confirm new password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-neutral-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <ClientOnly fallback="Updating...">
                    Updating...
                  </ClientOnly>
                ) : (
                  <ClientOnly fallback="Update Password">
                    Update Password
                  </ClientOnly>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
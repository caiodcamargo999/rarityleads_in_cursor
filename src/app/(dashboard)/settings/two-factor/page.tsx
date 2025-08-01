"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Shield, Smartphone, QrCode, Key } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ClientOnly } from '@/components/ClientOnly'

export default function TwoFactorPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')

  useEffect(() => {
    checkTwoFactorStatus()
  }, [])

  const checkTwoFactorStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      // For now, we'll simulate 2FA status
      // In a real implementation, you'd check the user's 2FA status from your database
      setIsEnabled(false)
    } catch (error) {
      console.error('Error checking 2FA status:', error)
    }
  }

  const handleEnableTwoFactor = async () => {
    setLoading(true)
    try {
      // In a real implementation, you'd call Supabase Edge Functions or your backend
      // to generate QR codes and backup codes
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock QR code and backup codes
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
      setBackupCodes(['12345678', '87654321', '11111111', '22222222', '33333333'])
      setShowSetup(true)
      
      toast({
        title: t('common.success'),
        description: 'Two-factor authentication setup initiated'
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to enable 2FA',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: t('common.error'),
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // In a real implementation, you'd verify the code with your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsEnabled(true)
      setShowSetup(false)
      
      toast({
        title: t('common.success'),
        description: 'Two-factor authentication enabled successfully'
      })
      
      router.push('/settings')
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Invalid verification code',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDisableTwoFactor = async () => {
    setLoading(true)
    try {
      // In a real implementation, you'd call your backend to disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsEnabled(false)
      
      toast({
        title: t('common.success'),
        description: 'Two-factor authentication disabled'
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to disable 2FA',
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
            <ClientOnly fallback="Two-Factor Authentication">
              {t('settings.security.twoFactor')}
            </ClientOnly>
          </h1>
          <p className="text-gray-400 mt-1">
            <ClientOnly fallback="Add an extra layer of security to your account">
              Add an extra layer of security to your account
            </ClientOnly>
          </p>
        </div>
      </div>

      {!showSetup ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-neutral-900 border-neutral-800 max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Two-Factor Authentication">
                  {t('settings.security.twoFactor')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Protect your account with an additional verification step">
                  Protect your account with an additional verification step
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">
                      <ClientOnly fallback="Status">
                        Status
                      </ClientOnly>
                    </p>
                    <p className="text-gray-400 text-sm">
                      <ClientOnly fallback={isEnabled ? "Enabled" : "Disabled"}>
                        {isEnabled ? "Enabled" : "Disabled"}
                      </ClientOnly>
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={isEnabled ? handleDisableTwoFactor : handleEnableTwoFactor}
                  disabled={loading}
                />
              </div>

              {!isEnabled && (
                <Button
                  onClick={handleEnableTwoFactor}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <ClientOnly fallback="Setting up...">
                      Setting up...
                    </ClientOnly>
                  ) : (
                    <ClientOnly fallback="Enable Two-Factor Authentication">
                      Enable Two-Factor Authentication
                    </ClientOnly>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* QR Code Setup */}
          <Card className="bg-neutral-900 border-neutral-800 max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Scan QR Code">
                  Scan QR Code
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Scan this QR code with your authenticator app">
                  Scan this QR code with your authenticator app
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <Image src={qrCode} alt="QR Code" width={192} height={192} className="w-48 h-48" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  <ClientOnly fallback="Use apps like Google Authenticator, Authy, or Microsoft Authenticator">
                    Use apps like Google Authenticator, Authy, or Microsoft Authenticator
                  </ClientOnly>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Verification */}
          <Card className="bg-neutral-900 border-neutral-800 max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Verify Setup">
                  Verify Setup
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Enter the 6-digit code from your authenticator app">
                  Enter the 6-digit code from your authenticator app
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verificationCode" className="text-white">
                  <ClientOnly fallback="Verification Code">
                    Verification Code
                  </ClientOnly>
                </Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-neutral-800 border-neutral-700 text-white text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerifyCode}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <ClientOnly fallback="Verifying...">
                    Verifying...
                  </ClientOnly>
                ) : (
                  <ClientOnly fallback="Verify and Enable">
                    Verify and Enable
                  </ClientOnly>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Backup Codes */}
          <Card className="bg-neutral-900 border-neutral-800 max-w-md">
            <CardHeader>
              <CardTitle className="text-white">
                <ClientOnly fallback="Backup Codes">
                  Backup Codes
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Save these codes in a secure location. You can use them to access your account if you lose your authenticator device.">
                  Save these codes in a secure location. You can use them to access your account if you lose your authenticator device.
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="bg-neutral-800 p-3 rounded text-center font-mono text-white"
                  >
                    {code}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-4">
                <ClientOnly fallback="Each code can only be used once. Generate new codes if you run out.">
                  Each code can only be used once. Generate new codes if you run out.
                </ClientOnly>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
} 
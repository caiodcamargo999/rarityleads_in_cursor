"use client"

import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  User,
  Mail,
  Camera,
  Save,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    avatar: null as File | null
  })
  const profileRef = useRef(null)
  const profileInView = useInView(profileRef, { once: true })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setProfileData(prev => ({
          ...prev,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || '',
          company: user.user_metadata?.company || '',
          phone: user.user_metadata?.phone || ''
        }))
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileData(prev => ({ ...prev, avatar: file }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          company: profileData.company,
          phone: profileData.phone
        }
      })

      if (error) throw error

      // Handle avatar upload if selected
      if (profileData.avatar) {
        const fileExt = profileData.avatar.name.split('.').pop()
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, profileData.avatar)

        if (uploadError) throw uploadError

        // Update user avatar URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
      }

      // Show success message or redirect
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div ref={profileRef} className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={profileInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-[#232336] rounded-lg hover:bg-[#2d2d47] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.div>
            </Link>
            <h1 className="text-3xl font-normal text-white">Profile Settings</h1>
          </div>
          <p className="text-lg text-gray-400">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={profileInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-[#18181c] border border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-normal text-white">Personal Information</CardTitle>
              <CardDescription className="text-gray-400">
                Update your profile details and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                    {profileData.avatar ? (
                      <img 
                        src={URL.createObjectURL(profileData.avatar)} 
                        alt="Avatar preview" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#8b5cf6] p-2 rounded-full cursor-pointer hover:bg-[#7c3aed] transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-white font-normal mb-1">Profile Picture</h3>
                  <p className="text-sm text-gray-400">Upload a new profile picture</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-normal text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#8b5cf6] focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-normal text-white mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#8b5cf6] focus:outline-none transition-colors"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#8b5cf6] focus:outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#8b5cf6] text-white border border-[#8b5cf6] shadow-sm hover:shadow-lg hover:bg-[#7c3aed] hover:border-[#7c3aed] transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-lg"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 
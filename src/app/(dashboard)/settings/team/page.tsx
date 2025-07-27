"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Users, UserPlus, Mail, Shield, MoreVertical, Trash2, Edit } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ClientOnly } from '@/components/ClientOnly'

interface TeamMember {
  id: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
}

export default function TeamPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'owner',
      status: 'active',
      joinedAt: '2024-01-01',
      lastActive: '2024-01-15'
    }
  ])

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!inviteEmail || !inviteEmail.includes('@')) {
        toast({
          title: t('common.error'),
          description: 'Please enter a valid email address',
          variant: 'destructive'
        })
        return
      }

      // In a real implementation, you'd send an invitation via Supabase
      const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        data: {
          role: inviteRole,
          invited_by: (await supabase.auth.getUser()).data.user?.id
        }
      })

      if (error) {
        throw error
      }

      // Add to local state
      const newMember: TeamMember = {
        id: Date.now().toString(),
        email: inviteEmail,
        name: inviteEmail.split('@')[0],
        role: inviteRole as TeamMember['role'],
        status: 'pending',
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: 'Never'
      }

      setTeamMembers(prev => [...prev, newMember])
      setInviteEmail('')
      setInviteRole('member')
      setShowInviteForm(false)

      toast({
        title: t('common.success'),
        description: `Invitation sent to ${inviteEmail}`
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to send invitation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    setLoading(true)
    try {
      // In a real implementation, you'd remove the member from your database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTeamMembers(prev => prev.filter(member => member.id !== memberId))
      
      toast({
        title: t('common.success'),
        description: 'Team member removed'
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to remove member',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'admin':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'member':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'viewer':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'inactive':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
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
            <ClientOnly fallback="Team Management">
              {t('settings.team.title')}
            </ClientOnly>
          </h1>
          <p className="text-gray-400 mt-1">
            <ClientOnly fallback="Manage your team members and permissions">
              Manage your team members and permissions
            </ClientOnly>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Team Overview">
                  Team Overview
                </ClientOnly>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
                  <div className="text-gray-400 text-sm">
                    <ClientOnly fallback="Total Members">
                      Total Members
                    </ClientOnly>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </div>
                  <div className="text-gray-400 text-sm">
                    <ClientOnly fallback="Active">
                      Active
                    </ClientOnly>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {teamMembers.filter(m => m.status === 'pending').length}
                  </div>
                  <div className="text-gray-400 text-sm">
                    <ClientOnly fallback="Pending">
                      Pending
                    </ClientOnly>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-gray-400 text-sm">
                    <ClientOnly fallback="Max Members">
                      Max Members
                    </ClientOnly>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invite Member */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Invite Team Member">
                  {t('settings.team.inviteMember')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Invite new members to your team">
                  Invite new members to your team
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showInviteForm ? (
                <Button
                  onClick={() => setShowInviteForm(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <ClientOnly fallback="Invite Member">
                    {t('settings.team.inviteMember')}
                  </ClientOnly>
                </Button>
              ) : (
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white">
                      <ClientOnly fallback="Email Address">
                        Email Address
                      </ClientOnly>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="colleague@company.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-white">
                      <ClientOnly fallback="Role">
                        Role
                      </ClientOnly>
                    </Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="member">
                          <ClientOnly fallback="Member">
                            Member
                          </ClientOnly>
                        </SelectItem>
                        <SelectItem value="admin">
                          <ClientOnly fallback="Admin">
                            Admin
                          </ClientOnly>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <ClientOnly fallback="Viewer">
                            Viewer
                          </ClientOnly>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <ClientOnly fallback="Sending...">
                          Sending...
                        </ClientOnly>
                      ) : (
                        <ClientOnly fallback="Send Invitation">
                          Send Invitation
                        </ClientOnly>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInviteForm(false)}
                      className="border-neutral-700 text-white hover:bg-neutral-800"
                    >
                      <ClientOnly fallback="Cancel">
                        {t('common.cancel')}
                      </ClientOnly>
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Team Members">
                  {t('settings.team.members')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Manage your team members and their roles">
                  Manage your team members and their roles
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="outline" 
                        className={`${getRoleColor(member.role)}`}
                      >
                        {member.role}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(member.status)}`}
                      >
                        {member.status}
                      </Badge>
                      
                      {member.role !== 'owner' && (
                        <Button
                          onClick={() => handleRemoveMember(member.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 
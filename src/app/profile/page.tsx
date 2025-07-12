'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: '',
    company: '',
    email: '',
    plan: ''
  });
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading user profile
    setProfile({
      full_name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@example.com',
      plan: 'Pro Plan'
    });
  }, []);

  const handleLegalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password changed successfully!');
      setPasswords({ current_password: '', new_password: '' });
    } catch (error) {
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
          Profile Settings
        </h1>

        {/* Legal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Legal Information
          </h2>
          <form onSubmit={handleLegalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-gray-400"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan
                </label>
                <input
                  type="text"
                  id="plan"
                  value={profile.plan}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-gray-400"
                  placeholder="Subscription plan"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current_password"
                value={passwords.current_password}
                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Current password"
              />
            </div>
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new_password"
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="New password"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Authentication Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Authentication Methods
          </h2>
          <div className="flex gap-4 mb-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              📧 Email
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              🔍 Google
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add or manage your authentication methods. (Coming soon)
          </p>
        </div>

        {/* Delete Account */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Delete Account
          </h2>
          <button
            disabled
            className="px-6 py-2 bg-red-600 text-white rounded-lg opacity-50 cursor-not-allowed"
          >
            Delete My Account
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Account deletion is permanent and cannot be undone. (Coming soon)
          </p>
        </div>
      </div>
    </div>
  );
} 
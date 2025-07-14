'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const MoonIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
);
const SunIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.05 6.05L4.64 4.64m12.02 0l-1.41 1.41M6.05 17.95l-1.41 1.41"/></svg>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: '',
    company: '',
    email: '',
    plan: '',
    avatar: null as string | null,
  });
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(
    typeof window !== 'undefined' && localStorage.getItem('theme') ? localStorage.getItem('theme')! : 'dark'
  );
  const [language, setLanguage] = useState(
    typeof window !== 'undefined' && localStorage.getItem('lang') ? localStorage.getItem('lang')! : 'en'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate loading user profile
    setProfile({
      full_name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@example.com',
      plan: 'Pro Plan',
      avatar: null,
    });
  }, []);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfile((p) => ({ ...p, avatar: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  }, []);

  const handleThemeChange = (t: string) => {
    setTheme(t);
    if (typeof window !== 'undefined') localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  };
  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    if (typeof window !== 'undefined') localStorage.setItem('lang', code);
  };
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'pt-BR', name: 'PT' },
    { code: 'es', name: 'ES' },
    { code: 'fr', name: 'FR' },
  ];

  const handleLegalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
    } catch {
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
    } catch {
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

        {/* Avatar Upload */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-20 h-20">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer group" onClick={() => fileInputRef.current?.click()} tabIndex={0} aria-label="Upload avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-medium text-gray-700 dark:text-white">{profile.full_name.charAt(0)}</span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
              <span className="absolute bottom-0 right-0 bg-gray-800 text-xs px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity text-white">Edit</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-medium text-gray-900 dark:text-white">{profile.full_name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-300">{profile.email}</div>
          </div>
        </div>

        {/* Theme & Language */}
        <div className="flex gap-6 mb-8">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Theme</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-2 rounded-full transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${theme === 'dark' ? 'bg-gray-700 text-white border-[#8B5CF6]' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
                aria-label="Switch to dark mode"
              >
                <MoonIcon />
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-2 rounded-full transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${theme === 'light' ? 'bg-gray-200 text-gray-900 border-[#8B5CF6]' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
                aria-label="Switch to light mode"
              >
                <SunIcon />
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Language</div>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2 py-1 text-xs rounded-btn transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${
                    language === lang.code
                      ? 'bg-gray-700 text-white border-[#8B5CF6]' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>

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
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
          Authentication Methods
        </h2>
        <div className="flex gap-4 mb-3">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Email
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Google
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add or manage your authentication methods. (Coming soon)
        </p>

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
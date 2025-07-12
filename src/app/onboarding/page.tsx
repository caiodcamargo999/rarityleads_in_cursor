'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    goals: [] as string[],
    integrations: [] as string[]
  });

  const goals = [
    'Generate more leads',
    'Improve conversion rates',
    'Automate outreach',
    'Track performance',
    'Scale operations'
  ];

  const integrations = [
    { id: 'linkedin', name: 'LinkedIn', icon: '🔗' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'x', name: 'X (Twitter)', icon: '🐦' }
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleIntegrationToggle = (integrationId: string) => {
    setFormData(prev => ({
      ...prev,
      integrations: prev.integrations.includes(integrationId)
        ? prev.integrations.filter(i => i !== integrationId)
        : [...prev.integrations, integrationId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data and redirect to dashboard
    console.log('Onboarding completed:', formData);
    // In a real app, you would save this to your database
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Rarity Leads
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Let&apos;s set up your account in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tell us about your business
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select your industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Who is your target audience?
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience
                </label>
                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Describe your ideal customer..."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                What are your goals?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select all that apply
              </p>
              <div className="space-y-2">
                {goals.map((goal) => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {goal}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connect your platforms
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose which platforms you want to integrate
              </p>
              <div className="grid grid-cols-2 gap-3">
                {integrations.map((integration) => (
                  <label
                    key={integration.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.integrations.includes(integration.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.integrations.includes(integration.id)}
                      onChange={() => handleIntegrationToggle(integration.id)}
                      className="sr-only"
                    />
                    <span className="text-lg mr-2">{integration.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {integration.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          <div className="flex-1"></div>
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Setup
            </button>
          )}
        </div>

        {/* Skip Link */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { Search, Mail, MessageCircle, Phone, Clock, Book, Video, Star } from 'lucide-react';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');

  const handleContactEmail = () => {
    window.location.href = 'mailto:support@rarityleads.com';
  };

  const handleStartChat = () => {
    // Implement chat functionality
    alert('Chat feature coming soon!');
  };

  const handleCallPhone = () => {
    window.location.href = 'tel:+1234567890';
  };

  return (
    <div className="min-h-screen bg-main-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Support Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get help and support for your Rarity Leads account with 24/7 assistance
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleContactEmail}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Video className="w-4 h-4" />
            Schedule Demo
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0 min</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Average Response Time
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              24/7 Support Available
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
              <Book className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Help Articles
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Searchable Knowledge Base
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
              <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Video Tutorials
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Step-by-step Guides
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-4">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0%</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Satisfaction Rate
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              5-star Support Team
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'faq', label: 'FAQ' },
                { id: 'contact', label: 'Contact' },
                { id: 'resources', label: 'Resources' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      How do I get started with Rarity Leads?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sign up for an account and follow our onboarding process. We&apos;ll guide you through setting up your first campaign.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      What payment methods do you accept?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We accept all major credit cards, PayPal, and bank transfers for annual plans.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Can I cancel my subscription anytime?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Yes, you can cancel your subscription at any time. No long-term contracts required.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Get in Touch
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose your preferred method to reach our support team
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-4">
                      <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Email Support
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Get detailed responses within 2 hours
                    </p>
                    <button
                      onClick={handleContactEmail}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Send Email
                    </button>
                  </div>

                  <div className="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-4">
                      <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Live Chat
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Instant support during business hours
                    </p>
                    <button
                      onClick={handleStartChat}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Start Chat
                    </button>
                  </div>

                  <div className="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-4">
                      <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Phone Support
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Speak directly with our team
                    </p>
                    <button
                      onClick={handleCallPhone}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Helpful Resources
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Access our comprehensive library of guides and tutorials
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Getting Started Guide
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Learn the basics of using Rarity Leads effectively
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      Read Guide →
                    </button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      API Documentation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Integrate Rarity Leads with your existing tools
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      View Docs →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
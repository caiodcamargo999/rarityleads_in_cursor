
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import DefineTarget from '@/components/prospecting/DefineTarget';
import ExploreMarket from '@/components/prospecting/ExploreMarket';
import IdentifyContacts from '@/components/prospecting/IdentifyContacts';
import CustomizeApproach from '@/components/prospecting/CustomizeApproach';
import StartEngagement from '@/components/prospecting/StartEngagement';

const Prospecting = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [prospectingData, setProspectingData] = useState({
    // DefineTarget data
    industry: '',
    subSegment: '',
    location: '',
    companySize: '',
    budget: 0,
    // ExploreMarket data
    selectedOffer: null,
    // IdentifyContacts data
    targetCompany: '',
    selectedDecisionMakers: [],
    // CustomizeApproach data
    template: '',
    channel: '',
    customMessage: '',
    // StartEngagement data
    scheduledDate: '',
    followUpPlan: '',
    scheduledActions: [],
    sentMessages: []
  });

  const updateProspectingData = (newData: Partial<typeof prospectingData>) => {
    setProspectingData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepNames = [
    t('prospecting.defineTarget.title'),
    t('prospecting.exploreMarket.title'),
    t('prospecting.identifyContacts.title'),
    t('prospecting.customizeApproach.title'),
    t('prospecting.startEngagement.title')
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DefineTarget
            data={prospectingData}
            onUpdate={updateProspectingData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ExploreMarket
            data={prospectingData}
            onUpdate={updateProspectingData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <IdentifyContacts
            data={prospectingData}
            onUpdate={updateProspectingData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <CustomizeApproach
            data={prospectingData}
            onUpdate={updateProspectingData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <StartEngagement
            data={prospectingData}
            onUpdate={updateProspectingData}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('prospecting.title')}
            </h1>
            <span className="text-sm text-gray-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
              Step {currentStep} of 5
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium transition-all duration-300 ${
                    step < currentStep
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                      : step === currentStep
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                      : 'bg-white/10 backdrop-blur-sm text-gray-400 border border-white/20'
                  }`}
                >
                  {step}
                </div>
                <span className={`text-xs mt-3 text-center max-w-20 font-medium ${
                  step <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {stepNames[step - 1]}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-card bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Prospecting;

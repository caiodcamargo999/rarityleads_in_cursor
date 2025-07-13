import Header from '@/components/Header';
import HeroSection from '@/components/ui/HeroSection';
import FeatureSection from '@/components/ui/FeatureSection';
import PricingSection from '@/components/ui/PricingSection';
import FinalCTASection from '@/components/ui/FinalCTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-main-bg">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <FeatureSection />
        <section
          id="solution"
          className="py-16 md:py-20 px-4 bg-main-bg"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bentosans font-medium mb-6 text-primary-text">The Solution: AI-Powered Prospecting, Human Results</h2>
            <p className="text-lg md:text-xl text-secondary-text mb-8 font-inter font-normal max-w-2xl mx-auto">
              Rarity Leads automates and humanizes your entire lead generation process, so you can focus on closing deals, not chasing prospects. Our platform combines advanced AI, real-time data, and multi-channel outreach to deliver qualified leads, actionable insights, and scalable growth for agencies and sales teams.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-card-bg border border-border rounded-xl p-8 shadow-md">
                <h3 className="text-xl font-bentosans font-medium mb-3 text-primary-text">AI-Driven Automation</h3>
                <ul className="list-disc list-inside text-secondary-text space-y-2">
                  <li>Capture, enrich, and score leads automatically</li>
                  <li>AI-powered SDR qualifies and routes prospects</li>
                  <li>Smart WhatsApp, LinkedIn, and Email follow-ups</li>
                  <li>Human handoff for high-value conversations</li>
                </ul>
              </div>
              <div className="bg-card-bg border border-border rounded-xl p-8 shadow-md">
                <h3 className="text-xl font-bentosans font-medium mb-3 text-primary-text">Actionable Intelligence</h3>
                <ul className="list-disc list-inside text-secondary-text space-y-2">
                  <li>Real-time analytics and campaign optimization</li>
                  <li>Intent targeting and decision-maker identification</li>
                  <li>Predictive insights and AI recommendations</li>
                  <li>Custom dashboards for every role</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <PricingSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}

import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$47",
      features: [
        "Qualified Leads",
        "AI-Powered SDR",
        "Multi-Channel Outreach",
        "Email & Chat Support"
      ],
      cta: "Choose Plan",
      popular: false
    },
    {
      name: "Pro",
      price: "$97",
      features: [
        "More Qualified Leads",
        "Everything in Starter",
        "Campaign Intelligence",
        "Priority Support"
      ],
      cta: "Choose Plan",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$197",
      features: [
        "Unlimited Leads",
        "Everything in Pro",
        "Dedicated Success Manager",
        "Custom Integrations"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-center mb-12 text-primary-text">
          Simple, Transparent Pricing. No Surprises.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`border border-border rounded-card p-8 bg-card-bg relative ${
                plan.popular ? 'border-primary-text ring-1 ring-primary-text' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-text text-main-bg px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-lg md:text-xl font-medium text-primary-text mb-4">
                {plan.name}
              </h3>
              <p className="text-3xl md:text-4xl font-medium text-primary-text mb-6">
                {plan.price}
              </p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-secondary-text font-normal">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/auth" 
                className={`block w-full text-center font-medium rounded-btn py-3 px-6 transition-colors ${
                  plan.popular 
                    ? 'bg-button-bg text-button-text hover:bg-button-hover-bg' 
                    : 'bg-transparent text-primary-text border border-border hover:bg-button-bg'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
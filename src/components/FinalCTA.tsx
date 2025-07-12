import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6 text-primary-text">
          Ready to Build Your Unfair Advantage?
        </h2>
        <p className="text-lg md:text-xl text-secondary-text mb-8 font-normal max-w-2xl mx-auto">
          Join high-growth companies that trust Rarity Leads to build their sales pipeline on autopilot.
        </p>
        <Link 
          href="/auth" 
          className="inline-block bg-button-bg text-button-text font-medium rounded-btn px-8 py-4 text-lg transition-colors hover:bg-button-hover-bg focus:outline-none focus:ring-2 focus:ring-border"
        >
          Get Started for Free
        </Link>
      </div>
    </section>
  );
} 
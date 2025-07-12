import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-12 md:py-16 text-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium mb-4 text-primary-text leading-tight">
          AI-powered warm lead hunting for faster deals, deeper conversations, and scalable outreach — with zero guesswork.
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-secondary-text mb-8 max-w-3xl mx-auto font-normal">
          Rarity Leads is your AI-native platform to attract, qualify, and close clients — without the manual grind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/auth" 
            className="inline-block bg-button-bg text-button-text font-medium rounded-btn px-8 py-4 text-lg transition-colors hover:bg-button-hover-bg focus:outline-none focus:ring-2 focus:ring-border min-w-[200px] text-center"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </section>
  );
} 
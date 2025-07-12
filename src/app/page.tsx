import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-main-bg">
      <Header />
      <main className="pt-20">
        <Hero />
        <Features />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

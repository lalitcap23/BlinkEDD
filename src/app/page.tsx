import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import UseCases from './components/UseCases';
import BlinkForm from './components/BlinkForm';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

export const metadata = {
  title: 'Solana Universal Payment Links | BlinkEDD - Seamless Crypto Payments',
  description: 'Create universal Solana payment links that work across all devices and wallets. Perfect for meetups, social media, tips, and instant payments. No wallet detection required.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <section id="generator" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Create Your Payment Link
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Generate universal Solana payment links in seconds. Works on any device, any wallet, anywhere.
              </p>
            </div>
            <BlinkForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
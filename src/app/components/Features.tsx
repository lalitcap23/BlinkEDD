import React from 'react';
import { 
  Globe, 
  Smartphone, 
  Zap, 
  Shield, 
  Users, 
  Share2,
  QrCode,
  Wallet,
  Link,
  CheckCircle
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Globe,
      title: "Universal Compatibility",
      description: "Works with all Solana wallets including Phantom, Solflare, Backpack, Glow, and more",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices with automatic wallet detection and deep linking",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Create payment links in seconds without any registration or setup required",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Secure & Trustless",
      description: "No intermediaries, direct wallet-to-wallet transactions using Solana Pay protocol",
      color: "from-green-500 to-green-600"
    },
    {
      icon: QrCode,
      title: "QR Code Support",
      description: "Generate QR codes for easy scanning and payment processing at events",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Share2,
      title: "Social Media Ready",
      description: "Perfect for sharing on Twitter, Discord, Telegram, and other social platforms",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create and share Solana payment links that work seamlessly across all platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Why Choose Universal Payment Links?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "No wallet detection headaches",
              "Works on iOS and Android",
              "Compatible with all major wallets",
              "Perfect for events and meetups",
              "Social media friendly",
              "No technical knowledge required",
              "Instant payment processing",
              "Free to use forever"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { ArrowRight, Edit3, Share2, Zap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Edit3,
      title: "Enter Details",
      description: "Add recipient wallet address, amount, and optional message",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Generate Link",
      description: "Instantly create universal payment links and QR codes",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Share2,
      title: "Share Anywhere",
      description: "Share on social media, events, or send directly to recipients",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating universal Solana payment links is as easy as 1-2-3. No technical knowledge required.
          </p>
        </div>

        <div className="relative">
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full border-4 border-purple-200 flex items-center justify-center text-sm font-bold text-purple-600">
                    {index + 1}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-6 text-gray-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              See It In Action
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch how easy it is to create and share universal Solana payment links
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Enter wallet address</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Set amount and message</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Generate universal link</span>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg text-center">
                <span className="text-sm font-medium text-gray-700">Ready to share! 🎉</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
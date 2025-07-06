'use client';
import React from 'react';
import { ArrowRight, Zap, Globe, Smartphone } from 'lucide-react';

export default function Hero() {
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Universal Solana Payment Links
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Payment Links
            <br />
            <span className="text-4xl md:text-6xl">That Work Everywhere</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Create universal Solana payment links that work seamlessly across all devices, wallets, and platforms. 
            Perfect for <span className="font-semibold text-purple-600">meetups</span>, 
            <span className="font-semibold text-blue-600"> social media</span>, and 
            <span className="font-semibold text-indigo-600"> instant payments</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={scrollToGenerator}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              Create Payment Link
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">✅ Free</span>
              <span className="text-sm">✅ No Registration</span>
              <span className="text-sm">✅ Instant</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Universal Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">0s</div>
              <div className="text-gray-600">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">∞</div>
              <div className="text-gray-600">Use Cases</div>
            </div>
          </div>
        </div>

        {/* Visual Demo */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Universal Links</h3>
                <p className="text-gray-600">Works on any device, any wallet, anywhere in the world</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black ">Mobile Optimized</h3>
                <p className="text-gray-600">Perfect mobile experience with automatic wallet detection</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Instant Setup</h3>
                <p className="text-gray-600">Generate payment links in seconds, no technical knowledge required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
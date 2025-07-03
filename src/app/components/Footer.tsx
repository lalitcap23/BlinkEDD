'use client';

import React from 'react';
import { Zap, Github, Twitter, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                BlinkEDD
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Create universal Solana payment links that work seamlessly across all devices, wallets, and platforms. 
              Built for the future of decentralized payments.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/lalitcap23"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Use Cases
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.solanapay.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  Solana Pay Docs
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://solana.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  Solana.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  Phantom Wallet
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://solflare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  Solflare Wallet
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>on Solana</span>
            </div>
            
            <div className="text-gray-300 text-sm">
              © 2025 BlinkEDD. Open source and free forever.
            </div>
            
            <button
              onClick={scrollToTop}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200 text-sm font-medium"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
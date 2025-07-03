'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Github, Twitter } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BlinkEDD
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Use Cases
            </button>
            <button
              onClick={() => scrollToSection('generator')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
            >
              Get Started
            </button>
          </div>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://github.com/lalitcap23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('use-cases')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection('generator')}
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium mt-2"
              >
                Get Started
              </button>
              <div className="flex items-center space-x-4 px-3 py-2">
                <a
                  href="https://github.com/lalitcap23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  generatePhantomMobileDeepLink,
  generateBackpackMobileDeepLink,
  generateSolflareMobileDeepLink,
  generateGlowMobileDeepLink,
  generateSolanaPayURL,
  detectMobilePlatform,
  formatSolAmount
} from "../utils/generateBlink";
import { ArrowLeft, Wallet, Smartphone, Globe, Copy, Check, ExternalLink } from "lucide-react";

const SUPPORTED_WALLETS = [
  { name: "Phantom", emoji: "👻", color: "from-purple-500 to-purple-600" },
  { name: "Solflare", emoji: "☀️", color: "from-yellow-500 to-orange-500" },
  { name: "Backpack", emoji: "🎒", color: "from-orange-500 to-red-500" },
  { name: "Glow", emoji: "✨", color: "from-blue-500 to-indigo-500" },
];

export default function PayClientPage() {
  const searchParams = useSearchParams();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);

  // Read params
  const recipient = searchParams.get("recipient") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");
  const label = searchParams.get("label") || "";
  const message = searchParams.get("message") || "";

  useEffect(() => {
    const platform = detectMobilePlatform();
    setIsAndroid(platform.isAndroid);
    setIsMobile(platform.isMobile);
  }, []);

  const handlePay = () => {
    const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
    setStatus("Opening wallet...");
    window.location.href = solanaPayUrl;
    setTimeout(() => setStatus(""), 3000);
  };

  const handleWalletSelect = (wallet: string) => {
    let url = "";
    switch (wallet.toLowerCase()) {
      case "phantom":
        url = generatePhantomMobileDeepLink(recipient, amount, label, message);
        break;
      case "solflare":
        url = generateSolflareMobileDeepLink(recipient, amount, label, message);
        break;
      case "backpack":
        url = generateSolanaPayURL(recipient, amount, label, message, { forceHttps: true });
        break;
      case "glow":
        url = generateGlowMobileDeepLink(recipient, amount, label, message);
        break;
      default:
        url = generateSolanaPayURL(recipient, amount, label, message);
    }
    setStatus(`Opening ${wallet}...`);
    window.location.href = url;
    setTimeout(() => setStatus(""), 3000);
    setShowWalletModal(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-gray-800">Solana Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Payment Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
              <div className="text-4xl mb-3">💳</div>
              <h1 className="text-2xl font-bold mb-2">Payment Request</h1>
              <div className="text-3xl font-bold mb-1">{formatSolAmount(amount)}</div>
              <p className="text-purple-100 text-sm">Solana Payment</p>
            </div>

            {/* Payment Details */}
            <div className="p-8 space-y-6">
              {/* Recipient */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-600 mb-2">Recipient</div>
                <div className="font-mono text-sm text-gray-800 break-all">
                  {recipient.slice(0, 8)}...{recipient.slice(-8)}
                </div>
                <button
                  onClick={() => copyToClipboard(recipient)}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy full address'}
                </button>
              </div>

              {/* Label & Message */}
              {label && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm font-semibold text-gray-600 mb-1">Payment For</div>
                  <div className="text-gray-800">{label}</div>
                </div>
              )}

              {message && (
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm font-semibold text-gray-600 mb-1">Message</div>
                  <div className="text-gray-800">{message}</div>
                </div>
              )}

              {/* Payment Buttons */}
              <div className="space-y-4">
                {/* Primary Pay Button */}
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg text-lg flex items-center justify-center gap-2"
                  onClick={handlePay}
                >
                  <Wallet className="w-6 h-6" />
                  Pay Now
                </button>

                {/* Mobile Wallet Selection */}
                {isMobile && (
                  <button
                    className="w-full bg-white border-2 border-gray-200 hover:border-purple-300 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => setShowWalletModal(true)}
                  >
                    <Smartphone className="w-5 h-5" />
                    Choose Wallet App
                  </button>
                )}

                {/* Desktop Info */}
                {!isMobile && (
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700">
                      On desktop? The payment link will open your default Solana wallet or browser extension.
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              {status && (
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-purple-700 text-sm font-medium">{status}</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">
                Powered by <span className="font-semibold text-purple-600">BlinkEDD</span> • Universal Solana Payments
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">
                This payment uses the official Solana Pay protocol. Your transaction is processed directly by your wallet - we never handle your funds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-center mb-6">Choose Your Wallet</h2>
              <div className="space-y-3">
                {SUPPORTED_WALLETS.map((wallet) => (
                  <button
                    key={wallet.name}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 bg-gradient-to-r ${wallet.color} hover:shadow-lg group`}
                    onClick={() => handleWalletSelect(wallet.name)}
                  >
                    <span className="text-2xl">{wallet.emoji}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white group-hover:text-white">{wallet.name}</div>
                      <div className="text-sm text-white/80">Tap to open</div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-white/80" />
                  </button>
                ))}
              </div>
              <button
                className="mt-6 w-full text-gray-500 hover:text-gray-700 text-sm py-2"
                onClick={() => setShowWalletModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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

const SUPPORTED_WALLETS = [
  { name: "Phantom", emoji: "👻" },
  { name: "Solflare", emoji: "☀️" },
  { name: "Backpack", emoji: "🎒" },
  { name: "Glow", emoji: "✨" },
];

export default function PayClientPage() {
  const searchParams = useSearchParams();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [status, setStatus] = useState("");

  // Read params
  const recipient = searchParams.get("recipient") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");
  const label = searchParams.get("label") || "";
  const message = searchParams.get("message") || "";

  useEffect(() => {
    const platform = detectMobilePlatform();
    setIsAndroid(platform.isAndroid);
  }, []);

  const handlePay = () => {
    // Always use the solana: URI scheme for best compatibility
    const solanaPayUrl = generateSolanaPayURL(recipient, amount, label, message);
    // Replace window.open with location.href for best Android compatibility
    window.location.href = solanaPayUrl;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Solana Payment Request
        </h1>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-700">Recipient:</span>
            <span className="font-mono text-gray-600">{recipient}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-700">Amount:</span>
            <span className="font-mono text-gray-600">{formatSolAmount(amount)}</span>
          </div>
          {label && (
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Label:</span>
              <span className="font-mono text-gray-600">{label}</span>
            </div>
          )}
          {message && (
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Message:</span>
              <span className="font-mono text-gray-600">{message}</span>
            </div>
          )}
        </div>
        <button
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all text-lg mb-2"
          onClick={handlePay}
        >
          PAY
        </button>
        {status && <div className="text-center text-blue-600 text-sm mt-2">{status}</div>}
        <p className="text-xs text-gray-500 text-center mt-4">
          Powered by Universal Solana Pay
        </p>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 max-w-full">
            <h2 className="text-lg font-semibold mb-4 text-center">Select Wallet</h2>
            <div className="space-y-3">
              {SUPPORTED_WALLETS.map((wallet) => (
                <button
                  key={wallet.name}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-base font-medium justify-center"
                  onClick={() => handleWalletSelect(wallet.name)}
                >
                  <span className="text-xl">{wallet.emoji}</span>
                  <span>{wallet.name}</span>
                </button>
              ))}
            </div>
            <button
              className="mt-6 w-full text-gray-500 hover:text-gray-700 text-sm underline"
              onClick={() => setShowWalletModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
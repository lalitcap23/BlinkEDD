// components/BlinkForm.tsx
'use client';

import { useState } from 'react';
import { generateBlinkURL, generateSolanaPayURL, validateSolanaAddress } from '../utils/generateBlink';
import { Copy, ExternalLink, QrCode, Check, AlertCircle } from 'lucide-react';

// QR Code component using QR Server API
const QRCodeDisplay = ({ value, size = 200 }: { value: string; size?: number }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=000000&margin=1`;
  
  return (
    <div className="relative">
      <img 
        src={qrUrl} 
        alt="QR Code for payment" 
        width={size} 
        height={size}
        className="border border-gray-200 rounded-lg shadow-sm"
        onError={(e) => {
          console.error('QR Code failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default function BlinkForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number>(0.1);
  const [label, setLabel] = useState('Support Me');
  const [message, setMessage] = useState('');
  const [phantomLink, setPhantomLink] = useState('');
  const [solanaPayLink, setSolanaPayLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPhantom, setCopiedPhantom] = useState(false);
  const [copiedSolanaPay, setCopiedSolanaPay] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleGenerate = async () => {
    setError('');
    
    if (!recipient.trim()) {
      setError('Wallet address is required');
      return;
    }

    if (!validateSolanaAddress(recipient.trim())) {
      setError('Invalid Solana wallet address');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setIsGenerating(true);
    
    try {
      const phantomUrl = generateBlinkURL(recipient.trim(), amount, label.trim(), message.trim());
      const solanaUrl = generateSolanaPayURL(recipient.trim(), amount, label.trim(), message.trim());
      
      setPhantomLink(phantomUrl);
      setSolanaPayLink(solanaUrl);
    } catch (err) {
      console.error('Error generating blink:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate blink');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'phantom' | 'solanapay') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'phantom') {
        setCopiedPhantom(true);
        setTimeout(() => setCopiedPhantom(false), 2000);
      } else {
        setCopiedSolanaPay(true);
        setTimeout(() => setCopiedSolanaPay(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const openInPhantom = () => {
    if (phantomLink) {
      window.open(phantomLink, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ⚡ Solana Blink Maker
        </h1>
        <p className="text-gray-600">Create instant payment links for Phantom wallet</p>
      </div>
      
      <div className="space-y-6">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recipient Wallet Address *
          </label>
          <input
            type="text"
            placeholder="Enter Solana wallet address (e.g., 7xKXtg...)"
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-mono"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount (SOL) *
          </label>
          <input
            type="number"
            placeholder="0.1"
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.001"
          />
          <p className="text-xs text-gray-500 mt-1">
            ≈ ${(amount * 20).toFixed(2)} USD (approximate)
          </p>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Label
          </label>
          <input
            type="text"
            placeholder="e.g., Buy me a coffee, Tip for content"
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            placeholder="Add a personal message..."
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !recipient.trim() || amount <= 0}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating Blink...
            </>
          ) : (
            <>
              ⚡ Generate Payment Blink
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {phantomLink && (
        <div className="mt-8 space-y-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎉 Blink Generated Successfully!</h3>
            <p className="text-sm text-gray-600">Share these links to receive payments</p>
          </div>

          {/* Phantom Link */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Phantom Wallet Link:</label>
              <button
                onClick={openInPhantom}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Test Link
              </button>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
              <input
                type="text"
                value={phantomLink}
                readOnly
                className="flex-1 text-xs text-gray-600 bg-transparent outline-none"
              />
              <button
                onClick={() => copyToClipboard(phantomLink, 'phantom')}
                className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                  copiedPhantom 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copiedPhantom ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedPhantom ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Solana Pay Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Solana Pay URL:</label>
            <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
              <input
                type="text"
                value={solanaPayLink}
                readOnly
                className="flex-1 text-xs text-gray-600 bg-transparent outline-none font-mono"
              />
              <button
                onClick={() => copyToClipboard(solanaPayLink, 'solanapay')}
                className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                  copiedSolanaPay 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copiedSolanaPay ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSolanaPay ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="text-center">
            <button
              onClick={() => setShowQR(!showQR)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors text-sm font-medium"
            >
              <QrCode className="w-4 h-4" />
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
            
            {showQR && (
              <div className="mt-4 inline-block p-4 bg-white rounded-lg shadow-sm">
                <QRCodeDisplay value={solanaPayLink} size={200} />
                <p className="text-xs text-gray-500 mt-2">Scan with Phantom or compatible wallet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
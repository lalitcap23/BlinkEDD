import React from 'react';
import { Copy, Check, Globe, QrCode, Share2 } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';

const ShareableLinks = ({
  universalPaymentLink,
  solanaPayURL,
  copied,
  copyToClipboard,
  amount,
  showAdvanced,
  setShowAdvanced,
  showQR,
  setShowQR,
  label,
  message
}: {
  universalPaymentLink: string;
  solanaPayURL: string;
  copied: { [key: string]: boolean };
  copyToClipboard: (text: string, type: string) => void;
  amount: number;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
  showQR: boolean;
  setShowQR: (v: boolean) => void;
  label: string;
  message: string;
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Solana Payment Link',
          text: label ? label : 'Pay me with Solana!',
          url: universalPaymentLink,
        });
      } catch (e) {
      }
    } else {
      alert('Sharing is not supported on this device/browser.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Universal Payment Page:
        </h5>
        <div className="bg-gray-50 p-3 rounded border font-mono text-xs break-all text-gray-600 mb-2">
          {universalPaymentLink}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => copyToClipboard(universalPaymentLink, 'universal')}
            className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm font-semibold text-black transition-colors flex items-center justify-center gap-2"
          >
            {copied.universal ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied.universal ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 rounded text-sm font-semibold text-black transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link anywhere - it creates a payment page that works on all devices
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>
      </div>

      {showAdvanced && (
        <>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Direct Solana Pay URL:</h5>
            <div className="bg-gray-50 p-3 rounded border font-mono text-xs break-all text-gray-600 mb-2">
              {solanaPayURL}
            </div>
            <button
              onClick={() => copyToClipboard(solanaPayURL, 'solpay')}
              className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded text-sm font-semibold text-black transition-colors flex items-center justify-center gap-2"
            >
              {copied.solpay ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied.solpay ? 'Copied!' : 'Copy Solana Pay URL'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Direct wallet protocol URL - for QR codes and wallet integrations
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowQR(!showQR)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors text-sm font-medium text-black"
            >
              <QrCode className="w-4 h-4"  />
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>

            {showQR && (
              <div className="mt-6 inline-block p-6 bg-white rounded-lg shadow-sm border">
                <QRCodeDisplay value={solanaPayURL} size={200} />
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500">Scan with any Solana wallet app</p>
                  <button
                    onClick={() => copyToClipboard(solanaPayURL, 'qr')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-semibold text-black transition-colors"
                  >
                    {'qr' in copied && copied.qr ? 'Copied!' : 'Copy QR URL'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShareableLinks;

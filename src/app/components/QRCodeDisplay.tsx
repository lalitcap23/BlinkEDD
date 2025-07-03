import React from 'react';

const QRCodeDisplay = ({ value, size = 200 }: { value: string; size?: number }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=000000&margin=1&ecc=M`;

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
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
        Compatible with all Solana wallets
      </div>
    </div>
  );
};

export default QRCodeDisplay; 
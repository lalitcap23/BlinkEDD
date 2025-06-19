'use client';

import { useState } from 'react';
import { generateBlinkURL } from '../utils/generateBlink';

export default function BlinkForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0.5);
  const [label, setLabel] = useState('Fund Me Coffee');
  const [link, setLink] = useState('');

  const handleGenerate = () => {
    const url = generateBlinkURL(recipient, amount, label);
    setLink(url);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl space-y-4">
      <h1 className="text-2xl font-bold text-center">🔗 Blink Maker</h1>

      <input
        type="text"
        placeholder="Your Wallet Address"
        className="w-full border p-2 rounded"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <input
        type="text"
        placeholder="Tag/Label (e.g. Buy me coffee)"
        className="w-full border p-2 rounded"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount in SOL"
        className="w-full border p-2 rounded"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />

      <button
        onClick={handleGenerate}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        Generate Blink
      </button>

      {link && (
        <div className="text-center">
          <p className="text-sm mt-2">🔗 Copy your blink link:</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words text-blue-600 underline"
          >
            {link}
          </a>
        </div>
      )}
    </div>
  );
}

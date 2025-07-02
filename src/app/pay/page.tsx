'use client';

import { useEffect, useRef } from 'react';
import { createUniversalPaymentButton } from '../utils/generateBlink';

export default function PayPage() {
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = createUniversalPaymentButton({
      recipient: 'YourSolanaAddressHere',
      amount: 0.01,
      label: 'Thanks!',
      message: 'You are awesome!'
    });

    if (buttonContainerRef.current) {
      buttonContainerRef.current.appendChild(button);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">Pay Page</h1>
      <div ref={buttonContainerRef} />
      <div id="status" className="mt-4 text-center text-sm text-gray-300" />
    </div>
  );
}

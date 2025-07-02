'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { createUniversalPaymentButton } from '../utils/generateBlink';

export default function PayClient() {
  const searchParams = useSearchParams();
  const to = searchParams.get('to') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const label = searchParams.get('label') || '';
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!to || !amount) return;

    const button = createUniversalPaymentButton({
      recipient: to,
      amount,
      label,
      message: 'You are awesome!'
    });

    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = ''; // Clear any previous buttons
      buttonContainerRef.current.appendChild(button);
    }
  }, [to, amount, label]);

  return (
    <div style={{ backgroundColor: 'white', color: 'black', height: '100vh', padding: '2rem' }}>
      <h1>Pay Page</h1>
      <div ref={buttonContainerRef} />
      <div id="status" style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }} />
    </div>
  );
}

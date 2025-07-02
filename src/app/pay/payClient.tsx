// src/app/pay/PayClient.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function PayClient() {
  const searchParams = useSearchParams();
  const to = searchParams.get('to');
  const amount = searchParams.get('amount');
  const label = searchParams.get('label');

  return (
    <div style={{ backgroundColor: 'white', color: 'black', height: '100vh', padding: '2rem' }}>
      <h1>Pay Page</h1>
      <p>To: {to}</p>
      <p>Amount: {amount}</p>
      <p>Label: {label}</p>
    </div>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';

export default function PayPage() {
  const searchParams = useSearchParams();

  const to = searchParams.get('to');
  const amount = searchParams.get('amount');
  const label = searchParams.get('label');

  return (
    <div>
      <h1>Pay Page</h1>
     
    </div>
  );
}

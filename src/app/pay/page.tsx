// src/app/pay/page.tsx
import { Suspense } from 'react';
import PayClient from './payClient';

export default function PayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayClient />
    </Suspense>
  );
}

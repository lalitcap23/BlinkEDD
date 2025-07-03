import { Suspense } from 'react';
import PayClientPage from './PayClientPage';

export default function PayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayClientPage />
    </Suspense>
  );
} 
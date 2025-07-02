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
  if (!to || !amount || amount <= 0) {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = '<p style="color: red;">Invalid payment parameters</p>';
    }
    return;
  }
  
  try {
    const button = createUniversalPaymentButton({
      recipient: to,
      amount,
      label,
      message: 'You are awesome!'
    });
    
    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = '';
      buttonContainerRef.current.appendChild(button);
    }
  } catch (error) {
    console.error('Error creating payment button:', error);
    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = '<p style="color: red;">Error creating payment button</p>';
    }
  }
}, [to, amount, label]);}
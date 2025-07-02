'use client';
import { useEffect, useRef, useState } from 'react';
import { createUniversalPaymentButton } from '../utils/generateBlink';

export default function PayPage() {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [debug, setDebug] = useState<string>('');

  useEffect(() => {
    console.log('PayPage useEffect triggered');
    setDebug('Starting button creation...');
    
    try {
      console.log('Creating button with params:', {
        recipient: 'YourSolanaAddressHere',
        amount: 0.01,
        label: 'Thanks!',
        message: 'You are awesome!'
      });
      
      const button = createUniversalPaymentButton({
        recipient: 'YourSolanaAddressHere',
        amount: 0.01,
        label: 'Thanks!',
        message: 'You are awesome!'
      });
      
      console.log('Button created:', button);
      setDebug('Button created successfully');
      
      if (buttonContainerRef.current) {
        console.log('Container found, appending button');
        buttonContainerRef.current.appendChild(button);
        setDebug('Button appended to container');
      } else {
        console.log('Container not found');
        setDebug('Error: Container not found');
      }
    } catch (error) {
      console.error('Error creating button:', error);
      setDebug(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  // Fallback: Create button manually if import fails
  const createFallbackButton = () => {
    const button = document.createElement('button');
    button.textContent = '🚀 Test Button (Fallback)';
    button.style.cssText = `
      padding: 10px 20px;
      border-radius: 8px;
      background: #6366f1;
      color: white;
      font-size: 16px;
      border: none;
      cursor: pointer;
      margin-top: 16px;
    `;
    button.onclick = () => alert('Fallback button clicked!');
    return button;
  };

  const handleFallbackTest = () => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = '';
      const fallbackButton = createFallbackButton();
      buttonContainerRef.current.appendChild(fallbackButton);
      setDebug('Fallback button created');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Pay Page</h1>
      
      {/* Debug info */}
      <div className="bg-gray-100 p-4 rounded mb-4 text-sm">
        <strong>Debug:</strong> {debug}
      </div>
      
      {/* Button container */}
      <div ref={buttonContainerRef} className="min-h-[50px] border-2 border-dashed border-gray-300 p-4 rounded">
        {/* Button will be inserted here */}
      </div>
      
      {/* Fallback test button */}
      <button 
        onClick={handleFallbackTest}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Test Fallback Button
      </button>
      
      <div id="status" className="mt-4 text-center text-sm text-gray-600" />
      
      {/* Additional debug info */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Container ref: {buttonContainerRef.current ? 'Found' : 'Not found'}</p>
        <p>Window available: {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
import React from 'react';
import { AlertCircle, Wallet } from 'lucide-react';

const StatusAlert = ({ type, message }: { type: 'error' | 'status'; message: string }) => {
  if (!message) return null;
  if (type === 'error') {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">
      <Wallet className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default StatusAlert; 
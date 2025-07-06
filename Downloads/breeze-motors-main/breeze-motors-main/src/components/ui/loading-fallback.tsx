import React from 'react';
import { RefreshCw, Phone, AlertCircle } from 'lucide-react';
import { Button } from './button';

interface LoadingFallbackProps {
  error?: string;
  onRetry?: () => void;
  showPhoneNumber?: boolean;
}

const LoadingFallback = ({ error, onRetry, showPhoneNumber = true }: LoadingFallbackProps) => {
  const handleCall = () => {
    try {
      window.location.href = 'tel:+15199710000';
    } catch (e) {
      alert('Please call us at (519) 971-0000');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          Service Notice
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {error}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          {showPhoneNumber && (
            <Button 
              onClick={handleCall}
              className="flex items-center gap-2 bg-[#3cc421] hover:bg-[#2ea01c]"
            >
              <Phone className="h-4 w-4" />
              Call (519) 971-0000
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
      <p className="text-lg text-gray-600">Loading our inventory...</p>
    </div>
  );
};

export default LoadingFallback;
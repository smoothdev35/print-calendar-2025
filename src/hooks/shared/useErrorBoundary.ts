import { useState } from 'react';

interface IUseErrorBoundary {
  error: Error | null;
  resetError: () => void;
}

const useErrorBoundary = (): IUseErrorBoundary => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    console.error('Error caught by boundary:', error);
  }

  return {
    error,
    resetError: () => setError(null)
  };
}

export default useErrorBoundary;
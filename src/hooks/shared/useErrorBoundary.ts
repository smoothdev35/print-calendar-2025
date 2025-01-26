import { useState } from 'react'

type UseErrorBoundary = {
  error: Error | null
  resetError: () => void
}

const useErrorBoundary = (): UseErrorBoundary => {
  const [error, setError] = useState<Error | null>(null)

  if (error) {
    console.error('Error caught by boundary:', error)
  }

  return {
    error,
    resetError: () => setError(null),
  }
}

export default useErrorBoundary

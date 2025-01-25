import { type PropsWithChildren, type ReactNode } from 'react'
import useErrorBoundary from '@/hooks/shared/useErrorBoundary'

interface IErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode
}

const ErrorBoundary = ({ children, fallback }: IErrorBoundaryProps) => {
  const { error, resetError } = useErrorBoundary()

  if (error) {
    return (
      fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {error.toString()}
          </details>
          <button onClick={resetError}>Try again</button>
        </div>
      )
    )
  }

  return children
}

export default ErrorBoundary

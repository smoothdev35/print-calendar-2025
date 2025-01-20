import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { APP_ROUTES } from './enums/shared.enums'
import ErrorBoundary from './components/shared/ErrorBoundary'

const CalendarScreen = lazy(() => import('./screens/calendar/CalendarScreen'))

const router = createBrowserRouter([
  {
    path: APP_ROUTES.ROOT,
    element: (
      <Suspense fallback={<>Loading</>}>
        <CalendarScreen />
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
])

export default router

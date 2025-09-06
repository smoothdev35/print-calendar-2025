import { RouterProvider } from 'react-router-dom'
import router from './routes'
import './index.css'
import { ErrorModal } from './components/shared/ErrorModal'
import { useErrorStore } from './store/errorStore'

const App = () => {
  const { isOpen, title, description, hideError } = useErrorStore()

  return (
    <>
      <RouterProvider router={router} />
      <ErrorModal
        open={isOpen}
        title={title}
        description={description}
        onOpenChange={hideError}
      />
    </>
  )
}

export default App

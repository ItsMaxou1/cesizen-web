import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

const App = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/*' element={user ? <DashboardPage /> : <Navigate to='/login' />} />
    </Routes>
  )
}

export default App
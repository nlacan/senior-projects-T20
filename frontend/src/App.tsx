import { Navigate, Route, Routes } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import CreateProfile from './pages/CreateProfile'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import LoginUser from './pages/LoginUser'
import RegisterUser from './pages/RegisterUser'

export default function App() {
  return (
    <Routes>
      {/* anyone can see these */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/login" element={<LoginUser />} />

      {/* only logged-in users can see these (others are sent to /login) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* any other address goes back to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

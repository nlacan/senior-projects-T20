import { Navigate, Outlet } from 'react-router'

// wraps pages that need a logged-in user
// if not logged in, send them to /login

export default function ProtectedRoute() {
    const isLoggedIn = Boolean(localStorage.getItem('token'))
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

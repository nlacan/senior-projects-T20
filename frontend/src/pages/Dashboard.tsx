import { useNavigate } from 'react-router'
import { clearTokens } from '../api'

export default function Dashboard() {
    const navigate = useNavigate()

    // (temporary) lets us test the flow again without clearing the browser's storage
    function handleLogout() {
        clearTokens()
        navigate('/')
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Dashboard elements here</p>
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}

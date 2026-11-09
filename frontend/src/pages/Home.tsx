import { Link } from 'react-router'

export default function Home() {
    return (
    <div>
        <h1>Welcome to PackAbroad!</h1>
        <p>
        <Link to="/register">Register</Link>
        </p>
        <p>
        <Link to="/login">Login</Link>
        </p>
    </div>
    )
}

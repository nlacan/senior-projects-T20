import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { login, saveTokens } from '../api'

export default function LoginUser() {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stop the browser from reloading the page
    setError('')

    try {
        // the backend checks the email and password, and sends an error back if they are wrong
        const tokens = await login(email, password)
        saveTokens(tokens) // remember that this user is logged in
        navigate('/dashboard')
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Log in</h2>
            <p>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </p>
            <p>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </p>
            {error && <p style={{ color: 'crimson' }}>{error}</p>}
            <button type="submit">Log in</button>
            <p>
            Need an account? <Link to="/register">Register</Link>
            </p>
        </form>
    )
}

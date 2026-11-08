import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { login, register, saveTokens } from '../api'

export default function RegisterUser() {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stop the browser from reloading the page
    setError('')

    // rule 1: the password needs at least 8 characters
    if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
    }

    try {
        // rule 2: the email must not already exist (the backend checks this and sends an error back)
        await register(email, password)

        // the account exists now, so log in with the same details to get the tokens
        const tokens = await login(email, password)
        saveTokens(tokens) // remember that this user is logged in
        navigate('/create-profile')
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
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
                placeholder="Password (at least 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </p>
            {error && <p style={{ color: 'crimson' }}>{error}</p>}
            <button type="submit">Register</button>
            <p>
            Already have an account? <Link to="/login">Log in</Link>
            </p>
        </form>
    )
}

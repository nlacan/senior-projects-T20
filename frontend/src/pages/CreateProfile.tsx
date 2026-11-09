import { Link } from 'react-router'

export default function CreateProfile() {
    return (
    <div>
        <h2>Create Profile Page</h2>
        <p>create profile here...</p>
        {/* (temporary) a way out of this page until the real form exists */}
        <Link to="/dashboard">Continue to dashboard</Link>
    </div>
    )
}

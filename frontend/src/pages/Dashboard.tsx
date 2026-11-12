import { useNavigate } from 'react-router'
import { clearTokens } from '../api'
import { Link } from 'react-router'
import { program } from '../api'
import { useState } from "react";

export default function Dashboard() {
    const navigate = useNavigate()

    // (temporary) lets us test the flow again without clearing the browser's storage
    function handleLogout() {
        clearTokens()
        navigate('/')
    }

    const [result, setResult] = useState<string>("Not tested yet");
    async function testConnection() {
        setResult("Loading...");
        try {
            const response = await program();
            setResult(response.data);
        } catch (err) {
            setResult(err instanceof Error ? err.message : "Error connecting");
        }
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Dashboard elements here</p>
            <ul>
                <li>
                    <Link to="/create-profile">Login</Link>
                </li>
            </ul>
            <p>Testing API call from View: {result}</p>
            <button onClick={testConnection}>Test Connection</button>
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}

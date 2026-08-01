import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/Auth.css';
import { useAuth } from '../context/AuthContext';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/auth/login', { email, password });
            //   localStorage.setItem('token', response.data.token);
            //   navigate('/todos');
            login(response.data.token);
            navigate('/todos');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have account? <a href="/register">Register</a>
            </p>
        </div>
    );
}
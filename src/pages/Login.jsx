import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../api';
import '../Styles/Login.css';

const Login = ({ onAuth, token }) => {
    const [loginMessage, setLoginMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginMessage('');
        try {
            const data = await login(username, password);
            onAuth(data);
            navigate("/play");
        } catch (error) {
            setLoginMessage(error.message);
            setLoading(false);
        }
    };

    /*Already logged in? Skip straight to the game*/
    if (token) {
        return <Navigate to="/play" />;
    }

    return(
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">🎰</div>
                <h1 className="login-title">Slots For Tots</h1>
                <p className="login-subtitle">Sign in to keep your winnings</p>

                <form className="login-form" onSubmit={handleLogin}>
                    <label className="login-label">
                        Username
                        <input
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        />
                    </label>
                    <label className="login-label">
                        Password
                        <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </label>

                    {loginMessage && <p className="login-error" role="alert">{loginMessage}</p>}

                    <button type="submit" className="login-button login-button-primary" disabled={loading}>
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                    {/*Render's free server can take a while to wake up*/}
                    {loading && <p className="login-hint">The first login after a while can take up to a minute.</p>}
                </form>

                <div className="login-divider">or</div>

                <Link to="/CreateAccount" className="login-button login-button-secondary">
                    Create an Account
                </Link>
                <Link to="/play" className="login-guest">
                    Play as Guest →
                </Link>
            </div>
        </div>
    )
}

export default Login;

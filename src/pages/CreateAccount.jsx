import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../api';
import '../Styles/Login.css';

const CreateAccount = ({ onAuth }) => {

    const [createAccountMessage, setCreateAccountMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        if (password !== confirm) {
            setCreateAccountMessage("Passwords don't match");
            return;
        }
        setLoading(true);
        setCreateAccountMessage('');
        try {
            const data = await register(username, password);
            onAuth(data);
            navigate("/play");
        } catch (error) {
            setCreateAccountMessage(error.message);
            setLoading(false);
        }
    };

    /*Uses the same card styles as the login page*/
    return(
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">🎰</div>
                <h1 className="login-title">Create Account</h1>
                <p className="login-subtitle">Start with $10 and save your winnings</p>

                <form className="login-form" onSubmit={handleCreateAccount}>
                    <label className="login-label">
                        Username
                        <input
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        />
                        <span className="login-field-hint">3-20 letters, numbers, or underscores</span>
                    </label>
                    <label className="login-label">
                        Password
                        <input
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        <span className="login-field-hint">At least 6 characters</span>
                    </label>
                    <label className="login-label">
                        Confirm password
                        <input
                        type="password"
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        />
                    </label>

                    {createAccountMessage && <p className="login-error" role="alert">{createAccountMessage}</p>}

                    <button type="submit" className="login-button login-button-primary" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                    {/*Render's free server can take a while to wake up*/}
                    {loading && <p className="login-hint">This can take up to a minute if the server was asleep.</p>}
                </form>

                <div className="login-divider">already have an account?</div>

                <Link to="/" className="login-button login-button-secondary">
                    Back to Login
                </Link>
                <Link to="/play" className="login-guest">
                    Play as Guest →
                </Link>
            </div>
        </div>
    )
}

export default CreateAccount;

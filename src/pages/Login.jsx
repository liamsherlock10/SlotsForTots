import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../api';

const Login = ({ onAuth, token }) => {
    const [loginMessage, setLoginMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            onAuth(data);
            navigate("/play");
        } catch (error) {
            setLoginMessage(error.message);
        }
    };

    /*Already logged in? Skip straight to the game*/
    if (token) {
        return <Navigate to="/play" />;
    }

    return(
        <>
        <h1 className="title">Slots For Tots</h1>
        <form onSubmit={handleLogin}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
        <h2>{loginMessage}</h2>
        <Link to="/CreateAccount">
            <button>Create an Account</button>
        </Link>
        <Link to="/play">
            <button>Play as Guest</button>
        </Link>
        </>
    )
}

export default Login;

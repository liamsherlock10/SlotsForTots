import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
    const [loginMessage, setLoginMessage] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "balls"){
            setLoginMessage("Login Successful!");
        } else{
            setLoginMessage("balls");
        }
    };

    return(
        <>
        <form onSubmit={handleLogin}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
        <h2>{loginMessage}</h2>
        <Link to="/">
            <button>Home</button>
        </Link>
        </>
    )
}

export default Login;
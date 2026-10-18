import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../api';

const CreateAccount = ({ onAuth }) => {

    const [createAccountMessage, setCreateAccountMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        if (password !== confirm) {
            setCreateAccountMessage("Passwords don't match");
            return;
        }
        try {
            const data = await register(username, password);
            onAuth(data);
            navigate("/play");
        } catch (error) {
            setCreateAccountMessage(error.message);
        }
    };

    return(
        <>
        {/*GOtta make these buttons next to each other and spaced out
        (CSS issue)*/}
        <form onSubmit={handleCreateAccount}>
        <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
        ></input>
        <label>{createAccountMessage}</label>
        <br></br>
        <button type="submit">Create Account!</button>
        </form>

        <Link to="/">
            <button>Return to Login</button>
        </Link>
        <Link to="/play">
            <button>Play as guest</button>
        </Link>
        </>
    )
}

export default CreateAccount;

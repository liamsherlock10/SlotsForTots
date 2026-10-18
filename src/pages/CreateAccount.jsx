import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CreateAccount = () => {

    const [createAccountMessage, setCreateAccountMessage] = useState('');
    const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('')
    //const [confirm, setConfirm] = useState('')

    

    return(
        <>
        {/*GOtta make these buttons next to each other and spaced out
        (CSS issue)*/}
        <form
            onSubmit={(event) => {
                event.preventDefault();
                setCreateAccountMessage("success!");
            }}
        >
        <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        ></input>
        <label>{createAccountMessage}</label>
        <br></br>
        <button type="submit">Create Account!</button>
        </form>

        <Link to="/Login">
            <button>Return to Login</button>
        </Link>
        <Link to="/">
            <button>Play as guest</button>
        </Link>
        </>
    )
}

export default CreateAccount;
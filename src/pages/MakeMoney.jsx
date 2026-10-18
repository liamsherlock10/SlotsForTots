import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { earnMoney } from '../api';

const MakeMoney = ({ total, setTotal, token }) => {
    const [error, setError] = useState('');

    /*Logged in players earn through the server so it gets saved*/
    const handleClick = async () => {
        if (!token){
            setTotal(total + 1)
            return
        }
        try {
            const result = await earnMoney(token)
            setTotal(result.user.money)
            setError('')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
        <h1>Let's make some money!</h1>
        <h2>Money: {total}</h2>

        {/*Placeholder side game: each click earns $1*/}
        <button onClick={handleClick}>Click for $1</button>
        <h3>{error}</h3>

        <Link to="/play">
            <button>Back to main game</button>
        </Link>
        </>
    )
}

export default MakeMoney;

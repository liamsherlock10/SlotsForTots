import React from 'react';
import { Link } from 'react-router-dom';

const MakeMoney = ({ total, setTotal }) => {
    return (
        <>
        <h1>Let's make some money!</h1>
        <h2>Money: {total}</h2>

        {/*Placeholder side game: each click earns $1*/}
        <button onClick={() => setTotal(total + 1)}>Click for $1</button>

        <Link to="/">
            <button>Back to main game</button>
        </Link>
        </>
    )
}

export default MakeMoney;

import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { earnMoney } from '../api';
import '../Styles/Login.css';
import '../Styles/Game.css';

/*Shows money as $10.00*/
const formatMoney = (amount) => `$${Number(amount).toFixed(2)}`;

const MakeMoney = ({ total, setTotal, token }) => {
    const [error, setError] = useState('');
    const [earned, setEarned] = useState(0);

    /*Logged in players earn through the server so it gets saved*/
    const handleClick = async () => {
        if (!token){
            setTotal(total + 1)
            setEarned(earned + 1)
            return
        }
        try {
            const result = await earnMoney(token)
            setTotal(result.user.money)
            setEarned((current) => current + 1)
            setError('')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Make Money</h1>
                <p className="login-subtitle">Tap the coin to earn $1 at a time</p>

                <div className="game-balance">
                    <div className="game-balance-label">Balance</div>
                    <div className="game-balance-amount">{formatMoney(total)}</div>
                </div>

                {/*Placeholder side game: each click earns $1*/}
                <button className="money-coin" onClick={handleClick} aria-label="Earn $1">
                    +$1
                </button>
                <p className="money-earned">
                    {earned > 0 ? `You've earned ${formatMoney(earned)} this visit` : "Start tapping!"}
                </p>

                {error && <p className="login-error" role="alert">{error}</p>}

                <div className="login-divider">ready to play?</div>

                <Link to="/play" className="login-button login-button-secondary">
                    ← Back to Game
                </Link>
            </div>
        </div>
    )
}

export default MakeMoney;

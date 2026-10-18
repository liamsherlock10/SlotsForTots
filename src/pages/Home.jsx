import React from 'react';
import "../Styles/Home.css"
import "../Styles/Login.css"
import "../Styles/Game.css"
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { placeBet } from '../api';

/*Shows money as $10.00*/
const formatMoney = (amount) => `$${Number(amount).toFixed(2)}`;

const Home = ({ total, setTotal, token, username, logout }) =>{
    /*Setting all of the states that will be used throughout the betting program */
    const [bet_amount, setBet_amount] = useState('');
    const [current_bet, setCurrent_bet] = useState(0);
    const [status, setStatus] = useState('');
    const [change, setChange] = useState(0);
    const [betting, setBetting] = useState(false);
    const navigate = useNavigate();

    /*This is the RunGame function that does all of the work when bet is cast */
    const RunGame = async (amount) => {
        const numericAmount = Number(amount);
        if (!(numericAmount > 0)){
            setStatus("Enter a bet greater than 0!")
            return
        }
        if (numericAmount > total){
            setStatus("You can't bet more than you have!")
            return
        }
        /*Logged in players bet through the server so their money gets saved*/
        if (token){
            setBetting(true)
            try {
                const result = await placeBet(token, numericAmount)
                setStatus(result.won ? "WIN" : "LOSE")
                setChange(result.change)
                setTotal(result.user.money)
                setCurrent_bet(numericAmount)
            } catch (error) {
                setStatus(error.message)
            }
            setBetting(false)
            return
        }
        /*Guests play locally and their money resets on refresh*/
        const chance = Math.random()
        if (chance > 0.5){
            setStatus("WIN")
            setChange(numericAmount)
            setTotal(total+numericAmount)
        } else{
            setStatus("LOSE")
            setChange(-numericAmount)
            setTotal(total-numericAmount)
        }
        setCurrent_bet(numericAmount);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        RunGame(bet_amount);
    };

    const isResult = status === "WIN" || status === "LOSE";

    return(
        <div className="login-page">
            <div className="login-card">
                {/*Who's playing, with log in/out on the right*/}
                <div className="game-topbar">
                    {token ? (
                        <>
                        <span>Logged in as <strong>{username}</strong></span>
                        <button className="game-topbar-button" onClick={() => { logout(); navigate("/"); }}>Log Out</button>
                        </>
                    ) : (
                        <>
                        <span>Playing as <strong>Guest</strong></span>
                        <Link to="/" className="game-topbar-button">Log In</Link>
                        </>
                    )}
                </div>

                <h1 className="login-title">Slots For Tots</h1>
                <p className="login-subtitle">Double or nothing. Feeling lucky?</p>

                <div className="game-balance">
                    <div className="game-balance-label">Balance</div>
                    <div className="game-balance-amount">{formatMoney(total)}</div>
                </div>

                {/*The bet form. Pressing Enter also places the bet*/}
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-label">
                        Your bet
                        <div className="game-bet-input">
                            <span>$</span>
                            <input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={bet_amount}
                            onChange={(e) => setBet_amount(e.target.value)}
                            />
                        </div>
                    </label>

                    <button type="submit" className="login-button login-button-primary" disabled={betting}>
                        {betting ? "Spinning..." : "Place Bet"}
                    </button>

                    {/*Shows WIN/LOSE, or a message if the bet wasn't allowed*/}
                    {isResult && (
                        <div className={`game-result ${status === "WIN" ? "game-result-win" : "game-result-lose"}`}>
                            <div className="game-result-title">{status === "WIN" ? "YOU WIN!" : "YOU LOSE"}</div>
                            <div className="game-result-detail">
                                {change > 0 ? "+" : "−"}{formatMoney(Math.abs(change))} on a {formatMoney(current_bet)} bet
                            </div>
                        </div>
                    )}
                    {status && !isResult && <p className="login-error" role="alert">{status}</p>}
                </form>

                <div className="login-divider">need more money?</div>

                <Link to="/MakeMoney" className="login-button login-button-secondary">
                    Make Money →
                </Link>

                {!token && (
                    <p className="game-guest-note">
                        Guest money resets when you refresh. <Link to="/CreateAccount">Create an account</Link> to save it.
                    </p>
                )}
            </div>
        </div>
    )
}


export default Home;

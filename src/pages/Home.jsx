import React from 'react';
import "../Styles/Home.css"
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { placeBet } from '../api';
//Note: this newest version is pushed to github but not online yet.
const Home = ({ total, setTotal, token, username, logout }) =>{
    /*Setting all of the states that will be used throughout the betting program */
    /*Problem: when I go off this page to login or create account, get back to a net 0
    That said, I don't rly think we need to address this bc the database will
    associate those values with an account and the button to get off the game 
    page will likely be a logout, and the "home" page will likely be a login page*/
    const [bet_amount, setBet_amount] = useState();
    const [current_bet, setCurrent_bet] = useState(0);
    const [status, setStatus] = useState('');
    const [change, setChange] = useState(0);

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
            try {
                const result = await placeBet(token, numericAmount)
                setStatus(result.won ? "WIN" : "LOSE")
                setChange(result.change)
                setTotal(result.user.money)
                setCurrent_bet(numericAmount)
            } catch (error) {
                setStatus(error.message)
            }
            return
        }
        /*Guests play locally and their money resets on refresh*/
        const chance = Math.random()
        if (chance > 0.5){
            setStatus("WIN")
            setChange(amount)
            setTotal(total+numericAmount)
        } else{
            setStatus("LOSE")
            setChange(-amount)
            setTotal(total-numericAmount)
        }
        setCurrent_bet(bet_amount);
    }


    return(
        <>
        <Link to="/MakeMoney">
            <button>Make Money Here!</button>
        </Link>
        {/*Title and label at top of page*/}
        <h1 className="title">Welcome to Slots For Tots!</h1>
        <h2>Bet amount: {current_bet}</h2>
        
        {/*This is the input field for bet amount, sets the bet_amount variable to input, etc.*/}
        <input
            placeholder= "Place your bet here"
            value = {bet_amount}
            onChange={(e) => setBet_amount(e.target.value)}
        />

        {/*This is the button that sets the RunGame function in motion*/}
        <button onClick={() => RunGame(bet_amount)}>Place Bet</button>

        <h1 className="spacer"> . </h1>

        {/*This is the labels that show the status, win, change in total, and total*/}
        <h3>{status}</h3>
        <h3>{change}</h3>
        <h3>{total}</h3>

        {token ? (
            <>
            <h3>Logged in as {username}</h3>
            <button onClick={logout}>Log Out</button>
            </>
        ) : (
            <>
            <Link to="/Login">
                <button>Go to Login Page</button>
            </Link>
            <Link to="/CreateAccount">
                <button>Go to Create Account Page</button>
            </Link>
            </>
        )}

        </>
    )
}


export default Home;
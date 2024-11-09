import React from 'react';
import "../Styles/Home.css"
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () =>{
    /*Setting all of the states that will be used throughout the betting program */
    const [bet_amount, setBet_amount] = useState();
    const [current_bet, setCurrent_bet] = useState(0);
    const [status, setStatus] = useState('');
    const [change, setChange] = useState(0);
    const [total, setTotal] = useState(0);

    /*This is the RunGame function that does all of the work when bet is cast */
    const RunGame = (amount) => {
        const numericAmount = Number(amount);
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

        <Link to="/Login">
            <button>Go to Login Page</button>
        </Link>
        <Link to="/CreateAccount">
            <button>Go to Create Account Page</button>
        </Link>

        </>
    )
}


export default Home;
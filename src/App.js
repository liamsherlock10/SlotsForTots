import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import MakeMoney from './pages/MakeMoney';
import { getMe } from './api';
import './App.css';

const App = () => {
  /*The player's money lives here so it survives moving between pages*/
  const [total, setTotal] = useState(10);
  /*The login token is saved in the browser so players stay logged in after a refresh*/
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');

  /*Called after logging in or creating an account*/
  const handleAuth = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUsername(data.user.username);
    setTotal(data.user.money);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername('');
    setTotal(10);
  };

  /*If there's a saved token, load that player's account when the site opens*/
  useEffect(() => {
    if (!token) {
      return;
    }
    getMe(token)
      .then((data) => {
        setUsername(data.user.username);
        setTotal(data.user.money);
      })
      .catch(logout);
    // Only run once when the site first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //go over the routing in this file, doesn't make full sense to me.
  //HashRouter keeps the page in the URL after a #, so refreshing works on GitHub Pages
  return (
    <Router>
      <Routes>
        {/*The login page is the front door; the game lives at /play*/}
        <Route path="/" element={<Login onAuth={handleAuth} token={token} />} />
        <Route path="/play" element={<Home total={total} setTotal={setTotal} token={token} username={username} logout={logout} />} />
        <Route path="/CreateAccount" element={<CreateAccount onAuth={handleAuth} />} />
        <Route path="/MakeMoney" element={<MakeMoney total={total} setTotal={setTotal} token={token} />} />
      </Routes>
    </Router>
  );
};

export default App;

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import MakeMoney from './pages/MakeMoney';
import './App.css';

const App = () => {
  /*The player's money lives here so it survives moving between pages*/
  const [total, setTotal] = useState(10);

  //go over the routing in this file, doesn't make full sense to me. 
  return (
    <Router basename= "/SlotsForTots">
      <Routes>
        <Route path="/" element={<Home total={total} setTotal={setTotal} />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/MakeMoney" element={<MakeMoney total={total} setTotal={setTotal} />} />
      </Routes>
    </Router>
  );
};

export default App;

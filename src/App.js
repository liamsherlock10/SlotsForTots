import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import './App.css';

const App = () => {
  //go over the routing in this file, doesn't make full sense to me. 
  return (
    <Router basename= "/SlotsForTots">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;

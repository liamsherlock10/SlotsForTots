import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

const App = () => {
  return (
    <Router basename= "/SlotsForTots">
      <Routes>
        <Route path= "/" element={<Home />} >/</Route>
      </Routes>
    </Router>
  );
};

export default App;


import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import Navbar from './components/Common/Navbar';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;

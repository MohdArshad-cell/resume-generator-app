import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage'; // Corrected path
import ResumeBuilderPage from './pages/ResumeBuilderPage'; // Corrected path

function App() {
  return (
    <Router>
      <div className="App">
        <div className="background-aurora"></div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/build" element={<ResumeBuilderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
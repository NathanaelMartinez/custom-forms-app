import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home-page';
import SignUpPage from './pages/sign-up-page';
import LoginPage from './pages/login-page';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;

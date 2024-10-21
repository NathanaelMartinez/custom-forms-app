import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/auth-context';
import HomePage from './pages/home-page';
import SignUpPage from './pages/sign-up-page';
import LoginPage from './pages/login-page';
import AdminPage from './pages/admin-page';
import CreateTemplatePage from './pages/create-template-page';
import FormPage from './pages/form-page';
import RecentTemplatesPage from './pages/recent-templates-page';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-panel" element={<AdminPage />} />
          <Route path="/templates/:templateId?" element={<CreateTemplatePage />} />
          <Route path="/recent-templates" element={<RecentTemplatesPage />} />
          <Route path="/forms/:id" element={<FormPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

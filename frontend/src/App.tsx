import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import HomePage from "./pages/home-page";
import SignUpPage from "./pages/sign-up-page";
import LoginPage from "./pages/login-page";
import AdminPage from "./pages/admin-page";
import CreateTemplatePage from "./pages/create-template-page";
import FormPage from "./pages/form-page";
import ViewTemplatesPage from "./pages/view-all-templates-page";
import PersonalDashboardPage from "./pages/personal-dashboard-page";
import { SupportModalProvider } from "./context/support-modal-context";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SupportModalProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-panel" element={<AdminPage />} />
            <Route
              path="/templates/:templateId?"
              element={<CreateTemplatePage />}
            />
            <Route path="/forms/:id" element={<FormPage />} />
            <Route path="/profile/:id" element={<PersonalDashboardPage />} />
            <Route path="/view-templates" element={<ViewTemplatesPage />} />
          </Routes>
        </Router>
      </SupportModalProvider>
    </AuthProvider>
  );
};

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './contexts/ToastContext';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import GlossaryPage from './pages/GlossaryPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SavedRecordsPage from './pages/dashboard/SavedRecordsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import ExpertDashboardPage from './pages/dashboard/ExpertDashboardPage';
import AdminPanelPage from './pages/admin/AdminPanelPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
          </Route>
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<div />} />
            <Route path="/records" element={<SavedRecordsPage />} />
            <Route path="/expert/panel" element={<ExpertDashboardPage />} />
            <Route path="/admin/panel" element={<AdminPanelPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
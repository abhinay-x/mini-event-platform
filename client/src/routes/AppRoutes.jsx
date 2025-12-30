import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/common/Spinner.jsx';
import AppShell from '../components/layout/AppShell.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import EventsPage from '../pages/EventsPage.jsx';
import EventFormPage from '../pages/EventFormPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';

const GuardFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh'
    }}
  >
    <Spinner size={32} />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <GuardFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <GuardFallback />;
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute>
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        </PublicRoute>
      }
    />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <PublicLayout>
            <RegisterPage />
          </PublicLayout>
        </PublicRoute>
      }
    />

    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <AppShell>
            <EventsPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/create"
      element={
        <ProtectedRoute>
          <AppShell>
            <EventFormPage mode="create" />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/events/:id/edit"
      element={
        <ProtectedRoute>
          <AppShell>
            <EventFormPage mode="edit" />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/profile"
      element={
        <ProtectedRoute>
          <AppShell>
            <ProfilePage />
          </AppShell>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

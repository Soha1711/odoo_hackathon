import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes as Paths } from '../constants/routes';
import { useAuthContext } from '../context/AuthContext';
import Layout from '../layouts/Layout';
import Loader from '../components/ui/Loader';

// Lazy load pages for premium modularity & speed
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));
const Environmental = React.lazy(() => import('../pages/environmental/Environmental'));
const Social = React.lazy(() => import('../pages/social/Social'));
const Governance = React.lazy(() => import('../pages/governance/Governance'));
const Gamification = React.lazy(() => import('../pages/gamification/Gamification'));
const Reports = React.lazy(() => import('../pages/reports/Reports'));
const Settings = React.lazy(() => import('../pages/settings/Settings'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={Paths.LOGIN} replace />;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center text-center p-8">
          <div className="text-6xl mb-4">&#9888;</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-4">A page failed to load. Please try refreshing.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <React.Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center bg-background">
            <Loader size="lg" />
          </div>
        }
      >
        <Routes>
          {/* Public auth pages */}
          <Route path={Paths.LOGIN} element={<Login />} />
          <Route path={Paths.REGISTER} element={<Register />} />

          {/* Protected Dashboard/App shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path={Paths.ENVIRONMENTAL} element={<Environmental />} />
            <Route path={Paths.SOCIAL} element={<Social />} />
            <Route path={Paths.GOVERNANCE} element={<Governance />} />
            <Route path={Paths.GAMIFICATION} element={<Gamification />} />
            <Route path={Paths.REPORTS} element={<Reports />} />
            <Route path={Paths.SETTINGS} element={<Settings />} />
          </Route>

          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </ErrorBoundary>
  );
}
export default AppRoutes;

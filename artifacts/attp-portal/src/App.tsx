import { useEffect, useState, type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { AdminApplicationPage, AdminCriteriaPage, AdminDashboard, AdminLoginPage, AdminPlaceholder, FacilityProfilePage, HomePage, LookupPage, RegisterPage } from '@/pages/portal-pages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
         <Route path="/" component={HomePage} />
         <Route path="/lookup" component={LookupPage} />
         <Route path="/register" component={RegisterPage} />
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin">
            <AdminGuard><AdminDashboard /></AdminGuard>
          </Route>
          <Route path="/admin/applications">
            <AdminGuard><AdminDashboard /></AdminGuard>
          </Route>
          <Route path="/admin/applications/pending">
            <AdminGuard><AdminDashboard /></AdminGuard>
          </Route>
          <Route path="/admin/applications/:id">
            <AdminGuard><AdminApplicationPage /></AdminGuard>
          </Route>
          <Route path="/admin/criteria">
            <AdminGuard><AdminCriteriaPage /></AdminGuard>
          </Route>
          <Route path="/admin/accounts">
            <AdminGuard><AdminPlaceholder kind="accounts" /></AdminGuard>
          </Route>
          <Route path="/admin/reports">
            <AdminGuard><AdminPlaceholder kind="reports" /></AdminGuard>
          </Route>
          <Route path="/facility/profile">
            <FacilityGuard><FacilityProfilePage /></FacilityGuard>
          </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function AdminGuard({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('attp-session-role') === 'admin');

  useEffect(() => {
    const syncSession = () => setAuthenticated(sessionStorage.getItem('attp-session-role') === 'admin');
    window.addEventListener('storage', syncSession);
    if (!authenticated) navigate('/admin/login', { replace: true });
    return () => window.removeEventListener('storage', syncSession);
  }, [authenticated, navigate]);

  return authenticated ? <>{children}</> : null;
}

function FacilityGuard({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('attp-session-role') === 'facility');

  useEffect(() => {
    const syncSession = () => setAuthenticated(sessionStorage.getItem('attp-session-role') === 'facility');
    window.addEventListener('storage', syncSession);
    if (!authenticated) navigate('/admin/login', { replace: true });
    return () => window.removeEventListener('storage', syncSession);
  }, [authenticated, navigate]);

  return authenticated ? <>{children}</> : null;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;

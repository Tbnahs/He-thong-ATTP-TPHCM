import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { AdminApplicationPage, AdminDashboard, AdminPlaceholder, HomePage, LookupPage, RegisterPage } from '@/pages/portal-pages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
         <Route path="/" component={HomePage} />
         <Route path="/lookup" component={LookupPage} />
         <Route path="/register" component={RegisterPage} />
         <Route path="/admin" component={AdminDashboard} />
         <Route path="/admin/applications" component={AdminDashboard} />
         <Route path="/admin/applications/pending" component={AdminDashboard} />
         <Route path="/admin/applications/:id" component={AdminApplicationPage} />
         <Route path="/admin/accounts" component={() => <AdminPlaceholder kind="accounts" />} />
         <Route path="/admin/reports" component={() => <AdminPlaceholder kind="reports" />} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

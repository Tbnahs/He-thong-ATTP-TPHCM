import { useEffect, useState, type ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import {
  AdminApplicationPage,
  AdminDashboard,
  AdminLoginPage,
  AdminPlaceholder,
  FacilityProfilePage,
  HomePage,
  LookupPage,
  NewsDetailPage,
  NewsPage,
  RegisterPage,
} from "@/pages/portal-pages";
import {
  InspectionCriteriaPage,
  InspectionMinutesPage,
  InspectionSchedulePage,
} from "@/pages/inspection-pages";
import {
  AdminFacilitiesPage,
  AdminBlankPage,
  AdminMealManagementPage,
  AdminMonitoringDashboard,
} from "@/pages/admin-module-pages";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/lookup" component={LookupPage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/news/:slug" component={NewsDetailPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/admin">
          <AdminGuard>
            <AdminBlankPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/applications">
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        </Route>
        <Route path="/admin/applications/pending">
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        </Route>
        <Route path="/admin/applications/:id">
          <AdminGuard>
            <AdminApplicationPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/facilities">
          <AdminGuard>
            <AdminBlankPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/three-step">
          <AdminGuard>
            <AdminBlankPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/menus">
          <AdminGuard>
            <AdminBlankPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/recipes">
          <AdminGuard>
            <AdminBlankPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/accounts">
          <AdminGuard>
            <AdminBlankPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/reports">
          <AdminGuard>
            <AdminBlankPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/inspections/schedule">
          <AdminGuard>
            <InspectionSchedulePage />
          </AdminGuard>
        </Route>
        <Route path="/admin/inspections/minutes">
          <AdminGuard>
            <InspectionMinutesPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/inspections/criteria">
          <AdminGuard>
            <InspectionCriteriaPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/inspections/incidents">
          <AdminGuard>
            <AdminPlaceholder kind="incidents" />
          </AdminGuard>
        </Route>
        <Route path="/facility/profile">
          <FacilityGuard>
            <FacilityProfilePage />
          </FacilityGuard>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function AdminGuard({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("attp-session-role") === "admin",
  );

  useEffect(() => {
    const syncSession = () =>
      setAuthenticated(sessionStorage.getItem("attp-session-role") === "admin");
    window.addEventListener("storage", syncSession);
    if (!authenticated) navigate("/admin/login", { replace: true });
    return () => window.removeEventListener("storage", syncSession);
  }, [authenticated, navigate]);

  return authenticated ? <>{children}</> : null;
}

function FacilityGuard({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("attp-session-role") === "facility",
  );

  useEffect(() => {
    const syncSession = () =>
      setAuthenticated(
        sessionStorage.getItem("attp-session-role") === "facility",
      );
    window.addEventListener("storage", syncSession);
    if (!authenticated) navigate("/admin/login", { replace: true });
    return () => window.removeEventListener("storage", syncSession);
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
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;

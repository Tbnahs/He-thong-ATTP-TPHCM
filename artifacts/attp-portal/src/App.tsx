import { useEffect, useState, type ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import {
  AdminDashboard,
  AdminApplicationPage,
  AdminLoginPage,
  AdminPlaceholder,
  HomePage,
  LookupPage,
  PublicLookupDetailPage,
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
  AdminFacilityDetailPage,
  AdminMealManagementPage,
  AdminMonitoringDashboard,
} from "@/pages/admin-module-pages";
import { AdminAccountsPage } from "@/pages/account-management-page";
import { AdminReportsPage } from "@/pages/report-pages";
import {
  FacilityIncidentDetailPage,
  FacilityIncidentListPage,
  IncidentCreatePage,
  IncidentDetailPage,
  IncidentMealDataPage,
  IncidentListPage,
} from "@/pages/incident-pages";
import {
  ThreeStepInspectionDashboard,
  ThreeStepInspectionDetail,
  ThreeStepInspectionForm,
} from "@/pages/meal-inspection-pages";
import {
  FacilityProfileDetailPage,
  FacilityProfilesPage,
} from "@/pages/facility-profile-pages";
import {
  canAccessAdminPath,
  getFirstAllowedAdminPath,
  getSessionAdminPermissions,
} from "@/lib/admin-permissions";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/lookup/:recordId" component={PublicLookupDetailPage} />
        <Route path="/lookup" component={LookupPage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/news/:slug" component={NewsDetailPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/admin">
          <AdminGuard>
            <AdminMonitoringDashboard />
          </AdminGuard>
        </Route>
        <Route path="/admin/applications/:id">
          <AdminGuard>
            <AdminApplicationPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/facility-profiles/:facilityId">
          <AdminGuard>
            <FacilityProfileDetailPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/facility-profiles">
          <AdminGuard>
            <FacilityProfilesPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/facilities/:facilityId">
          <AdminGuard>
            <AdminFacilityDetailPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/facilities">
          <AdminGuard>
            <AdminFacilitiesPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/three-step">
          <AdminGuard>
            <ThreeStepInspectionDashboard />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/three-step/:schoolId/form/:formId">
          <AdminGuard>
            <ThreeStepInspectionForm />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/three-step/:schoolId">
          <AdminGuard>
            <ThreeStepInspectionDetail />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/menus">
          <AdminGuard>
            <AdminMealManagementPage page="menus" />
          </AdminGuard>
        </Route>
        <Route path="/admin/meals/recipes">
          <AdminGuard>
            <AdminMealManagementPage page="recipes" />
          </AdminGuard>
        </Route>
        <Route path="/admin/accounts">
          <AdminGuard>
            <AdminAccountsPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/reports">
          <AdminGuard>
            <AdminReportsPage />
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
        <Route path="/admin/inspections/incidents/new">
          <AdminGuard>
            <IncidentCreatePage />
          </AdminGuard>
        </Route>
        <Route path="/admin/inspections/incidents/:id/menu/:menuId">
          <AdminGuard>
            <IncidentMealDataPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/inspections/incidents/:id">
          <AdminGuard>
            <IncidentDetailPage />
          </AdminGuard>
        </Route>
        <Route path="/admin/inspections/incidents">
          <AdminGuard>
            <IncidentListPage />
          </AdminGuard>
        </Route>
        <Route path="/facility/incidents/:id">
          <FacilityGuard>
            <FacilityIncidentDetailPage />
          </FacilityGuard>
        </Route>
        <Route path="/facility/incidents">
          <FacilityGuard>
            <FacilityIncidentListPage />
          </FacilityGuard>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function AdminGuard({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("attp-session-role") === "admin",
  );
  const [permissions] = useState(() => getSessionAdminPermissions());
  const canAccessCurrentRoute =
    authenticated && canAccessAdminPath(location, permissions);

  useEffect(() => {
    const syncSession = () =>
      setAuthenticated(sessionStorage.getItem("attp-session-role") === "admin");
    window.addEventListener("storage", syncSession);
    if (!authenticated) navigate("/admin/login", { replace: true });
    else if (!canAccessCurrentRoute) {
      navigate(getFirstAllowedAdminPath(permissions), { replace: true });
    }
    return () => window.removeEventListener("storage", syncSession);
  }, [authenticated, canAccessCurrentRoute, location, navigate, permissions]);

  return canAccessCurrentRoute ? <>{children}</> : null;
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

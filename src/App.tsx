import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "@/components/auth/AuthContext";
import { useAuth } from "@/components/auth/AuthContext";

const LoginForm = lazy(() => import("@/components/auth/LoginForm"));
const Home = lazy(() => import("@/components/home"));
const DriverDashboard = lazy(
  () => import("@/components/driver/DriverDashboard"),
);
const DriverRegistration = lazy(
  () => import("@/components/driver/DriverRegistration"),
);
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/register"
          element={
            <ProtectedRoute>
              <DriverRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

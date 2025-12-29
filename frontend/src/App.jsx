import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VehicleDetails from "./components/VehicleDetails";
import { useMaintenanceCheck } from "./hooks/useMaintenanceCheck";
import MaintenancePage from "./pages/MaintenancePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  const { isMaintenance, loading } = useMaintenanceCheck();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (isMaintenance) {
    return <MaintenancePage />;
  }
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<Login />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ Catch-All Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>

          {/* ✅ Global Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{
              top: "20px",
              right: "20px",
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default App;

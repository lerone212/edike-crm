import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssignSchools from "./pages/AssignSchools";
import VisitLog from "./pages/VisitLog";
import Calendar from "./pages/Calendar";
import Schools from "./pages/Schools";
import UserManagement from "./pages/UserManagement";
import FunnelProgress from "./pages/FunnelProgress";
import SalesFunnelPage from "./pages/SalesFunnelPage";
import ActivityLogs from "./pages/ActivityLogs";
import SchoolDetails from "./pages/SchoolDetails";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="assign-schools" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AssignSchools />
                </ProtectedRoute>
              } />
              <Route path="visit-log" element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <VisitLog />
                </ProtectedRoute>
              } />
              <Route path="calendar" element={
                <ProtectedRoute allowedRoles={['super_admin', 'employee']}>
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="schools" element={<Schools />} />
              <Route path="schools/:schoolId" element={<SchoolDetails />} />
              <Route path="sales-funnel" element={
                <ProtectedRoute allowedRoles={['super_admin', 'employee']}>
                  <SalesFunnelPage />
                </ProtectedRoute>
              } />
              <Route path="user-management" element={
                <ProtectedRoute allowedRoles={['it_support']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="funnel-progress" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <FunnelProgress />
                </ProtectedRoute>
              } />
              <Route path="activity-logs" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ActivityLogs />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

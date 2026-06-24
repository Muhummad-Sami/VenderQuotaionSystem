// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// ✅ LAZY LOAD - Only loads when you visit the page
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const VendorRegister = lazy(() => import('./pages/auth/VendorRegister'));
const Vendors = lazy(() => import('./pages/admin/Vendors'));
const AdminRequests = lazy(() => import('./pages/admin/Requests'));
const VendorRequests = lazy(() => import('./pages/vendor/Requests'));
const OfferForm = lazy(() => import('./pages/vendor/OfferForm'));
const Compare = lazy(() => import('./pages/Compare'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const VendorDashboard = lazy(() => import('./pages/vendor/Dashboard'));
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs'));

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  if (typeof children === 'function') return children({ user });
  return children;
};

function AppContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<VendorRegister />} />

        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="logs" element={<ActivityLogs />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/vendor/*" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Routes>
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="requests" element={<VendorRequests />} />
              <Route path="offer/:requestId" element={<OfferForm />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/compare" element={
          <ProtectedRoute><Compare /></ProtectedRoute>
        } />

        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">404</h1>
              <p className="text-white/60">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
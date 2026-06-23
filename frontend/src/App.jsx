import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import VendorRegister from './pages/auth/VendorRegister';
import Vendors from './pages/admin/Vendors';
import AdminRequests from './pages/admin/Requests';
import VendorRequests from './pages/vendor/Requests';
import OfferForm from './pages/vendor/OfferForm';
import Compare from './pages/Compare';
import AdminDashboard from './pages/admin/Dashboard';
import VendorDashboard from './pages/vendor/Dashboard';
import ActivityLogs from './pages/admin/ActivityLogs';   // 🆕 ADD THIS


const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  if (typeof children === 'function') {
    return children({ user });
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<VendorRegister />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="vendors" element={<Vendors />} />
                    <Route path="requests" element={<AdminRequests />} />
                    <Route path="logs" element={<ActivityLogs />} />   {/* 🆕 NEW */}
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/vendor/*"
              element={
                <ProtectedRoute allowedRoles={['vendor']}>
                  <Routes>
                    <Route path="dashboard" element={<VendorDashboard />} />
                    <Route path="requests" element={<VendorRequests />} />
                    <Route path="offer/:requestId" element={<OfferForm />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Compare Route */}
            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <Compare />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                  <p className="text-gray-600">Page not found</p>
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
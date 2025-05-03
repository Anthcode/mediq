import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { ProfilePage } from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import DoctorsPage from './pages/admin/DoctorsPage';
import EditDoctorPage from './pages/admin/EditDoctorPage';
import { AdminRoute } from './components/common/AdminRoute';
import styled from 'styled-components';

// Protected route component that redirects to login if user is not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // Or show a loading spinner
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Route that redirects to home if user is already authenticated
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // Or show a loading spinner
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/doctors/:id" 
        element={
          <ProtectedRoute>
            <DoctorDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <AuthRoute>
            <SignupPage />
          </AuthRoute>
        } 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/doctors" 
        element={
          <AdminRoute>
            <DoctorsPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/doctors/new" 
        element={
          <AdminRoute>
            <EditDoctorPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/doctors/:id/edit" 
        element={
          <AdminRoute>
            <EditDoctorPage />
          </AdminRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppWrapper>
            <Header />
            <MainContent>
              <AppRoutes />
            </MainContent>
            <Footer />
          </AppWrapper>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1 0 auto;
`;

export default App;
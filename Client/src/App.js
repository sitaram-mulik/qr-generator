import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import UserList from './components/UserList';
import UserAction from './components/UserAction';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const CreateAssets = React.lazy(() => import('./components/CreateAssets'));
const CreateCampaign = React.lazy(() => import('./components/CreateCampaign'));
const CampaignList = React.lazy(() => import('./components/CampaignList'));
const AssetList = React.lazy(() => import('./components/AssetList'));
const AssetDetails = React.lazy(() => import('./components/AssetDetail'));
const Profile = React.lazy(() => import('./components/Profile'));
const VerifyProduct = React.lazy(() => import('./components/VerifyProduct'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Login = React.lazy(() => import('./components/Login'));

function AppContent() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const showHeader = !location.pathname.startsWith('/verify/');

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/verify/:code" element={<VerifyProduct />} />

        {/* Protected routes */}
        <Route
          path="/assets/create"
          element={
            <ProtectedRoute>
              <CreateAssets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns/action"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns/action/:campaign"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <CampaignList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <AssetList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets/code/:code"
          element={
            <ProtectedRoute>
              <AssetDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute checkSuperAdmin>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/action"
          element={
            <ProtectedRoute checkSuperAdmin>
              <UserAction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/action/:userId"
          element={
            <ProtectedRoute checkSuperAdmin>
              <UserAction />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

const CreateAssets = React.lazy(() => import("./components/CreateAssets"));
const CreateCampaign = React.lazy(() => import("./components/CreateCampaign"));
const CampaignList = React.lazy(() => import("./components/CampaignList"));
const AssetList = React.lazy(() => import("./components/AssetList"));
const AssetDetails = React.lazy(() => import("./components/AssetDetail"));
const Profile = React.lazy(() => import("./components/Profile"));
const VerifyProduct = React.lazy(() => import("./components/VerifyProduct"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const Login = React.lazy(() => import("./components/Login"));

function AppContent() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const showHeader = !location.pathname.startsWith("/verify/");

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/verify/:code" element={<VerifyProduct />} />

        {/* Protected routes */}
        <Route
          path="/generate"
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
          path="/create-campaign"
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
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

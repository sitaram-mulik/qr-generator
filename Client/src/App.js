import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Verify from "./components/Verify";
import Profile from "./components/Profile";
import ImageCreater from "./components/ImageCreater";
import AssetDetails from "./components/AssetDetail";
import Campaign from "./components/CreateCampaign";
import CampaignList from "./components/CampaignList";
import CreateAssets from "./components/CreateAssets";
import AssetList from "./components/AssetList";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:token" element={<Verify />} />

        {/* Protected routes */}
        <Route
          path="/"
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
          path="/campaign"
          element={
            <ProtectedRoute>
              <Campaign />
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
          path="/image-creator"
          element={
            <ProtectedRoute>
              <ImageCreater />
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
    </BrowserRouter>
  );
}

export default App;

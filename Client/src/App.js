import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<CreateAssets />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assets/verify/:code" element={<Verify />} />
        <Route path="/assets/code/:code" element={<AssetDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/assets" element={<AssetList />} />
        <Route path="/image-creator" element={<ImageCreater />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

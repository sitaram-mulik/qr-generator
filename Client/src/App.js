import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Register from "./components/Register";
import CodeGenerator from "./components/CodeGenerator";
import CodeDetail from "./components/CodeDetail";
import Login from "./components/Login";
import Verify from "./components/Verify";
import Profile from "./components/Profile";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<CodeGenerator />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify/:code" element={<Verify />} />
        <Route path="/code/:code" element={<CodeDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Private from "./pages/Private";


function PrivateRoute() {
  const token = sessionStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/private" element={<Private />} />
          </Route>

          <Route path="*" element={<h2>404</h2>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

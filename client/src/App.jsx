import React, { useContext } from "react";
import { UserContext } from "./context/UserContext.jsx";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import UserDashboard from "./user/UserDashboard.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";

const App = () => {
  const { isLoggedIn, user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {isLoggedIn && user?.role === "User" ? (
          <Route path="/" element={<UserDashboard />} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        {isLoggedIn && user?.role === "Admin" ? (
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
};

export default App;

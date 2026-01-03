import React from "react";
import { Routes, Route } from "react-router-dom";
import Gateway from "./Pages/Landing/Gateway";
import Login from "./Pages/UserLogin/Login";
import Profile from "./Pages/UserProfile/Profile";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Toaster position="top-right" />
        <Header />
        <Routes>
          <Route path="/" element={<Gateway />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;

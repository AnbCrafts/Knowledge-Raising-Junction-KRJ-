import React from "react";
import { Routes, Route } from "react-router-dom";
import Gateway from "./Pages/Landing/Gateway";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Gateway />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

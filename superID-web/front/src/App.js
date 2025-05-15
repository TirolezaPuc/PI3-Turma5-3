import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import QRCodePage from "./pages/QRCodePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/qr" element={<QRCodePage />} />
        <Route path="/esqueci" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;

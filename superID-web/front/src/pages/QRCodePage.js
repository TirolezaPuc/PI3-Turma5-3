import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import "./QRCodePage.css";

function QRCodePage() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      navigate("/");
    } else {
      setToken(savedToken);
    }
  }, [navigate]);

  return (
    <div className="qr-container">
      <div className="qr-box">
        <h2>Escaneie com o App</h2>
        {token ? (
          <QRCodeCanvas value={token} size={200} />
        ) : (
          <p>Gerando QR Code...</p>
        )}
      </div>
    </div>
  );
}

export default QRCodePage;

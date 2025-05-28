import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //qr pop-up
  const [showModal, setShowModal] = useState(false);
  const [qrBase64, setQrBase64] = useState("");
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrError, setQrError] = useState("");

  //handler de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token); // simulação de auth
        navigate("/qr");
      } else {
        setError("Falha ao fazer login.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de comunicação com o servidor.");
    }
  };
  //handler de pop-up superID login
  const handleSuperIdLogin = async () => {
    setShowModal(true);
    setLoadingQR(true);
    setQrError("");

    try {
      const res = await fetch("/api/auth/performAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "pi3turma5",
          siteUrl: "www.seusite.com.br",
        }),
      });
      console.log("[SuperID] Enviando request performAuth...");

      const data = await res.json();

      if (res.ok && data.qrBase64) {
        console.log("[SuperID] QR code recebido com sucesso.");
        setQrBase64(data.qrBase64);
      } else {
        setQrError("Erro ao gerar QR Code.");
      }
    } catch (err) {
      console.error(err);
      setQrError("Erro de comunicação com o servidor.");
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Partner Company</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
            />
            Manter-me conectado
          </label>

          <button
            type="button"
            className="forgot-password"
            onClick={() => navigate("/esqueci")}
          >
            Esqueci minha senha
          </button>
        </div>

        <button type="submit" className="login-button">
          Entrar
        </button>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <button
          type="button"
          className="superid-button"
          onClick={handleSuperIdLogin}
        >
          Entrar com SuperID
        </button>
      </form>
      {showModal && (
        //pop-up modal
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              Escaneie com o app{" "}
              <span className="superid-highlight">Super ID</span>
            </h3>

            {loadingQR && <p>Gerando QR Code...</p>}
            {qrError && <p style={{ color: "red" }}>{qrError}</p>}

            {!loadingQR && qrBase64 && (
              <img
                src={`data:image/png;base64,${qrBase64}`}
                alt="QR Code SuperID"
              />
            )}

            <button onClick={() => setShowModal(false)} className="close-modal">
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

import React, { useState } from "react";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = () => {
    if (email) {
      setMsg("Se este e-mail estiver cadastrado, enviaremos instruções.");
    } else {
      setMsg("Digite um e-mail válido.");
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-box" onSubmit={(e) => e.preventDefault()}>
        <h2>Recuperar Senha</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="forgot-button" onClick={handleReset}>
          Enviar
        </button>

        {msg && <p className="forgot-msg">{msg}</p>}
      </form>
    </div>
  );
}

export default ForgotPasswordPage;

# 🔐 QR Code Login - Web + Mobile Integration

Projeto de autenticação com Firebase, exibindo um QR Code no frontend para ser escaneado pelo Super ID no Android.

---

## 📂 Estrutura do Projeto

```
/qr-login-project/
├── /client/    # Frontend (React)
└── /server/    # Backend (Node.js + Express)
```

---

## 🔧 Tecnologias Utilizadas

### Frontend (`/client`)

- React (Create React App)
- Firebase Authentication
- React Router
- QRCode React

### Backend (`/server`)

- Node.js + Express
- JWT
- Firebase Admin SDK

---

## 🚀 Instruções para rodar o projeto

### Pré-requisitos:

- Node.js instalado
- Firebase Project com Auth ativado
- App SuperId Android que consome o QR

---

### 1. Clonar o projeto

```bash
git clone https://github.com/seu-usuario/qr-login-project.git
cd qr-login-project
```

---

### 2. Instalar dependências

```bash
# Backend
cd api
npm install

# Frontend
cd front
npm install
```

---

### 3. Configurar variáveis de ambiente

#### 📁 `/front/.env`

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

#### 📁 `/api/.env`

```env
PORT=5050
JWT_SECRET=chave_segura
```

---

### 4. Rodar o projeto

Recomenda-se usar dois terminais:

```bash
# Terminal 1 - Backend
cd api
npm run dev

# Terminal 2 - Frontend
cd front
npm start
```

---

## 🔐 Como funciona

1. Usuário acessa o site e faz login com Firebase.
2. Após logado, o sistema gera e exibe um QR Code único (JWT).
3. O app SuperId no Android escaneia o QR e autentica o mesmo usuário no mobile.
4. O backend valida o QR e emite um token temporário.

---

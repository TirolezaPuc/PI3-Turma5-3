"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmLogin = exports.generateLogin = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express = __importStar(require("express"));
const QRCode = __importStar(require("qrcode"));
admin.initializeApp();
const db = admin.firestore();
// ============ Function 1 ============
// HTTP Function: Gera QR Code com loginToken
const app = express();
app.get("/generate-login", async (req, res) => {
    try {
        const loginToken = crypto.randomUUID(); // ou outra lógica
        const createdAt = Date.now();
        await db.collection("login").doc(loginToken).set({
            createdAt,
            used: false,
        });
        const qrCode = await QRCode.toDataURL(loginToken);
        res.status(200).send({ qrCode, loginToken });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Erro ao gerar QR Code.");
    }
});
exports.generateLogin = functions.https.onRequest(app);
// ============ Function 2 ============
// Callable Function: Valida loginToken e autentica usuário
exports.confirmLogin = functions.https.onCall(async (data, context) => {
    const loginToken = data.loginToken;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado.");
    }
    if (!loginToken) {
        throw new functions.https.HttpsError("invalid-argument", "Token ausente.");
    }
    const tokenDoc = await db.collection("login").doc(loginToken).get();
    if (!tokenDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Token não encontrado.");
    }
    const tokenData = tokenDoc.data();
    if (tokenData.used || Date.now() - tokenData.createdAt > 5 * 60 * 1000) {
        throw new functions.https.HttpsError("permission-denied", "Token expirado ou já utilizado.");
    }
    // Marca token como usado
    await db.collection("login").doc(loginToken).update({ used: true });
    // Opcional: registrar usuário que usou
    return {
        message: "Login confirmado com sucesso!",
        userId: context.auth.uid,
        email: context.auth.token.email,
    };
});
//# sourceMappingURL=index.js.map
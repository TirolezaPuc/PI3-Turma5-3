import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";
import * as QRCode from "qrcode";
import { Request, Response } from "express";

admin.initializeApp();
const firestore = admin.firestore();

// Interface for request bodies
interface PerformAuthRequest {
  apiKey: string;
  domain: string;
}

interface LoginStatusRequest {
  loginToken: string;
}

// 1. performAuth: Gera o QR Code para login sem senha
exports.performAuth = functions.https.onRequest(
  async (req: Request<{}, {}, PerformAuthRequest>, res: Response) => {
    // Valida o método HTTP
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido. Use POST." });
    }

    const { apiKey, domain } = req.body;

    // Validação dos campos
    if (!apiKey || !domain) {
      return res
        .status(400)
        .json({ error: "apiKey e domain são obrigatórios." });
    }

    try {
      // Verifica se o site parceiro está registrado
      const partnerSnapshot = await firestore
        .collection("partners")
        .where("apiKey", "==", apiKey)
        .where("domain", "==", domain)
        .get();

      if (partnerSnapshot.empty) {
        return res.status(403).json({ error: "Site parceiro não autorizado." });
      }

      // Gera um loginToken único (256 caracteres, Base64)
      const loginToken = crypto.randomBytes(32).toString("base64");

      // Salva no Firestore (coleção 'logins')
      await firestore.collection("logins").doc(loginToken).set({
        apiKey,
        domain,
        loginToken,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
      });

      // Gera o QR Code (contendo o loginToken)
      const qrCode = await QRCode.toDataURL(loginToken);

      return res.status(200).json({ qrCode });
    } catch (error) {
      console.error("Erro em performAuth:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }
);

// 2. getLoginStatus: Verifica se o usuário confirmou o login
exports.getLoginStatus = functions.https.onRequest(
  async (req: Request<{}, {}, LoginStatusRequest>, res: Response) => {
    // Valida o método HTTP
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido. Use POST." });
    }

    const { loginToken } = req.body;

    if (!loginToken) {
      return res.status(400).json({ error: "loginToken é obrigatório." });
    }

    try {
      const loginDoc = await firestore
        .collection("logins")
        .doc(loginToken)
        .get();

      if (!loginDoc.exists) {
        return res
          .status(404)
          .json({ status: "invalid", error: "Token inválido." });
      }

      const loginData = loginDoc.data();
      if (!loginData || !loginData.createdAt) {
        throw new Error("Dados de login inválidos");
      }

      const now = new Date();
      const createdAt = loginData.createdAt.toDate();
      const expirationTime = new Date(createdAt.getTime() + 60000); // 1 minuto de validade

      // Verifica se o token expirou
      if (now > expirationTime) {
        await loginDoc.ref.delete(); // Limpa tokens expirados
        return res
          .status(410)
          .json({ status: "expired", error: "Token expirado." });
      }

      // Verifica se o login foi confirmado
      if (loginData.status === "confirmed") {
        return res.status(200).json({
          status: "confirmed",
          userId: loginData.userId,
          userEmail: loginData.userEmail,
        });
      } else {
        return res.status(200).json({ status: "pending" });
      }
    } catch (error) {
      console.error("Erro em getLoginStatus:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }
);

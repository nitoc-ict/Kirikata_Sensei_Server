import express from "express";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import type { Request, Response } from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./userController.js";

import { authenticateUser } from "./auth.js";
import { setupSocket } from "./socket.js";

// ESM環境では __dirname がないので下記で定義する
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const portStr = process.env.PORT || "3000";
const PORT = parseInt(portStr, 10) || 3000;

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB接続成功"))
  .catch((err) => console.error("MongoDB接続エラー:", err));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ルーティングにコントローラ関数を割り当て
app.post("/api/users", createUser);
app.get("/api/users", getUsers);
app.get("/api/users/:id", getUserById);
app.put("/api/users/:id", updateUser);
app.delete("/api/users/:id", deleteUser);

app.post("/api/auth", authenticateUser);

// テスト用エンドポイント
app.get("/api/get", (req, res) => {
  res.json({ message: "GET method success!" });
});

app.get("/api/post", (req, res) => {
  const data = req.body;
  return data;
});

setupSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening port:${PORT}`);
  console.log(`${jwtSecret}`);
});

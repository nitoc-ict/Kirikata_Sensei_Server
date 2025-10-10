import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log("新しいクライアントが接続しました:", socket.id);
  socket.emit("my_response", {
    data: "サーバーからのメッセージ",
    count: 0,
  });
});

io.on("disconnect", (socket: Socket) => {
  console.log("クライアントが切断しました:", socket.id);
});

setInterval(() => {
  const message = `サーバーからの定期メッセージ。現在時刻: ${
    new Date().toLocaleTimeString
  }`;
  console.log("Broadcasting message:", message);

  io.emit("my_response", { data: message, count: 0 });
}, 5000);

server.listen(PORT, () => {
  console.log("サーバーがポート3000で起動しました");
});

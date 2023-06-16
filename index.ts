import Express from "express";
import { config } from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { initSocketIO } from "./utils/socket.io";
import applicationRouter from "./routers/application";

config();

const PORT = process.env.PORT || 3000;

const app = Express();

const server = http.createServer(app);
const io = new Server(server);

const connection = initSocketIO(io);

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }
);

app.use(applicationRouter);

if (process.env.NODE_ENV === "development") {
  console.info("Development mode.");
  app.post("/esbuild-rebuilt", () => {
    const now = new Date().toLocaleTimeString();
    console.info("Sending rebuild notification to client at", now);
    connection.emit("esbuild-rebuilt");
  });
}

server.listen(PORT, () => {
  console.info(`Server started on port ${PORT}`);
});

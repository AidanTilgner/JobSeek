import type { Server, Socket } from "socket.io";
import { createCoverLetterStream } from "../routers/application/handlers";

const connection: {
  socket: Socket | null;
  io: Server | null;
} = {
  socket: null,
  io: null,
};

export const initSocketIO = (io: Server) => {
  io.on("connection", (sock) => {
    console.info("a user connected");

    connection.socket = sock;
    connection.io = io;

    connection.socket.on("application/new/cover-letter:request", (payload) => {
      createCoverLetterStream(
        connection.socket as Socket,
        payload,
        "application/new/cover-letter:datastream"
      );
    });

    connection.socket.on("disconnect", () => {
      console.info("user disconnected");
    });
  });

  return io;
};

export const getSocket = () => {
  return connection.socket;
};

export const getIO = () => {
  return connection.io;
};

import type { Server, Socket } from "socket.io";

const connection: {
  sockets: { [key: string]: Socket };
  io: Server | null;
} = {
  sockets: {},
  io: null,
};

export const initSocketIO = (io: Server) => {
  io.on("connection", (sock) => {
    const now = new Date().toTimeString();
    console.info(`A user connected at ${now}`, sock.id);

    connection.sockets[sock.id] = sock;
    connection.io = io;

    sock.on("disconnect", () => {
      const now = new Date().toTimeString();
      console.info(`A user disconnected at ${now}`, sock.id);
      delete connection.sockets[sock.id];
    });
  });

  return io;
};

export const getSocket = (id: string) => {
  return connection.sockets[id];
};

export const getIO = () => {
  return connection.io;
};

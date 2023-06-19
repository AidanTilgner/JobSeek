import axios from "axios";
import { io, Socket } from "socket.io-client";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

export const socket: Socket = io();

(() => {
  (
    window as unknown as {
      socket: Socket;
    }
  ).socket = socket;
})();

export const recieveEvents = (
  eventLocation: string,
  callback: (data: unknown) => void,
  api?: boolean
) => {
  const location = api ? `/api${eventLocation}` : eventLocation;
  const evntSrc = new EventSource(location, {
    withCredentials: true,
  });

  evntSrc.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  });

  evntSrc.addEventListener("error", (event) => {
    console.error(event);
  });

  return evntSrc;
};

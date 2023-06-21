import { Router } from "express";
import { suggestFix, suggestFixStream } from "./handlers";
import { getSocket } from "../../utils/socket.io";

const router = Router();

router.post("/chat/suggest-fix", async (req, res) => {
  try {
    const stream = req.query.stream || req.body.stream;

    const socketID = req.headers["x-socket-id"] as string;

    const socket = getSocket(socketID);

    if (stream && socket) {
      suggestFixStream(socket, req.body, "llms/chat/suggest-fix:datastream");
      return res.status(200).json({
        success: true,
        message: "Stream started.",
      });
    }

    return suggestFix(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

export default router;

import { Router } from "express";
import { createCoverLetter, createCoverLetterStream } from "./handlers";
import { getSocket } from "../../utils/socket.io";
import { checkAccess } from "../../middleware/auth";
import resumeRouter from "./resume";

const router = Router();

router.use("/resume", resumeRouter);

router.post("/new/cover-letter", checkAccess, (req, res) => {
  try {
    const socketID = req.headers["x-socket-id"] as string;
    if (!socketID) throw new Error("Socket ID not found.");
    const socket = getSocket(socketID);

    const userId = req["jwtPayload"].id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const stream = req.query.stream || req.body.stream;

    if (stream && socket) {
      createCoverLetterStream(
        socket,
        req.body,
        "application/new/cover-letter:datastream",
        userId
      );
      return res.status(200).json({
        success: true,
        message: "Stream started.",
      });
    }

    return createCoverLetter(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});
export default router;

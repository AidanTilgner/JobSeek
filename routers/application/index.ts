import { Router } from "express";
import { createCoverLetter, createCoverLetterStream } from "./handlers";
import { getSocket } from "../../utils/socket.io";

const router = Router();

router.post("/new/cover-letter", (req, res) => {
  try {
    const socket = getSocket();

    const stream = req.query.stream || req.body.stream;

    if (stream && socket) {
      createCoverLetterStream(
        socket,
        req.body,
        "application/new/cover-letter:datastream"
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
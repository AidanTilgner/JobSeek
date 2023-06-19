import { Router } from "express";
import { createCoverLetter, createCoverLetterStream } from "./handlers";
import { getSocket } from "../../utils/socket.io";
import { checkAccess } from "../../middleware/auth";
import {
  newResume,
  deleteResume,
  updateResume,
  addSkillToResume,
  getUserResume,
} from "../../database/functions/resume";
import { User } from "../../database/models/user";

const router = Router();

router.post("/new/cover-letter", checkAccess, (req, res) => {
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

router.post("/new/resume", checkAccess, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const user = (
      req as unknown as {
        jwtPayload: unknown;
      }
    ).jwtPayload;

    const resume = await newResume((user as User).id, {
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Resume created.",
      data: resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      data: null,
    });
  }
});

router.put("/resume", checkAccess, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const user = (
      req as unknown as {
        jwtPayload: unknown;
      }
    ).jwtPayload;

    const resume = await updateResume((user as User).id, {
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Resume updated.",
      data: resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      data: null,
    });
  }
});

router.delete("/resume", checkAccess, async (req, res) => {
  try {
    const user = (
      req as unknown as {
        jwtPayload: unknown;
      }
    ).jwtPayload;

    await deleteResume((user as User).id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.post("/resume/:resume_id/skill", checkAccess, async (req, res) => {
  try {
    const { resume_id } = req.params;
    const { name, description, level } = req.body;

    if (!resume_id || !name || !description || !level) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const user = (
      req as unknown as {
        jwtPayload: unknown;
      }
    ).jwtPayload;

    const parsedResumeID = Number(resume_id);

    const skill = await addSkillToResume((user as User).id, parsedResumeID, {
      name,
      description,
      level,
    });

    return res.status(200).json({
      success: true,
      message: "Skill added.",
      data: skill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      data: null,
    });
  }
});

router.get("/resume", checkAccess, async (req, res) => {
  try {
    const user = (
      req as unknown as {
        jwtPayload: unknown;
      }
    ).jwtPayload;

    const resume = await getUserResume((user as User).id);

    return res.status(200).json({
      success: true,
      message: "Resume fetched.",
      data: resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      data: null,
    });
  }
});

export default router;

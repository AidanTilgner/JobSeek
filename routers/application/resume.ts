import { Router } from "express";
import {
  addSkillToResume,
  getUserResume,
  updateResume,
  updateSkillOnResume,
  deleteSkillFromResume,
  addProjectToResume,
  updateProjectOnResume,
  deleteProjectFromResume,
  addExperienceToResume,
  updateExperienceOnResume,
  deleteExperienceFromResume,
  addEducationToResume,
  updateEducationOnResume,
  deleteEducationFromResume,
} from "../../database/functions/resume";
import { checkAccess } from "../../middleware/auth";
import { User } from "../../database/models/user";

const router = Router();

router.put("/", checkAccess, async (req, res) => {
  try {
    const { name, description, phone, location } = req.body;

    if (!name || !description || !phone || !location) {
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
      phone,
      location,
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

router.get("/", checkAccess, async (req, res) => {
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

router.post("/skill", checkAccess, async (req, res) => {
  try {
    const { name, description, level } = req.body;

    if (!name || !description || !level) {
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

    const skill = await addSkillToResume((user as User).id, {
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

router.put("/skill/:skill_id", checkAccess, async (req, res) => {
  try {
    const { name, description, level } = req.body;
    const { skill_id } = req.params;

    if (!skill_id || !name || !description || !level) {
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

    const parsedSkillId = parseInt(skill_id);

    if (isNaN(parsedSkillId) || !parsedSkillId) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill id.",
      });
    }

    const skill = await updateSkillOnResume((user as User).id, parsedSkillId, {
      name,
      description,
      level,
    });

    return res.status(200).json({
      success: true,
      message: "Skill updated.",
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

router.delete("/skill/:skill_id", checkAccess, async (req, res) => {
  try {
    const { skill_id } = req.params;

    if (!skill_id) {
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

    const parsedSkillId = parseInt(skill_id);

    if (isNaN(parsedSkillId) || !parsedSkillId) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill id.",
      });
    }

    await deleteSkillFromResume((user as User).id, parsedSkillId);

    return res.status(200).json({
      success: true,
      message: "Skill deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.post("/project", checkAccess, async (req, res) => {
  try {
    const { name, description, startDate, endDate, link, location_worked_on } =
      req.body;

    if (!name || !description || !startDate || !link || !location_worked_on) {
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

    const project = await addProjectToResume((user as User).id, {
      name,
      description,
      startDate,
      endDate,
      link,
      location_worked_on,
    });

    return res.status(200).json({
      success: true,
      message: "Project added.",
      data: project,
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

router.put("/project/:project_id", checkAccess, async (req, res) => {
  try {
    const { name, description, startDate, endDate, link, location_worked_on } =
      req.body;
    const { project_id } = req.params;

    if (
      !project_id ||
      !name ||
      !description ||
      !startDate ||
      !location_worked_on
    ) {
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

    const parsedProjectId = parseInt(project_id);

    if (isNaN(parsedProjectId) || !parsedProjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid project id.",
      });
    }

    const project = await updateProjectOnResume(
      (user as User).id,
      parsedProjectId,
      {
        name,
        description,
        startDate,
        endDate,
        link,
        location_worked_on,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Project updated.",
      data: project,
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

router.delete("/project/:project_id", checkAccess, async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!project_id) {
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

    const parsedProjectId = parseInt(project_id);

    if (isNaN(parsedProjectId) || !parsedProjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid project id.",
      });
    }

    await deleteProjectFromResume((user as User).id, parsedProjectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.post("/experience", checkAccess, async (req, res) => {
  try {
    const { title, company, description, startDate, endDate, location } =
      req.body;

    if (!title || !company || !startDate || !description || !location) {
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

    await addExperienceToResume((user as User).id, {
      title,
      company,
      startDate,
      endDate,
      description,
      location,
    });

    return res.status(200).json({
      success: true,
      message: "Experience added.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.put("/experience/:experience_id", checkAccess, async (req, res) => {
  try {
    const { title, company, description, startDate, endDate, location } =
      req.body;
    const { experience_id } = req.params;

    if (
      !experience_id ||
      !title ||
      !company ||
      !startDate ||
      !description ||
      !location
    ) {
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

    const parsedExperienceId = parseInt(experience_id);

    if (isNaN(parsedExperienceId) || !parsedExperienceId) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience id.",
      });
    }

    await updateExperienceOnResume((user as User).id, parsedExperienceId, {
      title,
      company,
      startDate,
      endDate,
      description,
      location,
    });

    return res.status(200).json({
      success: true,
      message: "Experience updated.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.delete("/experience/:experience_id", checkAccess, async (req, res) => {
  try {
    const { experience_id } = req.params;

    if (!experience_id) {
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

    const parsedExperienceId = parseInt(experience_id);

    if (isNaN(parsedExperienceId) || !parsedExperienceId) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience id.",
      });
    }

    await deleteExperienceFromResume((user as User).id, parsedExperienceId);

    return res.status(200).json({
      success: true,
      message: "Experience deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.post("/education", checkAccess, async (req, res) => {
  try {
    const { school, degree, startDate, endDate, description, location } =
      req.body;

    if (!school || !degree || !startDate || !description || !location) {
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

    await addEducationToResume((user as User).id, {
      school,
      degree,
      startDate,
      endDate,
      description,
      location,
    });

    return res.status(200).json({
      success: true,
      message: "Education added.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.put("/education/:education_id", checkAccess, async (req, res) => {
  try {
    const { school, degree, startDate, endDate, description, location } =
      req.body;
    const { education_id } = req.params;

    if (
      !education_id ||
      !school ||
      !degree ||
      !startDate ||
      !description ||
      !location
    ) {
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

    const parsedEducationId = parseInt(education_id);

    if (isNaN(parsedEducationId) || !parsedEducationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid education id.",
      });
    }

    await updateEducationOnResume((user as User).id, parsedEducationId, {
      school,
      degree,
      startDate,
      endDate,
      description,
      location,
    });

    return res.status(200).json({
      success: true,
      message: "Education updated.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

router.delete("/education/:education_id", checkAccess, async (req, res) => {
  try {
    const { education_id } = req.params;

    if (!education_id) {
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

    const parsedEducationId = parseInt(education_id);

    if (isNaN(parsedEducationId) || !parsedEducationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid education id.",
      });
    }

    await deleteEducationFromResume((user as User).id, parsedEducationId);

    return res.status(200).json({
      success: true,
      message: "Education deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

export default router;

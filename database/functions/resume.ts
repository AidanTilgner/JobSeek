import { dataSource } from "..";
import { Resume } from "../models/resume";
import { Skill } from "../models/skill";
import { User } from "../models/user";

export const newResume = async (
  userId: number,
  {
    name,
    description,
  }: {
    name: Resume["name"];
    description: Resume["description"];
  }
) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    const resume = new Resume();

    resume.name = name;
    resume.description = description;

    resume.user = user;

    await dataSource.manager.save(resume);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getResumes = async (userId: number) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ["resumes"],
    });

    if (!user) {
      return null;
    }

    return user.resumes;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getResume = async (userId: number, resumeId: number) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ["resumes"],
    });

    if (!user) {
      return null;
    }

    const resume = user.resumes.find((resume) => resume.id === resumeId);

    if (!resume) {
      return null;
    }

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateResume = async (
  userId: number,
  resumeId: number,
  {
    name,
    description,
  }: {
    name: Resume["name"];
    description: Resume["description"];
  }
) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ["resumes"],
    });

    if (!user) {
      return null;
    }

    const resume = user.resumes.find((resume) => resume.id === resumeId);

    if (!resume) {
      return null;
    }

    resume.name = name;
    resume.description = description;

    await dataSource.manager.save(resume);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteResume = async (userId: number, resumeId: number) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ["resumes"],
    });

    if (!user) {
      return null;
    }

    const resume = user.resumes.find((resume) => resume.id === resumeId);

    if (!resume) {
      return null;
    }

    await dataSource.manager.remove(resume);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addSkillToResume = async (
  userId: number,
  resumeId: number,
  {
    name,
    level,
    description,
  }: {
    name: Skill["name"];
    level: Skill["level"];
    description: Skill["description"];
  }
) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ["resumes"],
    });

    if (!user) {
      return null;
    }

    const resume = user.resumes.find((resume) => resume.id === resumeId);

    if (!resume) {
      return null;
    }

    const skill = new Skill();
    skill.name = name;
    skill.level = level;
    skill.description = description;

    dataSource.manager.save(skill);

    const skills = resume.skills;

    skills.push(skill);

    resume.skills = skills;

    await dataSource.manager.save(resume);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

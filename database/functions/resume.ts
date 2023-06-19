import { dataSource } from "..";
import { Resume } from "../models/resume";
import { Skill } from "../models/skill";
import { User } from "../models/user";

export const newResume = async (userId: number) => {
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

    resume.name = `${user.firstName} ${user.lastName}`;
    resume.description =
      "I am a distinguished professional with a passion in many areas.";

    await dataSource.manager.save(resume);

    // Set the updated values for the user entity
    await dataSource.manager
      .createQueryBuilder()
      .update(User)
      .set({
        resume: resume,
      })
      .where("id = :id", { id: userId })
      .execute();

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserResume = async (userId: number) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    return user.resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getResume = async (resumeId: number) => {
  try {
    const resume = await dataSource.manager.findOne(Resume, {
      where: {
        id: resumeId,
      },
    });

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

    if (!user.resume) {
      return null;
    }

    user.resume.name = name;
    user.resume.description = description;

    await dataSource.manager.save(user.resume);

    return user.resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteResume = async (userId: number) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    const resume = user.resume;

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
    });

    if (!user) {
      return null;
    }

    const resume = user.resume;

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

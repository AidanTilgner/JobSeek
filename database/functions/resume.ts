import { dataSource } from "..";
import { Resume } from "../models/resume";
import { Skill } from "../models/skill";
import { Project } from "../models/project";
import { Experience } from "../models/experience";
import { Education } from "../models/education";
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

export const updateSkillOnResume = async (
  userId: number,
  skillId: number,
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

    const skill = await dataSource.manager.findOne(Skill, {
      where: {
        id: skillId,
      },
    });

    if (!skill) {
      return null;
    }

    skill.name = name;
    skill.level = level;
    skill.description = description;

    await dataSource.manager.save(skill);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteSkillFromResume = async (
  userId: number,
  skillId: number
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

    const skill = await dataSource.manager.findOne(Skill, {
      where: {
        id: skillId,
      },
    });

    if (!skill) {
      return null;
    }

    await dataSource.manager.remove(skill);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addProjectToResume = async (
  userId: number,
  {
    name,
    description,
    startDate,
    endDate,
    skills,
    link,
    location_worked_on,
  }: {
    name: Project["name"];
    description: Project["description"];
    startDate: Project["startDate"];
    endDate: Project["endDate"];
    skills: Project["skills"];
    link: Project["link"];
    location_worked_on: Project["location_worked_on"];
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

    const project = new Project();
    project.name = name;
    project.description = description;
    project.startDate = startDate;
    project.endDate = endDate;
    project.skills = skills;
    project.link = link;
    project.location_worked_on = location_worked_on;

    dataSource.manager.save(project);

    const projects = resume.projects;

    projects.push(project);

    resume.projects = projects;

    await dataSource.manager.save(resume);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateProjectOnResume = async (
  userId: number,
  projectId: number,
  {
    name,
    description,
    startDate,
    endDate,
    skills,
    link,
    location_worked_on,
  }: {
    name: Project["name"];
    description: Project["description"];
    startDate: Project["startDate"];
    endDate: Project["endDate"];
    skills: Project["skills"];
    link: Project["link"];
    location_worked_on: Project["location_worked_on"];
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

    const project = await dataSource.manager.findOne(Project, {
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return null;
    }

    project.name = name;
    project.description = description;
    project.startDate = startDate;
    project.endDate = endDate;
    project.skills = skills;
    project.link = link;
    project.location_worked_on = location_worked_on;

    await dataSource.manager.save(project);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteProjectFromResume = async (
  userId: number,
  projectId: number
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

    const project = await dataSource.manager.findOne(Project, {
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return null;
    }

    await dataSource.manager.remove(project);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addExperienceToResume = async (
  userId: number,
  {
    title,
    company,
    description,
    startDate,
    endDate,
    location,
  }: {
    title: Experience["title"];
    company: Experience["company"];
    description: Experience["description"];
    startDate: Experience["startDate"];
    endDate: Experience["endDate"];
    location: Experience["location"];
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

    const experience = new Experience();
    experience.title = title;
    experience.company = company;
    experience.description = description;
    experience.startDate = startDate;
    experience.endDate = endDate;
    experience.location = location;

    dataSource.manager.save(experience);

    const experiences = resume.experience;

    experiences.push(experience);

    resume.experience = experiences;

    await dataSource.manager.save(resume);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateExperienceOnResume = async (
  userId: number,
  experienceId: number,
  {
    title,
    company,
    description,
    startDate,
    endDate,
    location,
  }: {
    title: Experience["title"];
    company: Experience["company"];
    description: Experience["description"];
    startDate: Experience["startDate"];
    endDate: Experience["endDate"];
    location: Experience["location"];
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

    const experience = await dataSource.manager.findOne(Experience, {
      where: {
        id: experienceId,
      },
    });

    if (!experience) {
      return null;
    }

    experience.title = title;
    experience.company = company;
    experience.description = description;
    experience.startDate = startDate;
    experience.endDate = endDate;
    experience.location = location;

    await dataSource.manager.save(experience);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteExperienceFromResume = async (
  userId: number,
  experienceId: number
) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    const resume = user?.resume;

    if (!resume) {
      return null;
    }

    const experience = await dataSource.manager.findOne(Experience, {
      where: {
        id: experienceId,
      },
    });

    if (!experience) {
      return null;
    }

    await dataSource.manager.remove(experience);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addEducationToResume = async (
  userId: number,
  {
    school,
    degree,
    description,
    startDate,
    endDate,
    location,
  }: {
    school: Education["school"];
    degree: Education["degree"];
    description: Education["description"];
    startDate: Education["startDate"];
    endDate: Education["endDate"];
    location: Education["location"];
  }
) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    const resume = user?.resume;

    if (!resume) {
      return null;
    }

    const education = new Education();
    education.school = school;
    education.degree = degree;
    education.description = description;
    education.startDate = startDate;
    education.endDate = endDate;
    education.location = location;

    dataSource.manager.save(education);

    const educations = resume.education;

    educations.push(education);

    resume.education = educations;

    await dataSource.manager.save(resume);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateEducationOnResume = async (
  userId: number,
  educationId: number,
  {
    school,
    degree,
    description,
    startDate,
    endDate,
    location,
  }: {
    school: Education["school"];
    degree: Education["degree"];
    description: Education["description"];
    startDate: Education["startDate"];
    endDate: Education["endDate"];
    location: Education["location"];
  }
) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    const resume = user?.resume;

    if (!resume) {
      return null;
    }

    const education = await dataSource.manager.findOne(Education, {
      where: {
        id: educationId,
      },
    });

    if (!education) {
      return null;
    }

    education.school = school;
    education.degree = degree;
    education.description = description;
    education.startDate = startDate;
    education.endDate = endDate;
    education.location = location;

    await dataSource.manager.save(education);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteEducationFromResume = async (
  userId: number,
  educationId: number
) => {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    const resume = user?.resume;

    if (!resume) {
      return null;
    }

    const education = await dataSource.manager.findOne(Education, {
      where: {
        id: educationId,
      },
    });

    if (!education) {
      return null;
    }

    await dataSource.manager.remove(education);

    return resume;
  } catch (error) {
    console.error(error);
    return null;
  }
};

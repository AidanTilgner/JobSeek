import { Resume } from "../database/models/resume";
import { Skill } from "../database/models/skill";

export const getSkillLevelDescribed = (skill: Skill) => {
  const level = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
    5: "Master",
  };

  return level[skill.level];
};

export const getResumeDescribed = (resume: Resume) => {
  const described = `
    Applicant Name: ${resume.name}
    Applicant Email: ${resume.user.email}
    Applicant Location: ${resume.location}
    Applicant Phone: ${resume.phone}

    Applicant Skills: ${resume.skills
      .map(
        (skill) =>
          `${skill.name} - ${skill.description} - ${getSkillLevelDescribed(
            skill
          )}`
      )
      .join(",\n ")}

    Applicant Experience: ${resume.experience
      .map(
        (experience) =>
          `${experience.title} at ${experience.company} from ${experience.startDate} to ${experience.endDate} - ${experience.description}`
      )
      .join(",\n ")}

    Applicant Education: ${resume.education
      .map(
        (education) =>
          `${education.degree} at ${education.school} from ${education.startDate} to ${education.endDate} - ${education.description}`
      )
      .join(",\n ")}

    Applicant Projects: ${resume.projects
      .map(
        (project) =>
          `${project.name} ${project.link && `(${project.link})`} from ${
            project.startDate
          } to ${project.endDate} at ${project.location_worked_on} - ${
            project.description
          }`
      )
      .join(",\n ")}
    `;

  return described;
};

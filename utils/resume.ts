import { Resume } from "../database/models/resume";

export const getResumeDescribed = (resume: Resume) => {
  const described = `
    Applicant Name: ${resume.name}
    Applicant Email: ${resume.user.email}
    Applicant Location: ${resume.location}
    Applicant Phone: ${resume.phone}

    Applicant Skills: ${resume.skills
      .map((skill) => `${skill.name} - ${skill.description}`)
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
          `${project.name} from ${project.startDate} to ${project.endDate} - ${project.description}`
      )
      .join(",\n ")}
    `;

  return described;
};

export interface Skill {
  name: string;
  description: string;
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  skills: string[];
  link: string;
  location_worked_on: string;
}

export interface Resume {
  name: string;
  email: string;
  location: string;
  phone: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  location: string;
  recruiter_name: string | undefined;
}

export interface Skill {
  id?: number;
  name: string;
  level: number;
  description: string;
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

export interface Education {
  id?: number;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  link: string;
  location_worked_on: string;
}

export interface Resume {
  name: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  user?: User;
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

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SuggestionFixModes = "cover-letter" | "conversation-starter";
export type CoverLetterModes = "cover-letter" | "conversation-starter";

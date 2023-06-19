export interface Skill {
  name: string;
  level: number;
  description: string;
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
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
  description: string;
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

import { DataSource } from "typeorm";
import "reflect-metadata";
import { seedDatabase } from "./seeders";
import { User } from "./models/user";
import { Token } from "./models/token";
import { Resume } from "./models/resume";
import { Education } from "./models/education";
import { Experience } from "./models/experience";
import { Skill } from "./models/skill";
import { Project } from "./models/project";

export const entities = {
  User,
  Token,
  Resume,
  Education,
  Experience,
  Skill,
  Project,
};

export const dataSource = new DataSource({
  type: "sqlite",
  database: "datastore/database.sqlite",
  synchronize: true, // ! MAKE SURE TO SET THIS BASED ON YOUR PREFERENCES
  entities: Object.values(entities),
  migrations: ["database/migrations/*.ts"],
  migrationsTableName: "migrations",
});

export const initializeDatabase = async () => {
  await dataSource.initialize();
  console.info("Database initialized");
  await seedDatabase();
  console.info("Database seeded");
  return dataSource;
};

export const getDataStore = () => {
  if (dataSource) {
    return dataSource;
  }
  return null;
};

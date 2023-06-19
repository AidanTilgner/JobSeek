import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "./user";
import { Skill } from "./skill";
import { Project } from "./project";
import { Experience } from "./experience";
import { Education } from "./education";

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "varchar", nullable: true })
  location!: string;

  @Column({ type: "varchar", nullable: true })
  phone!: string;

  @OneToOne(() => User, (user) => user.resume)
  user!: User;

  @OneToMany(() => Skill, (skill) => skill.resume, {
    eager: true,
  })
  skills!: Skill[];

  @OneToMany(() => Project, (project) => project.resume, { eager: true })
  projects!: Project[];

  @OneToMany(() => Experience, (experience) => experience.resume, {
    eager: true,
  })
  experience!: Experience[];

  @OneToMany(() => Education, (education) => education.resume, {
    eager: true,
  })
  education!: Education[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

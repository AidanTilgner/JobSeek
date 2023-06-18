import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.resumes)
  user!: User;

  @OneToMany(() => Skill, (skill) => skill.resume)
  skills!: Skill[];

  @OneToMany(() => Project, (project) => project.resume)
  projects!: Project[];

  @OneToMany(() => Experience, (experience) => experience.resume)
  experiences!: Experience[];

  @OneToMany(() => Education, (education) => education.resume)
  educations!: Education[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

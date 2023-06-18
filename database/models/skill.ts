import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Resume } from "./resume";

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "int", length: 255 })
  level!: number;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @ManyToOne(() => Resume, (resume) => resume.skills)
  resume!: Resume;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

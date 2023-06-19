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
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "varchar", length: 255 })
  startDate!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  endDate!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  link!: string;

  @Column({ type: "varchar", length: 255 })
  location_worked_on!: string;

  @ManyToOne(() => Resume, (resume) => resume.projects)
  resume!: Resume;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

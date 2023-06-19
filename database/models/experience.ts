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
export class Experience {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255 })
  company!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "varchar", length: 255 })
  startDate!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  endDate!: string | undefined;

  @Column({ type: "varchar", length: 255 })
  location!: string;

  @ManyToOne(() => Resume, (resume) => resume.experience)
  resume!: Resume;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

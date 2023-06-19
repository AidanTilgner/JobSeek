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
export class Education {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  school!: string;

  @Column({ type: "varchar", length: 255 })
  degree!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "varchar", length: 255 })
  startDate!: string;

  @Column({ type: "varchar", length: 255 })
  endDate!: string;

  @Column({ type: "varchar", length: 255 })
  location!: string;

  @ManyToOne(() => Resume, (resume) => resume.education)
  resume!: Resume;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

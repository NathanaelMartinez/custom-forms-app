import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { Question } from "./question";

@Entity("templates")
export class Template {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @ManyToOne(() => User, (user) => user.templates, { eager: true }) // eager means associated user is automatically fetched here
  author!: User;

  @OneToMany(() => Question, (question) => question.template, { cascade: true }) // cascade means question changes automatically cascaded to templates
  questions!: Question[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}

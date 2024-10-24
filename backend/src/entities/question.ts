import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Template } from "./template";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  questionText!: string; // visible question text - e.g. "What is your favorite color?"

  @Column()
  type!: string; // single-line, multiple-line, integer, checkbox, etc.

  @Column("jsonb", { nullable: true }) // not every question is a checkbox
  options?: string[]; // options for checkbox

  @ManyToOne(() => Template, (template) => template.questions, {
    onDelete: "CASCADE",
    eager: false, // prevent automatic loading of template in all queries
  })
  @JoinColumn({ name: "templateId" })
  template!: Template;

  @Column({ default: true })
  displayInTable!: boolean; // whether this question should be shown in table views of responses

  // this will help preserve order of the questions
  @Column()
  order_index!: number;
}

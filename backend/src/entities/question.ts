import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Template } from "./template";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  type!: string; // single-line, multiple-line, integer, checkbox, etc.

  @ManyToOne(() => Template, (template) => template.questions, {
    onDelete: "CASCADE",
  })
  template!: Template;

  @Column({ default: false })
  displayInTable!: boolean; // boolean value that defines whether the question will be displayed in the table of the filled-out forms (on the tab of the template).
}

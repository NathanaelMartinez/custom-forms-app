import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Template } from "./template";
import { User } from "./user";

@Entity("responses")
export class Response {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Template, (template) => template.responses, {
    onDelete: "CASCADE", // delete responses when template is deleted (no where to view aggregate data)
  })
  template!: Template;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @Column("jsonb")
  answers!: Record<string, any>; // eg. { "questionId1": "answer1", "questionId2": "answer2" }

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  submittedAt!: Date;
}

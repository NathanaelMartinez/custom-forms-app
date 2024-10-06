import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { Template } from "./template";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  content!: string;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  author!: User;

  @ManyToOne(() => Template, (template) => template.comments, {
    onDelete: "CASCADE",
  })
  template!: Template;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Template } from "./template";
import { Comment } from "./comment";
import { Response } from "./response";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true, select: false })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ default: "active" })
  status!: string; // status can be 'active' or 'blocked'

  @OneToMany(() => Template, (template) => template.author)
  templates!: Template[];

  @OneToMany(() => Comment, (comment) => comment.author) // link to comments
  comments!: Comment[];

  @Column({ type: "timestamp" })
  createdAt!: Date;

  @OneToMany(() => Response, (response) => response.user)
  responses!: Response[];
}

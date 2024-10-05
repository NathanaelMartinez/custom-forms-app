import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Template } from "./template";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ default: "active" })
  status!: string; // status can be 'active' or 'blocked'

  @OneToMany(() => Template, (template) => template.author)
  templates!: Template[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}

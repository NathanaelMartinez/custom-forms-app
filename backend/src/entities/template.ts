import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from "typeorm";
import { User } from "./user";
import { Question } from "./question";
import { Comment } from "./comment";
import { Response } from "./response";

@Entity("templates")
export class Template {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @ManyToOne(() => User, (user) => user.templates, { eager: true }) // eager means associated user is automatically fetched here
  author!: User;

  @OneToMany(() => Question, (question) => question.template, { cascade: true }) // cascade means question changes automatically cascaded to templates
  questions!: Question[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ default: 0 })
  likes!: number;

  @OneToMany(() => Comment, (comment) => comment.template, { cascade: true })
  comments!: Comment[];

  @Column({ type: "text", nullable: true }) // add image as a URL string
  image!: string | null;

  @Column({ type: "text", nullable: true })
  topic!: string;

  @Column("simple-array", { nullable: true })
  tags!: string[]; // TODO: make tags into entity

  @OneToMany(() => Response, (response) => response.template, { eager: true })
  responses!: Response[];

  @Column({ type: "tsvector", nullable: true }) // this stores search vector
  @Index({ fulltext: true }) // full-text search index
  search_vector!: string;
}

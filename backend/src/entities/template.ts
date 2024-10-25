import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./user";
import { Question } from "./question";
import { Comment } from "./comment";
import { Response } from "./response";
import { Tag } from "./tag";

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

  @ManyToMany(() => User, (user) => user.likedTemplates)
  @JoinTable()
  likedBy!: User[]; // users that have like template

  @Column({ default: 0 })
  likesCount!: number; // this is more performant than likedBy.length

  @OneToMany(() => Comment, (comment) => comment.template, { cascade: true })
  comments!: Comment[];

  @Column({ type: "text", nullable: true }) // add image as a URL string
  image!: string | null;

  @Column({ type: "text", nullable: true })
  topic!: string;

  @ManyToMany(() => Tag, (tag) => tag.templates, { cascade: true })
  @JoinTable()
  tags!: Tag[];

  @OneToMany(() => Response, (response) => response.template, { eager: true })
  responses!: Response[];

  @Column({ type: "tsvector", nullable: true }) // this stores search vector
  @Index({ fulltext: true }) // full-text search index
  search_vector!: string;
}

import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user";
import { Template } from "../entities/template";
import { Question } from "../entities/question";
import { Comment } from "../entities/comment";
import { Response } from "../entities/response";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true, // automatically sync the schema (DISABLE IN PRODUCTION)
  logging: false,
  entities: [User, Template, Question, Comment, Response],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
});

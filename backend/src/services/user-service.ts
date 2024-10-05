import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user";
import bcrypt from "bcryptjs";

// create user
export const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<User | null> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // fetch user table
  const userRepository = AppDataSource.getRepository(User);

  const newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.password = hashedPassword;

  try {
    const savedUser = await userRepository.save(newUser);
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOneBy({ email });
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
};

// Compare passwords
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

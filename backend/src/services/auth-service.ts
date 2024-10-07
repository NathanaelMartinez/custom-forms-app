import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { authConfig } from "../config/auth-config";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user";

// jwt options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authConfig.jwtSecret,
};

// passport jwt strategy
passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: jwt_payload.sub });

      if (user) {
        console.log("User found:", user);
        return done(null, user);
      } else {
        console.log("User not found");
        return done(null, false);
      }
    } catch (err) {
      console.error("Error in JwtStrategy:", err);
      return done(err, false);
    }
  })
);

// export initialization function for app.ts
export const initializeAuth = () => passport.initialize();

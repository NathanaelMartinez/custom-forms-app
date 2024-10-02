import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { authConfig } from "../config/auth-config";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/user";

// jwt options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authConfig.jwtSecret,
};

// passport jwt strategy
passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      // find user by id (jwt_payload.sub)
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: jwt_payload.sub });

      if (user) {
        return done(null, user);
      } else {
        // user doesn't exist
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// export initialization function for app.ts
export const initializeAuth = () => passport.initialize();

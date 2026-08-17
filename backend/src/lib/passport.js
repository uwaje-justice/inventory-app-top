import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import db from "./db.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtVerifyCallback = async (payload, done) => {
  try {
    const user = await db.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

passport.use(new JWTStrategy(jwtOptions, jwtVerifyCallback));

export default passport;
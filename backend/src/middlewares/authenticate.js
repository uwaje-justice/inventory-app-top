import passport from "passport";
import { AuthenticationError } from "../utils/errors.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new AuthenticationError("Authentication failed"));
    }

    req.user = sanitizeUser(user);
    next();
  })(req, res, next);
};

export default authenticate;
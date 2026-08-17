import { validationResult } from "express-validator";
import { ValidationError } from "../utils/errors.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationError(
      errors.array().reduce((errObj, err) => {
        errObj[err.path] = err.msg;
        return errObj;
      }, {}),
    );
  }

  next();
};

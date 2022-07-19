import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { Modifiers } from "../common/utils";

const { pick } = Modifiers;

const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = Modifiers.pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return res.status(400).json({ success: false, message: errorMessage });
    }
    Object.assign(req, value);
    return next();
  };

export default validate;

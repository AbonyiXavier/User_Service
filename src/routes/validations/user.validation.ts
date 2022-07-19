import Joi from "joi";
import { objectId } from "./custom.validation";

const createUserValidation = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    userName: Joi.string().required(),
  }),
};

const updateUserValidation = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      userName: Joi.string().optional(),
    })
    .min(1),
};

export { createUserValidation, updateUserValidation };

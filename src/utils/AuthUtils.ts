import * as Joi from "joi";

export const register = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required().pattern(new RegExp('^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$')).message("Password must be at least 8 characters long, contain at least one symbol, and only unique characters."),
});

export const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

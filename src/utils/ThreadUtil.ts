import * as Joi from "joi";

export const addThread = Joi.object({
  content: Joi.string().required(),
  image: Joi.string().allow(""),
});

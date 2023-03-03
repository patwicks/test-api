const Joi = require("joi");

exports.userRegisterValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(50).required(),
    fullname: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(6).required(),
    profile:  Joi.string().uri().required(),
    roles: Joi.array().required()
  });
  return schema.validate(data);
};

exports.userLoginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

exports.userUpdateValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(50).required(),
    fullname: Joi.string().min(5).max(50).required(),
    roles: Joi.array().required()
  });
  return schema.validate(data);
};
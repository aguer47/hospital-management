const Joi = require("joi");

// Rules for doctor data
const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  specialization: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required()
});

// Validation logic
module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};

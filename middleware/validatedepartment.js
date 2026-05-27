const Joi = require("joi");

// Department data structure
const schema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  head: Joi.string().required(),
  phone: Joi.string().required()
});

module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};

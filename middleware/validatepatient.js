const Joi = require("joi");

// Define what a patient object should look like
const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  dob: Joi.string().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  emergencyContact: Joi.string().required()
});

// Middleware function to validate the request body
module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    // If there's a validation error, send a 400 response with the message
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  // If everything is fine, go to the next step
  next();
};
